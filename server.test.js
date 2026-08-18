const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('./server');

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try { await run(`http://127.0.0.1:${port}`); }
  finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
}

async function openEvents(baseUrl, room, clientId, name) {
  const controller = new AbortController();
  const response = await fetch(`${baseUrl}/api/events?${new URLSearchParams({ room, clientId, name })}`, { signal: controller.signal });
  assert.equal(response.status, 200);
  return { controller, reader: response.body.getReader(), decoder: new TextDecoder(), buffer: '', queue: [] };
}

async function nextEvent(session, predicate = () => true) {
  const deadline = Date.now() + 3500;
  while (Date.now() < deadline) {
    while (session.queue.length) {
      const payload = session.queue.shift();
      if (predicate(payload)) return payload;
    }
    const remaining = Math.max(1, deadline - Date.now());
    const result = await Promise.race([
      session.reader.read(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Tempo esgotado esperando evento')), remaining)),
    ]);
    if (result.done) break;
    session.buffer += session.decoder.decode(result.value, { stream: true });
    const blocks = session.buffer.split('\n\n'); session.buffer = blocks.pop();
    for (const block of blocks) {
      const line = block.split('\n').find((item) => item.startsWith('data: '));
      if (line) session.queue.push(JSON.parse(line.slice(6)));
    }
  }
  throw new Error('Evento esperado não chegou');
}

async function post(baseUrl, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await response.json();
  assert.ok(response.ok, data.error);
  return data;
}

async function closeEvents(...sessions) {
  await Promise.all(sessions.map((session) => session.reader.cancel().catch(() => {})));
  sessions.forEach((session) => session.controller.abort());
}

test('publica a versão 0.5 e os servidores ICE', async () => {
  await withServer(async (baseUrl) => {
    const health = await fetch(`${baseUrl}/api/health`);
    assert.deepEqual(await health.json(), { ok: true, name: 'Concord', version: '0.5.0' });
    assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
    const ice = await (await fetch(`${baseUrl}/api/ice`)).json();
    assert.ok(ice.iceServers.some((server) => String(server.urls).includes('turn:')));
  });
});

test('entrega a interface real sem os botões fictícios antigos', async () => {
  await withServer(async (baseUrl) => {
    const html = await (await fetch(baseUrl)).text();
    assert.match(html, /CONCORD/);
    assert.match(html, /Preview da minha tela/);
    assert.match(html, /Permitir desenhos/);
    assert.match(html, /Teste do microfone/);
    assert.match(html, /Proteger meu IP/);
    assert.match(html, /Gravar mensagem de voz/);
    assert.doesNotMatch(html, /Adicionar servidor|Anexar arquivo/);
  });
});

test('mantém texto e voz separados, encaminha sinais e sincroniza desenhos', async () => {
  await withServer(async (baseUrl) => {
    const gabriel = await openEvents(baseUrl, 'geral', 'gabriel-1', 'Gabriel');
    const amigo = await openEvents(baseUrl, 'projetos', 'amigo-1', 'Amigo');
    await nextEvent(gabriel, (event) => event.type === 'hello');
    await nextEvent(amigo, (event) => event.type === 'hello');

    await post(baseUrl, '/api/call', { clientId: 'gabriel-1', action: 'join', voiceRoom: 'lobby', media: { micEnabled: true } });
    await post(baseUrl, '/api/call', { clientId: 'amigo-1', action: 'join', voiceRoom: 'lobby', media: { micEnabled: true } });
    const roster = await nextEvent(gabriel, (event) => event.type === 'call-state' && event.users.length === 2);
    assert.deepEqual(new Set(roster.users.map((user) => user.id)), new Set(['gabriel-1', 'amigo-1']));
    assert.equal(roster.users.find((user) => user.id === 'amigo-1').textRoom, 'projetos');

    await post(baseUrl, '/api/signal', { clientId: 'gabriel-1', target: 'amigo-1', data: { candidate: { candidate: 'teste' } } });
    const signal = await nextEvent(amigo, (event) => event.type === 'signal');
    assert.equal(signal.from, 'gabriel-1');
    assert.equal(signal.data.candidate.candidate, 'teste');

    await post(baseUrl, '/api/media-state', {
      clientId: 'gabriel-1', media: { micEnabled: true, screenSharing: true, annotationsEnabled: true },
    });
    await nextEvent(amigo, (event) => event.type === 'call-state' && event.users.find((user) => user.id === 'gabriel-1')?.media.screenSharing);
    await post(baseUrl, '/api/annotation', {
      clientId: 'amigo-1', shareOwnerId: 'gabriel-1', action: 'item',
      item: { id: 'traco-1', tool: 'pen', color: '#ff5d8f', width: 3, points: [{ x: .1, y: .2 }, { x: .8, y: .7 }] },
    });
    const drawing = await nextEvent(gabriel, (event) => event.type === 'annotation' && event.action === 'item');
    assert.equal(drawing.item.id, 'traco-1');
    assert.equal(drawing.from, 'amigo-1');

    const atrasado = await openEvents(baseUrl, 'cafe', 'atrasado-1', 'Atrasado');
    await nextEvent(atrasado, (event) => event.type === 'hello');
    const joined = await post(baseUrl, '/api/call', { clientId: 'atrasado-1', action: 'join', voiceRoom: 'lobby', media: { micEnabled: true } });
    assert.equal(joined.annotations[0].items[0].id, 'traco-1');

    await post(baseUrl, '/api/media-state', {
      clientId: 'gabriel-1', media: { micEnabled: true, screenSharing: true, annotationsEnabled: false },
    });
    const denied = await fetch(`${baseUrl}/api/annotation`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'amigo-1', shareOwnerId: 'gabriel-1', action: 'item',
        item: { id: 'bloqueado-1', tool: 'text', text: 'não', x: .5, y: .5, color: '#ffffff', width: 4 },
      }),
    });
    assert.equal(denied.status, 403);
    await post(baseUrl, '/api/annotation', { clientId: 'gabriel-1', shareOwnerId: 'gabriel-1', action: 'clear' });

    await closeEvents(gabriel, amigo, atrasado);
  });
});

