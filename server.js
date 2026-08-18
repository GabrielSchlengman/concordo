const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_BODY_BYTES = 64 * 1024;
const MAX_CLIENTS_PER_ROOM = 150;
const ALLOWED_ROOMS = new Set(['geral', 'projetos', 'cafe', 'lobby', 'jogos', 'musica']);
const rooms = new Map();
const requestWindows = new Map();

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self' https: wss:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(self), microphone=(self), display-capture=(self)',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, { clients: new Map(), messages: [] });
  }
  return rooms.get(roomId);
}

function cleanId(value, fallback = 'geral') {
  const id = String(value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48);
  return id || fallback;
}

function cleanRoom(value) {
  const roomId = cleanId(value);
  return ALLOWED_ROOMS.has(roomId) ? roomId : 'geral';
}

function cleanName(value) {
  return String(value || 'Visitante').trim().replace(/\s+/g, ' ').slice(0, 32) || 'Visitante';
}

function writeSse(response, payload) {
  if (response.writableEnded) return;
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcast(room, payload, exceptId = null) {
  for (const [id, client] of room.clients) {
    if (id !== exceptId) writeSse(client.response, payload);
  }
}

function usersFor(room) {
  return [...room.clients.entries()].map(([id, client]) => ({
    id,
    name: client.name,
    inCall: client.inCall,
  }));
}

function sendRoomState(room) {
  const users = usersFor(room);
  broadcast(room, { type: 'presence', users });
  broadcast(room, { type: 'call-state', users: users.filter((user) => user.inCall) });
}

function json(response, status, body) {
  response.writeHead(status, {
    ...securityHeaders,
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

function isRateLimited(request) {
  const address = request.socket.remoteAddress || 'desconhecido';
  const now = Date.now();
  const current = requestWindows.get(address);
  if (!current || now - current.startedAt >= 60_000) {
    requestWindows.set(address, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > 120;
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(new Error('Payload muito grande'));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    request.on('error', reject);
  });
}

function serveStatic(requestUrl, response) {
  const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const relativePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, relativePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    json(response, 403, { error: 'Acesso negado' });
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      json(response, 404, { error: 'Arquivo não encontrado' });
      return;
    }

    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.ico': 'image/x-icon',
    };

    response.writeHead(200, {
      ...securityHeaders,
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

function createServer() {
  return http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

    if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
      json(response, 200, { ok: true, name: 'Lume' });
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/events') {
      const roomId = cleanRoom(requestUrl.searchParams.get('room'));
      const clientId = cleanId(requestUrl.searchParams.get('clientId'), '');
      const name = cleanName(requestUrl.searchParams.get('name'));

      if (!clientId) {
        json(response, 400, { error: 'Cliente inválido' });
        return;
      }

      const room = getRoom(roomId);
      if (!room.clients.has(clientId) && room.clients.size >= MAX_CLIENTS_PER_ROOM) {
        json(response, 503, { error: 'Esta sala está cheia. Tente novamente em instantes.' });
        return;
      }

      response.writeHead(200, {
        ...securityHeaders,
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      response.write(': conectado\n\n');

      const previous = room.clients.get(clientId);
      if (previous && !previous.response.writableEnded) previous.response.end();

      const client = { name, response, inCall: false };
      room.clients.set(clientId, client);
      writeSse(response, {
        type: 'hello',
        room: roomId,
        messages: room.messages,
        users: usersFor(room),
      });
      sendRoomState(room);

      const heartbeat = setInterval(() => {
        if (!response.writableEnded) response.write(': ping\n\n');
      }, 20_000);

      request.on('close', () => {
        clearInterval(heartbeat);
        const current = room.clients.get(clientId);
        if (current?.response !== response) return;
        room.clients.delete(clientId);
        if (current.inCall) broadcast(room, { type: 'peer-left', id: clientId });
        sendRoomState(room);
      });
      return;
    }

    if (request.method === 'POST' && requestUrl.pathname.startsWith('/api/')) {
      if (isRateLimited(request)) {
        json(response, 429, { error: 'Muitas ações em pouco tempo. Aguarde um minuto.' });
        return;
      }
      try {
        const body = await readJson(request);
        const roomId = cleanRoom(body.room);
        const clientId = cleanId(body.clientId, '');
        const room = getRoom(roomId);
        const client = room.clients.get(clientId);

        if (!client) {
          json(response, 409, { error: 'Reconecte-se à sala e tente novamente.' });
          return;
        }

        if (requestUrl.pathname === '/api/message') {
          const text = String(body.text || '').trim().slice(0, 2000);
          if (!text) {
            json(response, 400, { error: 'Mensagem vazia' });
            return;
          }
          const message = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            clientId,
            name: client.name,
            text,
            createdAt: new Date().toISOString(),
          };
          room.messages.push(message);
          if (room.messages.length > 100) room.messages.shift();
          broadcast(room, { type: 'message', message });
          json(response, 201, { ok: true });
          return;
        }

        if (requestUrl.pathname === '/api/call') {
          const joining = body.action === 'join';
          client.inCall = joining;
          if (!joining) broadcast(room, { type: 'peer-left', id: clientId }, clientId);
          sendRoomState(room);
          json(response, 200, { ok: true, users: usersFor(room).filter((user) => user.inCall) });
          return;
        }

        if (requestUrl.pathname === '/api/signal') {
          const targetId = cleanId(body.target, '');
          const target = room.clients.get(targetId);
          if (!client.inCall || !target?.inCall) {
            json(response, 409, { error: 'Participante fora da chamada' });
            return;
          }
          writeSse(target.response, {
            type: 'signal',
            from: clientId,
            name: client.name,
            data: body.data,
          });
          json(response, 200, { ok: true });
          return;
        }

        json(response, 404, { error: 'Endpoint não encontrado' });
      } catch (error) {
        json(response, 400, { error: error.message || 'Requisição inválida' });
      }
      return;
    }

    if (request.method === 'GET') {
      serveStatic(requestUrl, response);
      return;
    }

    json(response, 405, { error: 'Método não permitido' });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 4173;
  const host = process.env.HOST || '0.0.0.0';
  const server = createServer();
  server.listen(port, host, () => {
    console.log(`Lume disponível em http://localhost:${port}`);
  });

  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    for (const room of rooms.values()) {
      broadcast(room, { type: 'server-restarting' });
      for (const client of room.clients.values()) client.response.end();
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10_000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = { createServer };

