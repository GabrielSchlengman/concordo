const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createServer } = require('./server');
const sessionTokens = new Map();

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try { await run(`http://127.0.0.1:${port}`); }
  finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
}

async function openEvents(baseUrl, room, clientId, name, deviceId = `${clientId}-device`, space = 'alpendre') {
  const controller = new AbortController();
  const response = await fetch(`${baseUrl}/api/events?${new URLSearchParams({ space, room, clientId, deviceId, name })}`, { signal: controller.signal });
  assert.equal(response.status, 200);
  return { clientId, controller, reader: response.body.getReader(), decoder: new TextDecoder(), buffer: '', queue: [] };
}

async function nextEvent(session, predicate = () => true) {
  const deadline = Date.now() + 3500;
  while (Date.now() < deadline) {
    while (session.queue.length) {
      const payload = session.queue.shift();
      if (payload.type === 'hello' && payload.sessionToken) sessionTokens.set(session.clientId, payload.sessionToken);
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
  const secured = { ...body, sessionToken: body.sessionToken || sessionTokens.get(body.clientId) };
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(secured),
  });
  const data = await response.json();
  assert.ok(response.ok, data.error);
  return data;
}

async function closeEvents(...sessions) {
  await Promise.all(sessions.map((session) => session.reader.cancel().catch(() => {})));
  sessions.forEach((session) => session.controller.abort());
}

test('publica o Alpendre 1.1.0 sem credenciais TURN compartilhadas', async () => {
  await withServer(async (baseUrl) => {
    const health = await fetch(`${baseUrl}/api/health`);
    assert.deepEqual(await health.json(), { ok: true, name: 'Alpendre', version: '1.1.0' });
    assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
    assert.match(health.headers.get('content-security-policy'), /frame-src 'self'/);
    assert.doesNotMatch(health.headers.get('content-security-policy'), /meet\.jit\.si/);
    const ice = await (await fetch(`${baseUrl}/api/ice`)).json();
    assert.equal(ice.iceServers.some((server) => String(server.urls).includes('openrelay.metered.ca')), false);
    assert.equal(ice.relayReady, false);
    assert.equal(ice.relayProvider, 'none');
  });
});

test('entrega a interface real sem os botões fictícios antigos', async () => {
  await withServer(async (baseUrl) => {
    const html = await (await fetch(baseUrl)).text();
    assert.match(html, /ALPENDRE/);
    assert.match(html, /Preview da minha tela/);
    assert.match(html, /Permitir desenhos/);
    assert.match(html, /Teste do microfone/);
    assert.match(html, /Proteção rígida de IP/);
    assert.match(html, /Gravar mensagem de voz/);
    assert.match(html, /Anotações por cima da minha tela/);
    assert.doesNotMatch(html, /Marcar onde clicar/);
    assert.match(html, /alpendre-chimp-a\.png/);
    assert.match(html, /Chamada dentro do Alpendre/);
    assert.match(html, /Servidores disponíveis/);
    assert.match(html, /Código do convite/);
    assert.doesNotMatch(html, /jitsi-container|Abrir chamada agora/);
    assert.doesNotMatch(html, /Adicionar servidor|Anexar arquivo/);
  });
});

