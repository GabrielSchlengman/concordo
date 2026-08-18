const CHANNELS = {
  geral: 'geral', projetos: 'projetos', cafe: 'café',
  lobby: 'Lobby', jogos: 'Jogatina', musica: 'Música',
};

const ICONS = {
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
  'mic-off': '<path d="m2 2 20 20M9 9v3a3 3 0 0 0 5.12 2.12M15 9.3V5a3 3 0 0 0-5.63-1.44M17 17.1A7 7 0 0 0 19 12v-2M5 10v2a7 7 0 0 0 10.43 6.1M12 19v3M8 22h8"/>',
  headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2M18 19h-2v-6h4v4a2 2 0 0 1-2 2ZM6 19H4a2 2 0 0 1-2-2v-4h4v6Z"/>',
  video: '<path d="M15 10 21 6v12l-6-4v4H3V6h12v12"/>',
  'video-off': '<path d="m2 2 20 20M15 10l6-4v12l-3.7-2.47M15 15v3H3V6h3"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"/>',
  'volume-off': '<path d="M11 5 6 9H2v6h4l5 4V5ZM22 9l-6 6M16 9l6 6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 8.95 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.58 15 1.7 1.7 0 0 0 3.02 14H3v-4h.08A1.7 1.7 0 0 0 4.6 8.95a1.7 1.7 0 0 0-.34-1.88L4.2 7l2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.58 1.7 1.7 0 0 0 10 3.02V3h4v.08A1.7 1.7 0 0 0 15.05 4.6a1.7 1.7 0 0 0 1.88-.34L17 4.2 19.83 7l-.06.06A1.7 1.7 0 0 0 19.42 9 1.7 1.7 0 0 0 20.98 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/>',
  members: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 11a4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.87"/>',
  screen: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M8 10l4-4 4 4M12 6v7"/>',
  'phone-off': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92ZM2 2l20 20"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  fullscreen: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
  pencil: '<path d="m18 2 4 4L7 21H3v-4L18 2ZM14 6l4 4"/>',
  eraser: '<path d="m7 21-4-4L16 4a2.8 2.8 0 0 1 4 4L8 20a3 3 0 0 1-1 .7ZM6 14l5 5M9 21h12"/>',
  text: '<path d="M5 4h14M12 4v16M8 20h8"/>',
  undo: '<path d="M9 7 4 12l5 5M4 12h9a7 7 0 0 1 7 7"/>',
  paperclip: '<path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  waveform: '<path d="M3 10v4M7 7v10M11 3v18M15 8v8M19 5v14M23 10v4"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  trash: '<path d="M3 6h18M8 6V3h8v3M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
};

function iconSvg(name) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.close}</svg>`;
}
document.querySelectorAll('[data-icon]').forEach((node) => { node.innerHTML = iconSvg(node.dataset.icon); });

const DEFAULTS = {
  microphoneId: 'default', speakerId: 'default', cameraId: 'default',
  sensitivity: 12, masterVolume: 100,
  noiseSuppression: true, echoCancellation: true, autoGainControl: true,
  participantVideo: true, selfView: true, screenPreview: true,
  annotations: true, autoFocus: true, cameraQuality: '720', screenQuality: '1080',
  protectIp: true, callSounds: true, soundVolume: 45,
  accent: '#8b5cf6', compact: false,
};

function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem('concord-settings') || '{}');
    const settings = { ...DEFAULTS, ...raw };
    if (raw.shareQuality) settings.screenQuality = String(raw.shareQuality);
    if (raw.autoFocusShares !== undefined) settings.autoFocus = Boolean(raw.autoFocusShares);
    if (raw.compactMode !== undefined) settings.compact = Boolean(raw.compactMode);
    if (!/^#[0-9a-f]{6}$/i.test(settings.accent)) settings.accent = DEFAULTS.accent;
    settings.sensitivity = Math.max(2, Math.min(45, Number(settings.sensitivity) || 12));
    settings.soundVolume = Math.max(0, Math.min(100, Number(settings.soundVolume) || 0));
    settings.protectIp = settings.protectIp !== false;
    settings.callSounds = settings.callSounds !== false;
    return settings;
  } catch { return { ...DEFAULTS }; }
}

const clientId = sessionStorage.getItem('concord-client-id') || sessionStorage.getItem('lume-client-id') || crypto.randomUUID();
sessionStorage.setItem('concord-client-id', clientId);

const state = {
  clientId,
  name: localStorage.getItem('concord-name') || localStorage.getItem('lume-name') || 'Visitante',
  avatar: localStorage.getItem('concord-avatar') || '',
  textRoom: 'geral', voiceRoom: null, eventSource: null,
  textUsers: [], voiceChannels: { lobby: [], jogos: [], musica: [] }, callUsers: [],
  settings: loadSettings(), peers: new Map(), iceServers: [],
  audioStream: null, cameraStream: null, screenStream: null,
  micEnabled: true, deafened: false, annotationsEnabled: true,
  audioContext: null, audioMonitors: new Map(), voiceFrame: null,
  speaking: new Set(), loopbackActive: false, micTestStream: null,
  layout: 'grid', pinnedUserId: null, autoFocusedShareId: null,
  drawColor: '#ff5d8f', drawTool: 'pen', drawSize: 4, activeShareOwnerId: null,
  annotationPanelOpen: false, annotations: new Map(), ownAnnotationIds: [], pendingAvatar: null,
  knownCallUsers: new Map(), callRosterReady: false,
  pendingFiles: [], recorder: null, recordingStream: null, recordingStartedAt: 0, recordingTimer: null,
};

const IDS = [
  'room-title','chat-area','messages','message-form','message-input','attachment-tray','attach-button','file-input','record-audio','recording-time','member-count','member-list','toggle-member-list',
  'call-stage','call-title','call-status','video-grid','layout-button','participant-video-button','self-view-button','fullscreen-button',
  'annotation-toolbar','annotation-target','close-annotation','draw-size','undo-drawing','clear-drawings','annotation-permission-row','allow-annotations','annotation-help','call-mic','call-deafen','call-camera','call-screen','call-draw','leave-call',
  'connection-panel','connected-room','disconnect-voice','profile-button','profile-avatar','profile-fallback','self-name','self-status','bar-mic','bar-deafen','open-settings',
  'settings-overlay','close-settings','settings-avatar','settings-avatar-fallback','settings-name-display','display-name','avatar-input','remove-avatar','save-profile','profile-feedback',
  'input-device','output-device','master-volume','master-volume-value','mic-sensitivity','sensitivity-value','loopback-button','settings-meter','mic-loopback-audio',
  'noise-suppression','noise-status','echo-cancellation','echo-status','auto-gain','gain-status','protect-ip','call-sounds','sound-volume','sound-volume-value',
  'setting-participant-video','setting-self-view','setting-screen-preview','setting-annotations','setting-auto-focus','camera-device','camera-quality','screen-quality','accent-color','compact-mode',
  'context-menu','toast-stack',
];
const el = Object.fromEntries(IDS.map((id) => [id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), document.getElementById(id)]));

function initials(name) {
  return String(name || 'Visitante').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
}

function avatarNode(user, className = 'avatar') {
  const avatar = document.createElement('div');
  avatar.className = className;
  const image = document.createElement('img');
  image.alt = '';
  const fallback = document.createElement('span');
  fallback.textContent = initials(user.name);
  if (user.avatar) { image.src = user.avatar; avatar.classList.add('has-image'); }
  avatar.append(image, fallback);
  return avatar;
}

function toast(message, kind = '') {
  const item = document.createElement('div');
  item.className = `toast ${kind}`;
  item.textContent = message;
  el.toastStack.append(item);
  setTimeout(() => item.remove(), 4200);
}

async function api(path, body = {}) {
  const response = await fetch(path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: state.clientId, room: state.textRoom, ...body }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Não foi possível concluir essa ação.');
  return result;
}

function saveSettings() {
  localStorage.setItem('concord-settings', JSON.stringify(state.settings));
  applyAppearance();
}

function applyAppearance() {
  document.documentElement.style.setProperty('--accent', state.settings.accent);
  const rgb = state.settings.accent.match(/[a-f\d]{2}/gi)?.map((hex) => parseInt(hex, 16)) || [139, 92, 246];
  document.documentElement.style.setProperty('--accent-rgb', rgb.join(','));
  document.body.classList.toggle('compact', state.settings.compact);
}

function setAvatarDisplay(container, image, fallback, avatar, name) {
  fallback.textContent = initials(name);
  container.classList.toggle('has-image', Boolean(avatar));
  if (avatar) image.src = avatar; else image.removeAttribute('src');
}

function updateSelfUI() {
  el.selfName.textContent = state.name;
  el.settingsNameDisplay.textContent = state.name;
  el.displayName.value = state.name;
  setAvatarDisplay(el.profileButton, el.profileAvatar, el.profileFallback, state.avatar, state.name);
  setAvatarDisplay(el.settingsAvatar.parentElement, el.settingsAvatar, el.settingsAvatarFallback, state.pendingAvatar ?? state.avatar, state.name);
  el.selfStatus.textContent = state.voiceRoom ? `Em ${CHANNELS[state.voiceRoom]}` : 'Disponível';
}

function mediaState() {
  return {
    micEnabled: state.micEnabled && Boolean(state.audioStream?.getAudioTracks()[0]),
    cameraEnabled: Boolean(state.cameraStream?.getVideoTracks()[0]),
    screenSharing: Boolean(state.screenStream?.getVideoTracks()[0]),
    annotationsEnabled: Boolean(state.annotationsEnabled && state.screenStream),
    deafened: state.deafened,
  };
}

async function postMediaState() {
  if (!state.voiceRoom) return;
  try { await api('/api/media-state', { media: mediaState() }); }
  catch (error) { console.warn(error); }
}

function connectEvents() {
  state.eventSource?.close();
  const query = new URLSearchParams({ room: state.textRoom, clientId: state.clientId, name: state.name });
  const source = new EventSource(`/api/events?${query}`);
  state.eventSource = source;
  document.querySelector('.status-dot').style.background = '#ffd166';

  source.onopen = () => {
    document.querySelector('.status-dot').style.background = 'var(--green)';
    api('/api/profile', { name: state.name, avatar: state.avatar }).catch(() => {});
  };
  source.onerror = () => {
    document.querySelector('.status-dot').style.background = 'var(--red)';
    el.callStatus.textContent = state.voiceRoom ? 'Reconectando ao Concord…' : '';
  };
  source.onmessage = async (event) => {
    let payload;
    try { payload = JSON.parse(event.data); } catch { return; }
    if (payload.type === 'hello') {
      renderMessages(payload.messages || []);
      state.textUsers = payload.users || [];
      state.voiceChannels = payload.voiceChannels || state.voiceChannels;
      renderPresence();
      if (state.voiceRoom && payload.self?.voiceRoom !== state.voiceRoom) {
        api('/api/call', { action: 'join', voiceRoom: state.voiceRoom, media: mediaState() })
          .then((result) => syncCallUsers(result.users || []))
          .catch((error) => toast(error.message, 'error'));
      }
    } else if (payload.type === 'presence') {
      state.textUsers = payload.users || [];
      renderMembers();
    } else if (payload.type === 'voice-state') {
      state.voiceChannels = payload.channels || state.voiceChannels;
      renderVoiceChannels();
      if (state.voiceRoom) syncCallUsers(state.voiceChannels[state.voiceRoom] || []);
    } else if (payload.type === 'call-state') {
      if (payload.room === state.voiceRoom) syncCallUsers(payload.users || []);
    } else if (payload.type === 'message') {
      appendMessage(payload.message);
    } else if (payload.type === 'signal') {
      await handleSignal(payload.from, payload.data);
    } else if (payload.type === 'peer-left') {
      removePeer(payload.id);
    } else if (payload.type === 'annotation') {
      handleAnnotation(payload);
    } else if (payload.type === 'annotation-sync') {
      state.annotations.set(payload.shareOwnerId, Array.isArray(payload.items) ? payload.items : []);
      document.querySelectorAll(`canvas[data-share-owner="${CSS.escape(payload.shareOwnerId)}"]`).forEach((canvas) => redrawCanvas(canvas, payload.shareOwnerId));
    } else if (payload.type === 'server-restarting') {
      toast('O Concord está atualizando. A chamada volta sozinha em instantes.');
    }
  };
}

function switchTextRoom(roomId) {
  if (roomId === state.textRoom) return;
  state.textRoom = roomId;
  document.querySelectorAll('[data-text-room]').forEach((node) => node.classList.toggle('active', node.dataset.textRoom === roomId));
  el.roomTitle.textContent = CHANNELS[roomId];
  el.messageInput.placeholder = `Conversar em #${CHANNELS[roomId]}`;
  el.messages.innerHTML = '<div class="empty-state"><div>Carregando o canal…</div></div>';
  connectEvents();
}

