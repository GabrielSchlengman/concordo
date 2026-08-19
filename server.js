const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { URL } = require('node:url');
const { createSupabasePersistence } = require('./persistence');

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
const DEFAULT_SPACE_ID = 'alpendre';
const DEFAULT_CHANNEL_NAMES = Object.freeze({
  text: { geral: 'geral', projetos: 'projetos', cafe: 'café' },
  voice: { lobby: 'Lobby', jogos: 'Jogatina', musica: 'Música' },
});
const rooms = new Map();
const spaces = new Map();
const clients = new Map();
const requestWindows = new Map();
const files = new Map();
const annotationItems = new Map();
const profiles = new Map();
let storedFileBytes = 0;
let turnCache = null;
let activePersistence = createSupabasePersistence();
let persistenceReady = Promise.resolve();

function resetRuntimeState() {
  for (const client of clients.values()) clearTimeout(client.disconnectTimer);
  rooms.clear(); clients.clear(); requestWindows.clear(); files.clear(); annotationItems.clear(); profiles.clear();
  spaces.clear();
  spaces.set(DEFAULT_SPACE_ID, createSpaceRecord({ id: DEFAULT_SPACE_ID, name: 'Alpendre', visibility: 'public' }));
  storedFileBytes = 0;
}

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self' https: wss:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(self), microphone=(self), display-capture=(self), speaker-selection=(self)',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

function roomKey(spaceId, roomId) {
  return `${spaceId}:${roomId}`;
}

function getRoom(spaceId, roomId) {
  const key = roomKey(spaceId, roomId);
  if (!rooms.has(key)) rooms.set(key, { clients: new Map(), messages: [] });
  return rooms.get(key);
}