test('integra a chamada WebRTC dentro do app e mantém a camada segura do desktop', () => {
  const app = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');
  const main = fs.readFileSync(path.join(__dirname, 'electron', 'main.js'), 'utf8');
  const overlay = fs.readFileSync(path.join(__dirname, 'electron', 'annotation-overlay.js'), 'utf8');
  assert.match(app, /protectIp: false/);
  assert.match(app, /className = 'remote-call-audio'/);
  assert.match(app, /new RTCPeerConnection/);
  assert.doesNotMatch(app, /jitsi|meet\.ffmuc/i);
  assert.doesNotMatch(app, /window\.open\(/);
  assert.match(app, /startAnnotationOverlay/);
  assert.doesNotMatch(main, /JITSI_ORIGIN|createCallWindow/);
  assert.match(main, /setIgnoreMouseEvents\(true/);
  assert.match(main, /setContentProtection\(true\)/);
  assert.doesNotMatch(overlay, /item\.tool === 'pointer'/);
  assert.match(app, /remove-many/);
});

test('cria espaços públicos e privados e isola chamadas entre eles', async () => {
  await withServer(async (baseUrl) => {
    const owner = await openEvents(baseUrl, 'geral', 'espaco-admin', 'Admin', 'admin-device');
    await nextEvent(owner, (event) => event.type === 'hello');
    const create = async (name, visibility) => {
      return (await post(baseUrl, '/api/spaces', { clientId: 'espaco-admin', name, visibility })).space;
    };
    const publicSpace = await create('Varanda pública', 'public');
    const privateSpace = await create('Turma privada', 'private');
    const directory = await (await fetch(`${baseUrl}/api/spaces`)).json();
    assert.ok(directory.spaces.some((space) => space.id === publicSpace.id));
    assert.ok(!directory.spaces.some((space) => space.id === privateSpace.id));
    const ownerQuery = new URLSearchParams({ id: privateSpace.id, clientId: 'espaco-admin', sessionToken: sessionTokens.get('espaco-admin') });
    const privateView = (await (await fetch(`${baseUrl}/api/space?${ownerQuery}`)).json()).space;
    assert.equal(privateView.visibility, 'private');
    assert.equal(privateView.role, 'owner');
    assert.match(privateView.inviteCode, /^ALP-[A-F0-9]{8}$/);

    const inviteeDefault = await openEvents(baseUrl, 'geral', 'convidado-1', 'Convidado', 'convidado-device');
    await nextEvent(inviteeDefault, (event) => event.type === 'hello');
    const joinedPrivate = await post(baseUrl, '/api/space-join', { clientId: 'convidado-1', code: privateView.inviteCode });
    assert.equal(joinedPrivate.space.role, 'member');
    const invitee = await openEvents(baseUrl, 'geral', 'convidado-1', 'Convidado', 'convidado-device', privateSpace.id);
    await nextEvent(invitee, (event) => event.type === 'hello');
    const renamed = await post(baseUrl, '/api/channel-update', { clientId: 'espaco-admin', spaceId: privateSpace.id, kind: 'voice', channelId: 'lobby', name: 'Resenha' });
    assert.equal(renamed.space.channels.voice.lobby, 'Resenha');
    await post(baseUrl, '/api/space-action', { clientId: 'espaco-admin', spaceId: privateSpace.id, action: 'kick', targetClientId: 'convidado-1' });
    const blockedPrivate = await fetch(`${baseUrl}/api/space?${new URLSearchParams({ id: privateSpace.id, clientId: 'convidado-1', sessionToken: sessionTokens.get('convidado-1') })}`);
    assert.equal(blockedPrivate.status, 404);

    const defaultUser = await openEvents(baseUrl, 'geral', 'espaco-a', 'Pessoa A');
    const otherUser = await openEvents(baseUrl, 'geral', 'espaco-b', 'Pessoa B', 'espaco-b-device', publicSpace.id);
    await nextEvent(defaultUser, (event) => event.type === 'hello');
    await nextEvent(otherUser, (event) => event.type === 'hello');
    await post(baseUrl, '/api/call', { clientId: 'espaco-a', action: 'join', voiceRoom: 'lobby', media: { micEnabled: true } });
    await post(baseUrl, '/api/call', { clientId: 'espaco-b', action: 'join', voiceRoom: 'lobby', media: { micEnabled: true } });
    const blocked = await fetch(`${baseUrl}/api/signal`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: 'espaco-a', sessionToken: sessionTokens.get('espaco-a'), target: 'espaco-b', data: { candidate: null } }),
    });
    assert.equal(blocked.status, 409);
    await closeEvents(owner, inviteeDefault, invitee, defaultUser, otherUser);
  });
});