function renderMessages(messages) {
  el.messages.replaceChildren();
  if (!messages.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const box = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = `# ${CHANNELS[state.textRoom]}`;
    box.append(strong, document.createTextNode('Este é o começo do canal.'));
    empty.append(box); el.messages.append(empty); return;
  }
  messages.forEach(appendMessage);
  el.messages.scrollTop = el.messages.scrollHeight;
}

function appendMessage(message) {
  el.messages.querySelector('.empty-state')?.remove();
  const row = document.createElement('article');
  row.className = 'message';
  row.append(avatarNode(message));
  const head = document.createElement('div'); head.className = 'message-head';
  const author = document.createElement('strong'); author.textContent = message.name || 'Visitante';
  const time = document.createElement('time');
  time.textContent = new Date(message.createdAt || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  head.append(author, time);
  const body = document.createElement('div'); body.className = 'message-body'; body.textContent = message.text;
  row.append(head, body);
  if (Array.isArray(message.attachments) && message.attachments.length) {
    const attachments = document.createElement('div'); attachments.className = 'message-attachments';
    message.attachments.forEach((attachment) => attachments.append(renderAttachment(attachment)));
    row.append(attachments);
  }
  el.messages.append(row);
  el.messages.scrollTop = el.messages.scrollHeight;
}

function formatBytes(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function renderAttachment(attachment) {
  const mime = String(attachment.mime || '');
  if (/^image\/(png|jpe?g|gif|webp)$/.test(mime)) {
    const link = document.createElement('a'); link.href = attachment.url; link.target = '_blank'; link.rel = 'noopener';
    const image = document.createElement('img'); image.className = 'attachment-image'; image.src = attachment.url; image.alt = attachment.name || 'Imagem enviada'; image.loading = 'lazy';
    image.addEventListener('error', () => { link.replaceWith(expiredAttachment()); }); link.append(image); return link;
  }
  if (/^audio\/(mpeg|ogg|wav|webm|mp4|x-m4a)$/.test(mime)) {
    const audio = document.createElement('audio'); audio.className = 'attachment-audio'; audio.controls = true; audio.preload = 'metadata'; audio.src = attachment.url;
    audio.addEventListener('error', () => audio.replaceWith(expiredAttachment())); return audio;
  }
  const link = document.createElement('a'); link.className = 'file-card'; link.href = `${attachment.url}?download=1`; link.download = attachment.name || 'arquivo';
  link.innerHTML = iconSvg('file');
  const copy = document.createElement('span'); copy.className = 'file-copy';
  const name = document.createElement('strong'); name.textContent = attachment.name || 'Arquivo';
  const size = document.createElement('small'); size.textContent = formatBytes(Number(attachment.size) || 0); copy.append(name, size); link.append(copy); return link;
}

function expiredAttachment() {
  const message = document.createElement('span'); message.className = 'attachment-expired'; message.textContent = 'Arquivo expirado ou indisponível'; return message;
}

function addPendingFiles(fileList) {
  const available = 5 - state.pendingFiles.length;
  const selected = [...(fileList || [])].slice(0, Math.max(0, available));
  for (const file of selected) {
    if (file.size > 8 * 1024 * 1024) { toast(`${file.name}: limite de 8 MB.`, 'error'); continue; }
    if (!file.size) continue;
    state.pendingFiles.push({ id: crypto.randomUUID(), file, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '' });
  }
  if ([...(fileList || [])].length > available) toast('Você pode enviar até 5 arquivos por mensagem.', 'error');
  renderPendingFiles();
}

function renderPendingFiles() {
  el.attachmentTray.classList.toggle('hidden', !state.pendingFiles.length); el.attachmentTray.replaceChildren();
  state.pendingFiles.forEach((pending) => {
    const card = document.createElement('div'); card.className = 'pending-attachment';
    if (pending.preview) { const image = document.createElement('img'); image.src = pending.preview; image.alt = ''; card.append(image); }
    else { const icon = document.createElement('span'); icon.className = 'pending-file-icon'; icon.innerHTML = iconSvg(pending.file.type.startsWith('audio/') ? 'waveform' : 'file'); card.append(icon); }
    const copy = document.createElement('div'); copy.className = 'pending-copy';
    const name = document.createElement('strong'); name.textContent = pending.file.name;
    const size = document.createElement('small'); size.textContent = pending.uploading ? 'Enviando…' : formatBytes(pending.file.size); copy.append(name, size);
    const remove = document.createElement('button'); remove.className = 'pending-remove'; remove.innerHTML = iconSvg('close'); remove.title = 'Remover';
    remove.disabled = Boolean(pending.uploading); remove.addEventListener('click', () => removePendingFile(pending.id));
    card.append(copy, remove); el.attachmentTray.append(card);
  });
}

function removePendingFile(id) {
  const index = state.pendingFiles.findIndex((item) => item.id === id); if (index < 0) return;
  const [removed] = state.pendingFiles.splice(index, 1); if (removed.preview) URL.revokeObjectURL(removed.preview); renderPendingFiles();
}

async function uploadPendingFile(pending) {
  if (pending.attachment) return pending.attachment;
  pending.uploading = true; renderPendingFiles();
  const query = new URLSearchParams({ clientId: state.clientId });
  const response = await fetch(`/api/upload?${query}`, {
    method: 'POST', headers: { 'Content-Type': pending.file.type || 'application/octet-stream', 'X-File-Name': encodeURIComponent(pending.file.name) }, body: pending.file,
  });
  const result = await response.json().catch(() => ({})); pending.uploading = false;
  if (!response.ok) throw new Error(result.error || `Falha ao enviar ${pending.file.name}.`);
  pending.attachment = result.attachment; return pending.attachment;
}

async function sendCurrentMessage() {
  const text = el.messageInput.value.trim(); if (!text && !state.pendingFiles.length) return;
  const pending = [...state.pendingFiles];
  el.messageInput.disabled = true;
  try {
    const attachments = [];
    for (const item of pending) attachments.push(await uploadPendingFile(item));
    await api('/api/message', { text, attachments: attachments.map((item) => item.id) });
    el.messageInput.value = ''; el.messageInput.style.height = 'auto';
    pending.forEach((item) => removePendingFile(item.id));
  } catch (error) { toast(error.message, 'error'); renderPendingFiles(); }
  finally { el.messageInput.disabled = false; el.messageInput.focus(); }
}

async function toggleAudioRecording() {
  if (state.recorder?.state === 'recording') { state.recorder.stop(); return; }
  if (!window.MediaRecorder) { toast('Seu navegador não suporta gravação de áudio.', 'error'); return; }
  try {
    const liveTrack = state.audioStream?.getAudioTracks()[0];
    state.recordingStream = liveTrack ? new MediaStream([liveTrack.clone()]) : await navigator.mediaDevices.getUserMedia({ audio: audioConstraints(), video: false });
    state.recordingStream.getAudioTracks().forEach((track) => { track.enabled = true; });
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
    const chunks = []; state.recorder = new MediaRecorder(state.recordingStream, { mimeType, audioBitsPerSecond: 64000 });
    state.recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    state.recorder.onstop = () => {
      clearInterval(state.recordingTimer); state.recordingTimer = null;
      state.recordingStream?.getTracks().forEach((track) => track.stop()); state.recordingStream = null;
      const duration = Math.max(1, Math.round((Date.now() - state.recordingStartedAt) / 1000));
      const blob = new Blob(chunks, { type: mimeType });
      if (blob.size) addPendingFiles([new File([blob], `mensagem-de-voz-${duration}s.webm`, { type: 'audio/webm' })]);
      el.recordAudio.classList.remove('recording'); el.recordAudio.innerHTML = `${iconSvg('waveform')}<span id="recording-time" class="hidden">0:00</span>`; el.recordingTime = document.getElementById('recording-time');
      playCue('sent'); state.recorder = null;
    };
    state.recordingStartedAt = Date.now(); state.recorder.start(500); playCue('record');
    el.recordAudio.classList.add('recording'); el.recordingTime.classList.remove('hidden');
    state.recordingTimer = setInterval(() => {
      const seconds = Math.floor((Date.now() - state.recordingStartedAt) / 1000);
      el.recordingTime.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
      if (seconds >= 120) state.recorder?.stop();
    }, 250);
  } catch {
    clearInterval(state.recordingTimer); state.recordingTimer = null;
    state.recordingStream?.getTracks().forEach((track) => track.stop()); state.recordingStream = null; state.recorder = null;
    el.recordAudio.classList.remove('recording'); el.recordingTime.classList.add('hidden');
    toast('Permita o microfone para gravar uma mensagem de voz.', 'error');
  }
}

function allVoiceUsers() {
  return Object.values(state.voiceChannels).flat();
}

function getUser(userId) {
  if (userId === state.clientId) return { id: state.clientId, name: state.name, avatar: state.avatar, media: mediaState() };
  return state.callUsers.find((user) => user.id === userId) || allVoiceUsers().find((user) => user.id === userId) || state.textUsers.find((user) => user.id === userId) || { id: userId, name: 'Participante', avatar: '', media: {} };
}

function renderPresence() { renderMembers(); renderVoiceChannels(); }

function renderMembers() {
  el.memberCount.textContent = state.textUsers.length;
  el.memberList.replaceChildren();
  state.textUsers.forEach((user) => {
    const item = document.createElement('div'); item.className = 'member'; item.dataset.userId = user.id;
    const avatar = avatarNode(user); const online = document.createElement('i'); online.className = 'online-dot'; avatar.append(online);
    const copy = document.createElement('div'); copy.className = 'member-copy';
    const name = document.createElement('strong'); name.textContent = `${user.name}${user.id === state.clientId ? ' (você)' : ''}`;
    const status = document.createElement('small'); status.textContent = user.voiceRoom ? `Em ${CHANNELS[user.voiceRoom]}` : 'Disponível';
    copy.append(name, status); item.append(avatar, copy); el.memberList.append(item);
  });
}

function renderVoiceChannels() {
  for (const roomId of ['lobby', 'jogos', 'musica']) {
    const container = document.querySelector(`[data-voice-users="${roomId}"]`);
    container.replaceChildren();
    (state.voiceChannels[roomId] || []).forEach((user) => {
      const item = document.createElement('div'); item.className = 'voice-user'; item.dataset.userId = user.id;
      if (state.speaking.has(user.id)) item.classList.add('speaking');
      item.append(avatarNode(user, 'mini-avatar'));
      const name = document.createElement('span'); name.textContent = user.id === state.clientId ? `${user.name} (você)` : user.name; item.append(name);
      const icons = document.createElement('span'); icons.className = 'voice-user-icons';
      if (!user.media?.micEnabled) icons.innerHTML += iconSvg('mic-off');
      if (user.media?.deafened) icons.innerHTML += iconSvg('headphones');
      if (user.media?.screenSharing) icons.innerHTML += iconSvg('screen');
      item.append(icons); container.append(item);
    });
    document.querySelector(`[data-voice-room="${roomId}"]`).classList.toggle('in-call', state.voiceRoom === roomId);
  }
}

async function loadIceServers() {
  try {
    const response = await fetch('/api/ice', { cache: 'no-store' });
    const data = await response.json();
    state.iceServers = Array.isArray(data.iceServers) ? data.iceServers : [];
  } catch {
    state.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
  }
}

function getAudioContext() {
  if (!state.audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) state.audioContext = new AudioContextClass();
  }
  if (state.audioContext?.state === 'suspended') state.audioContext.resume().catch(() => {});
  return state.audioContext;
}

function playCue(type) {
  if (!state.settings.callSounds || state.settings.soundVolume <= 0) return;
  const context = getAudioContext(); if (!context) return;
  const patterns = {
    join: [[0, 520, .08], [.09, 700, .12]],
    leave: [[0, 620, .09], [.1, 420, .13]],
    screen: [[0, 740, .07], [.07, 880, .07], [.14, 1040, .11]],
    mute: [[0, 310, .08], [.08, 220, .1]],
    unmute: [[0, 270, .07], [.07, 410, .11]],
    deafen: [[0, 220, .08], [.09, 165, .14]],
    undeafen: [[0, 220, .07], [.08, 330, .07], [.16, 440, .11]],
    record: [[0, 660, .09]],
    sent: [[0, 540, .05], [.055, 780, .08]],
  };
  const notes = patterns[type] || patterns.sent;
  const volume = Math.min(.16, (state.settings.soundVolume / 100) * .16);
  notes.forEach(([delay, frequency, duration]) => {
    const oscillator = context.createOscillator(); const gain = context.createGain();
    const start = context.currentTime + delay; const end = start + duration;
    oscillator.type = type === 'screen' ? 'triangle' : 'sine'; oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(volume, start + .015); gain.gain.exponentialRampToValueAtTime(.0001, end);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(start); oscillator.stop(end + .02);
  });
}

function audioConstraints() {
  const constraints = {
    echoCancellation: state.settings.echoCancellation,
    noiseSuppression: state.settings.noiseSuppression,
    autoGainControl: state.settings.autoGainControl,
    channelCount: { ideal: 1 }, sampleRate: { ideal: 48000 }, sampleSize: { ideal: 16 },
  };
  if (state.settings.microphoneId !== 'default') constraints.deviceId = { exact: state.settings.microphoneId };
  return constraints;
}

async function ensureMicrophone(force = false) {
  const currentTrack = state.audioStream?.getAudioTracks()[0];
  if (currentTrack?.readyState === 'live' && !force) {
    try { await currentTrack.applyConstraints(audioConstraints()); } catch { /* navegador sem suporte parcial */ }
    currentTrack.enabled = state.micEnabled;
    updateProcessingStatus(currentTrack);
    return state.audioStream;
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints(), video: false });
  } catch (firstError) {
    if (firstError.name === 'NotAllowedError') throw firstError;
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  }
  const previous = state.audioStream;
  state.audioStream = stream;
  const track = stream.getAudioTracks()[0];
  track.enabled = state.micEnabled;
  await replaceLocalTrack('audio', track, stream);
  previous?.getTracks().forEach((oldTrack) => oldTrack.stop());
  startLocalMeter();
  updateProcessingStatus(track);
  await refreshDevices();
  return stream;
}