function cleanId(value, fallback = '') {
  const id = String(value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  return id || fallback;
}

function cleanToken(value) {
  return String(value || '').trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
}

function cleanSpaceId(value, fallback = DEFAULT_SPACE_ID) {
  const id = cleanId(value, fallback).toLowerCase();
  return id || fallback;
}

function cleanSpaceName(value) {
  return String(value || 'Novo espaço').trim().replace(/\s+/g, ' ').slice(0, 40) || 'Novo espaço';
}

function cleanChannelName(value, fallback) {
  return String(value || fallback).trim().replace(/\s+/g, ' ').slice(0, 32) || fallback;
}

function createInviteCode() {
  let code;
  do { code = `ALP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`; }
  while ([...spaces.values()].some((space) => space.inviteCode === code));
  return code;
}

function createSpaceRecord({ id, name, visibility, ownerDeviceId = null }) {
  return {
    id, name, visibility, ownerDeviceId, inviteCode: id === DEFAULT_SPACE_ID ? 'ALPENDRE' : createInviteCode(),
    members: new Set(ownerDeviceId ? [ownerDeviceId] : []), banned: new Set(),
    channels: { text: { ...DEFAULT_CHANNEL_NAMES.text }, voice: { ...DEFAULT_CHANNEL_NAMES.voice } },
    createdAt: new Date().toISOString(),
  };
}

function persistentSnapshot() {
  return {
    version: 1,
    spaces: [...spaces.values()].map((space) => ({
      id: space.id,
      name: space.name,
      visibility: space.visibility,
      ownerDeviceId: space.ownerDeviceId,
      inviteCode: space.inviteCode,
      members: [...space.members],
      banned: [...space.banned],
      channels: space.channels,
      createdAt: space.createdAt,
    })),
    rooms: [...rooms].map(([key, room]) => ({
      key,
      messages: room.messages.slice(-100).map((message) => ({
        ...message,
        attachments: (message.attachments || []).map((attachment) => ({ ...attachment })),
      })),
    })).filter((room) => room.messages.length),
    profiles: [...profiles].map(([deviceId, profile]) => ({ deviceId, ...profile })),
  };
}

function restorePersistentState(snapshot) {
  if (!snapshot || snapshot.version !== 1) return;
  spaces.clear(); rooms.clear(); profiles.clear();
  for (const source of Array.isArray(snapshot.spaces) ? snapshot.spaces.slice(0, 100) : []) {
    const id = cleanSpaceId(source.id, '');
    if (!id || spaces.has(id)) continue;
    const space = createSpaceRecord({
      id,
      name: cleanSpaceName(source.name),
      visibility: source.visibility === 'private' ? 'private' : 'public',
      ownerDeviceId: cleanId(source.ownerDeviceId) || null,
    });
    const inviteCode = String(source.inviteCode || '').trim().toUpperCase();
    if (/^(?:ALPENDRE|ALP-[A-F0-9]{8})$/.test(inviteCode)) space.inviteCode = inviteCode;
    space.members = new Set((Array.isArray(source.members) ? source.members : []).map((idValue) => cleanId(idValue)).filter(Boolean));
    space.banned = new Set((Array.isArray(source.banned) ? source.banned : []).map((idValue) => cleanId(idValue)).filter(Boolean));
    for (const kind of ['text', 'voice']) {
      for (const channelId of Object.keys(DEFAULT_CHANNEL_NAMES[kind])) {
        space.channels[kind][channelId] = cleanChannelName(source.channels?.[kind]?.[channelId], DEFAULT_CHANNEL_NAMES[kind][channelId]);
      }
    }
    if (/^\d{4}-\d{2}-\d{2}T/.test(String(source.createdAt || ''))) space.createdAt = source.createdAt;
    spaces.set(id, space);
  }
  if (!spaces.has(DEFAULT_SPACE_ID)) spaces.set(DEFAULT_SPACE_ID, createSpaceRecord({ id: DEFAULT_SPACE_ID, name: 'Alpendre', visibility: 'public' }));
  const defaultSpace = spaces.get(DEFAULT_SPACE_ID);
  defaultSpace.name = 'Alpendre'; defaultSpace.visibility = 'public'; defaultSpace.ownerDeviceId = null; defaultSpace.inviteCode = 'ALPENDRE';

  for (const source of Array.isArray(snapshot.rooms) ? snapshot.rooms.slice(0, 300) : []) {
    const [spaceId, rawRoomId] = String(source.key || '').split(':');
    const roomId = cleanRoom(rawRoomId, '');
    if (!spaces.has(spaceId) || !roomId) continue;
    const room = getRoom(spaceId, roomId);
    room.messages = (Array.isArray(source.messages) ? source.messages.slice(-100) : []).map((message) => ({
      id: cleanId(message.id),
      clientId: cleanId(message.clientId),
      ownerDeviceId: cleanId(message.ownerDeviceId),
      name: cleanName(message.name),
      avatar: cleanAvatar(message.avatar),
      text: String(message.text || '').slice(0, 2000),
      attachments: (Array.isArray(message.attachments) ? message.attachments.slice(0, MAX_ATTACHMENTS_PER_MESSAGE) : []).map((attachment) => ({
        id: cleanId(attachment.id),
        name: cleanFileName(attachment.name),
        mime: cleanMime(attachment.mime),
        size: Math.max(0, Number(attachment.size) || 0),
        url: `/api/files/${cleanId(attachment.id)}`,
      })).filter((attachment) => attachment.id),
      attachmentIds: (Array.isArray(message.attachmentIds) ? message.attachmentIds : []).map((idValue) => cleanId(idValue)).filter(Boolean),
      createdAt: /^\d{4}-\d{2}-\d{2}T/.test(String(message.createdAt || '')) ? message.createdAt : new Date().toISOString(),
    })).filter((message) => message.id && (message.text || message.attachments.length));
  }
  for (const source of Array.isArray(snapshot.profiles) ? snapshot.profiles.slice(0, 1000) : []) {
    const deviceId = cleanId(source.deviceId);
    if (deviceId) profiles.set(deviceId, { name: cleanName(source.name), avatar: cleanAvatar(source.avatar) });
  }
}

function persistRuntimeState() {
  activePersistence.schedule(persistentSnapshot());
}

function spaceSlug(name) {
  const base = cleanSpaceName(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28) || 'espaco';
  let id = base;
  while (spaces.has(id)) id = `${base.slice(0, 21)}-${crypto.randomBytes(3).toString('hex')}`;
  return id;
}

function isSpaceMember(space, client) {
  return Boolean(client?.deviceId && (space.id === DEFAULT_SPACE_ID || space.members.has(client.deviceId)));
}

function canAccessSpace(space, client, deviceId = client?.deviceId) {
  if (!space) return false;
  if (deviceId && space.banned.has(deviceId)) return false;
  if (space.visibility === 'public' || space.id === DEFAULT_SPACE_ID) return true;
  return Boolean(deviceId && space.members.has(deviceId));
}

function spaceRole(space, client) {
  if (!client?.deviceId) return 'visitor';
  if (space.ownerDeviceId === client.deviceId) return 'owner';
  return isSpaceMember(space, client) ? 'member' : 'visitor';
}

function publicSpace(space, viewer = null) {
  let online = 0;
  for (const client of clients.values()) if (client.spaceId === space.id) online += 1;
  const role = spaceRole(space, viewer);
  const result = {
    id: space.id, name: space.name, visibility: space.visibility, online, createdAt: space.createdAt,
    role, joined: role !== 'visitor' || space.id === DEFAULT_SPACE_ID,
    channels: { text: { ...space.channels.text }, voice: { ...space.channels.voice } },
  };
  if (role === 'owner' || role === 'member') result.inviteCode = space.inviteCode;
  if (role === 'owner') {
    const seen = new Set();
    result.members = [...clients.values()].filter((client) => {
      if (client.spaceId !== space.id || seen.has(client.deviceId)) return false;
      seen.add(client.deviceId); return true;
    }).map((client) => ({ id: client.id, deviceId: client.deviceId, name: client.name, avatar: client.avatar || '' }));
  }
  return result;
}

function publicSpaces(viewer = null) {
  return [...spaces.values()]
    .filter((space) => space.visibility === 'public' || isSpaceMember(space, viewer))
    .map((space) => publicSpace(space, viewer));
}

function clientFromQuery(requestUrl) {
  const client = clients.get(cleanId(requestUrl.searchParams.get('clientId')));
  return client && cleanToken(requestUrl.searchParams.get('sessionToken')) === client.sessionToken ? client : null;
}

function viewerFromQuery(requestUrl) {
  const client = clientFromQuery(requestUrl);
  if (client) return client;
  const deviceId = cleanId(requestUrl.searchParams.get('deviceId'));
  return deviceId ? { deviceId } : null;
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
  return { provider: 'direct' };
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
    screenAudio: value?.screenAudio === true,
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
    spaceId: client.spaceId,
    inCall: Boolean(client.voiceRoom),
    media: cleanMediaState(client.media),
  };
}

