const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { URL } = require('node:url');

const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_BODY_BYTES = 384 * 1024;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_FILE_STORE_BYTES = 64 * 1024 * 1024;
const MAX_ATTACHMENTS_PER_MESSAGE = 5;
const MAX_CLIENTS = 300;
const MAX_CLIENTS_PER_ROOM = 150;
const RECONNECT_GRACE_MS = 8_000;
const TEXT_ROOMS = new Set(['geral', 'projetos', 'cafe']);
const VOICE_ROOMS = new Set(['lobby', 'jogos', 'musica']);
const rooms = new Map();
const clients = new Map();
const requestWindows = new Map();
const files = new Map();
const annotationItems = new Map();
let storedFileBytes = 0;
let turnCache = null;

const requestedJitsiDomain = String(process.env.JITSI_DOMAIN || 'meet.jit.si')
  .trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
const JITSI_DOMAIN = /^[a-z0-9.-]+$/.test(requestedJitsiDomain) ? requestedJitsiDomain : 'meet.jit.si';
const CONFERENCE_NAMESPACE = String(process.env.CONCORD_CONFERENCE_NAMESPACE || crypto.randomBytes(18).toString('hex'))
  .replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
const JITSI_ORIGIN = `https://${JITSI_DOMAIN}`;

