const DEFAULT_SCOPE = 'main';
const DEFAULT_TABLE = 'alpendre_state';

function safeTableName(value) {
  const table = String(value || DEFAULT_TABLE).trim();
  return /^[a-z][a-z0-9_]{0,62}$/.test(table) ? table : DEFAULT_TABLE;
}

function createSupabasePersistence({
  url = process.env.SUPABASE_URL,
  serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY,
  table = process.env.SUPABASE_STATE_TABLE,
  fetchImpl = globalThis.fetch,
  debounceMs = 350,
} = {}) {
  const baseUrl = String(url || '').trim().replace(/\/$/, '');
  const key = String(serviceKey || '').trim();
  const tableName = safeTableName(table);
  const configured = /^https?:\/\//i.test(baseUrl) && Boolean(key) && typeof fetchImpl === 'function';
  let healthy = configured ? null : false;
  let lastError = '';
  let timer = null;
  let pendingSnapshot = null;

  function headers(extra = {}) {
    return {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      ...extra,
    };
  }

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetchImpl(`${baseUrl}/rest/v1/${tableName}${path}`, {
        ...options,
        signal: controller.signal,
        headers: headers(options.headers),
      });
      if (!response.ok) throw new Error(`Supabase respondeu ${response.status}`);
      healthy = true;
      lastError = '';
      return response;
    } catch (error) {
      healthy = false;
      lastError = error?.name === 'AbortError' ? 'tempo limite excedido' : String(error?.message || error);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function load() {
    if (!configured) return null;
    try {
      const response = await request(`?select=payload&scope=eq.${encodeURIComponent(DEFAULT_SCOPE)}&limit=1`);
      const rows = await response.json();
      return Array.isArray(rows) ? rows[0]?.payload || null : null;
    } catch (error) {
      console.warn(`Persistência Supabase indisponível no início: ${lastError}`);
      return null;
    }
  }

  async function save(snapshot) {
    if (!configured || !snapshot) return false;
    try {
      await request('?on_conflict=scope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({ scope: DEFAULT_SCOPE, payload: snapshot, updated_at: new Date().toISOString() }),
      });
      return true;
    } catch (error) {
      console.warn(`Não foi possível salvar no Supabase: ${lastError}`);
      return false;
    }
  }

  function schedule(snapshot) {
    if (!configured) return;
    pendingSnapshot = snapshot;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      const next = pendingSnapshot;
      pendingSnapshot = null;
      save(next);
    }, debounceMs);
    timer.unref?.();
  }

  async function flush() {
    clearTimeout(timer);
    timer = null;
    const next = pendingSnapshot;
    pendingSnapshot = null;
    return next ? save(next) : true;
  }

  function status() {
    return {
      mode: configured ? 'supabase' : 'memory',
      configured,
      healthy,
      lastError: lastError || undefined,
    };
  }

  return { load, save, schedule, flush, status };
}

module.exports = { createSupabasePersistence };
