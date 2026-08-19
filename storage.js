const DEFAULT_BUCKET = 'alpendre-files';

function cleanBucket(value) {
  const bucket = String(value || DEFAULT_BUCKET).trim();
  return /^[a-z0-9][a-z0-9-]{1,62}$/.test(bucket) ? bucket : DEFAULT_BUCKET;
}

function encodeObjectPath(value) {
  return String(value || '').split('/').filter(Boolean).map(encodeURIComponent).join('/');
}

function createSupabaseStorage({
  url = process.env.SUPABASE_URL,
  serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY,
  bucket = process.env.SUPABASE_STORAGE_BUCKET,
  fetchImpl = globalThis.fetch,
} = {}) {
  const baseUrl = String(url || '').trim().replace(/\/$/, '');
  const key = String(serviceKey || '').trim();
  const bucketName = cleanBucket(bucket);
  const configured = /^https?:\/\//i.test(baseUrl) && Boolean(key) && typeof fetchImpl === 'function';
  let healthy = configured ? null : false;
  let lastError = '';

  function headers(extra = {}) {
    return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
  }

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetchImpl(`${baseUrl}/storage/v1${path}`, {
        ...options, signal: controller.signal, headers: headers(options.headers),
      });
      if (!response.ok) throw new Error(`Storage respondeu ${response.status}`);
      healthy = true; lastError = '';
      return response;
    } catch (error) {
      healthy = false;
      lastError = error?.name === 'AbortError' ? 'tempo limite excedido' : String(error?.message || error);
      throw error;
    } finally { clearTimeout(timeout); }
  }

  async function upload(objectPath, data, mime) {
    if (!configured) throw new Error('Storage permanente não está configurado.');
    await request(`/object/${encodeURIComponent(bucketName)}/${encodeObjectPath(objectPath)}`, {
      method: 'POST', headers: { 'Content-Type': mime || 'application/octet-stream', 'x-upsert': 'false' }, body: data,
    });
  }

  async function download(objectPath) {
    if (!configured) throw new Error('Storage permanente não está configurado.');
    const response = await request(`/object/${encodeURIComponent(bucketName)}/${encodeObjectPath(objectPath)}`);
    return Buffer.from(await response.arrayBuffer());
  }

  async function remove(objectPaths) {
    const prefixes = (Array.isArray(objectPaths) ? objectPaths : [objectPaths]).map(String).filter(Boolean);
    if (!prefixes.length) return;
    if (!configured) throw new Error('Storage permanente não está configurado.');
    await request(`/object/${encodeURIComponent(bucketName)}`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes }),
    });
  }

  function status() { return { configured, healthy, lastError: lastError || undefined, bucket: bucketName }; }
  return { upload, download, remove, status };
}

module.exports = { createSupabaseStorage };