async function replaceLocalTrack(kind, track, stream) {
  for (const peer of state.peers.values()) {
    const sender = [...peer.pc.getSenders()].find((item) => item._concordKind === kind);
    if (sender) await sender.replaceTrack(track).catch(() => {});
    else if (track) {
      const added = peer.pc.addTrack(track, stream);
      added._concordKind = kind;
    }
  }
  announceMediaDescription();
}

function addLocalTracks(peer) {
  const tracks = [
    ['audio', state.audioStream], ['camera', state.cameraStream], ['screen', state.screenStream],
  ];
  for (const [kind, stream] of tracks) {
    const track = kind === 'audio' ? stream?.getAudioTracks()[0] : stream?.getVideoTracks()[0];
    if (!track) continue;
    const sender = peer.pc.addTrack(track, stream);
    sender._concordKind = kind;
  }
}

async function joinCall(roomId) {
  if (state.voiceRoom === roomId) return;
  getAudioContext();
  try {
    await ensureMicrophone();
  } catch (error) {
    state.micEnabled = false;
    toast(error.name === 'NotAllowedError' ? 'Permita o microfone no navegador para falar.' : 'Não consegui abrir seu microfone.', 'error');
  }
  if (state.voiceRoom) closeAllPeers();
  try {
    const result = await api('/api/call', { action: 'join', voiceRoom: roomId, media: mediaState() });
    state.voiceRoom = roomId;
    state.callUsers = result.users || [];
    state.annotations.clear(); state.pinnedUserId = null; state.autoFocusedShareId = null;
    (result.annotations || []).forEach((snapshot) => state.annotations.set(snapshot.shareOwnerId, snapshot.items || []));
    state.knownCallUsers.clear(); state.callRosterReady = false;
    renderCall(); renderVoiceChannels(); updateControlStates();
    syncCallUsers(state.callUsers);
    playCue('join');
    toast(`Você entrou em ${CHANNELS[roomId]}.`);
  } catch (error) { toast(error.message, 'error'); }
}

async function leaveCall() {
  if (!state.voiceRoom) return;
  const oldRoom = state.voiceRoom;
  playCue('leave');
  try { await api('/api/call', { action: 'leave' }); } catch { /* limpar localmente mesmo assim */ }
  state.voiceRoom = null; state.callUsers = []; state.pinnedUserId = null; state.autoFocusedShareId = null;
  state.knownCallUsers.clear(); state.callRosterReady = false; state.annotationPanelOpen = false;
  closeAllPeers(); stopCamera(); stopScreen(false); stopLoopback();
  state.audioStream?.getTracks().forEach((track) => track.stop()); state.audioStream = null;
  state.audioMonitors.delete(state.clientId); state.speaking.clear();
  renderCall(); renderVoiceChannels(); updateControlStates();
  toast(`Você saiu de ${CHANNELS[oldRoom]}.`);
}

function syncCallUsers(users) {
  if (!state.voiceRoom) return;
  const nextUsers = new Map(users.map((user) => [user.id, user]));
  if (state.callRosterReady) {
    for (const [id, user] of nextUsers) {
      if (id !== state.clientId && !state.knownCallUsers.has(id)) playCue('join');
      const previous = state.knownCallUsers.get(id);
      if (id !== state.clientId && user.media?.screenSharing && !previous?.media?.screenSharing) playCue('screen');
    }
    for (const id of state.knownCallUsers.keys()) if (id !== state.clientId && !nextUsers.has(id)) playCue('leave');
  }
  state.knownCallUsers = nextUsers; state.callRosterReady = true;
  state.callUsers = users;
  const validIds = new Set(users.map((user) => user.id));
  for (const user of users) if (user.id !== state.clientId) createPeer(user.id);
  for (const id of state.peers.keys()) if (!validIds.has(id)) removePeer(id);
  renderCall(); renderMembers(); renderVoiceChannels();
}