function writeSse(response, payload) {
  if (!response || response.writableEnded || response.destroyed) return;
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcastTextRoom(spaceId, roomId, payload, exceptId = null) {
  const room = getRoom(spaceId, roomId);
  for (const [id, client] of room.clients) {
    if (id !== exceptId) writeSse(client.response, payload);
  }
}

function broadcastMessage(spaceId, roomId, message) {
  for (const client of getRoom(spaceId, roomId).clients.values()) {
    writeSse(client.response, { type: 'message', message: publicMessage(message, client) });
  }
}

function broadcastVoiceRoom(spaceId, voiceRoom, payload, exceptId = null) {
  if (!voiceRoom) return;
  for (const [id, client] of clients) {
    if (id !== exceptId && client.spaceId === spaceId && client.voiceRoom === voiceRoom) writeSse(client.response, payload);
  }
}

function broadcastAll(payload) {
  for (const client of clients.values()) writeSse(client.response, payload);
}

function usersForTextRoom(spaceId, roomId) {
  return [...getRoom(spaceId, roomId).clients.values()].map(publicUser);
}

function voiceChannelsState(spaceId) {
  const channels = Object.fromEntries([...VOICE_ROOMS].map((roomId) => [roomId, []]));
  for (const client of clients.values()) {
    if (client.spaceId === spaceId && client.voiceRoom && channels[client.voiceRoom]) channels[client.voiceRoom].push(publicUser(client));
  }
  return channels;
}

function sendTextPresence(spaceId, ...roomIds) {
  for (const roomId of new Set(roomIds.filter(Boolean))) {
    broadcastTextRoom(spaceId, roomId, { type: 'presence', users: usersForTextRoom(spaceId, roomId) });
  }
}

function sendVoiceState(spaceId) {
  const channels = voiceChannelsState(spaceId);
  for (const client of clients.values()) {
    if (client.spaceId !== spaceId) continue;
    writeSse(client.response, { type: 'voice-state', channels });
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
  const spaceId = client.spaceId;
  clearTimeout(client.disconnectTimer);
  getRoom(spaceId, textRoom).clients.delete(clientId);
  clients.delete(clientId);
  if (voiceRoom) {
    if (client.media?.screenSharing) broadcastVoiceRoom(spaceId, voiceRoom, { type: 'annotation', action: 'clear', shareOwnerId: clientId, from: clientId }, clientId);
    annotationItems.delete(clientId);
    broadcastVoiceRoom(spaceId, voiceRoom, { type: 'peer-left', id: clientId }, clientId);
  }
  sendTextPresence(spaceId, textRoom);
  sendVoiceState(spaceId);
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
  resetRuntimeState();
  activePersistence = createSupabasePersistence();
  persistenceReady = activePersistence.load().then((snapshot) => restorePersistentState(snapshot));
  return http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    await persistenceReady;

    if (request.method === 'GET' && requestUrl.pathname === '/') {
      response.writeHead(302, { ...securityHeaders, Location: '/index.html', 'Cache-Control': 'no-store' });
      response.end();
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
      json(response, 200, { ok: true, name: 'Alpendre', version: '1.2.0', persistence: activePersistence.status() });
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/spaces') {
      json(response, 200, { spaces: publicSpaces(viewerFromQuery(requestUrl)) });
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/space') {
      const space = spaces.get(cleanSpaceId(requestUrl.searchParams.get('id')));
      const viewer = viewerFromQuery(requestUrl);
      if (!space || !canAccessSpace(space, viewer)) json(response, 404, { error: 'Este espaço não existe ou você não tem acesso.' });
      else json(response, 200, { space: publicSpace(space, viewer) });
      return;
    }

    if (request.method === 'POST' && requestUrl.pathname === '/api/spaces') {
      if (isRateLimited(request)) { json(response, 429, { error: 'Muitas criações em pouco tempo. Aguarde um minuto.' }); return; }
      try {
        const body = await readJson(request);
        const creator = clients.get(cleanId(body.clientId));
        if (!creator || cleanToken(body.sessionToken) !== creator.sessionToken) {
          json(response, 409, { error: 'Reconecte-se e tente novamente.' }); return;
        }
        const visibility = body.visibility === 'private' ? 'private' : 'public';
        const name = cleanSpaceName(body.name);
        const id = visibility === 'private' ? `priv-${crypto.randomBytes(12).toString('hex')}` : spaceSlug(name);
        const space = createSpaceRecord({ id, name, visibility, ownerDeviceId: creator.deviceId });
        spaces.set(id, space);
        persistRuntimeState();
        broadcastAll({ type: 'spaces-updated' });
        json(response, 201, { ok: true, space: publicSpace(space, creator) });
      } catch (error) {
        json(response, 400, { error: error.message || 'Não foi possível criar o espaço.' });
      }
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
      const spaceId = cleanSpaceId(requestUrl.searchParams.get('space'));
      const space = spaces.get(spaceId);
      const textRoom = cleanRoom(requestUrl.searchParams.get('room'));
      const clientId = cleanId(requestUrl.searchParams.get('clientId'));
      const deviceId = cleanId(requestUrl.searchParams.get('deviceId'));
      const name = cleanName(requestUrl.searchParams.get('name'));
      const accessClient = clients.get(clientId);
      if (!space || !clientId || !deviceId || !canAccessSpace(space, accessClient, deviceId)) {
        json(response, space && clientId && deviceId ? 403 : 400, { error: space ? 'Você não tem acesso a este espaço.' : 'Este espaço não existe ou o convite expirou.' });
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
        json(response, 503, { error: 'O Alpendre está cheio. Tente novamente em instantes.' });
        return;
      }
      const nextRoom = getRoom(spaceId, textRoom);
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
      const previousSpaceId = existing?.spaceId;
      if (existing) {
        clearTimeout(existing.disconnectTimer);
        if (existing.response && !existing.response.writableEnded) existing.response.end();
        if (previousTextRoom && (previousTextRoom !== textRoom || previousSpaceId !== spaceId)) getRoom(previousSpaceId, previousTextRoom).clients.delete(clientId);
        if (previousSpaceId && previousSpaceId !== spaceId && existing.voiceRoom) {
          if (existing.media?.screenSharing) broadcastVoiceRoom(previousSpaceId, existing.voiceRoom, { type: 'annotation', action: 'clear', shareOwnerId: clientId, from: clientId }, clientId);
          annotationItems.delete(clientId);
          broadcastVoiceRoom(previousSpaceId, existing.voiceRoom, { type: 'peer-left', id: clientId }, clientId);
          existing.voiceRoom = null;
          existing.media = cleanMediaState();
          sendVoiceState(previousSpaceId);
        }
      }
      const client = existing || {
        id: clientId,
        sessionToken: crypto.randomBytes(32).toString('base64url'),
        avatar: profiles.get(deviceId)?.avatar || '',
        voiceRoom: null,
        media: cleanMediaState(),
      };
      client.name = name;
      client.deviceId = deviceId;
      client.response = response;
      client.textRoom = textRoom;
      client.spaceId = spaceId;
      if (space.visibility === 'public' || space.id === DEFAULT_SPACE_ID) {
        const wasMember = space.members.has(deviceId);
        space.members.add(deviceId);
        if (!wasMember) persistRuntimeState();
      }
      client.disconnectTimer = null;
      clients.set(clientId, client);
      nextRoom.clients.set(clientId, client);

      writeSse(response, {
        type: 'hello',
        space: publicSpace(space, client),
        room: textRoom,
        messages: nextRoom.messages.map((message) => publicMessage(message, client)),
        users: usersForTextRoom(spaceId, textRoom),
        voiceChannels: voiceChannelsState(spaceId),
        self: publicUser(client),
        sessionToken: client.sessionToken,
      });
      if (previousSpaceId && previousSpaceId !== spaceId) sendTextPresence(previousSpaceId, previousTextRoom);
      sendTextPresence(spaceId, textRoom);
      sendVoiceState(spaceId);

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
      const sessionToken = cleanToken(request.headers['x-alpendre-session'] || request.headers['x-concord-session'] || requestUrl.searchParams.get('sessionToken'));
      if (!client || sessionToken !== client.sessionToken) { json(response, 409, { error: 'Reconecte-se e tente novamente.' }); return; }
      const declaredSize = Number(request.headers['content-length']) || 0;
      if (declaredSize > MAX_UPLOAD_BYTES) { json(response, 413, { error: 'O arquivo ultrapassa o limite de 8 MB.' }); return; }
      try {
        const data = await readBuffer(request);
        if (!data.length) { json(response, 400, { error: 'O arquivo está vazio.' }); return; }
        const file = {
          id: crypto.randomBytes(18).toString('hex'), clientId, spaceId: client.spaceId, room: client.textRoom,
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
          const attachments = attachmentIds.map((id) => files.get(id)).filter((file) => file?.clientId === clientId && file.spaceId === client.spaceId && file.room === roomId);
          if (!text && !attachments.length) {
            json(response, 400, { error: 'Mensagem vazia' });
            return;
          }
          const room = getRoom(client.spaceId, roomId);
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
          persistRuntimeState();
          broadcastMessage(client.spaceId, roomId, message);
          json(response, 201, { ok: true });
          return;
        }

        if (requestUrl.pathname === '/api/message-delete') {
          const roomId = cleanRoom(body.room || client.textRoom);
          const room = getRoom(client.spaceId, roomId);
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
          persistRuntimeState();
          broadcastTextRoom(client.spaceId, roomId, { type: 'message-deleted', messageId });
          json(response, 200, { ok: true });
          return;
        }

        if (requestUrl.pathname === '/api/profile') {
          client.name = cleanName(body.name || client.name);
          if (Object.hasOwn(body, 'avatar')) client.avatar = cleanAvatar(body.avatar);
          profiles.set(client.deviceId, { name: client.name, avatar: client.avatar });
          persistRuntimeState();
          sendTextPresence(client.spaceId, client.textRoom);
          sendVoiceState(client.spaceId);
          json(response, 200, { ok: true, user: publicUser(client) });
          return;
        }

        if (requestUrl.pathname === '/api/space-join') {
          const code = String(body.code || '').trim().toUpperCase();
          const space = [...spaces.values()].find((item) => item.inviteCode === code || item.id.toUpperCase() === code);
          if (!space) { json(response, 404, { error: 'Código de convite inválido ou expirado.' }); return; }
          if (space.banned.has(client.deviceId)) { json(response, 403, { error: 'Você foi removido deste espaço pelo administrador.' }); return; }
          space.members.add(client.deviceId);
          persistRuntimeState();
          broadcastAll({ type: 'spaces-updated' });
          json(response, 200, { ok: true, space: publicSpace(space, client) });
          return;
        }

        if (requestUrl.pathname === '/api/space-action') {
          const space = spaces.get(cleanSpaceId(body.spaceId, client.spaceId));
          if (!space) { json(response, 404, { error: 'Espaço não encontrado.' }); return; }
          const action = String(body.action || '');
          if (action === 'leave') {
            if (space.id === DEFAULT_SPACE_ID || space.ownerDeviceId === client.deviceId) {
              json(response, 403, { error: space.id === DEFAULT_SPACE_ID ? 'O Alpendre padrão está sempre disponível.' : 'O dono precisa excluir o espaço, não sair dele.' }); return;
            }
            space.members.delete(client.deviceId);
            writeSse(client.response, { type: 'space-removed', spaceId: space.id, reason: 'left' });
          } else if (action === 'delete') {
            if (space.id === DEFAULT_SPACE_ID || space.ownerDeviceId !== client.deviceId) {
              json(response, 403, { error: 'Somente o dono pode excluir este espaço.' }); return;
            }
            for (const member of clients.values()) if (member.spaceId === space.id) writeSse(member.response, { type: 'space-removed', spaceId: space.id, reason: 'deleted' });
            spaces.delete(space.id);
            for (const key of [...rooms.keys()]) if (key.startsWith(`${space.id}:`)) rooms.delete(key);
          } else if (action === 'kick') {
            if (space.ownerDeviceId !== client.deviceId) { json(response, 403, { error: 'Somente o dono pode remover participantes.' }); return; }
            const target = clients.get(cleanId(body.targetClientId));
            if (!target || target.spaceId !== space.id || target.deviceId === client.deviceId) { json(response, 404, { error: 'Participante não encontrado.' }); return; }
            space.members.delete(target.deviceId); space.banned.add(target.deviceId);
            writeSse(target.response, { type: 'space-removed', spaceId: space.id, reason: 'kicked' });
          } else { json(response, 400, { error: 'Ação inválida.' }); return; }
          persistRuntimeState();
          broadcastAll({ type: 'spaces-updated' });
          json(response, 200, { ok: true });
          return;
        }

        if (requestUrl.pathname === '/api/channel-update') {
          const space = spaces.get(cleanSpaceId(body.spaceId, client.spaceId));
          if (!space || space.ownerDeviceId !== client.deviceId) { json(response, 403, { error: 'Somente o dono pode editar os canais.' }); return; }
          const kind = body.kind === 'voice' ? 'voice' : 'text';
          const channelId = cleanId(body.channelId);
          const allowed = kind === 'voice' ? VOICE_ROOMS : TEXT_ROOMS;
          if (!allowed.has(channelId)) { json(response, 400, { error: 'Canal inválido.' }); return; }
          space.channels[kind][channelId] = cleanChannelName(body.name, DEFAULT_CHANNEL_NAMES[kind][channelId]);
          persistRuntimeState();
          const updated = publicSpace(space, client);
          for (const member of clients.values()) if (member.spaceId === space.id) writeSse(member.response, { type: 'space-updated', space: publicSpace(space, member) });
          json(response, 200, { ok: true, space: updated });
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
            if (client.media?.screenSharing) broadcastVoiceRoom(client.spaceId, previousVoiceRoom, { type: 'annotation', action: 'clear', shareOwnerId: clientId, from: clientId });
            annotationItems.delete(clientId);
            broadcastVoiceRoom(client.spaceId, previousVoiceRoom, { type: 'peer-left', id: clientId }, clientId);
          }
          client.voiceRoom = nextVoiceRoom;
          client.media = joining ? cleanMediaState(body.media) : cleanMediaState();
          sendVoiceState(client.spaceId);
          if (joining) {
            for (const [ownerId, store] of annotationItems) {
              const owner = clients.get(ownerId);
              if (owner?.spaceId !== client.spaceId || owner?.voiceRoom !== nextVoiceRoom || !owner.media?.screenSharing || !store.size) continue;
              writeSse(client.response, {
                type: 'annotation-sync', shareOwnerId: ownerId,
                items: [...store.values()].map((entry) => ({ ...entry.item, authorId: entry.from })),
              });
            }
          }
          json(response, 200, {
            ok: true,
            voiceRoom: client.voiceRoom,
            conference: conferenceConfig(client.voiceRoom),
            users: client.voiceRoom ? voiceChannelsState(client.spaceId)[client.voiceRoom] : [],
            annotations: client.voiceRoom ? [...annotationItems].flatMap(([ownerId, store]) => {
              const owner = clients.get(ownerId);
              return owner?.spaceId === client.spaceId && owner?.voiceRoom === client.voiceRoom && owner.media?.screenSharing && store.size
                ? [{ shareOwnerId: ownerId, items: [...store.values()].map((entry) => ({ ...entry.item, authorId: entry.from })) }]
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
            broadcastVoiceRoom(client.spaceId, client.voiceRoom, { type: 'annotation', action: 'clear', shareOwnerId: clientId, from: clientId });
          }
          sendVoiceState(client.spaceId);
          json(response, 200, { ok: true });
          return;
        }

        if (requestUrl.pathname === '/api/signal') {
          const targetId = cleanId(body.target);
          const target = clients.get(targetId);
          if (!client.voiceRoom || target?.spaceId !== client.spaceId || target?.voiceRoom !== client.voiceRoom) {
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
          if (!client.voiceRoom || shareOwner?.spaceId !== client.spaceId || shareOwner?.voiceRoom !== client.voiceRoom || !shareOwner.media.screenSharing) {
            json(response, 409, { error: 'Compartilhamento indisponível.' });
            return;
          }
          const store = annotationStore(shareOwnerId);
          const requestedAction = String(body.action || 'item');
          let action = requestedAction === 'clear' ? 'clear' : requestedAction === 'remove' ? 'remove' : 'item';
          const payload = { type: 'annotation', action, shareOwnerId, from: clientId, authorName: client.name };
          if (action === 'clear') {
            if (clientId === shareOwnerId) store.clear();
            else {
              const itemIds = [...store].filter(([, entry]) => entry.from === clientId).map(([itemId]) => itemId);
              for (const itemId of itemIds) store.delete(itemId);
              action = 'remove-many'; payload.action = action; payload.itemIds = itemIds;
            }
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
            if (source.tool === 'pointer') { json(response, 400, { error: 'A ferramenta Clique foi removida.' }); return; }
            const tool = source.tool === 'eraser' ? 'eraser' : source.tool === 'text' ? 'text' : 'pen';
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
            } else {
              const rawPoints = Array.isArray(source.points) ? source.points.slice(0, 1000) : [];
              item.points = rawPoints.map((point) => ({
                x: Math.max(0, Math.min(1, Number(point.x) || 0)),
                y: Math.max(0, Math.min(1, Number(point.y) || 0)),
              }));
              if (item.points.length < 2) { json(response, 400, { error: 'Traço inválido.' }); return; }
            }
            if (store.size >= 500) store.delete(store.keys().next().value);
            store.set(item.id, { from: clientId, authorName: client.name, item }); payload.item = { ...item, authorId: clientId };
          }
          broadcastVoiceRoom(client.spaceId, client.voiceRoom, payload);
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
  server.listen(port, host, () => console.log(`Alpendre disponível em http://localhost:${port}`));

  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    broadcastAll({ type: 'server-restarting' });
    for (const client of clients.values()) client.response?.end();
    server.close(async () => {
      await activePersistence.flush();
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 10_000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = { createServer };