test('envia anexos temporários no chat e força download de arquivos arbitrários', async () => {
  await withServer(async (baseUrl) => {
    const session = await openEvents(baseUrl, 'geral', 'arquivo-1', 'Gabriel');
    await nextEvent(session, (event) => event.type === 'hello');
    const upload = await fetch(`${baseUrl}/api/upload?clientId=arquivo-1`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'X-File-Name': encodeURIComponent('notas.txt') },
      body: 'arquivo seguro',
    });
    assert.equal(upload.status, 201);
    const attachment = (await upload.json()).attachment;
    await post(baseUrl, '/api/message', { clientId: 'arquivo-1', room: 'geral', text: '', attachments: [attachment.id] });
    const message = await nextEvent(session, (event) => event.type === 'message');
    assert.equal(message.message.attachments[0].name, 'notas.txt');
    const download = await fetch(`${baseUrl}${attachment.url}`);
    assert.equal(download.headers.get('content-type'), 'application/octet-stream');
    assert.match(download.headers.get('content-disposition'), /^attachment/);
    assert.equal(await download.text(), 'arquivo seguro');
    await closeEvents(session);
  });
});

test('preserva a chamada ao trocar o canal de texto', async () => {
  await withServer(async (baseUrl) => {
    const first = await openEvents(baseUrl, 'geral', 'reconecta-1', 'Gabriel');
    await nextEvent(first, (event) => event.type === 'hello');
    await post(baseUrl, '/api/call', { clientId: 'reconecta-1', action: 'join', voiceRoom: 'musica', media: { micEnabled: true } });
    const second = await openEvents(baseUrl, 'cafe', 'reconecta-1', 'Gabriel');
    const hello = await nextEvent(second, (event) => event.type === 'hello');
    assert.equal(hello.self.voiceRoom, 'musica');
    assert.equal(hello.self.textRoom, 'cafe');
    await closeEvents(first, second);
  });
});