function createPeer(userId) {
  if (!state.voiceRoom || userId === state.clientId || state.peers.has(userId)) return state.peers.get(userId);
  const pc = new RTCPeerConnection({
    iceServers: state.iceServers,
    iceCandidatePoolSize: 10,
    iceTransportPolicy: state.settings.protectIp ? 'relay' : 'all',
  });
  const peer = {
    id: userId, pc, polite: state.clientId.localeCompare(userId) > 0,
    makingOffer: false, ignoreOffer: false, settingRemoteAnswer: false,
    pendingCandidates: [], remoteStreams: new Map(), description: {},
    audioNodes: [], reconnectAttempts: 0, disconnectTimer: null,
  };
  state.peers.set(userId, peer);
  addLocalTracks(peer);

  pc.onicecandidate = ({ candidate }) => {
    if (candidate) sendSignal(userId, { candidate }).catch(() => {});
  };
  pc.onnegotiationneeded = async () => {
    try {
      peer.makingOffer = true;
      await pc.setLocalDescription();
      await sendSignal(userId, { description: pc.localDescription });
      await sendMediaDescription(userId);
    } catch (error) { console.warn('negociação', error); }
    finally { peer.makingOffer = false; }
  };
  pc.ontrack = (event) => handleRemoteTrack(peer, event);
  pc.onconnectionstatechange = () => {
    const status = pc.connectionState;
    if (status === 'connected') {
      peer.reconnectAttempts = 0; clearTimeout(peer.disconnectTimer);
      el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · ${state.settings.protectIp ? 'IP protegido' : 'conexão direta'}`;
    } else if (status === 'failed') {
      recoverPeer(peer);
    } else if (status === 'disconnected') {
      clearTimeout(peer.disconnectTimer);
      peer.disconnectTimer = setTimeout(() => {
        if (pc.connectionState === 'disconnected') recoverPeer(peer);
      }, 6000);
    }
  };
  announceMediaDescription(userId);
  return peer;
}

async function recoverPeer(peer) {
  if (!state.peers.has(peer.id) || !state.voiceRoom) return;
  peer.reconnectAttempts += 1;
  if (peer.reconnectAttempts <= 2) {
    try {
      peer.pc.restartIce();
      peer.makingOffer = true;
      await peer.pc.setLocalDescription(await peer.pc.createOffer({ iceRestart: true }));
      await sendSignal(peer.id, { description: peer.pc.localDescription });
    } catch (error) { console.warn('reinício ICE', error); }
    finally { peer.makingOffer = false; }
    return;
  }
  removePeer(peer.id);
  setTimeout(() => { if (state.callUsers.some((user) => user.id === peer.id)) createPeer(peer.id); }, 700);
}

async function sendSignal(target, data) {
  await api('/api/signal', { target, data });
}

async function handleSignal(from, data) {
  if (!state.voiceRoom || !data) return;
  const peer = createPeer(from);
  if (!peer) return;
  const pc = peer.pc;
  try {
    if (data.mediaDescription) {
      peer.description = data.mediaDescription;
      renderVideoGrid();
      return;
    }
    if (data.description) {
      const readyForOffer = !peer.makingOffer && (pc.signalingState === 'stable' || peer.settingRemoteAnswer);
      const offerCollision = data.description.type === 'offer' && !readyForOffer;
      peer.ignoreOffer = !peer.polite && offerCollision;
      if (peer.ignoreOffer) return;
      peer.settingRemoteAnswer = data.description.type === 'answer';
      await pc.setRemoteDescription(data.description);
      peer.settingRemoteAnswer = false;
      while (peer.pendingCandidates.length) await pc.addIceCandidate(peer.pendingCandidates.shift());
      if (data.description.type === 'offer') {
        await pc.setLocalDescription();
        await sendSignal(from, { description: pc.localDescription });
        await sendMediaDescription(from);
      }
      return;
    }
    if (data.candidate) {
      if (pc.remoteDescription) await pc.addIceCandidate(data.candidate);
      else peer.pendingCandidates.push(data.candidate);
    }
  } catch (error) {
    if (!peer.ignoreOffer) console.warn('sinal WebRTC', error);
  }
}

function localMediaDescription() {
  return {
    cameraStreamId: state.cameraStream?.id || '',
    screenStreamId: state.screenStream?.id || '',
  };
}

async function sendMediaDescription(target) {
  if (!state.peers.has(target)) return;
  await sendSignal(target, { mediaDescription: localMediaDescription() }).catch(() => {});
}

function announceMediaDescription(target = null) {
  if (target) { sendMediaDescription(target); return; }
  for (const id of state.peers.keys()) sendMediaDescription(id);
}

function handleRemoteTrack(peer, event) {
  const stream = event.streams[0] || new MediaStream([event.track]);
  peer.remoteStreams.set(stream.id, stream);
  if (event.track.kind === 'audio') setupRemoteAudio(peer, stream, event.track);
  event.track.onunmute = () => { if (event.track.kind === 'audio') setupRemoteAudio(peer, stream, event.track); renderVideoGrid(); };
  event.track.onended = () => { peer.remoteStreams.delete(stream.id); renderVideoGrid(); };
  renderVideoGrid();
}

function setupRemoteAudio(peer, stream, track) {
  if (peer.audioNodes.some((node) => node.trackId === track.id)) return;
  const audioStream = new MediaStream([track]);
  const audio = document.createElement('audio');
  audio.autoplay = true; audio.playsInline = true; audio.srcObject = audioStream;
  const entry = { trackId: track.id, audio, source: null, gain: null, analyser: null };
  const context = getAudioContext();
  if (context) {
    try {
      entry.source = context.createMediaStreamSource(audioStream);
      entry.gain = context.createGain();
      entry.analyser = context.createAnalyser(); entry.analyser.fftSize = 512;
      entry.source.connect(entry.gain); entry.source.connect(entry.analyser); entry.gain.connect(context.destination);
      audio.muted = true;
      state.audioMonitors.set(peer.id, entry.analyser);
      startVoiceMeterLoop();
    } catch { /* usa elemento de áudio abaixo */ }
  }
  peer.audioNodes.push(entry);
  applyRemoteAudio(peer.id);
  audio.play().catch(() => {
    if (!entry.gain) toast('Clique em qualquer lugar para liberar o áudio da chamada.', 'error');
  });
}

function userPreference(userId) {
  try {
    const all = JSON.parse(localStorage.getItem('concord-user-audio') || '{}');
    return { muted: false, volume: 100, hideVideo: false, ...(all[userId] || {}) };
  } catch { return { muted: false, volume: 100, hideVideo: false }; }
}

function setUserPreference(userId, update) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem('concord-user-audio') || '{}'); } catch { /* vazio */ }
  all[userId] = { muted: false, volume: 100, hideVideo: false, ...(all[userId] || {}), ...update };
  localStorage.setItem('concord-user-audio', JSON.stringify(all));
  applyRemoteAudio(userId); renderVideoGrid();
}

function applyRemoteAudio(userId = null) {
  const peers = userId ? [state.peers.get(userId)].filter(Boolean) : [...state.peers.values()];
  for (const peer of peers) {
    const preference = userPreference(peer.id);
    const silent = state.deafened || preference.muted;
    const gainValue = silent ? 0 : (state.settings.masterVolume / 100) * (preference.volume / 100);
    for (const node of peer.audioNodes) {
      if (node.gain) node.gain.gain.setTargetAtTime(gainValue, state.audioContext.currentTime, 0.015);
      else { node.audio.muted = silent; node.audio.volume = Math.min(1, gainValue); node.audio.play().catch(() => {}); }
    }
  }
}

function removePeer(userId) {
  const peer = state.peers.get(userId); if (!peer) return;
  clearTimeout(peer.disconnectTimer);
  peer.audioNodes.forEach((node) => {
    try { node.source?.disconnect(); node.gain?.disconnect(); } catch { /* já removido */ }
    node.audio.srcObject = null;
  });
  state.audioMonitors.delete(userId); state.speaking.delete(userId);
  peer.pc.ontrack = null; peer.pc.onicecandidate = null; peer.pc.close();
  state.peers.delete(userId); renderVideoGrid();
}

function closeAllPeers() {
  for (const id of [...state.peers.keys()]) removePeer(id);
}

function rebuildPeerConnections() {
  if (!state.voiceRoom) return;
  const peers = state.callUsers.filter((user) => user.id !== state.clientId).map((user) => user.id);
  closeAllPeers(); peers.forEach(createPeer);
  el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · reconectando com IP ${state.settings.protectIp ? 'protegido' : 'direto'}`;
}

async function toggleMicrophone() {
  if (!state.audioStream) {
    try { await ensureMicrophone(); state.micEnabled = true; }
    catch { toast('Não consegui acessar o microfone. Confira a permissão.', 'error'); return; }
  } else state.micEnabled = !state.micEnabled;
  state.audioStream.getAudioTracks().forEach((track) => { track.enabled = state.micEnabled; });
  playCue(state.micEnabled ? 'unmute' : 'mute');
  updateControlStates(); postMediaState();
}

function toggleDeafen() {
  state.deafened = !state.deafened;
  playCue(state.deafened ? 'deafen' : 'undeafen');
  applyRemoteAudio(); updateControlStates(); postMediaState();
}

async function toggleCamera() {
  if (state.cameraStream) { stopCamera(); return; }
  if (!state.voiceRoom) { toast('Entre em um canal de voz primeiro.'); return; }
  const height = Number(state.settings.cameraQuality) || 720;
  const video = { width: { ideal: Math.round(height * 16 / 9) }, height: { ideal: height }, frameRate: { ideal: 30, max: 30 } };
  if (state.settings.cameraId !== 'default') video.deviceId = { exact: state.settings.cameraId };
  try {
    state.cameraStream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
    const track = state.cameraStream.getVideoTracks()[0];
    track.onended = () => stopCamera();
    await replaceLocalTrack('camera', track, state.cameraStream);
    updateControlStates(); renderVideoGrid(); postMediaState(); refreshDevices();
  } catch (error) {
    toast(error.name === 'NotAllowedError' ? 'Permita a câmera no navegador.' : 'Não consegui abrir a câmera.', 'error');
  }
}

function stopCamera() {
  if (!state.cameraStream) return;
  for (const peer of state.peers.values()) {
    const sender = [...peer.pc.getSenders()].find((item) => item._concordKind === 'camera');
    if (sender) sender.replaceTrack(null).catch(() => {});
  }
  state.cameraStream.getTracks().forEach((track) => track.stop()); state.cameraStream = null;
  announceMediaDescription(); updateControlStates(); renderVideoGrid(); postMediaState();
}

async function toggleScreen() {
  if (state.screenStream) { stopScreen(); return; }
  if (!state.voiceRoom) { toast('Entre em um canal de voz primeiro.'); return; }
  if (!navigator.mediaDevices?.getDisplayMedia) { toast('Compartilhamento de tela não é suportado aqui.', 'error'); return; }
  const height = Number(state.settings.screenQuality) || 1080;
  try {
    if (window.concordDesktop?.isDesktop) {
      const selected = await chooseDesktopSource();
      if (!selected) return;
    }
    state.screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { height: { ideal: height }, frameRate: { ideal: 30, max: 30 } }, audio: false,
    });
    state.annotationsEnabled = state.settings.annotations;
    const track = state.screenStream.getVideoTracks()[0];
    track.onended = () => stopScreen();
    await replaceLocalTrack('screen', track, state.screenStream);
    if (state.settings.autoFocus) { state.layout = 'focus'; state.autoFocusedShareId = state.clientId; }
    playCue('screen'); updateControlStates(); renderVideoGrid(); postMediaState();
    toast('Sua tela está sendo compartilhada.');
  } catch (error) {
    if (error.name !== 'NotAllowedError') toast('Não consegui iniciar o compartilhamento.', 'error');
  }
}