test('mantém texto e voz separados, encaminha sinais e sincroniza desenhos', async () => {
  await withServer(async (baseUrl) => {
    const gabriel = await openEvents(baseUrl, 'geral', 'gabriel-1', 'Gabriel');
    const amigo = await openEvents(baseUrl, 'projetos', 'amigo-1', 'Amigo');
    await nextEvent(gabriel, (event) => event.type === 'hello');
    await nextEvent(amigo, (event) => event.type === 'hello');

    const gabrielJoin = await post(baseUrl, '/api/call', { clientId: 'gabriel-1', action: 'join', voiceRoom: 'lobby', media: { micEnabled: true } });
    const amigoJoin = await post(baseUrl, '/api/call', { clientId: 'amigo-1', action: 'join', voiceRoom: 'lobby', media: { micEnabled: true } });
    assert.equal(gabrielJoin.conference.provider, 'direct');
    assert.equal(amigoJoin.conference.provider, 'direct');
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
      clientId: 'gabriel-1', shareOwnerId: 'gabriel-1', action: 'item',
      item: { id: 'dono-1', tool: 'pen', color: '#5dd6ff', width: 3, points: [{ x: .2, y: .2 }, { x: .3, y: .3 }] },
    });
    await post(baseUrl, '/api/annotation', {
      clientId: 'amigo-1', shareOwnerId: 'gabriel-1', action: 'item',
      item: { id: 'traco-1', tool: 'pen', color: '#ff5d8f', width: 3, points: [{ x: .1, y: .2 }, { x: .8, y: .7 }] },
    });
    const drawing = await nextEvent(gabriel, (event) => event.type === 'annotation' && event.item?.id === 'traco-1');
    assert.equal(drawing.item.id, 'traco-1');
    assert.equal(drawing.from, 'amigo-1');
    const pointer = await fetch(`${baseUrl}/api/annotation`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: 'amigo-1', sessionToken: sessionTokens.get('amigo-1'), shareOwnerId: 'gabriel-1', action: 'item', item: { id: 'clique-1', tool: 'pointer', x: .45, y: .55 } }),
    });
    assert.equal(pointer.status, 400);
    await post(baseUrl, '/api/annotation', {
      clientId: 'amigo-1', shareOwnerId: 'gabriel-1', action: 'item',
      item: { id: 'texto-1', tool: 'text', text: 'clique aqui', x: .5, y: .6, color: '#ffffff', width: 4 },
    });
    const textItem = await nextEvent(gabriel, (event) => event.type === 'annotation' && event.item?.id === 'texto-1');
    assert.equal(textItem.item.text, 'clique aqui');

    const atrasado = await openEvents(baseUrl, 'cafe', 'atrasado-1', 'Atrasado');
    await nextEvent(atrasado, (event) => event.type === 'hello');
    const joined = await post(baseUrl, '/api/call', { clientId: 'atrasado-1', action: 'join', voiceRoom: 'lobby', media: { micEnabled: true } });
    assert.equal(joined.annotations[0].items[0].id, 'dono-1');
    assert.equal(joined.annotations[0].items.length, 3);
    assert.equal(joined.annotations[0].items.find((item) => item.id === 'traco-1').authorId, 'amigo-1');

    await post(baseUrl, '/api/annotation', { clientId: 'amigo-1', shareOwnerId: 'gabriel-1', action: 'clear' });
    const removedOwn = await nextEvent(gabriel, (event) => event.type === 'annotation' && event.action === 'remove-many');
    assert.deepEqual(new Set(removedOwn.itemIds), new Set(['traco-1', 'texto-1']));

    await post(baseUrl, '/api/media-state', {
      clientId: 'gabriel-1', media: { micEnabled: true, screenSharing: true, annotationsEnabled: false },
    });
    const denied = await fetch(`${baseUrl}/api/annotation`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'amigo-1', sessionToken: sessionTokens.get('amigo-1'), shareOwnerId: 'gabriel-1', action: 'item',
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
    const upload = await fetch(`${baseUrl}/api/upload?${new URLSearchParams({ clientId: 'arquivo-1', sessionToken: sessionTokens.get('arquivo-1') })}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/zip', 'X-File-Name': encodeURIComponent('notas.zip') },
      body: 'arquivo seguro',
    });
    assert.equal(upload.status, 201);
    const attachment = (await upload.json()).attachment;
    await post(baseUrl, '/api/message', { clientId: 'arquivo-1', room: 'geral', text: '', attachments: [attachment.id] });
    const message = await nextEvent(session, (event) => event.type === 'message');
    assert.equal(message.message.mine, true);
    assert.equal(message.message.attachments[0].name, 'notas.zip');
    const download = await fetch(`${baseUrl}${attachment.url}`);
    assert.equal(download.headers.get('content-type'), 'application/octet-stream');
    assert.match(download.headers.get('content-disposition'), /^attachment/);
    assert.equal(await download.text(), 'arquivo seguro');

    const previewUpload = await fetch(`${baseUrl}/api/upload?${new URLSearchParams({ clientId: 'arquivo-1', sessionToken: sessionTokens.get('arquivo-1') })}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'X-File-Name': encodeURIComponent('leia.txt') },
      body: 'prévia dentro do Alpendre',
    });
    const previewAttachment = (await previewUpload.json()).attachment;
    const preview = await fetch(`${baseUrl}${previewAttachment.url}?preview=1`);
    assert.equal(preview.headers.get('content-type'), 'text/plain');
    assert.match(preview.headers.get('content-disposition'), /^inline/);
    const forcedDownload = await fetch(`${baseUrl}${previewAttachment.url}?download=1`);
    assert.equal(forcedDownload.headers.get('content-type'), 'application/octet-stream');

    await post(baseUrl, '/api/message-delete', { clientId: 'arquivo-1', room: 'geral', messageId: message.message.id });
    const deleted = await nextEvent(session, (event) => event.type === 'message-deleted');
    assert.equal(deleted.messageId, message.message.id);
    assert.equal((await fetch(`${baseUrl}${attachment.url}`)).status, 404);
    await closeEvents(session);
  });
});

test('mantém apenas uma guia ativa por instalação', async () => {
  await withServer(async (baseUrl) => {
    const first = await openEvents(baseUrl, 'geral', 'guia-1', 'Gabriel', 'instalacao-unica');
    await nextEvent(first, (event) => event.type === 'hello');
    const second = await openEvents(baseUrl, 'geral', 'guia-2', 'Gabriel', 'instalacao-unica');
    const replaced = await nextEvent(first, (event) => event.type === 'tab-replaced');
    assert.equal(replaced.type, 'tab-replaced');
    const hello = await nextEvent(second, (event) => event.type === 'hello');
    assert.equal(hello.self.id, 'guia-2');
    await closeEvents(first, second);
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
