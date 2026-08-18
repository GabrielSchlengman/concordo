const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('./server');

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('responde ao health check', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
    assert.deepEqual(await response.json(), { ok: true, name: 'Concord' });
  });
});

test('entrega a interface principal', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(baseUrl);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /Bem-vindo ao Concord/i);
    assert.match(html, /Compartilhar tela/i);
    assert.match(html, /Voz e áudio/i);
    assert.match(html, /Visualização padrão/i);
  });
});

test('transmite mensagens em tempo real para a sala', async () => {
  await withServer(async (baseUrl) => {
    const controller = new AbortController();
    const events = await fetch(`${baseUrl}/api/events?room=geral&clientId=teste-1&name=Gabriel`, {
      signal: controller.signal,
    });
    assert.equal(events.status, 200);
    const reader = events.body.getReader();
    const decoder = new TextDecoder();

    const firstChunk = decoder.decode((await reader.read()).value);
    assert.match(firstChunk, /conectado|hello/);

    const sent = await fetch(`${baseUrl}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: 'geral',
        clientId: 'teste-1',
        text: 'Mensagem de teste',
      }),
    });
    assert.equal(sent.status, 201);

    let received = '';
    for (let index = 0; index < 5 && !received.includes('Mensagem de teste'); index += 1) {
      const chunk = await reader.read();
      if (chunk.done) break;
      received += decoder.decode(chunk.value);
    }
    assert.match(received, /Mensagem de teste/);
    await reader.cancel();
    controller.abort();
  });
});

test('mantém o estado da chamada ao reconectar', async () => {
  await withServer(async (baseUrl) => {
    const firstController = new AbortController();
    const firstEvents = await fetch(`${baseUrl}/api/events?room=lobby&clientId=reconecta-1&name=Gabriel`, {
      signal: firstController.signal,
    });
    const firstReader = firstEvents.body.getReader();
    await firstReader.read();

    const joined = await fetch(`${baseUrl}/api/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room: 'lobby', clientId: 'reconecta-1', action: 'join' }),
    });
    assert.equal(joined.status, 200);

    const secondController = new AbortController();
    const secondEvents = await fetch(`${baseUrl}/api/events?room=lobby&clientId=reconecta-1&name=Gabriel`, {
      signal: secondController.signal,
    });
    const secondReader = secondEvents.body.getReader();
    const secondChunk = new TextDecoder().decode((await secondReader.read()).value);
    assert.match(secondChunk, /"inCall":true/);

    await secondReader.cancel();
    secondController.abort();
    firstController.abort();
  });
});