async function chooseDesktopSource() {
  let sources;
  try { sources = await window.concordDesktop.getDisplaySources(); }
  catch { toast('Não consegui listar suas telas e janelas.', 'error'); return false; }
  if (!sources?.length) { toast('Nenhuma tela ou janela disponível.', 'error'); return false; }
  return new Promise((resolve) => {
    const overlay = document.createElement('div'); overlay.className = 'source-overlay';
    const dialog = document.createElement('section'); dialog.className = 'source-dialog';
    const header = document.createElement('header');
    const titleBox = document.createElement('div'); const title = document.createElement('h2'); title.textContent = 'O que você quer compartilhar?';
    const subtitle = document.createElement('p'); subtitle.textContent = 'Escolha uma tela ou janela. O preview aparecerá na chamada.'; titleBox.append(title, subtitle);
    const close = document.createElement('button'); close.className = 'icon-button'; close.innerHTML = iconSvg('close'); header.append(titleBox, close);
    const grid = document.createElement('div'); grid.className = 'source-grid';
    const finish = (value) => { overlay.remove(); resolve(value); };
    close.addEventListener('click', () => finish(false)); overlay.addEventListener('click', (event) => { if (event.target === overlay) finish(false); });
    sources.forEach((source) => {
      const button = document.createElement('button'); button.className = 'source-card';
      const image = document.createElement('img'); image.src = source.thumbnail; image.alt = '';
      const label = document.createElement('span'); label.textContent = source.name; button.append(image, label);
      button.addEventListener('click', async () => {
        const accepted = await window.concordDesktop.selectDisplaySource(source.id).catch(() => false); finish(Boolean(accepted));
      });
      grid.append(button);
    });
    dialog.append(header, grid); overlay.append(dialog); document.body.append(overlay);
  });
}

function stopScreen(notify = true) {
  if (!state.screenStream) return;
  for (const peer of state.peers.values()) {
    const sender = [...peer.pc.getSenders()].find((item) => item._concordKind === 'screen');
    if (sender) sender.replaceTrack(null).catch(() => {});
  }
  state.screenStream.getTracks().forEach((track) => { track.onended = null; track.stop(); }); state.screenStream = null;
  state.annotations.delete(state.clientId); state.autoFocusedShareId = null;
  if (state.activeShareOwnerId === state.clientId) { state.activeShareOwnerId = null; state.annotationPanelOpen = false; }
  if (!state.pinnedUserId) state.layout = 'grid';
  announceMediaDescription(); updateControlStates(); renderVideoGrid(); postMediaState();
  if (notify) toast('Compartilhamento encerrado.');
}

function remoteVideoStreams(peer, user) {
  const streams = [...peer.remoteStreams.values()].filter((stream) => stream.getVideoTracks().some((track) => track.readyState === 'live'));
  const camera = streams.find((stream) => stream.id === peer.description.cameraStreamId) ||
    (user.media?.cameraEnabled ? streams.find((stream) => stream.id !== peer.description.screenStreamId) : null);
  const screen = streams.find((stream) => stream.id === peer.description.screenStreamId) ||
    (user.media?.screenSharing ? streams.find((stream) => stream !== camera) || (!user.media?.cameraEnabled ? streams[0] : null) : null);
  return { camera, screen };
}

function makeVideoTile({ key, user, stream, screen = false, local = false, hiddenVideo = false }) {
  const tile = document.createElement('article');
  tile.className = `video-tile${screen ? ' screen' : ''}`;
  tile.dataset.key = key; tile.dataset.userId = user.id;
  if (state.speaking.has(user.id)) tile.classList.add('speaking');
  if (hiddenVideo) tile.classList.add('video-hidden');
  const video = document.createElement('video'); video.autoplay = true; video.playsInline = true; video.muted = local;
  if (stream) { video.srcObject = stream; tile.classList.add('has-video'); video.play().catch(() => {}); }
  const fallback = document.createElement('div'); fallback.className = 'tile-fallback'; fallback.append(avatarNode(user));
  const label = document.createElement('div'); label.className = 'tile-label';
  label.innerHTML = iconSvg(user.media?.micEnabled === false ? 'mic-off' : 'mic');
  const text = document.createElement('span'); text.textContent = `${user.name}${local ? ' (você)' : ''}`; label.append(text);
  tile.append(video, fallback, label);
  if (screen) {
    const badge = document.createElement('button'); badge.className = 'screen-badge'; badge.textContent = local ? 'SEU PREVIEW' : 'TELA'; badge.title = 'Abrir ferramentas nesta tela';
    badge.addEventListener('click', (event) => {
      event.stopPropagation(); state.activeShareOwnerId = user.id; state.annotationPanelOpen = true;
      updateAnnotationPanel(); renderVideoGrid(); updateControlStates();
    });
    tile.append(badge);
    const canvas = document.createElement('canvas'); canvas.className = 'annotation-canvas'; canvas.dataset.shareOwner = user.id;
    const canDraw = state.annotationPanelOpen && state.activeShareOwnerId === user.id && (local || user.media?.annotationsEnabled === true);
    canvas.classList.toggle('locked', !canDraw); tile.append(canvas); setupDrawingCanvas(canvas, user.id, canDraw);
  }
  tile.addEventListener('dblclick', () => focusUser(user.id));
  return tile;
}

function renderVideoGrid() {
  if (!state.voiceRoom) { el.videoGrid.replaceChildren(); return; }
  const tiles = [];
  const self = { id: state.clientId, name: state.name, avatar: state.avatar, media: mediaState() };
  if (state.settings.selfView) {
    tiles.push(makeVideoTile({ key: `camera-${state.clientId}`, user: self, stream: state.cameraStream, local: true }));
  }
  if (state.screenStream && state.settings.screenPreview) {
    tiles.push(makeVideoTile({ key: `screen-${state.clientId}`, user: self, stream: state.screenStream, screen: true, local: true }));
  }
  for (const user of state.callUsers) {
    if (user.id === state.clientId) continue;
    const peer = state.peers.get(user.id); if (!peer) continue;
    const streams = remoteVideoStreams(peer, user);
    const preference = userPreference(user.id);
    if (state.settings.participantVideo) {
      tiles.push(makeVideoTile({ key: `camera-${user.id}`, user, stream: streams.camera, hiddenVideo: preference.hideVideo }));
    }
    if (user.media?.screenSharing || streams.screen) {
      tiles.push(makeVideoTile({ key: `screen-${user.id}`, user, stream: streams.screen, screen: true }));
      if (state.settings.autoFocus && !state.pinnedUserId) { state.layout = 'focus'; state.autoFocusedShareId = user.id; }
    }
  }
  el.videoGrid.replaceChildren(...tiles);
  if (!tiles.length) {
    const empty = document.createElement('div'); empty.className = 'empty-state'; empty.textContent = 'Áudio conectado. Ative uma câmera ou compartilhe a tela.'; el.videoGrid.append(empty);
  }
  applyLayoutState(); updateAnnotationPanel();
}

function applyLayoutState() {
  const focusId = state.pinnedUserId || state.autoFocusedShareId;
  el.videoGrid.classList.toggle('focus-mode', state.layout === 'focus');
  const tiles = [...el.videoGrid.querySelectorAll('.video-tile')];
  tiles.forEach((tile) => tile.classList.remove('focused'));
  if (state.layout === 'focus') {
    let chosen = focusId ? tiles.find((tile) => tile.dataset.userId === focusId && tile.classList.contains('screen')) || tiles.find((tile) => tile.dataset.userId === focusId) : null;
    chosen ||= tiles.find((tile) => tile.classList.contains('screen')) || tiles[0];
    chosen?.classList.add('focused');
  }
  el.layoutButton.classList.toggle('active', state.layout === 'focus');
  el.layoutButton.querySelector('span:last-child').textContent = state.layout === 'focus' ? 'Foco' : 'Grade';
}

function focusUser(userId) {
  if (state.pinnedUserId === userId && state.layout === 'focus') {
    state.pinnedUserId = null; state.layout = 'grid';
  } else { state.pinnedUserId = userId; state.layout = 'focus'; }
  renderVideoGrid(); hideContextMenu();
}

function toggleLayout() {
  state.layout = state.layout === 'grid' ? 'focus' : 'grid';
  if (state.layout === 'grid') { state.pinnedUserId = null; state.autoFocusedShareId = null; }
  applyLayoutState();
}

function screenContentBox(canvas) {
  const rect = canvas.getBoundingClientRect(); const video = canvas.parentElement?.querySelector('video');
  const aspect = video?.videoWidth && video?.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9;
  let width = rect.width; let height = width / aspect;
  if (height > rect.height) { height = rect.height; width = height * aspect; }
  return { x: (rect.width - width) / 2, y: (rect.height - height) / 2, width, height, rect };
}

function canAnnotate(ownerId) {
  if (ownerId === state.clientId) return Boolean(state.screenStream);
  return state.callUsers.find((user) => user.id === ownerId)?.media?.annotationsEnabled === true;
}