const securityHeaders = {
  'Content-Security-Policy': `default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https: wss:; style-src 'self' 'unsafe-inline'; script-src 'self' ${JITSI_ORIGIN}; frame-src ${JITSI_ORIGIN}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': `camera=(self "${JITSI_ORIGIN}"), microphone=(self "${JITSI_ORIGIN}"), display-capture=(self "${JITSI_ORIGIN}"), speaker-selection=(self "${JITSI_ORIGIN}")`,
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

function getRoom(roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, { clients: new Map(), messages: [] });
  return rooms.get(roomId);
}

function cleanId(value, fallback = '') {
  const id = String(value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  return id || fallback;
}

function cleanToken(value) {
  return String(value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
}

function cleanRoom(value, fallback = 'geral') {
  const roomId = cleanId(value, fallback);
  return TEXT_ROOMS.has(roomId) ? roomId : fallback;
}

function cleanVoiceRoom(value) {
  const roomId = cleanId(value, '');
  return VOICE_ROOMS.has(roomId) ? roomId : null;
}

function conferenceConfig(voiceRoom) {
  if (!voiceRoom) return null;
  return {
    provider: 'jitsi',
    domain: JITSI_DOMAIN,
    roomName: `Concord-${CONFERENCE_NAMESPACE}-${voiceRoom}`,
  };
}

function cleanName(value) {
  return String(value || 'Visitante').trim().replace(/\s+/g, ' ').slice(0, 32) || 'Visitante';
}

function cleanAvatar(value) {
  const avatar = String(value || '');
  if (!avatar) return '';
  if (avatar.length > 140_000) return '';
  return /^data:image\/(?:png|jpe?g|webp);base64,[a-zA-Z0-9+/=]+$/.test(avatar) ? avatar : '';
}

function cleanFileName(value) {
  let name;
  try { name = decodeURIComponent(String(value || 'arquivo')); } catch { name = String(value || 'arquivo'); }
  return name.replace(/[\u0000-\u001f<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 120) || 'arquivo';
}

function cleanMime(value) {
  const mime = String(value || '').split(';')[0].trim().toLowerCase().slice(0, 100);
  return /^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/.test(mime) ? mime : 'application/octet-stream';
}

function isInlineMime(mime) {
  return /^(?:image\/(?:png|jpe?g|gif|webp)|audio\/(?:mpeg|ogg|wav|webm|mp4|x-m4a)|video\/(?:mp4|webm|ogg|quicktime|x-matroska)|application\/pdf|text\/plain)$/.test(mime);
}

function publicAttachment(file) {
  return { id: file.id, name: file.name, mime: file.mime, size: file.size, url: `/api/files/${file.id}` };
}

function publicMessage(message, client) {
  return {
    id: message.id,
    clientId: message.clientId,
    name: message.name,
    avatar: message.avatar,
    text: message.text,
    attachments: message.attachments,
    createdAt: message.createdAt,
    mine: Boolean(client?.deviceId && message.ownerDeviceId === client.deviceId),
  };
}

function pruneFiles() {
  const expiry = Date.now() - (24 * 60 * 60 * 1000);
  for (const [id, file] of files) {
    if (file.createdAt < expiry || storedFileBytes > MAX_FILE_STORE_BYTES || files.size > 200) {
      files.delete(id); storedFileBytes -= file.size;
    }
  }
}

function annotationStore(ownerId) {
  if (!annotationItems.has(ownerId)) annotationItems.set(ownerId, new Map());
  return annotationItems.get(ownerId);
}

function cleanMediaState(value) {
  return {
    micEnabled: value?.micEnabled !== false,
    cameraEnabled: value?.cameraEnabled === true,
    screenSharing: value?.screenSharing === true,
    annotationsEnabled: value?.annotationsEnabled === true,
    deafened: value?.deafened === true,
  };
}

function publicUser(client) {
  return {
    id: client.id,
    name: client.name,
    avatar: client.avatar || '',
    textRoom: client.textRoom,
    voiceRoom: client.voiceRoom,
    inCall: Boolean(client.voiceRoom),
    media: cleanMediaState(client.media),
  };
}

function writeSse(response, payload) {
  if (!response || response.writableEnded || response.destroyed) return;
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcastTextRoom(roomId, payload, exceptId = null) {
  const room = getRoom(roomId);
  for (const [id, client] of room.clients) {
    if (id !== exceptId) writeSse(client.response, payload);
  }
}

function broadcastMessage(roomId, message) {
  for (const client of getRoom(roomId).clients.values()) {
    writeSse(client.response, { type: 'message', message: publicMessage(message, client) });
  }
}

function broadcastVoiceRoom(voiceRoom, payload, exceptId = null) {
  if (!voiceRoom) return;
  for (const [id, client] of clients) {
    if (id !== exceptId && client.voiceRoom === voiceRoom) writeSse(client.response, payload);
  }
}

function broadcastAll(payload) {
  for (const client of clients.values()) writeSse(client.response, payload);
}

function usersForTextRoom(roomId) {
  return [...getRoom(roomId).clients.values()].map(publicUser);
}

function voiceChannelsState() {
  const channels = Object.fromEntries([...VOICE_ROOMS].map((roomId) => [roomId, []]));
  for (const client of clients.values()) {
    if (client.voiceRoom && channels[client.voiceRoom]) channels[client.voiceRoom].push(publicUser(client));
  }
  return channels;
}

function sendTextPresence(...roomIds) {
  for (const roomId of new Set(roomIds.filter(Boolean))) {
    broadcastTextRoom(roomId, { type: 'presence', users: usersForTextRoom(roomId) });
  }
}

function sendVoiceState() {
  const channels = voiceChannelsState();
  broadcastAll({ type: 'voice-state', channels });
  for (const client of clients.values()) {
    if (!client.voiceRoom) continue;
    writeSse(client.response, {
      type: 'call-state',
      room: client.voiceRoom,
      users: channels[client.voiceRoom] || [],
    });
  }
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
  const forwarded = String(request.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const address = forwarded || request.socket.remoteAddress || 'desconhecido';
  const now = Date.now();
  const current = requestWindows.get(address);
  if (!current || now - current.startedAt >= 60_000) {
    requestWindows.set(address, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > 240;
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

function readBuffer(request, limit = MAX_UPLOAD_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('O arquivo ultrapassa o limite de 8 MB.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => resolve(Buffer.concat(chunks)));
    request.on('error', reject);
  });
}

function serveFile(requestUrl, response) {
  const id = cleanId(requestUrl.pathname.split('/').pop(), '');
  const file = files.get(id);
  if (!file) { json(response, 404, { error: 'Este arquivo expirou ou não existe mais.' }); return; }
  const inline = isInlineMime(file.mime) && requestUrl.searchParams.get('download') !== '1';
  response.writeHead(200, {
    ...securityHeaders,
    'Content-Type': inline ? file.mime : 'application/octet-stream',
    'Content-Length': file.size,
    'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cache-Control': 'private, max-age=3600',
  });
  response.end(file.data);
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

function disconnectClientNow(clientId, response = null) {
  const client = clients.get(clientId);
  if (!client || (response && client.response !== response)) return;
  const textRoom = client.textRoom;
  const voiceRoom = client.voiceRoom;
  clearTimeout(client.disconnectTimer);
  getRoom(textRoom).clients.delete(clientId);
  clients.delete(clientId);
  if (voiceRoom) {
    if (client.media?.screenSharing) broadcastVoiceRoom(voiceRoom, { type: 'annotation', action: 'clear', shareOwnerId: clientId, from: clientId }, clientId);
    annotationItems.delete(clientId);
    broadcastVoiceRoom(voiceRoom, { type: 'peer-left', id: clientId }, clientId);
  }
  sendTextPresence(textRoom);
  sendVoiceState();
}

function scheduleDisconnect(clientId, response) {
  const client = clients.get(clientId);
  if (!client || client.response !== response) return;
  clearTimeout(client.disconnectTimer);
  client.disconnectTimer = setTimeout(() => {
    disconnectClientNow(clientId, response);
  }, RECONNECT_GRACE_MS);
  client.disconnectTimer.unref?.();
}

function validIceServers(value) {
  return Array.isArray(value) && value.some((server) => {
    const urls = Array.isArray(server?.urls) ? server.urls : [server?.urls];
    return urls.some((url) => /^turns?:/i.test(String(url || ''))) && server.username && server.credential;
  });
}

async function providerIceServers() {
  if (turnCache?.expiresAt > Date.now()) return turnCache.value;
  const cloudflareKeyId = String(process.env.CLOUDFLARE_TURN_KEY_ID || '').trim();
  const cloudflareToken = String(process.env.CLOUDFLARE_TURN_API_TOKEN || '').trim();
  const meteredUrl = String(process.env.METERED_TURN_URL || '').trim();
  let value = null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    let response = null;
    if (cloudflareKeyId && cloudflareToken) {
      response = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(cloudflareKeyId)}/credentials/generate-ice-servers`, {
        method: 'POST', signal: controller.signal,
        headers: { Authorization: `Bearer ${cloudflareToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttl: 86_400 }),
      });
      if (response.ok) {
        const payload = await response.json();
        if (validIceServers(payload.iceServers)) value = { iceServers: payload.iceServers, relayReady: true, relayReliable: true, relayProvider: 'cloudflare' };
      }
    } else if (/^https:\/\/[a-z0-9.-]+\.metered\.live\/api\/v1\/turn\/credentials\?/i.test(meteredUrl)) {
      response = await fetch(meteredUrl, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (response.ok) {
        const payload = await response.json();
        if (validIceServers(payload)) value = { iceServers: payload, relayReady: true, relayReliable: true, relayProvider: 'metered' };
      }
    }
    clearTimeout(timer);
    if (response && !response.ok) console.warn(`TURN provider respondeu ${response.status}`);
  } catch (error) {
    console.warn(`TURN provider indisponível: ${error.name || 'erro'}`);
  }
  if (value) turnCache = { expiresAt: Date.now() + 12 * 60 * 60 * 1000, value };
  return value;
}

async function iceServers() {
  const configuredUrls = String(process.env.TURN_URLS || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (configuredUrls.length && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    return {
      iceServers: [
        { urls: ['stun:stun.l.google.com:19302', 'stun:stun.cloudflare.com:3478'] },
        { urls: configuredUrls, username: process.env.TURN_USERNAME, credential: process.env.TURN_CREDENTIAL },
      ],
      relayReady: true, relayReliable: true, relayProvider: 'custom',
    };
  }
  const provider = await providerIceServers();
  if (provider) return provider;
  return {
    iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun.cloudflare.com:3478'] }],
    relayReady: false, relayReliable: false, relayProvider: 'none',
  };
}

function createServer() {
  return http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

    if (request.method === 'GET' && requestUrl.pathname === '/') {
      response.writeHead(302, { ...securityHeaders, Location: '/index.html', 'Cache-Control': 'no-store' });
      response.end();
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
      json(response, 200, { ok: true, name: 'Concord', version: '0.9.0' });
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/ice') {
      json(response, 200, await iceServers());
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname.startsWith('/api/files/')) {
      serveFile(requestUrl, response);
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/events') {
      const textRoom = cleanRoom(requestUrl.searchParams.get('room'));
      const clientId = cleanId(requestUrl.searchParams.get('clientId'));
      const deviceId = cleanId(requestUrl.searchParams.get('deviceId'));
      const name = cleanName(requestUrl.searchParams.get('name'));
      if (!clientId || !deviceId) {
        json(response, 400, { error: 'Cliente inválido' });
        return;
      }
      for (const [otherId, other] of [...clients]) {
        if (otherId === clientId || other.deviceId !== deviceId) continue;
        writeSse(other.response, { type: 'tab-replaced' });
        other.response?.end();
        disconnectClientNow(otherId);
      }
      const existing = clients.get(clientId);
      if (!existing && clients.size >= MAX_CLIENTS) {
        json(response, 503, { error: 'O Concord está cheio. Tente novamente em instantes.' });
        return;
      }
      const nextRoom = getRoom(textRoom);
      if (!existing && nextRoom.clients.size >= MAX_CLIENTS_PER_ROOM) {
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

      const previousTextRoom = existing?.textRoom;
      if (existing) {
        clearTimeout(existing.disconnectTimer);
        if (existing.response && !existing.response.writableEnded) existing.response.end();
        if (previousTextRoom && previousTextRoom !== textRoom) getRoom(previousTextRoom).clients.delete(clientId);
      }
      const client = existing || {
        id: clientId,
        sessionToken: crypto.randomBytes(32).toString('base64url'),
        avatar: '',
        voiceRoom: null,
        media: cleanMediaState(),
      };
      client.name = name;
      client.deviceId = deviceId;
      client.response = response;
      client.textRoom = textRoom;
      client.disconnectTimer = null;
      clients.set(clientId, client);
      nextRoom.clients.set(clientId, client);

      writeSse(response, {
        type: 'hello',
        room: textRoom,
        messages: nextRoom.messages.map((message) => publicMessage(message, client)),
        users: usersForTextRoom(textRoom),
        voiceChannels: voiceChannelsState(),
        self: publicUser(client),
        sessionToken: client.sessionToken,
      });
      sendTextPresence(previousTextRoom, textRoom);
      sendVoiceState();

      const heartbeat = setInterval(() => {
        if (!response.writableEnded) response.write(': ping\n\n');
      }, 20_000);
      request.on('close', () => {
        clearInterval(heartbeat);
        scheduleDisconnect(clientId, response);
      });
      return;
    }

    if (request.method === 'POST' && requestUrl.pathname === '/api/upload') {
      if (isRateLimited(request)) { json(response, 429, { error: 'Muitos envios em pouco tempo. Aguarde um minuto.' }); return; }
      const clientId = cleanId(requestUrl.searchParams.get('clientId'));
      const client = clients.get(clientId);
      const sessionToken = cleanToken(request.headers['x-concord-session'] || requestUrl.searchParams.get('sessionToken'));
      if (!client || sessionToken !== client.sessionToken) { json(response, 409, { error: 'Reconecte-se e tente novamente.' }); return; }
      const declaredSize = Number(request.headers['content-length']) || 0;
      if (declaredSize > MAX_UPLOAD_BYTES) { json(response, 413, { error: 'O arquivo ultrapassa o limite de 8 MB.' }); return; }
      try {
        const data = await readBuffer(request);
        if (!data.length) { json(response, 400, { error: 'O arquivo está vazio.' }); return; }
        const file = {
          id: crypto.randomBytes(18).toString('hex'), clientId, room: client.textRoom,
          name: cleanFileName(request.headers['x-file-name']), mime: cleanMime(request.headers['content-type']),
          size: data.length, data, createdAt: Date.now(),
        };
        files.set(file.id, file); storedFileBytes += file.size; pruneFiles();
        json(response, 201, { ok: true, attachment: publicAttachment(file), expiresInHours: 24 });
      } catch (error) { if (!response.writableEnded) json(response, 400, { error: error.message || 'Falha no envio.' }); }
      return;
    }

    if (request.method === 'POST' && requestUrl.pathname.startsWith('/api/')) {
      if (isRateLimited(request)) {
        json(response, 429, { error: 'Muitas ações em pouco tempo. Aguarde um minuto.' });
        return;
      }
      try {
        const body = await readJson(request);
        const clientId = cleanId(body.clientId);
        const client = clients.get(clientId);
        if (!client || cleanToken(body.sessionToken) !== client.sessionToken) {
          json(response, 409, { error: 'Reconecte-se e tente novamente.' });
          return;
        }

        if (requestUrl.pathname === '/api/message') {
          const roomId = cleanRoom(body.room || client.textRoom);
          const text = String(body.text || '').trim().slice(0, 2000);
          const attachmentIds = Array.isArray(body.attachments) ? body.attachments.slice(0, MAX_ATTACHMENTS_PER_MESSAGE).map((id) => cleanId(id)) : [];
          const attachments = attachmentIds.map((id) => files.get(id)).filter((file) => file?.clientId === clientId && file.room === roomId);
          if (!text && !attachments.length) {
            json(response, 400, { error: 'Mensagem vazia' });
            return;
          }
          const room = getRoom(roomId);
          const message = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            clientId,
            ownerDeviceId: client.deviceId,
            name: client.name,
            avatar: client.avatar || '',
            text,
            attachments: attachments.map(publicAttachment),
            attachmentIds: attachments.map((attachment) => attachment.id),
            createdAt: new Date().toISOString(),
          };
          room.messages.push(message);
          if (room.messages.length > 100) room.messages.shift();
          broadcastMessage(roomId, message);
          json(response, 201, { ok: true });
          return;
        }

        if (requestUrl.pathname === '/api/message-delete') {
          const roomId = cleanRoom(body.room || client.textRoom);
          const room = getRoom(roomId);
          const messageId = cleanId(body.messageId);
          const index = room.messages.findIndex((message) => message.id === messageId);
          if (index < 0) { json(response, 404, { error: 'Mensagem não encontrada.' }); return; }
          const message = room.messages[index];
          if (message.ownerDeviceId !== client.deviceId) { json(response, 403, { error: 'Você só pode excluir suas próprias mensagens.' }); return; }
          room.messages.splice(index, 1);
          for (const attachmentId of message.attachmentIds || []) {
            const file = files.get(attachmentId);
            if (file) { files.delete(attachmentId); storedFileBytes -= file.size; }
          }
          broadcastTextRoom(roomId, { type: 'message-deleted', messageId });
          json(response, 200, { ok: true });
          return;
        }

        if (requestUrl.pathname === '/api/profile') {
          client.name = cleanName(body.name || client.name);
          if (Object.hasOwn(body, 'avatar')) client.avatar = cleanAvatar(body.avatar);
          sendTextPresence(client.textRoom);
          sendVoiceState();
          json(response, 200, { ok: true, user: publicUser(client) });
          return;
        }

        if (requestUrl.pathname === '/api/call') {
          const joining = body.action === 'join';
          const previousVoiceRoom = client.voiceRoom;
          const nextVoiceRoom = joining ? cleanVoiceRoom(body.voiceRoom || body.room) : null;
          if (joining && !nextVoiceRoom) {
            json(response, 400, { error: 'Canal de voz inválido' });
            return;
          }
          if (previousVoiceRoom && previousVoiceRoom !== nextVoiceRoom) {
            if (client.media?.screenSharing) broadcastVoiceRoom(previousVoiceRoom, { type: 'annotation', action: 'clear', shareOwnerId: clientId, from: clientId });
            annotationItems.delete(clientId);
            broadcastVoiceRoom(previousVoiceRoom, { type: 'peer-left', id: clientId }, clientId);
          }
          client.voiceRoom = nextVoiceRoom;
          client.media = joining ? cleanMediaState(body.media) : cleanMediaState();
          sendVoiceState();
          if (joining) {
            for (const [ownerId, store] of annotationItems) {
              const owner = clients.get(ownerId);
              if (owner?.voiceRoom !== nextVoiceRoom || !owner.media?.screenSharing || !store.size) continue;
              writeSse(client.response, {
                type: 'annotation-sync', shareOwnerId: ownerId,
                items: [...store.values()].map((entry) => entry.item),
              });
            }
          }
          json(response, 200, {
            ok: true,
            voiceRoom: client.voiceRoom,
            conference: conferenceConfig(client.voiceRoom),
            users: client.voiceRoom ? voiceChannelsState()[client.voiceRoom] : [],
            annotations: client.voiceRoom ? [...annotationItems].flatMap(([ownerId, store]) => {
              const owner = clients.get(ownerId);
              return owner?.voiceRoom === client.voiceRoom && owner.media?.screenSharing && store.size
                ? [{ shareOwnerId: ownerId, items: [...store.values()].map((entry) => entry.item) }]
                : [];
            }) : [],
          });
          return;
        }

        if (requestUrl.pathname === '/api/media-state') {
          if (!client.voiceRoom) {
            json(response, 409, { error: 'Você não está em uma chamada.' });
            return;
          }
          const wasSharing = client.media?.screenSharing === true;
          client.media = cleanMediaState(body.media);
          if (wasSharing !== client.media.screenSharing) {
            annotationItems.delete(clientId);
            broadcastVoiceRoom(client.voiceRoom, { type: 'annotation', action: 'clear', shareOwnerId: clientId, from: clientId });
          }
          sendVoiceState();
          json(response, 200, { ok: true });
          return;
        }

        if (requestUrl.pathname === '/api/signal') {
          const targetId = cleanId(body.target);
          const target = clients.get(targetId);
          if (!client.voiceRoom || target?.voiceRoom !== client.voiceRoom) {
            json(response, 409, { error: 'Participante fora da chamada' });
            return;
          }
          writeSse(target.response, { type: 'signal', from: clientId, name: client.name, data: body.data });
          json(response, 200, { ok: true });
          return;
        }

        if (requestUrl.pathname === '/api/annotation') {
          const shareOwnerId = cleanId(body.shareOwnerId);
          const shareOwner = clients.get(shareOwnerId);
          if (!client.voiceRoom || shareOwner?.voiceRoom !== client.voiceRoom || !shareOwner.media.screenSharing) {
            json(response, 409, { error: 'Compartilhamento indisponível.' });
            return;
          }
          const store = annotationStore(shareOwnerId);
          const requestedAction = String(body.action || 'item');
          const action = requestedAction === 'clear' ? 'clear' : requestedAction === 'remove' ? 'remove' : 'item';
          const payload = { type: 'annotation', action, shareOwnerId, from: clientId, authorName: client.name };
          if (action === 'clear') {
            if (clientId !== shareOwnerId) { json(response, 403, { error: 'Somente quem compartilha pode apagar tudo.' }); return; }
            store.clear();
          } else if (action === 'remove') {
            const itemId = cleanId(body.itemId);
            const existingItem = store.get(itemId);
            if (!existingItem || (existingItem.from !== clientId && clientId !== shareOwnerId)) {
              json(response, 403, { error: 'Você só pode desfazer suas próprias anotações.' }); return;
            }
            store.delete(itemId); payload.itemId = itemId;
          } else {
            if (clientId !== shareOwnerId && !shareOwner.media.annotationsEnabled) {
              json(response, 403, { error: 'Quem está compartilhando desativou as anotações.' }); return;
            }
            const source = body.item || body.stroke || {};
            const tool = source.tool === 'eraser' ? 'eraser' : source.tool === 'text' ? 'text' : source.tool === 'pointer' ? 'pointer' : 'pen';
            const item = {
              id: cleanId(source.id, crypto.randomBytes(12).toString('hex')),
              tool, color: /^#[0-9a-fA-F]{6}$/.test(source.color) ? source.color : '#ff5d8f',
              width: Math.max(1, Math.min(36, Number(source.width) || 3)),
            };
            if (tool === 'text') {
              item.text = String(source.text || '').trim().slice(0, 160);
              item.x = Math.max(0, Math.min(1, Number(source.x) || 0));
              item.y = Math.max(0, Math.min(1, Number(source.y) || 0));
              if (!item.text) { json(response, 400, { error: 'Texto vazio.' }); return; }
            } else if (tool === 'pointer') {
              item.x = Math.max(0, Math.min(1, Number(source.x) || 0));
              item.y = Math.max(0, Math.min(1, Number(source.y) || 0));
            } else {
              const rawPoints = Array.isArray(source.points) ? source.points.slice(0, 1000) : [];
              item.points = rawPoints.map((point) => ({
                x: Math.max(0, Math.min(1, Number(point.x) || 0)),
                y: Math.max(0, Math.min(1, Number(point.y) || 0)),
              }));
              if (item.points.length < 2) { json(response, 400, { error: 'Traço inválido.' }); return; }
            }
            if (store.size >= 500) store.delete(store.keys().next().value);
            store.set(item.id, { from: clientId, authorName: client.name, item }); payload.item = item;
          }
          broadcastVoiceRoom(client.voiceRoom, payload);
          json(response, 201, { ok: true });
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
  server.listen(port, host, () => console.log(`Concord disponível em http://localhost:${port}`));

  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    broadcastAll({ type: 'server-restarting' });
    for (const client of clients.values()) client.response?.end();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10_000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = { createServer };
