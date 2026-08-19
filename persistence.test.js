const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createSupabasePersistence } = require('./persistence');
const { createSupabaseStorage } = require('./storage');

test('usa memória quando o Supabase não está configurado', async () => {
  const persistence = createSupabasePersistence({ url: '', serviceKey: '' });
  assert.equal(await persistence.load(), null);
  assert.deepEqual(persistence.status(), { mode: 'memory', configured: false, healthy: false, lastError: undefined });
});

test('carrega e salva o estado pelo REST do Supabase sem expor a chave no navegador', async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    if (!options.method) return { ok: true, json: async () => [{ payload: { version: 1, spaces: [] } }] };
    return { ok: true, json: async () => [] };
  };
  const persistence = createSupabasePersistence({
    url: 'https://example.supabase.co', serviceKey: 'server-secret', fetchImpl, debounceMs: 1,
  });
  assert.deepEqual(await persistence.load(), { version: 1, spaces: [] });
  persistence.schedule({ version: 1, spaces: [{ id: 'alpendre' }] });
  await persistence.flush();
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /alpendre_state\?on_conflict=scope$/);
  assert.equal(calls[1].options.headers.Authorization, 'Bearer server-secret');
  assert.equal(JSON.parse(calls[1].options.body).scope, 'main');
});

test('inclui um schema privado para a service role', () => {
  const sql = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /revoke all.*anon, authenticated/i);
  assert.match(sql, /grant all.*service_role/i);
  assert.match(sql, /storage\.buckets/i);
  assert.match(sql, /alpendre-files/);
});

test('envia, baixa e remove anexos pelo Storage sem expor a chave', async () => {
  const calls = [];
  const storage = createSupabaseStorage({
    url: 'https://example.supabase.co', serviceKey: 'server-secret',
    fetchImpl: async (url, options = {}) => {
      calls.push({ url, options });
      return { ok: true, arrayBuffer: async () => Buffer.from('arquivo').buffer };
    },
  });
  await storage.upload('attachments/geral/arquivo.txt', Buffer.from('arquivo'), 'text/plain');
  await storage.download('attachments/geral/arquivo.txt');
  await storage.remove(['attachments/geral/arquivo.txt']);
  assert.match(calls[0].url, /storage\/v1\/object\/alpendre-files\/attachments\/geral\/arquivo.txt$/);
  assert.equal(calls[0].options.headers.Authorization, 'Bearer server-secret');
  assert.equal(calls[2].options.method, 'DELETE');
});