function setupDrawingCanvas(canvas, shareOwnerId, enabled) {
  let activeItem = null;
  const pointFromEvent = (event) => {
    const box = screenContentBox(canvas);
    return {
      x: Math.max(0, Math.min(1, (event.clientX - box.rect.left - box.x) / box.width)),
      y: Math.max(0, Math.min(1, (event.clientY - box.rect.top - box.y) / box.height)),
    };
  };
  const finish = async () => {
    if (!activeItem) return;
    const item = activeItem; activeItem = null;
    if (item.points.length < 2) return;
    addAnnotationItem(shareOwnerId, item, true);
    try { await api('/api/annotation', { action: 'item', shareOwnerId, item }); }
    catch (error) { removeAnnotationItem(shareOwnerId, item.id); toast(error.message, 'error'); }
  };
  if (enabled) {
    canvas.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (state.drawTool === 'text') { createTextAnnotation(canvas, shareOwnerId, pointFromEvent(event)); return; }
      canvas.setPointerCapture(event.pointerId);
      activeItem = {
        id: crypto.randomUUID(), tool: state.drawTool, color: state.drawColor,
        width: state.drawTool === 'eraser' ? state.drawSize * 2 : state.drawSize,
        points: [pointFromEvent(event)],
      };
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!activeItem) return;
      activeItem.points.push(pointFromEvent(event)); redrawCanvas(canvas, shareOwnerId, activeItem);
    });
    canvas.addEventListener('pointerup', finish); canvas.addEventListener('pointercancel', finish);
  }
  requestAnimationFrame(() => redrawCanvas(canvas, shareOwnerId));
}

function createTextAnnotation(canvas, ownerId, point) {
  if (canvas.parentElement.querySelector('.annotation-text-input')) return;
  const box = screenContentBox(canvas); const input = document.createElement('input');
  input.className = 'annotation-text-input'; input.maxLength = 160; input.placeholder = 'Digite e pressione Enter';
  input.style.left = `${box.x + point.x * box.width}px`; input.style.top = `${box.y + point.y * box.height}px`;
  const finish = async (save) => {
    const text = input.value.trim(); input.remove(); if (!save || !text) return;
    const item = { id: crypto.randomUUID(), tool: 'text', text, x: point.x, y: point.y, color: state.drawColor, width: state.drawSize };
    addAnnotationItem(ownerId, item, true);
    try { await api('/api/annotation', { action: 'item', shareOwnerId: ownerId, item }); }
    catch (error) { removeAnnotationItem(ownerId, item.id); toast(error.message, 'error'); }
  };
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); finish(true); }
    if (event.key === 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(Boolean(input.value.trim())), { once: true });
  canvas.parentElement.append(input); input.focus();
}

function addAnnotationItem(ownerId, item, own = false) {
  const items = state.annotations.get(ownerId) || [];
  if (!items.some((existing) => existing.id === item.id)) items.push(item);
  if (items.length > 500) items.shift(); state.annotations.set(ownerId, items);
  if (own && !state.ownAnnotationIds.some((entry) => entry.id === item.id)) state.ownAnnotationIds.push({ ownerId, id: item.id });
  document.querySelectorAll(`canvas[data-share-owner="${CSS.escape(ownerId)}"]`).forEach((canvas) => redrawCanvas(canvas, ownerId));
}

function removeAnnotationItem(ownerId, itemId) {
  const items = state.annotations.get(ownerId) || [];
  state.annotations.set(ownerId, items.filter((item) => item.id !== itemId));
  state.ownAnnotationIds = state.ownAnnotationIds.filter((entry) => entry.id !== itemId);
  document.querySelectorAll(`canvas[data-share-owner="${CSS.escape(ownerId)}"]`).forEach((canvas) => redrawCanvas(canvas, ownerId));
}

function redrawCanvas(canvas, ownerId, temporary = null) {
  const box = screenContentBox(canvas); if (!box.rect.width || !box.rect.height) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(box.rect.width * ratio); const height = Math.round(box.rect.height * ratio);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const context = canvas.getContext('2d'); context.clearRect(0, 0, width, height); context.lineCap = 'round'; context.lineJoin = 'round';
  const drawBox = { x: box.x * ratio, y: box.y * ratio, width: box.width * ratio, height: box.height * ratio };
  const items = [...(state.annotations.get(ownerId) || []), ...(temporary ? [temporary] : [])];
  for (const item of items) {
    context.globalCompositeOperation = item.tool === 'eraser' ? 'destination-out' : 'source-over';
    if (item.tool === 'text') {
      context.fillStyle = item.color; context.font = `600 ${Math.max(14, item.width * 4) * ratio}px Inter, sans-serif`;
      context.fillText(item.text, drawBox.x + item.x * drawBox.width, drawBox.y + item.y * drawBox.height); continue;
    }
    if (!item.points?.length) continue;
    context.beginPath(); context.strokeStyle = item.color; context.lineWidth = item.width * ratio;
    context.moveTo(drawBox.x + item.points[0].x * drawBox.width, drawBox.y + item.points[0].y * drawBox.height);
    item.points.slice(1).forEach((point) => context.lineTo(drawBox.x + point.x * drawBox.width, drawBox.y + point.y * drawBox.height));
    context.stroke();
  }
  context.globalCompositeOperation = 'source-over';
}

function handleAnnotation(payload) {
  const ownerId = payload.shareOwnerId;
  if (payload.action === 'clear') {
    state.annotations.delete(ownerId); state.ownAnnotationIds = state.ownAnnotationIds.filter((entry) => entry.ownerId !== ownerId);
    document.querySelectorAll(`canvas[data-share-owner="${CSS.escape(ownerId)}"]`).forEach((canvas) => redrawCanvas(canvas, ownerId));
  } else if (payload.action === 'remove') removeAnnotationItem(ownerId, payload.itemId);
  else if (payload.item || payload.stroke) addAnnotationItem(ownerId, payload.item || payload.stroke, payload.from === state.clientId);
}

function currentSharedOwner() {
  const sharingIds = new Set([
    ...(state.screenStream ? [state.clientId] : []),
    ...state.callUsers.filter((user) => user.media?.screenSharing).map((user) => user.id),
  ]);
  if (sharingIds.has(state.activeShareOwnerId)) return state.activeShareOwnerId;
  if (sharingIds.has(state.pinnedUserId)) return state.pinnedUserId;
  if (sharingIds.has(state.autoFocusedShareId)) return state.autoFocusedShareId;
  return sharingIds.values().next().value || null;
}

function updateAnnotationPanel() {
  const ownerId = currentSharedOwner(); state.activeShareOwnerId = ownerId;
  if (!ownerId) { state.annotationPanelOpen = false; el.annotationToolbar.classList.add('hidden'); return; }
  const owner = getUser(ownerId); el.annotationTarget.textContent = `Tela de ${owner.name}${ownerId === state.clientId ? ' (você)' : ''}`;
  const ownScreen = ownerId === state.clientId;
  el.annotationPermissionRow.classList.toggle('hidden', !ownScreen); el.allowAnnotations.checked = state.annotationsEnabled;
  const allowed = canAnnotate(ownerId);
  el.annotationHelp.textContent = allowed ? 'Clique e arraste diretamente sobre a tela compartilhada.' : `${owner.name} desativou as anotações.`;
  el.clearDrawings.disabled = !ownScreen;
  el.undoDrawing.disabled = !state.ownAnnotationIds.some((entry) => entry.ownerId === ownerId);
  el.annotationToolbar.classList.toggle('hidden', !state.annotationPanelOpen);
  el.callDraw.classList.toggle('active', state.annotationPanelOpen);
}

function toggleAnnotationPanel() {
  if (!currentSharedOwner()) { toast('Ainda não há uma tela compartilhada para anotar.'); return; }
  state.annotationPanelOpen = !state.annotationPanelOpen; updateAnnotationPanel(); renderVideoGrid(); updateControlStates();
}

function closeAnnotationPanel() { state.annotationPanelOpen = false; updateAnnotationPanel(); renderVideoGrid(); updateControlStates(); }

async function undoDrawing() {
  const ownerId = currentSharedOwner();
  const latest = [...state.ownAnnotationIds].reverse().find((entry) => entry.ownerId === ownerId);
  if (!latest) { toast('Você ainda não fez nenhuma anotação nessa tela.'); return; }
  removeAnnotationItem(ownerId, latest.id);
  try { await api('/api/annotation', { action: 'remove', shareOwnerId: ownerId, itemId: latest.id }); }
  catch (error) { toast(error.message, 'error'); }
}

async function clearDrawings() {
  const ownerId = currentSharedOwner(); if (!ownerId) return;
  if (ownerId !== state.clientId) { toast('Somente quem compartilha pode apagar todas as anotações.', 'error'); return; }
  try { await api('/api/annotation', { action: 'clear', shareOwnerId: ownerId }); }
  catch (error) { toast(error.message, 'error'); }
}

function setAnnotationPermission(enabled) {
  if (!state.screenStream) return;
  state.annotationsEnabled = enabled; state.settings.annotations = enabled; saveSettings();
  updateAnnotationPanel(); renderVideoGrid(); postMediaState(); updateControlStates();
}

function renderCall() {
  const active = Boolean(state.voiceRoom);
  el.callStage.classList.toggle('hidden', !active); el.connectionPanel.classList.toggle('hidden', !active);
  if (!active) return;
  el.callTitle.textContent = CHANNELS[state.voiceRoom]; el.connectedRoom.textContent = CHANNELS[state.voiceRoom];
  el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada`;
  updateSelfUI(); renderVideoGrid();
}

function startLocalMeter() {
  const context = getAudioContext(); const track = state.audioStream?.getAudioTracks()[0];
  if (!context || !track) return;
  try {
    const source = context.createMediaStreamSource(new MediaStream([track]));
    const analyser = context.createAnalyser(); analyser.fftSize = 512; source.connect(analyser);
    state.audioMonitors.set(state.clientId, analyser); startVoiceMeterLoop();
  } catch { /* medidor não é essencial para a chamada */ }
}

function startVoiceMeterLoop() {
  if (state.voiceFrame) return;
  const loop = () => {
    state.voiceFrame = requestAnimationFrame(loop);
    for (const [userId, analyser] of state.audioMonitors) {
      const values = new Uint8Array(analyser.fftSize); analyser.getByteTimeDomainData(values);
      let sum = 0; for (const value of values) { const normalized = (value - 128) / 128; sum += normalized * normalized; }
      const level = Math.min(100, Math.sqrt(sum / values.length) * 240);
      const speaking = level >= state.settings.sensitivity && (userId !== state.clientId || state.micEnabled);
      const changed = speaking !== state.speaking.has(userId);
      if (speaking) state.speaking.add(userId); else state.speaking.delete(userId);
      if (userId === state.clientId) el.settingsMeter.style.width = `${level}%`;
      if (changed) {
        document.querySelectorAll(`[data-user-id="${CSS.escape(userId)}"]`).forEach((node) => node.classList.toggle('speaking', speaking));
      }
    }
  };
  loop();
}

function updateProcessingStatus(track = state.audioStream?.getAudioTracks()[0]) {
  const supported = navigator.mediaDevices?.getSupportedConstraints?.() || {};
  const active = track?.getSettings?.() || {};
  const rows = [
    ['noiseSuppression', el.noiseStatus, state.settings.noiseSuppression],
    ['echoCancellation', el.echoStatus, state.settings.echoCancellation],
    ['autoGainControl', el.gainStatus, state.settings.autoGainControl],
  ];
  rows.forEach(([key, node, wanted]) => {
    if (!supported[key]) node.textContent = 'Não disponível neste navegador';
    else if (!wanted) node.textContent = 'Desligado';
    else if (active[key] === true) node.textContent = 'Ativo no microfone';
    else if (track) node.textContent = 'Solicitado ao navegador';
    else node.textContent = 'Será ativado ao abrir o microfone';
  });
}

async function applyAudioProcessing() {
  const track = state.audioStream?.getAudioTracks()[0];
  if (!track) { updateProcessingStatus(); return; }
  try { await track.applyConstraints(audioConstraints()); }
  catch { toast('Seu microfone não aceitou uma das opções de processamento.', 'error'); }
  updateProcessingStatus(track);
}

async function refreshDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) return;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    fillDeviceSelect(el.inputDevice, devices.filter((device) => device.kind === 'audioinput'), state.settings.microphoneId, 'Microfone');
    fillDeviceSelect(el.outputDevice, devices.filter((device) => device.kind === 'audiooutput'), state.settings.speakerId, 'Saída');
    fillDeviceSelect(el.cameraDevice, devices.filter((device) => device.kind === 'videoinput'), state.settings.cameraId, 'Câmera');
  } catch { /* rótulos dependem de permissão */ }
}

function fillDeviceSelect(select, devices, selected, prefix) {
  const fragment = document.createDocumentFragment();
  const defaultOption = document.createElement('option'); defaultOption.value = 'default'; defaultOption.textContent = 'Padrão do sistema'; fragment.append(defaultOption);
  devices.filter((device) => device.deviceId !== 'default').forEach((device, index) => {
    const option = document.createElement('option'); option.value = device.deviceId; option.textContent = device.label || `${prefix} ${index + 1}`; fragment.append(option);
  });
  select.replaceChildren(fragment); select.value = [...select.options].some((option) => option.value === selected) ? selected : 'default';
}

async function setOutputDevice(deviceId) {
  const targets = [el.micLoopbackAudio, ...[...state.peers.values()].flatMap((peer) => peer.audioNodes.map((node) => node.audio))];
  let supported = false;
  for (const audio of targets) {
    if (typeof audio.setSinkId !== 'function') continue;
    supported = true; try { await audio.setSinkId(deviceId); } catch { /* dispositivo indisponível */ }
  }
  if (typeof state.audioContext?.setSinkId === 'function') {
    supported = true; try { await state.audioContext.setSinkId(deviceId); } catch { /* usa padrão */ }
  }
  if (!supported && deviceId !== 'default') toast('Este navegador não permite escolher a saída. Ele usará o padrão do Windows.', 'error');
}

async function toggleLoopback() {
  if (state.loopbackActive) { stopLoopback(); return; }
  try { state.micTestStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints(), video: false }); }
  catch { toast('Não consegui abrir o microfone para o teste.', 'error'); return; }
  const track = state.micTestStream.getAudioTracks()[0];
  el.micLoopbackAudio.srcObject = new MediaStream([track]);
  el.micLoopbackAudio.muted = false; el.micLoopbackAudio.volume = Math.min(1, state.settings.masterVolume / 100);
  await setOutputDevice(state.settings.speakerId);
  try {
    await el.micLoopbackAudio.play(); state.loopbackActive = true;
    el.loopbackButton.innerHTML = `${iconSvg('volume-off')} Parar teste`;
    toast('Teste ativo: fale e você ouvirá sua voz. Use fones.');
  } catch { toast('O navegador bloqueou o teste. Clique novamente.', 'error'); }
}

function stopLoopback() {
  state.loopbackActive = false; el.micLoopbackAudio.pause(); el.micLoopbackAudio.srcObject = null;
  state.micTestStream?.getTracks().forEach((track) => track.stop()); state.micTestStream = null;
  el.loopbackButton.innerHTML = `${iconSvg('mic')} Iniciar teste`;
}

function updateControlStates() {
  const hasMic = state.micEnabled && Boolean(state.audioStream?.getAudioTracks()[0]);
  [el.barMic, el.callMic].forEach((button) => {
    button.classList.toggle('off', !hasMic); button.innerHTML = iconSvg(hasMic ? 'mic' : 'mic-off');
    button.title = hasMic ? 'Desativar microfone' : 'Ativar microfone';
  });
  [el.barDeafen, el.callDeafen].forEach((button) => {
    button.classList.toggle('off', state.deafened); button.innerHTML = iconSvg(state.deafened ? 'volume-off' : 'headphones');
    button.title = state.deafened ? 'Ouvir novamente' : 'Silenciar fone';
  });
  el.callCamera.classList.toggle('active', Boolean(state.cameraStream));
  el.callCamera.innerHTML = iconSvg(state.cameraStream ? 'video' : 'video-off');
  el.callScreen.classList.toggle('active', Boolean(state.screenStream));
  updateAnnotationPanel();
  el.participantVideoButton.classList.toggle('active', state.settings.participantVideo);
  el.selfViewButton.classList.toggle('active', state.settings.selfView);
}

function openSettings(tab = 'account') {
  updateSelfUI(); syncSettingsControls(); refreshDevices(); updateProcessingStatus();
  el.settingsOverlay.classList.remove('hidden'); selectSettingsTab(tab);
}

function closeSettings() { stopLoopback(); el.settingsOverlay.classList.add('hidden'); }

function selectSettingsTab(tab) {
  document.querySelectorAll('[data-settings-tab]').forEach((button) => button.classList.toggle('active', button.dataset.settingsTab === tab));
  document.querySelectorAll('[data-settings-page]').forEach((page) => page.classList.toggle('active', page.dataset.settingsPage === tab));
}

function syncSettingsControls() {
  el.masterVolume.value = state.settings.masterVolume; el.masterVolumeValue.value = `${state.settings.masterVolume}%`;
  el.micSensitivity.value = state.settings.sensitivity; el.sensitivityValue.value = `${state.settings.sensitivity}%`;
  el.noiseSuppression.checked = state.settings.noiseSuppression; el.echoCancellation.checked = state.settings.echoCancellation; el.autoGain.checked = state.settings.autoGainControl;
  el.settingParticipantVideo.checked = state.settings.participantVideo; el.settingSelfView.checked = state.settings.selfView;
  el.settingScreenPreview.checked = state.settings.screenPreview; el.settingAnnotations.checked = state.settings.annotations; el.settingAutoFocus.checked = state.settings.autoFocus;
  el.protectIp.checked = state.settings.protectIp; el.callSounds.checked = state.settings.callSounds;
  el.soundVolume.value = state.settings.soundVolume; el.soundVolumeValue.value = `${state.settings.soundVolume}%`;
  el.cameraQuality.value = state.settings.cameraQuality; el.screenQuality.value = state.settings.screenQuality;
  el.accentColor.value = state.settings.accent; el.compactMode.checked = state.settings.compact;
}

async function prepareAvatar(file) {
  if (!file || file.size > 8 * 1024 * 1024) { toast('Escolha uma imagem de até 8 MB.', 'error'); return; }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = url; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128;
    const context = canvas.getContext('2d');
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const x = (image.naturalWidth - side) / 2; const y = (image.naturalHeight - side) / 2;
    context.drawImage(image, x, y, side, side, 0, 0, 128, 128);
    state.pendingAvatar = canvas.toDataURL('image/webp', .82);
    if (!state.pendingAvatar.startsWith('data:image/webp')) state.pendingAvatar = canvas.toDataURL('image/jpeg', .82);
    updateSelfUI(); el.profileFeedback.textContent = 'Foto pronta. Clique em Salvar perfil.';
  } catch { toast('Não consegui ler essa imagem.', 'error'); }
  finally { URL.revokeObjectURL(url); }
}

async function saveProfile() {
  const name = el.displayName.value.trim().replace(/\s+/g, ' ').slice(0, 32) || 'Visitante';
  const avatar = state.pendingAvatar ?? state.avatar;
  try {
    const result = await api('/api/profile', { name, avatar });
    state.name = result.user?.name || name; state.avatar = result.user?.avatar || avatar; state.pendingAvatar = null;
    localStorage.setItem('concord-name', state.name); localStorage.setItem('concord-avatar', state.avatar);
    updateSelfUI(); renderPresence(); renderVideoGrid();
    el.profileFeedback.textContent = 'Perfil salvo.'; setTimeout(() => { el.profileFeedback.textContent = ''; }, 2200);
  } catch (error) { toast(error.message, 'error'); }
}

function showContextMenu(event, userId) {
  if (!state.voiceRoom || userId === state.clientId || !state.callUsers.some((user) => user.id === userId)) return;
  event.preventDefault(); const user = getUser(userId); const preference = userPreference(userId);
  el.contextMenu.replaceChildren();
  const head = document.createElement('div'); head.className = 'context-head'; head.textContent = user.name; el.contextMenu.append(head);
  const mute = contextAction(preference.muted ? 'Desmutar para mim' : 'Silenciar para mim', preference.muted ? 'volume' : 'volume-off', () => setUserPreference(userId, { muted: !preference.muted }));
  const hide = contextAction(preference.hideVideo ? 'Mostrar vídeo' : 'Ocultar vídeo', preference.hideVideo ? 'eye' : 'video-off', () => setUserPreference(userId, { hideVideo: !preference.hideVideo }));
  const focus = contextAction(state.pinnedUserId === userId ? 'Voltar para grade' : 'Priorizar participante', 'fullscreen', () => focusUser(userId));
  const rangeBox = document.createElement('div'); rangeBox.className = 'context-range';
  const label = document.createElement('label'); const labelText = document.createElement('span'); labelText.textContent = 'Volume';
  const output = document.createElement('output'); output.textContent = `${preference.volume}%`; label.append(labelText, output);
  const range = document.createElement('input'); range.type = 'range'; range.min = '0'; range.max = '200'; range.value = preference.volume;
  range.addEventListener('input', () => { output.textContent = `${range.value}%`; setUserPreference(userId, { volume: Number(range.value), muted: false }); });
  rangeBox.append(label, range); el.contextMenu.append(mute, rangeBox, hide, focus);
  el.contextMenu.classList.remove('hidden');
  const x = Math.min(event.clientX, innerWidth - 245); const y = Math.min(event.clientY, innerHeight - el.contextMenu.offsetHeight - 8);
  el.contextMenu.style.left = `${Math.max(5, x)}px`; el.contextMenu.style.top = `${Math.max(5, y)}px`;
}

function contextAction(label, icon, action) {
  const button = document.createElement('button'); button.className = 'context-action';
  const text = document.createElement('span'); text.textContent = label; button.append(text); button.insertAdjacentHTML('beforeend', iconSvg(icon));
  button.addEventListener('click', () => { action(); hideContextMenu(); }); return button;
}

function hideContextMenu() { el.contextMenu.classList.add('hidden'); }

document.querySelectorAll('[data-text-room]').forEach((button) => button.addEventListener('click', () => switchTextRoom(button.dataset.textRoom)));
document.querySelectorAll('[data-voice-room]').forEach((button) => button.addEventListener('click', () => joinCall(button.dataset.voiceRoom)));

el.messageForm.addEventListener('submit', async (event) => { event.preventDefault(); await sendCurrentMessage(); });
el.messageInput.addEventListener('input', () => { el.messageInput.style.height = 'auto'; el.messageInput.style.height = `${Math.min(140, el.messageInput.scrollHeight)}px`; });
el.messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); el.messageForm.requestSubmit(); }
});
el.attachButton.addEventListener('click', () => el.fileInput.click());
el.fileInput.addEventListener('change', () => { addPendingFiles(el.fileInput.files); el.fileInput.value = ''; });
el.recordAudio.addEventListener('click', toggleAudioRecording);
['dragenter', 'dragover'].forEach((type) => el.chatArea.addEventListener(type, (event) => {
  event.preventDefault(); if (event.dataTransfer?.types?.includes('Files')) el.chatArea.classList.add('drop-active');
}));
['dragleave', 'drop'].forEach((type) => el.chatArea.addEventListener(type, (event) => {
  event.preventDefault(); el.chatArea.classList.remove('drop-active');
  if (type === 'drop' && event.dataTransfer?.files?.length) addPendingFiles(event.dataTransfer.files);
}));
el.messageInput.addEventListener('paste', (event) => {
  const files = [...(event.clipboardData?.files || [])]; if (files.length) { event.preventDefault(); addPendingFiles(files); }
});

[el.barMic, el.callMic].forEach((button) => button.addEventListener('click', toggleMicrophone));
[el.barDeafen, el.callDeafen].forEach((button) => button.addEventListener('click', toggleDeafen));
el.callCamera.addEventListener('click', toggleCamera); el.callScreen.addEventListener('click', toggleScreen); el.callDraw.addEventListener('click', toggleAnnotationPanel);
el.leaveCall.addEventListener('click', leaveCall); el.disconnectVoice.addEventListener('click', leaveCall);
el.layoutButton.addEventListener('click', toggleLayout);
el.fullscreenButton.addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await el.callStage.requestFullscreen(); } catch { toast('Tela cheia não foi liberada pelo navegador.', 'error'); }
});
el.participantVideoButton.addEventListener('click', () => {
  state.settings.participantVideo = !state.settings.participantVideo; saveSettings(); syncSettingsControls(); updateControlStates(); renderVideoGrid();
});
el.selfViewButton.addEventListener('click', () => {
  state.settings.selfView = !state.settings.selfView; saveSettings(); syncSettingsControls(); updateControlStates(); renderVideoGrid();
});
el.toggleMemberList.addEventListener('click', () => {
  document.body.classList.toggle('member-panel-hidden'); el.toggleMemberList.classList.toggle('active', !document.body.classList.contains('member-panel-hidden'));
});

document.querySelectorAll('[data-draw-color]').forEach((button) => button.addEventListener('click', () => {
  state.drawColor = button.dataset.drawColor;
  document.querySelectorAll('[data-draw-color]').forEach((item) => item.classList.toggle('active', item === button));
}));
document.querySelectorAll('[data-draw-tool]').forEach((button) => button.addEventListener('click', () => {
  state.drawTool = button.dataset.drawTool;
  document.querySelectorAll('[data-draw-tool]').forEach((item) => item.classList.toggle('active', item === button));
}));
el.drawSize.addEventListener('input', () => { state.drawSize = Number(el.drawSize.value); });
el.undoDrawing.addEventListener('click', undoDrawing); el.clearDrawings.addEventListener('click', clearDrawings);
el.closeAnnotation.addEventListener('click', closeAnnotationPanel);
el.allowAnnotations.addEventListener('change', () => setAnnotationPermission(el.allowAnnotations.checked));

[el.openSettings, el.profileButton].forEach((button) => button.addEventListener('click', () => openSettings(button === el.profileButton ? 'account' : 'voice')));
el.closeSettings.addEventListener('click', closeSettings);
document.querySelectorAll('[data-settings-tab]').forEach((button) => button.addEventListener('click', () => selectSettingsTab(button.dataset.settingsTab)));
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  hideContextMenu();
  if (!el.settingsOverlay.classList.contains('hidden')) closeSettings();
  else if (state.annotationPanelOpen) closeAnnotationPanel();
});

el.avatarInput.addEventListener('change', () => prepareAvatar(el.avatarInput.files?.[0]));
el.removeAvatar.addEventListener('click', () => { state.pendingAvatar = ''; updateSelfUI(); el.profileFeedback.textContent = 'Foto removida. Clique em Salvar perfil.'; });
el.saveProfile.addEventListener('click', saveProfile);

el.masterVolume.addEventListener('input', () => {
  state.settings.masterVolume = Number(el.masterVolume.value); el.masterVolumeValue.value = `${state.settings.masterVolume}%`;
  saveSettings(); applyRemoteAudio(); el.micLoopbackAudio.volume = Math.min(1, state.settings.masterVolume / 100);
});
el.micSensitivity.addEventListener('input', () => {
  state.settings.sensitivity = Number(el.micSensitivity.value); el.sensitivityValue.value = `${state.settings.sensitivity}%`; saveSettings();
});
el.inputDevice.addEventListener('change', async () => {
  state.settings.microphoneId = el.inputDevice.value; saveSettings();
  try { await ensureMicrophone(true); postMediaState(); } catch { toast('Não consegui trocar o microfone.', 'error'); }
});
el.outputDevice.addEventListener('change', () => {
  state.settings.speakerId = el.outputDevice.value; saveSettings(); setOutputDevice(state.settings.speakerId);
});
el.cameraDevice.addEventListener('change', async () => {
  state.settings.cameraId = el.cameraDevice.value; saveSettings(); if (state.cameraStream) { stopCamera(); await toggleCamera(); }
});
el.loopbackButton.addEventListener('click', toggleLoopback);
el.protectIp.addEventListener('change', () => {
  state.settings.protectIp = el.protectIp.checked; saveSettings(); rebuildPeerConnections();
  toast(state.settings.protectIp ? 'Proteção de IP ativada. A chamada usa retransmissão.' : 'Conexão direta permitida. Outros participantes podem receber seu IP.', state.settings.protectIp ? '' : 'error');
});
el.callSounds.addEventListener('change', () => {
  state.settings.callSounds = el.callSounds.checked; saveSettings(); if (state.settings.callSounds) playCue('sent');
});
el.soundVolume.addEventListener('input', () => {
  state.settings.soundVolume = Number(el.soundVolume.value); el.soundVolumeValue.value = `${state.settings.soundVolume}%`; saveSettings();
});

const processSettings = [
  [el.noiseSuppression, 'noiseSuppression'], [el.echoCancellation, 'echoCancellation'], [el.autoGain, 'autoGainControl'],
];
processSettings.forEach(([control, key]) => control.addEventListener('change', () => { state.settings[key] = control.checked; saveSettings(); applyAudioProcessing(); }));

const visualSettings = [
  [el.settingParticipantVideo, 'participantVideo'], [el.settingSelfView, 'selfView'], [el.settingScreenPreview, 'screenPreview'],
  [el.settingAnnotations, 'annotations'], [el.settingAutoFocus, 'autoFocus'],
];
visualSettings.forEach(([control, key]) => control.addEventListener('change', () => {
  state.settings[key] = control.checked;
  if (key === 'annotations') {
    if (state.screenStream) { setAnnotationPermission(control.checked); return; }
    state.annotationsEnabled = control.checked;
  }
  saveSettings(); updateControlStates(); renderVideoGrid(); postMediaState();
}));
el.cameraQuality.addEventListener('change', () => { state.settings.cameraQuality = el.cameraQuality.value; saveSettings(); });
el.screenQuality.addEventListener('change', () => { state.settings.screenQuality = el.screenQuality.value; saveSettings(); });
el.accentColor.addEventListener('input', () => { state.settings.accent = el.accentColor.value; saveSettings(); });
el.compactMode.addEventListener('change', () => { state.settings.compact = el.compactMode.checked; saveSettings(); });

document.addEventListener('contextmenu', (event) => {
  const target = event.target.closest('[data-user-id]'); if (target) showContextMenu(event, target.dataset.userId);
});
document.addEventListener('pointerdown', (event) => {
  getAudioContext();
  if (!event.target.closest('#context-menu')) hideContextMenu();
  for (const peer of state.peers.values()) for (const node of peer.audioNodes) if (!node.gain) node.audio.play().catch(() => {});
});
window.addEventListener('resize', () => {
  document.querySelectorAll('.annotation-canvas').forEach((canvas) => redrawCanvas(canvas, canvas.dataset.shareOwner));
});
document.addEventListener('fullscreenchange', () => el.fullscreenButton.classList.toggle('active', Boolean(document.fullscreenElement)));
navigator.mediaDevices?.addEventListener?.('devicechange', refreshDevices);

applyAppearance(); syncSettingsControls(); updateSelfUI(); updateControlStates(); updateProcessingStatus();
state.annotationsEnabled = state.settings.annotations;
loadIceServers().finally(connectEvents);
