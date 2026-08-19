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
  pointer: '<circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  undo: '<path d="M9 7 4 12l5 5M4 12h9a7 7 0 0 1 7 7"/>',
  paperclip: '<path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  waveform: '<path d="M3 10v4M7 7v10M11 3v18M15 8v8M19 5v14M23 10v4"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  trash: '<path d="M3 6h18M8 6V3h8v3M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2"/>',
  refresh: '<path d="M20 11a8 8 0 1 0 2 5M20 4v7h-7"/>',
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
  protectIp: false, privacyModeVersion: 2, callSounds: true, soundVolume: 45, desktopOverlay: true,
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
    if (Number(raw.privacyModeVersion) < 2) settings.protectIp = false;
    settings.privacyModeVersion = 2;
    settings.callSounds = settings.callSounds !== false;
    return settings;
  } catch { return { ...DEFAULTS }; }
}

const clientId = sessionStorage.getItem('concord-client-id') || sessionStorage.getItem('lume-client-id') || crypto.randomUUID();
sessionStorage.setItem('concord-client-id', clientId);
const deviceId = localStorage.getItem('concord-device-id') || crypto.randomUUID();
localStorage.setItem('concord-device-id', deviceId);
const tabId = sessionStorage.getItem('concord-tab-id') || crypto.randomUUID();
sessionStorage.setItem('concord-tab-id', tabId);

const state = {
  clientId, deviceId, tabId, sessionToken: '', tabActive: false, tabHeartbeat: null, tabStandbyTimer: null,
  name: localStorage.getItem('concord-name') || localStorage.getItem('lume-name') || 'Visitante',
  avatar: localStorage.getItem('concord-avatar') || '',
  textRoom: 'geral', voiceRoom: null, eventSource: null,
  textUsers: [], voiceChannels: { lobby: [], jogos: [], musica: [] }, callUsers: [],
  settings: loadSettings(), peers: new Map(), peerRebuilds: new Map(), iceServers: [], stunServers: [], relayServers: [], iceRelayReady: false, iceRelayReliable: false, relayProvider: '',
  audioStream: null, cameraStream: null, screenStream: null,
  micEnabled: true, deafened: false, annotationsEnabled: true,
  audioContext: null, audioMonitors: new Map(), voiceFrame: null,
  speaking: new Set(), loopbackActive: false, micTestStream: null,
  layout: 'grid', pinnedUserId: null, autoFocusedShareId: null,
  drawColor: '#ff5d8f', drawTool: 'pen', drawSize: 4, activeShareOwnerId: null,
  annotationPanelOpen: false, annotations: new Map(), ownAnnotationIds: [], pendingAvatar: null,
  knownCallUsers: new Map(), callRosterReady: false,
  pendingFiles: [], recorder: null, recordingStream: null, recordingStartedAt: 0, recordingTimer: null,
  desktopOverlayAvailable: false, mediaWarningAt: 0, unreadMessages: 0,
  callProvider: null, conference: null, jitsiApi: null, jitsiReady: false, jitsiTimer: null,
  jitsiVideoEnabled: false, jitsiScreenSharing: false, jitsiLeaving: false, jitsiLocalParticipantId: '',
};

const IDS = [
  'room-title','chat-area','messages','new-messages','message-form','message-input','attachment-tray','attach-button','file-input','record-audio','recording-time','member-count','member-list','toggle-member-list',
  'call-stage','call-title','call-status','video-grid','reconnect-media','jitsi-open-external','jitsi-call','jitsi-container','jitsi-loading','layout-button','view-menu','layout-grid','layout-focus','participant-video-button','self-view-button','screen-preview-button','fullscreen-button',
  'annotation-toolbar','annotation-target','close-annotation','draw-size','undo-drawing','clear-drawings','annotation-permission-row','allow-annotations','annotation-help','call-mic','call-deafen','call-camera','call-screen','call-draw','leave-call',
  'connection-panel','connected-room','disconnect-voice','profile-button','profile-avatar','profile-fallback','self-name','self-status','bar-mic','bar-deafen','open-settings',
  'settings-overlay','close-settings','settings-avatar','settings-avatar-fallback','settings-name-display','display-name','avatar-input','remove-avatar','save-profile','profile-feedback',
  'input-device','output-device','master-volume','master-volume-value','mic-sensitivity','sensitivity-value','loopback-button','settings-meter','sensitivity-threshold','mic-level-value','mic-loopback-audio',
  'noise-suppression','noise-status','echo-cancellation','echo-status','auto-gain','gain-status','protect-ip','call-sounds','sound-volume','sound-volume-value','desktop-overlay','desktop-overlay-status',
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
    body: JSON.stringify({ clientId: state.clientId, sessionToken: state.sessionToken, room: state.textRoom, ...body }),
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
  const hosted = state.callProvider === 'jitsi';
  return {
    micEnabled: state.micEnabled && (hosted || Boolean(state.audioStream?.getAudioTracks()[0])),
    cameraEnabled: hosted ? state.jitsiVideoEnabled : Boolean(state.cameraStream?.getVideoTracks()[0]),
    screenSharing: hosted ? state.jitsiScreenSharing : Boolean(state.screenStream?.getVideoTracks()[0]),
    annotationsEnabled: hosted ? false : Boolean(state.annotationsEnabled && state.screenStream),
    deafened: state.deafened,
  };
}

async function postMediaState() {
  if (!state.voiceRoom) return;
  try { await api('/api/media-state', { media: mediaState() }); }
  catch (error) { console.warn(error); }
}

const ACTIVE_TAB_KEY = 'concord-active-tab';
const DEV_MULTITAB = ['localhost', '127.0.0.1', '::1'].includes(location.hostname) && new URLSearchParams(location.search).has('multi');

function readActiveTab() {
  try { return JSON.parse(localStorage.getItem(ACTIVE_TAB_KEY) || 'null'); } catch { return null; }
}

function writeActiveTab() {
  localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify({ tabId: state.tabId, expiresAt: Date.now() + 6000 }));
}

function tabStandbyOverlay() {
  let overlay = document.getElementById('tab-standby-overlay');
  if (overlay) return overlay;
  overlay = document.createElement('div'); overlay.id = 'tab-standby-overlay'; overlay.className = 'tab-standby-overlay hidden';
  const card = document.createElement('section'); card.className = 'tab-standby-card';
  const logo = document.createElement('div'); logo.className = 'tab-standby-logo'; logo.textContent = 'C';
  const title = document.createElement('h2'); title.textContent = 'O Concord já está aberto em outra guia';
  const copy = document.createElement('p'); copy.textContent = 'Só uma guia por navegador fica conectada à chamada. Isso evita visitantes duplicados, eco e câmera presa.';
  const button = document.createElement('button'); button.className = 'primary-button'; button.textContent = 'Usar o Concord nesta guia';
  button.addEventListener('click', () => activateTab(true));
  card.append(logo, title, copy, button); overlay.append(card); document.body.append(overlay); return overlay;
}

function stopLocalSessionForStandby() {
  state.eventSource?.close(); state.eventSource = null; state.sessionToken = '';
  state.voiceRoom = null; state.callUsers = [];
  unmountJitsi(); closeAllPeers(); stopLoopback(); stopCamera(); stopScreen(false);
  state.audioStream?.getTracks().forEach((track) => track.stop()); state.audioStream = null;
  state.audioMonitors.clear(); state.speaking.clear();
  renderCall(); renderVoiceChannels(); updateControlStates();
}

function enterTabStandby() {
  state.tabActive = false; clearInterval(state.tabHeartbeat); state.tabHeartbeat = null;
  stopLocalSessionForStandby(); tabStandbyOverlay().classList.remove('hidden');
  clearInterval(state.tabStandbyTimer);
  state.tabStandbyTimer = setInterval(() => {
    const owner = readActiveTab();
    if (!owner || owner.expiresAt < Date.now()) activateTab(false);
  }, 2200);
}

async function activateTab(force = false) {
  if (state.tabActive) return;
  if (!DEV_MULTITAB) {
    const owner = readActiveTab();
    if (!force && owner && owner.tabId !== state.tabId && owner.expiresAt > Date.now()) { enterTabStandby(); return; }
    writeActiveTab();
    const verified = readActiveTab();
    if (verified?.tabId !== state.tabId) { enterTabStandby(); return; }
  }
  clearInterval(state.tabStandbyTimer); state.tabStandbyTimer = null;
  state.tabActive = true; tabStandbyOverlay().classList.add('hidden');
  if (!DEV_MULTITAB) state.tabHeartbeat = setInterval(writeActiveTab, 2000);
  await loadIceServers(); connectEvents();
}

function connectEvents() {
  if (!state.tabActive) return;
  state.eventSource?.close();
  const queryDeviceId = DEV_MULTITAB ? `${state.deviceId}-${state.tabId}` : state.deviceId;
  const query = new URLSearchParams({ room: state.textRoom, clientId: state.clientId, deviceId: queryDeviceId, name: state.name });
  const source = new EventSource(`/api/events?${query}`);
  state.eventSource = source;
  document.querySelector('.status-dot').style.background = '#ffd166';

  source.onopen = () => {
    document.querySelector('.status-dot').style.background = 'var(--green)';
  };
  source.onerror = () => {
    document.querySelector('.status-dot').style.background = 'var(--red)';
    el.callStatus.textContent = state.voiceRoom ? 'Reconectando ao Concord…' : '';
  };
  source.onmessage = async (event) => {
    let payload;
    try { payload = JSON.parse(event.data); } catch { return; }
    if (payload.type === 'hello') {
      state.sessionToken = String(payload.sessionToken || '');
      api('/api/profile', { name: state.name, avatar: state.avatar }).catch(() => {});
      renderMessages(payload.messages || []);
      state.textUsers = payload.users || [];
      state.voiceChannels = payload.voiceChannels || state.voiceChannels;
      renderPresence();
      if (!state.voiceRoom && payload.self?.voiceRoom) {
        joinCall(payload.self.voiceRoom).catch(() => {});
      } else if (state.voiceRoom && payload.self?.voiceRoom !== state.voiceRoom) {
        api('/api/call', { action: 'join', voiceRoom: state.voiceRoom, media: mediaState() })
          .then((result) => {
            state.conference = result.conference || state.conference;
            if (state.conference?.provider === 'jitsi') mountJitsi(state.conference);
            syncCallUsers(result.users || []);
          })
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
    } else if (payload.type === 'message-deleted') {
      removeMessageFromView(payload.messageId);
    } else if (payload.type === 'tab-replaced') {
      enterTabStandby();
    } else if (payload.type === 'signal' && state.callProvider !== 'jitsi') {
      await handleSignal(payload.from, payload.data);
    } else if (payload.type === 'peer-left' && state.callProvider !== 'jitsi') {
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
  if (state.tabActive) connectEvents();
}

function renderMessages(messages) {
  el.messages.replaceChildren();
  state.unreadMessages = 0; updateNewMessagesButton();
  if (!messages.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const box = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = `# ${CHANNELS[state.textRoom]}`;
    box.append(strong, document.createTextNode('Este é o começo do canal.'));
    empty.append(box); el.messages.append(empty); return;
  }
  messages.forEach((message) => appendMessage(message, true));
  el.messages.scrollTop = el.messages.scrollHeight;
}

function isNearMessageBottom() {
  return el.messages.scrollHeight - el.messages.scrollTop - el.messages.clientHeight < 90;
}

function updateNewMessagesButton() {
  el.newMessages.classList.toggle('hidden', state.unreadMessages < 1);
  el.newMessages.textContent = state.unreadMessages === 1 ? '1 nova mensagem' : `${state.unreadMessages} novas mensagens`;
}

function removeMessageFromView(messageId) {
  el.messages.querySelector(`[data-message-id="${CSS.escape(String(messageId || ''))}"]`)?.remove();
  if (!el.messages.querySelector('.message')) renderMessages([]);
}

async function deleteMessage(messageId) {
  if (!confirm('Excluir esta mensagem para todos?')) return;
  try { await api('/api/message-delete', { messageId }); }
  catch (error) { toast(error.message, 'error'); }
}

function appendMessage(message, initial = false) {
  const shouldFollow = initial || isNearMessageBottom() || message.mine;
  el.messages.querySelector('.empty-state')?.remove();
  const row = document.createElement('article');
  row.className = `message${message.mine ? ' own-message' : ''}`;
  row.dataset.messageId = message.id;
  row.append(avatarNode(message));
  const head = document.createElement('div'); head.className = 'message-head';
  const author = document.createElement('strong'); author.textContent = message.name || 'Visitante';
  const time = document.createElement('time');
  time.textContent = new Date(message.createdAt || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  head.append(author, time);
  if (message.mine) {
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'message-delete';
    remove.title = 'Excluir mensagem'; remove.ariaLabel = 'Excluir mensagem'; remove.innerHTML = iconSvg('trash');
    remove.addEventListener('click', () => deleteMessage(message.id)); head.append(remove);
  }
  const body = document.createElement('div'); body.className = 'message-body'; body.textContent = message.text;
  row.append(head, body);
  if (Array.isArray(message.attachments) && message.attachments.length) {
    const attachments = document.createElement('div'); attachments.className = 'message-attachments';
    message.attachments.forEach((attachment) => attachments.append(renderAttachment(attachment)));
    row.append(attachments);
  }
  el.messages.append(row);
  if (shouldFollow) {
    el.messages.scrollTop = el.messages.scrollHeight; state.unreadMessages = 0;
  } else state.unreadMessages += 1;
  updateNewMessagesButton();
}

function formatBytes(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function renderAttachment(attachment) {
  const mime = String(attachment.mime || '');
  const block = document.createElement('div'); block.className = 'attachment-block';
  let previewable = false;
  if (/^image\/(png|jpe?g|gif|webp)$/.test(mime)) {
    const image = document.createElement('img'); image.className = 'attachment-image'; image.src = attachment.url; image.alt = attachment.name || 'Imagem enviada'; image.loading = 'lazy';
    image.addEventListener('error', () => { block.replaceWith(expiredAttachment()); }); image.addEventListener('click', () => openAttachmentViewer(attachment));
    block.append(image); previewable = true;
  } else if (/^video\/(mp4|webm|ogg|quicktime|x-matroska)$/.test(mime)) {
    const video = document.createElement('video'); video.className = 'attachment-video'; video.controls = true; video.preload = 'metadata'; video.src = attachment.url;
    video.addEventListener('error', () => video.replaceWith(expiredAttachment())); block.append(video); previewable = true;
  } else if (/^audio\/(mpeg|ogg|wav|webm|mp4|x-m4a)$/.test(mime)) {
    const audio = document.createElement('audio'); audio.className = 'attachment-audio'; audio.controls = true; audio.preload = 'metadata'; audio.src = attachment.url;
    audio.addEventListener('error', () => audio.replaceWith(expiredAttachment())); block.append(audio); previewable = true;
  } else {
    const card = document.createElement('div'); card.className = 'file-card'; card.innerHTML = iconSvg('file');
    const copy = document.createElement('span'); copy.className = 'file-copy';
    const name = document.createElement('strong'); name.textContent = attachment.name || 'Arquivo';
    const size = document.createElement('small'); size.textContent = `${formatBytes(Number(attachment.size) || 0)} · ${mime || 'arquivo'}`; copy.append(name, size); card.append(copy); block.append(card);
    previewable = mime === 'application/pdf' || mime === 'text/plain';
  }
  const footer = document.createElement('div'); footer.className = 'attachment-footer';
  const label = document.createElement('span'); label.textContent = `${attachment.name || 'Arquivo'} · ${formatBytes(Number(attachment.size) || 0)}`; footer.append(label);
  if (previewable) {
    const view = document.createElement('button'); view.type = 'button'; view.innerHTML = `${iconSvg('eye')} Visualizar`;
    view.addEventListener('click', () => openAttachmentViewer(attachment)); footer.append(view);
  }
  const download = document.createElement('a'); download.href = `${attachment.url}?download=1`; download.download = attachment.name || 'arquivo'; download.innerHTML = `${iconSvg('download')} Baixar`; footer.append(download);
  block.append(footer); return block;
}

function openAttachmentViewer(attachment) {
  const overlay = document.createElement('div'); overlay.className = 'attachment-viewer-overlay';
  const dialog = document.createElement('section'); dialog.className = 'attachment-viewer';
  const header = document.createElement('header');
  const copy = document.createElement('div'); const title = document.createElement('strong'); title.textContent = attachment.name || 'Arquivo';
  const detail = document.createElement('small'); detail.textContent = `${attachment.mime || 'arquivo'} · ${formatBytes(Number(attachment.size) || 0)}`; copy.append(title, detail);
  const download = document.createElement('a'); download.href = `${attachment.url}?download=1`; download.download = attachment.name || 'arquivo'; download.innerHTML = `${iconSvg('download')} Baixar`;
  const close = document.createElement('button'); close.className = 'icon-button'; close.innerHTML = iconSvg('close'); close.ariaLabel = 'Fechar'; header.append(copy, download, close);
  const content = document.createElement('div'); content.className = 'attachment-viewer-content'; const mime = String(attachment.mime || '');
  if (mime.startsWith('image/')) { const image = document.createElement('img'); image.src = attachment.url; image.alt = attachment.name || ''; content.append(image); }
  else if (mime.startsWith('video/')) { const video = document.createElement('video'); video.src = attachment.url; video.controls = true; video.autoplay = true; content.append(video); }
  else if (mime.startsWith('audio/')) { const audio = document.createElement('audio'); audio.src = attachment.url; audio.controls = true; audio.autoplay = true; content.append(audio); }
  else if (mime === 'application/pdf') { const frame = document.createElement('iframe'); frame.src = `${attachment.url}?preview=1`; frame.title = attachment.name || 'PDF'; content.append(frame); }
  else if (mime === 'text/plain') {
    const pre = document.createElement('pre'); pre.textContent = 'Carregando…'; content.append(pre);
    fetch(`${attachment.url}?preview=1`).then((response) => response.ok ? response.text() : Promise.reject()).then((text) => { pre.textContent = text.slice(0, 300_000); }).catch(() => { pre.textContent = 'Este arquivo expirou ou não pôde ser aberto.'; });
  }
  const finish = () => { document.removeEventListener('keydown', onKey); overlay.remove(); };
  const onKey = (event) => { if (event.key === 'Escape') finish(); };
  close.addEventListener('click', finish); overlay.addEventListener('click', (event) => { if (event.target === overlay) finish(); }); document.addEventListener('keydown', onKey);
  dialog.append(header, content); overlay.append(dialog); document.body.append(overlay);
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
    method: 'POST', headers: { 'Content-Type': pending.file.type || 'application/octet-stream', 'X-File-Name': encodeURIComponent(pending.file.name), 'X-Concord-Session': state.sessionToken }, body: pending.file,
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
    const onlyUrls = (entry, predicate) => {
      const urls = (Array.isArray(entry.urls) ? entry.urls : [entry.urls]).filter((url) => predicate(String(url)));
      return urls.length ? [{ ...entry, urls: urls.length === 1 ? urls[0] : urls }] : [];
    };
    state.stunServers = state.iceServers.flatMap((entry) => onlyUrls(entry, (url) => url.startsWith('stun:')));
    state.relayServers = state.iceServers.flatMap((entry) => onlyUrls(entry, (url) => url.startsWith('turn:') || url.startsWith('turns:')));
    state.iceRelayReady = data.relayReady === true;
    state.iceRelayReliable = data.relayReliable === true;
    state.relayProvider = String(data.relayProvider || '');
  } catch {
    state.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
    state.stunServers = [...state.iceServers]; state.relayServers = [];
    state.iceRelayReady = false; state.iceRelayReliable = false; state.relayProvider = '';
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

function setJitsiLoading(title, detail, failed = false) {
  const titleNode = el.jitsiLoading.querySelector('strong');
  const detailNode = el.jitsiLoading.querySelector('small');
  if (titleNode) titleNode.textContent = title;
  if (detailNode) detailNode.textContent = detail;
  el.jitsiCall.classList.toggle('failed', failed);
  el.jitsiCall.classList.remove('ready', 'frame-loaded');
}

function jitsiMeetingUrl(conference = state.conference) {
  if (!conference?.domain || !conference?.roomName) return '';
  return `https://${conference.domain}/${encodeURIComponent(conference.roomName)}`;
}

function loadJitsiApi(domain) {
  if (window.JitsiMeetExternalAPI) return Promise.resolve(window.JitsiMeetExternalAPI);
  if (window.__concordJitsiPromise) return window.__concordJitsiPromise;
  window.__concordJitsiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => reject(new Error('Tempo esgotado ao carregar a chamada.')), 20_000);
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.dataset.concordJitsi = domain;
    script.onload = () => {
      clearTimeout(timeout);
      if (window.JitsiMeetExternalAPI) resolve(window.JitsiMeetExternalAPI);
      else reject(new Error('O serviço de chamada não ficou disponível.'));
    };
    script.onerror = () => { clearTimeout(timeout); reject(new Error('Não foi possível carregar o serviço de chamada.')); };
    document.head.append(script);
  }).catch((error) => {
    window.__concordJitsiPromise = null;
    throw error;
  });
  return window.__concordJitsiPromise;
}

async function applyJitsiDeafen() {
  if (!state.jitsiApi || !state.jitsiReady) return;
  try {
    const participants = await state.jitsiApi.getParticipantsInfo();
    const volume = state.deafened ? 0 : Math.min(1, state.settings.masterVolume / 100);
    for (const participant of participants || []) {
      const id = participant.participantId || participant.id;
      if (id && id !== state.jitsiLocalParticipantId) state.jitsiApi.executeCommand('setParticipantVolume', id, volume);
    }
  } catch { /* o menu interno da chamada continua disponível */ }
}

function unmountJitsi(hangup = false) {
  clearTimeout(state.jitsiTimer); state.jitsiTimer = null;
  const apiInstance = state.jitsiApi;
  state.jitsiApi = null; state.jitsiReady = false; state.jitsiLocalParticipantId = '';
  state.jitsiVideoEnabled = false; state.jitsiScreenSharing = false;
  if (apiInstance) {
    state.jitsiLeaving = true;
    try { if (hangup) apiInstance.executeCommand('hangup'); } catch { /* já saiu */ }
    try { apiInstance.dispose(); } catch { /* já desmontado */ }
    setTimeout(() => { state.jitsiLeaving = false; }, 600);
  }
  el.jitsiContainer.replaceChildren();
  el.jitsiCall.classList.remove('ready', 'failed', 'frame-loaded');
}

async function mountJitsi(conference) {
  if (!conference?.domain || !conference?.roomName || !state.voiceRoom) return;
  const roomAtStart = state.voiceRoom;
  unmountJitsi(false);
  state.callProvider = 'jitsi'; state.conference = conference;
  el.callStage.classList.add('jitsi-active');
  el.jitsiCall.classList.remove('hidden'); el.jitsiOpenExternal.classList.remove('hidden');
  setJitsiLoading('Preparando chamada estável…', 'Áudio, câmera e tela serão abertos com segurança dentro do Concord.');
  el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · preparando mídia…`;
  try {
    const JitsiMeetExternalAPI = await loadJitsiApi(conference.domain);
    if (state.voiceRoom !== roomAtStart || state.conference?.roomName !== conference.roomName) return;
    const apiInstance = new JitsiMeetExternalAPI(conference.domain, {
      roomName: conference.roomName,
      parentNode: el.jitsiContainer,
      width: '100%',
      height: '100%',
      lang: 'ptBR',
      userInfo: { displayName: state.name },
      onload: () => {
        if (state.voiceRoom !== roomAtStart) return;
        el.jitsiCall.classList.add('frame-loaded');
        el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · inicie a sala se necessário`;
      },
      configOverwrite: {
        prejoinPageEnabled: false,
        prejoinConfig: { enabled: false },
        disableDeepLinking: true,
        enableWelcomePage: false,
        startWithAudioMuted: !state.micEnabled,
        startWithVideoMuted: true,
        enableNoAudioDetection: true,
        enableNoisyMicDetection: true,
        disableInviteFunctions: true,
        p2p: { enabled: false },
        toolbarButtons: [
          'microphone', 'camera', 'desktop', 'hangup', 'fullscreen', 'tileview',
          'settings', 'videoquality', 'select-background', 'participants-pane', 'raisehand',
        ],
      },
      interfaceConfigOverwrite: {
        APP_NAME: 'Concord',
        NATIVE_APP_NAME: 'Concord',
        PROVIDER_NAME: 'Concord',
        MOBILE_APP_PROMO: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        TILE_VIEW_MAX_COLUMNS: 5,
      },
    });
    state.jitsiApi = apiInstance;
    const iframe = apiInstance.getIFrame?.();
    if (iframe) {
      iframe.title = `Chamada ${CHANNELS[state.voiceRoom]}`;
      iframe.allow = 'camera; microphone; display-capture; autoplay; clipboard-write; fullscreen';
    }
    apiInstance.addListener('videoConferenceJoined', (event) => {
      if (state.jitsiApi !== apiInstance) return;
      clearTimeout(state.jitsiTimer); state.jitsiTimer = null;
      state.jitsiReady = true; state.jitsiLocalParticipantId = event.id || '';
      el.jitsiCall.classList.add('ready'); el.jitsiCall.classList.remove('failed');
      el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · mídia conectada`;
      apiInstance.executeCommand('setNoiseSuppressionEnabled', { enabled: state.settings.noiseSuppression });
      applyJitsiDeafen(); updateControlStates(); postMediaState();
    });
    apiInstance.addListener('audioMuteStatusChanged', ({ muted }) => {
      const next = !muted;
      if (state.micEnabled !== next) playCue(next ? 'unmute' : 'mute');
      state.micEnabled = next; updateControlStates(); postMediaState();
    });
    apiInstance.addListener('videoMuteStatusChanged', ({ muted }) => {
      state.jitsiVideoEnabled = !muted; updateControlStates(); postMediaState();
    });
    apiInstance.addListener('screenSharingStatusChanged', ({ on }) => {
      state.jitsiScreenSharing = Boolean(on);
      if (on) playCue('screen');
      updateControlStates(); postMediaState();
    });
    apiInstance.addListener('participantJoined', ({ id }) => {
      if (state.deafened && id) apiInstance.executeCommand('setParticipantVolume', id, 0);
    });
    apiInstance.addListener('browserSupport', ({ supported }) => {
      if (!supported) toast('Este navegador não suporta a chamada estável. Use a opção Nova janela.', 'error');
    });
    apiInstance.addListener('micError', () => toast('O microfone foi bloqueado. Libere a permissão dentro da chamada.', 'error'));
    apiInstance.addListener('cameraError', () => toast('A câmera foi bloqueada. Confira a permissão do navegador.', 'error'));
    apiInstance.addListener('readyToClose', () => {
      if (!state.jitsiLeaving && state.voiceRoom) leaveCall(true);
    });
    state.jitsiTimer = setTimeout(() => {
      if (state.jitsiApi !== apiInstance || state.jitsiReady || el.jitsiCall.classList.contains('frame-loaded')) return;
      setJitsiLoading('A chamada demorou para abrir', 'Clique em Reabrir ou use Nova janela. O chat e os canais continuam funcionando.', true);
      el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · mídia ainda não abriu`;
    }, 25_000);
  } catch (error) {
    setJitsiLoading('Não foi possível abrir a chamada aqui', 'Use Nova janela para entrar diretamente ou clique em Reabrir.', true);
    el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · chamada indisponível`;
    toast(error.message || 'Não foi possível abrir a chamada estável.', 'error');
  }
}

function openJitsiInNewWindow() {
  const url = jitsiMeetingUrl();
  if (!url) return;
  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  if (!opened) toast('O navegador bloqueou a nova janela. Permita pop-ups para o Concord.', 'error');
}

async function joinCall(roomId) {
  if (state.voiceRoom === roomId) return;
  getAudioContext();
  if (state.voiceRoom) { unmountJitsi(true); closeAllPeers(); }
  try {
    const result = await api('/api/call', { action: 'join', voiceRoom: roomId, media: mediaState() });
    state.voiceRoom = roomId;
    state.conference = result.conference || null;
    state.callProvider = state.conference?.provider === 'jitsi' ? 'jitsi' : 'direct';
    state.callUsers = result.users || [];
    state.annotations.clear(); state.pinnedUserId = null; state.autoFocusedShareId = null;
    (result.annotations || []).forEach((snapshot) => state.annotations.set(snapshot.shareOwnerId, snapshot.items || []));
    state.knownCallUsers.clear(); state.callRosterReady = false;
    renderCall(); renderVoiceChannels(); updateControlStates();
    syncCallUsers(state.callUsers);
    if (state.callProvider === 'jitsi') mountJitsi(state.conference);
    else {
      try { await ensureMicrophone(); }
      catch (error) {
        state.micEnabled = false;
        toast(error.name === 'NotAllowedError' ? 'Permita o microfone no navegador para falar.' : 'Não consegui abrir seu microfone.', 'error');
      }
    }
    playCue('join');
    toast(`Você entrou em ${CHANNELS[roomId]}.`);
  } catch (error) { toast(error.message, 'error'); }
}

async function leaveCall(fromProvider = false) {
  if (!state.voiceRoom) return;
  const oldRoom = state.voiceRoom;
  playCue('leave');
  unmountJitsi(!fromProvider);
  try { await api('/api/call', { action: 'leave' }); } catch { /* limpar localmente mesmo assim */ }
  state.voiceRoom = null; state.callUsers = []; state.pinnedUserId = null; state.autoFocusedShareId = null;
  state.callProvider = null; state.conference = null;
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
  if (state.callProvider === 'jitsi') closeAllPeers();
  else for (const user of users) if (user.id !== state.clientId) createPeer(user.id);
  for (const id of state.peers.keys()) if (!validIds.has(id)) removePeer(id);
  renderCall(); renderMembers(); renderVoiceChannels();
}

function updateCallConnectionStatus() {
  if (!state.voiceRoom) return;
  const total = Math.max(1, state.callUsers.length);
  if (state.callProvider === 'jitsi') {
    el.callStatus.textContent = state.jitsiReady
      ? `${total} na chamada · mídia conectada`
      : el.jitsiCall.classList.contains('frame-loaded') ? `${total} na chamada · inicie a sala se necessário` : `${total} na chamada · preparando mídia…`;
    return;
  }
  const remoteCount = state.callUsers.filter((user) => user.id !== state.clientId).length;
  const connectedCount = [...state.peers.values()].filter((peer) => peer.pc.connectionState === 'connected').length;
  const failedCount = [...state.peers.values()].filter((peer) => peer.timedOut).length;
  if (!remoteCount) el.callStatus.textContent = `${total} na chamada`;
  else if (connectedCount === remoteCount) el.callStatus.textContent = `${total} na chamada · mídia conectada${state.settings.protectIp ? ' · IP protegido' : ''}`;
  else if (failedCount) el.callStatus.textContent = `${total} na chamada · não foi possível abrir a mídia · tente Reconectar`;
  else el.callStatus.textContent = `${total} na chamada · conectando áudio e vídeo…`;
}

function createPeer(userId) {
  if (!state.voiceRoom || userId === state.clientId || state.peers.has(userId)) return state.peers.get(userId);
  const pc = new RTCPeerConnection({
    iceServers: state.iceServers,
    iceCandidatePoolSize: 4,
    iceTransportPolicy: state.settings.protectIp ? 'relay' : 'all',
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
  });
  const peer = {
    id: userId, pc, polite: state.clientId.localeCompare(userId) > 0,
    initiator: state.clientId.localeCompare(userId) < 0,
    makingOffer: false, ignoreOffer: false, settingRemoteAnswer: false,
    pendingCandidates: [], remoteStreams: new Map(), description: {},
    audioNodes: [], reconnectAttempts: 0, disconnectTimer: null, retryTimer: null, rebuildTimer: null, timeoutTimer: null,
    negotiationQueued: false, recovering: false, relayEscalated: true, timedOut: false,
    autoRebuilds: state.peerRebuilds.get(userId) || 0,
  };
  state.peers.set(userId, peer);
  addLocalTracks(peer);

  pc.onicecandidate = ({ candidate }) => {
    sendSignal(userId, candidate ? { candidate } : { candidate: null, endOfCandidates: true }).catch(() => {});
  };
  pc.onnegotiationneeded = () => negotiatePeer(peer);
  pc.ontrack = (event) => handleRemoteTrack(peer, event);
  pc.onconnectionstatechange = () => {
    const status = pc.connectionState;
    if (status === 'connected') {
      peer.reconnectAttempts = 0; peer.timedOut = false; state.peerRebuilds.delete(userId);
      clearTimeout(peer.disconnectTimer); clearTimeout(peer.retryTimer); clearTimeout(peer.rebuildTimer); clearTimeout(peer.timeoutTimer);
      peer.disconnectTimer = null; peer.retryTimer = null; peer.rebuildTimer = null; peer.timeoutTimer = null;
      updateCallConnectionStatus();
    } else if (status === 'failed') {
      if (!peer.timeoutTimer) schedulePeerStages(peer);
      recoverPeer(peer);
    } else if (status === 'disconnected') {
      clearTimeout(peer.disconnectTimer);
      peer.disconnectTimer = setTimeout(() => {
        if (pc.connectionState === 'disconnected') {
          if (!peer.timeoutTimer) schedulePeerStages(peer);
          recoverPeer(peer);
        }
      }, 6000);
    }
    renderVideoGrid();
  };
  schedulePeerStages(peer);
  announceMediaDescription(userId);
  return peer;
}

async function negotiatePeer(peer, { iceRestart = false } = {}) {
  if (!state.peers.has(peer.id) || peer.pc.connectionState === 'closed') return;
  if (peer.makingOffer || peer.pc.signalingState !== 'stable') { peer.negotiationQueued = true; return; }
  if (!peer.initiator && !peer.pc.remoteDescription) return;
  peer.negotiationQueued = false;
  try {
    peer.makingOffer = true;
    if (iceRestart) await peer.pc.setLocalDescription(await peer.pc.createOffer({ iceRestart: true }));
    else await peer.pc.setLocalDescription();
    await sendSignal(peer.id, { description: peer.pc.localDescription });
    await sendMediaDescription(peer.id);
  } catch (error) { console.warn('negociação', error); }
  finally {
    peer.makingOffer = false;
    if (peer.negotiationQueued && peer.pc.signalingState === 'stable') setTimeout(() => negotiatePeer(peer), 0);
  }
}

function schedulePeerStages(peer) {
  clearTimeout(peer.retryTimer); clearTimeout(peer.rebuildTimer); clearTimeout(peer.timeoutTimer);
  peer.retryTimer = setTimeout(() => {
    peer.retryTimer = null;
    if (state.peers.get(peer.id) === peer && !['connected', 'closed'].includes(peer.pc.connectionState)) recoverPeer(peer);
  }, 8000);
  if (peer.autoRebuilds < 1) {
    peer.rebuildTimer = setTimeout(() => autoRebuildPeer(peer), 20_000);
  }
  peer.timeoutTimer = setTimeout(() => {
    if (state.peers.get(peer.id) !== peer || ['connected', 'closed'].includes(peer.pc.connectionState)) return;
    peer.timedOut = true; peer.recovering = false; updateCallConnectionStatus(); renderVideoGrid();
    if (Date.now() - state.mediaWarningAt > 20_000) {
      state.mediaWarningAt = Date.now();
      toast(state.relayServers.length ? 'A rede não concluiu a mídia mesmo após a recuperação. Use Reconectar para tentar de novo.' : 'A conexão direta falhou e não há retransmissão TURN disponível.', 'error');
    }
  }, peer.autoRebuilds ? 30_000 : 32_000);
}

function autoRebuildPeer(peer) {
  if (state.peers.get(peer.id) !== peer || ['connected', 'closed'].includes(peer.pc.connectionState)) return;
  const userId = peer.id;
  state.peerRebuilds.set(userId, peer.autoRebuilds + 1);
  el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · reconstruindo a rota de mídia…`;
  removePeer(userId, true);
  setTimeout(() => { if (state.voiceRoom && state.callUsers.some((user) => user.id === userId)) createPeer(userId); }, 350);
}

async function escalatePeerToRelay(peer, notifyRemote = true) {
  if (!state.peers.has(peer.id) || peer.relayEscalated || !state.relayServers.length) return;
  peer.relayEscalated = true;
  peer.pc.setConfiguration({ iceServers: state.iceServers, iceTransportPolicy: state.settings.protectIp ? 'relay' : 'all' });
  el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · tentando rota alternativa…`;
  if (notifyRemote) await sendSignal(peer.id, { enableRelay: true }).catch(() => {});
  if (peer.initiator) await negotiatePeer(peer, { iceRestart: true });
}

async function recoverPeer(peer) {
  if (!state.peers.has(peer.id) || !state.voiceRoom || peer.recovering) return;
  peer.recovering = true;
  el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · recuperando áudio e vídeo…`;
  try {
    if (!peer.reconnectAttempts) {
      peer.reconnectAttempts = 1;
      if (peer.initiator) await negotiatePeer(peer, { iceRestart: true });
      else await sendSignal(peer.id, { restartRequest: true });
    }
  } catch (error) { console.warn('reinício ICE', error); }
  finally { peer.recovering = false; }
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
    if (data.restartRequest) {
      if (peer.initiator) await negotiatePeer(peer, { iceRestart: true });
      return;
    }
    if (data.enableRelay) {
      await escalatePeerToRelay(peer, false);
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
      while (peer.pendingCandidates.length) await pc.addIceCandidate(peer.pendingCandidates.shift()).catch(() => {});
      if (data.description.type === 'offer') {
        await pc.setLocalDescription(await pc.createAnswer());
        await sendSignal(from, { description: pc.localDescription });
        await sendMediaDescription(from);
      }
      if (peer.negotiationQueued && pc.signalingState === 'stable') setTimeout(() => negotiatePeer(peer), 0);
      return;
    }
    if ('candidate' in data || data.endOfCandidates) {
      if (peer.ignoreOffer) return;
      const candidate = data.candidate || null;
      if (pc.remoteDescription) await pc.addIceCandidate(candidate).catch(() => {});
      else peer.pendingCandidates.push(candidate);
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
  audio.autoplay = true; audio.playsInline = true; audio.srcObject = audioStream; audio.className = 'remote-call-audio';
  document.body.append(audio);
  const entry = { trackId: track.id, audio, source: null, gain: null, analyser: null };
  const context = getAudioContext();
  if (context) {
    try {
      entry.source = context.createMediaStreamSource(audioStream);
      entry.analyser = context.createAnalyser(); entry.analyser.fftSize = 512;
      entry.source.connect(entry.analyser);
      state.audioMonitors.set(peer.id, entry.analyser);
      startVoiceMeterLoop();
    } catch { /* usa elemento de áudio abaixo */ }
  }
  peer.audioNodes.push(entry);
  setOutputDevice(state.settings.speakerId);
  applyRemoteAudio(peer.id);
  audio.play().catch(() => {
    toast('Clique em qualquer lugar para liberar o áudio da chamada.', 'error');
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
      node.audio.muted = silent; node.audio.volume = Math.min(1, gainValue); node.audio.play().catch(() => {});
    }
  }
}

function removePeer(userId, preserveRebuild = false) {
  const peer = state.peers.get(userId); if (!peer) return;
  clearTimeout(peer.disconnectTimer); clearTimeout(peer.retryTimer); clearTimeout(peer.rebuildTimer); clearTimeout(peer.timeoutTimer);
  peer.audioNodes.forEach((node) => {
    try { node.source?.disconnect(); node.gain?.disconnect(); } catch { /* já removido */ }
    node.audio.srcObject = null; node.audio.remove();
  });
  state.audioMonitors.delete(userId); state.speaking.delete(userId);
  peer.pc.ontrack = null; peer.pc.onicecandidate = null; peer.pc.close();
  state.peers.delete(userId); if (!preserveRebuild) state.peerRebuilds.delete(userId); renderVideoGrid();
}

function closeAllPeers() {
  for (const id of [...state.peers.keys()]) removePeer(id);
}

async function rebuildPeerConnections() {
  if (!state.voiceRoom) return;
  if (state.callProvider === 'jitsi') {
    mountJitsi(state.conference);
    return;
  }
  await loadIceServers();
  const peers = state.callUsers.filter((user) => user.id !== state.clientId).map((user) => user.id);
  closeAllPeers(); peers.forEach(createPeer);
  el.callStatus.textContent = `${Math.max(1, state.callUsers.length)} na chamada · refazendo áudio e vídeo…`;
}

async function toggleMicrophone() {
  if (state.callProvider === 'jitsi') {
    if (!state.jitsiApi) { toast('A chamada ainda está abrindo.'); return; }
    state.jitsiApi.executeCommand('toggleAudio');
    return;
  }
  if (!state.audioStream) {
    try { await ensureMicrophone(); state.micEnabled = true; }
    catch { toast('Não consegui acessar o microfone. Confira a permissão.', 'error'); return; }
  } else state.micEnabled = !state.micEnabled;
  state.audioStream.getAudioTracks().forEach((track) => { track.enabled = state.micEnabled; });
  playCue(state.micEnabled ? 'unmute' : 'mute');
  updateControlStates(); postMediaState();
}

async function toggleDeafen() {
  state.deafened = !state.deafened;
  playCue(state.deafened ? 'deafen' : 'undeafen');
  if (state.callProvider === 'jitsi') await applyJitsiDeafen();
  else applyRemoteAudio();
  updateControlStates(); postMediaState();
}

async function toggleCamera() {
  if (state.callProvider === 'jitsi') {
    if (!state.jitsiApi) { toast('A chamada ainda está abrindo.'); return; }
    state.jitsiApi.executeCommand('toggleVideo');
    return;
  }
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
  if (state.callProvider === 'jitsi') {
    if (!state.jitsiApi) { toast('A chamada ainda está abrindo.'); return; }
    state.jitsiApi.executeCommand('toggleShareScreen');
    return;
  }
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
    if (window.concordDesktop?.isDesktop && state.settings.desktopOverlay && state.desktopOverlayAvailable) {
      await window.concordDesktop.startAnnotationOverlay().catch(() => false);
      syncDesktopAnnotationOverlay();
    }
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
        const selected = await window.concordDesktop.selectDisplaySource(source.id).catch(() => ({ accepted: false, overlayAvailable: false }));
        state.desktopOverlayAvailable = selected?.overlayAvailable === true;
        finish(selected?.accepted === true);
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
  window.concordDesktop?.stopAnnotationOverlay?.().catch(() => {}); state.desktopOverlayAvailable = false;
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

function makeVideoTile({ key, user, stream, screen = false, local = false, hiddenVideo = false, connectionState = 'connected' }) {
  const tile = document.createElement('article');
  tile.className = `video-tile${screen ? ' screen' : ''}`;
  tile.dataset.key = key; tile.dataset.userId = user.id;
  if (state.speaking.has(user.id)) tile.classList.add('speaking');
  if (hiddenVideo) tile.classList.add('video-hidden');
  const video = document.createElement('video'); video.autoplay = true; video.playsInline = true; video.muted = local;
  if (stream) {
    video.srcObject = stream;
    const reveal = () => { if (local || (connectionState === 'connected' && video.readyState >= 2)) tile.classList.add('has-video'); };
    video.addEventListener('loadeddata', reveal); video.addEventListener('playing', reveal);
    if (local) tile.classList.add('has-video');
    video.play().then(reveal).catch(() => {});
  }
  const fallback = document.createElement('div'); fallback.className = 'tile-fallback';
  if (!local && connectionState !== 'connected') {
    const failed = connectionState === 'failed';
    const waiting = document.createElement('div'); waiting.className = 'screen-wait'; waiting.innerHTML = `${iconSvg(failed ? 'refresh' : (screen ? 'screen' : 'refresh'))}<strong>${failed ? 'Não foi possível conectar' : 'Abrindo áudio e vídeo…'}</strong><small>${failed ? 'A tentativa terminou. Você pode tentar novamente.' : 'A conexão de mídia ainda não foi concluída.'}</small>`;
    const retry = document.createElement('button'); retry.className = 'toolbar-button'; retry.innerHTML = `${iconSvg('refresh')}<span>Reconectar</span>`; retry.addEventListener('click', (event) => { event.stopPropagation(); rebuildPeerConnections(); }); waiting.append(retry); fallback.append(waiting);
  } else if (screen && !stream) {
    const waiting = document.createElement('div'); waiting.className = 'screen-wait'; waiting.innerHTML = `${iconSvg('screen')}<strong>Conectando à tela…</strong><small>O Concord está recuperando a transmissão.</small>`; fallback.append(waiting);
  } else if (screen && stream) {
    const waiting = document.createElement('div'); waiting.className = 'screen-wait'; waiting.innerHTML = `${iconSvg('screen')}<strong>Recebendo a tela…</strong><small>Aguardando os primeiros quadros.</small>`; fallback.append(waiting);
  } else fallback.append(avatarNode(user));
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
      tiles.push(makeVideoTile({ key: `camera-${user.id}`, user, stream: streams.camera, hiddenVideo: preference.hideVideo, connectionState: peer.timedOut ? 'failed' : peer.pc.connectionState }));
    }
    if (user.media?.screenSharing || streams.screen) {
      tiles.push(makeVideoTile({ key: `screen-${user.id}`, user, stream: streams.screen, screen: true, connectionState: peer.timedOut ? 'failed' : peer.pc.connectionState }));
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
  el.layoutGrid.classList.toggle('active', state.layout === 'grid');
  el.layoutFocus.classList.toggle('active', state.layout === 'focus');
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
    await publishAnnotationItem(shareOwnerId, item);
  };
  if (enabled) {
    canvas.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (state.drawTool === 'text') { createTextAnnotation(canvas, shareOwnerId, pointFromEvent(event)); return; }
      if (state.drawTool === 'pointer') {
        const point = pointFromEvent(event);
        publishAnnotationItem(shareOwnerId, { id: crypto.randomUUID(), tool: 'pointer', x: point.x, y: point.y, color: state.drawColor, width: state.drawSize });
        return;
      }
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
    await publishAnnotationItem(ownerId, item);
  };
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); finish(true); }
    if (event.key === 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(Boolean(input.value.trim())), { once: true });
  canvas.parentElement.append(input); input.focus();
}

async function publishAnnotationItem(ownerId, item) {
  addAnnotationItem(ownerId, item, true);
  try { await api('/api/annotation', { action: 'item', shareOwnerId: ownerId, item }); }
  catch (error) { removeAnnotationItem(ownerId, item.id); toast(error.message, 'error'); }
}

function addAnnotationItem(ownerId, item, own = false) {
  const items = state.annotations.get(ownerId) || [];
  if (!items.some((existing) => existing.id === item.id)) items.push(item);
  if (items.length > 500) items.shift(); state.annotations.set(ownerId, items);
  if (own && !state.ownAnnotationIds.some((entry) => entry.id === item.id)) state.ownAnnotationIds.push({ ownerId, id: item.id });
  document.querySelectorAll(`canvas[data-share-owner="${CSS.escape(ownerId)}"]`).forEach((canvas) => redrawCanvas(canvas, ownerId));
  if (ownerId === state.clientId) syncDesktopAnnotationOverlay();
}

function removeAnnotationItem(ownerId, itemId) {
  const items = state.annotations.get(ownerId) || [];
  state.annotations.set(ownerId, items.filter((item) => item.id !== itemId));
  state.ownAnnotationIds = state.ownAnnotationIds.filter((entry) => entry.id !== itemId);
  document.querySelectorAll(`canvas[data-share-owner="${CSS.escape(ownerId)}"]`).forEach((canvas) => redrawCanvas(canvas, ownerId));
  if (ownerId === state.clientId) syncDesktopAnnotationOverlay();
}

function syncDesktopAnnotationOverlay() {
  if (!window.concordDesktop?.updateAnnotationOverlay || !state.screenStream || !state.settings.desktopOverlay || !state.desktopOverlayAvailable) return;
  window.concordDesktop.updateAnnotationOverlay({ items: state.annotations.get(state.clientId) || [] }).catch(() => {});
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
    if (item.tool === 'pointer') {
      const x = drawBox.x + item.x * drawBox.width; const y = drawBox.y + item.y * drawBox.height;
      const radius = Math.max(13, item.width * 3) * ratio;
      context.strokeStyle = item.color; context.lineWidth = Math.max(2, item.width / 2) * ratio;
      context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.moveTo(x - radius * 1.45, y); context.lineTo(x + radius * 1.45, y); context.moveTo(x, y - radius * 1.45); context.lineTo(x, y + radius * 1.45); context.stroke();
      continue;
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
    if (ownerId === state.clientId) syncDesktopAnnotationOverlay();
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
  if (state.callProvider === 'jitsi') {
    toast('As anotações sobre a tela não estão disponíveis no modo de chamada estável.');
    return;
  }
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
  const hosted = active && state.callProvider === 'jitsi';
  el.callStage.classList.toggle('jitsi-active', hosted);
  el.jitsiCall.classList.toggle('hidden', !hosted);
  el.jitsiOpenExternal.classList.toggle('hidden', !hosted);
  if (!active) return;
  el.callTitle.textContent = CHANNELS[state.voiceRoom]; el.connectedRoom.textContent = CHANNELS[state.voiceRoom];
  updateCallConnectionStatus();
  updateSelfUI();
  if (!hosted) renderVideoGrid();
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
      if (userId === state.clientId) {
        el.settingsMeter.style.width = `${level}%`;
        el.micLevelValue.textContent = `${Math.round(level)}%`;
        el.settingsMeter.parentElement.classList.toggle('speaking', speaking);
      }
      if (changed) {
        document.querySelectorAll(`[data-user-id="${CSS.escape(userId)}"]`).forEach((node) => node.classList.toggle('speaking', speaking));
      }
    }
  };
  loop();
}

function updateProcessingStatus(track = state.audioStream?.getAudioTracks()[0]) {
  if (state.callProvider === 'jitsi' && state.voiceRoom) {
    el.noiseStatus.textContent = state.settings.noiseSuppression ? 'Ativo na chamada estável' : 'Desligado';
    el.echoStatus.textContent = 'Gerenciado pela chamada estável';
    el.gainStatus.textContent = 'Gerenciado pela chamada estável';
    return;
  }
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
  if (state.callProvider === 'jitsi' && state.jitsiApi) {
    state.jitsiApi.executeCommand('setNoiseSuppressionEnabled', { enabled: state.settings.noiseSuppression });
    updateProcessingStatus();
    toast('A configuração foi enviada para a chamada estável.');
    return;
  }
  const track = state.audioStream?.getAudioTracks()[0];
  if (!track) { updateProcessingStatus(); return; }
  try {
    await ensureMicrophone(true);
    toast('Processamento aplicado ao microfone.');
  } catch {
    toast('Seu microfone não aceitou uma das opções de processamento.', 'error');
    updateProcessingStatus(track);
  }
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
  const hosted = state.callProvider === 'jitsi';
  const hasMic = state.micEnabled && (hosted || Boolean(state.audioStream?.getAudioTracks()[0]));
  [el.barMic, el.callMic].forEach((button) => {
    button.classList.toggle('off', !hasMic); button.innerHTML = iconSvg(hasMic ? 'mic' : 'mic-off');
    button.title = hasMic ? 'Desativar microfone' : 'Ativar microfone';
  });
  [el.barDeafen, el.callDeafen].forEach((button) => {
    button.classList.toggle('off', state.deafened); button.innerHTML = iconSvg(state.deafened ? 'volume-off' : 'headphones');
    button.title = state.deafened ? 'Ouvir novamente' : 'Silenciar fone';
  });
  const cameraEnabled = hosted ? state.jitsiVideoEnabled : Boolean(state.cameraStream);
  const screenEnabled = hosted ? state.jitsiScreenSharing : Boolean(state.screenStream);
  el.callCamera.classList.toggle('active', cameraEnabled);
  el.callCamera.innerHTML = iconSvg(cameraEnabled ? 'video' : 'video-off');
  el.callScreen.classList.toggle('active', screenEnabled);
  updateAnnotationPanel();
  el.participantVideoButton.classList.toggle('active', state.settings.participantVideo);
  el.selfViewButton.classList.toggle('active', state.settings.selfView);
  el.screenPreviewButton.classList.toggle('active', state.settings.screenPreview);
  el.layoutGrid.classList.toggle('active', state.layout === 'grid');
  el.layoutFocus.classList.toggle('active', state.layout === 'focus');
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
  el.sensitivityThreshold.style.left = `${state.settings.sensitivity}%`;
  el.noiseSuppression.checked = state.settings.noiseSuppression; el.echoCancellation.checked = state.settings.echoCancellation; el.autoGain.checked = state.settings.autoGainControl;
  el.settingParticipantVideo.checked = state.settings.participantVideo; el.settingSelfView.checked = state.settings.selfView;
  el.settingScreenPreview.checked = state.settings.screenPreview; el.settingAnnotations.checked = state.settings.annotations; el.settingAutoFocus.checked = state.settings.autoFocus;
  el.protectIp.checked = state.settings.protectIp; el.callSounds.checked = state.settings.callSounds;
  el.soundVolume.value = state.settings.soundVolume; el.soundVolumeValue.value = `${state.settings.soundVolume}%`;
  el.desktopOverlay.checked = state.settings.desktopOverlay;
  el.desktopOverlay.disabled = !window.concordDesktop?.isDesktop;
  el.desktopOverlay.parentElement.classList.toggle('setting-unavailable', !window.concordDesktop?.isDesktop);
  el.desktopOverlayStatus.textContent = window.concordDesktop?.isDesktop
    ? 'Ao compartilhar a tela inteira, mostra as marcações sobre ela sem bloquear seus cliques.'
    : 'O navegador não pode desenhar sobre outros programas. Esta opção funciona no aplicativo.';
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
    state.jitsiApi?.executeCommand('displayName', state.name);
    updateSelfUI(); renderPresence(); renderVideoGrid();
    el.profileFeedback.textContent = 'Perfil salvo.'; setTimeout(() => { el.profileFeedback.textContent = ''; }, 2200);
  } catch (error) { toast(error.message, 'error'); }
}

function showContextMenu(event, userId) {
  if (!state.voiceRoom || userId === state.clientId || !state.callUsers.some((user) => user.id === userId)) return;
  event.preventDefault(); const user = getUser(userId); const preference = userPreference(userId);
  el.contextMenu.replaceChildren();
  const head = document.createElement('div'); head.className = 'context-head'; head.textContent = user.name; el.contextMenu.append(head);
  if (state.callProvider === 'jitsi') {
    const manage = contextAction('Abrir controles da chamada', 'members', () => state.jitsiApi?.executeCommand('toggleParticipantsPane', true));
    el.contextMenu.append(manage);
    el.contextMenu.classList.remove('hidden');
    const hostedX = Math.min(event.clientX, innerWidth - 245); const hostedY = Math.min(event.clientY, innerHeight - el.contextMenu.offsetHeight - 8);
    el.contextMenu.style.left = `${Math.max(5, hostedX)}px`; el.contextMenu.style.top = `${Math.max(5, hostedY)}px`;
    return;
  }
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
el.messages.addEventListener('scroll', () => {
  if (!isNearMessageBottom()) return;
  state.unreadMessages = 0; updateNewMessagesButton();
});
el.newMessages.addEventListener('click', () => {
  el.messages.scrollTo({ top: el.messages.scrollHeight, behavior: 'smooth' });
  state.unreadMessages = 0; updateNewMessagesButton();
});
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
el.reconnectMedia.addEventListener('click', rebuildPeerConnections);
el.jitsiOpenExternal.addEventListener('click', openJitsiInNewWindow);
el.leaveCall.addEventListener('click', () => leaveCall()); el.disconnectVoice.addEventListener('click', () => leaveCall());
el.layoutButton.addEventListener('click', (event) => {
  event.stopPropagation(); el.viewMenu.classList.toggle('hidden');
});
el.layoutGrid.addEventListener('click', () => {
  if (state.callProvider === 'jitsi' && state.jitsiApi) state.jitsiApi.executeCommand('setTileView', true);
  state.layout = 'grid'; state.pinnedUserId = null; state.autoFocusedShareId = null;
  applyLayoutState(); el.viewMenu.classList.add('hidden');
});
el.layoutFocus.addEventListener('click', () => {
  if (state.callProvider === 'jitsi' && state.jitsiApi) state.jitsiApi.executeCommand('setTileView', false);
  state.layout = 'focus'; applyLayoutState(); el.viewMenu.classList.add('hidden');
});
el.fullscreenButton.addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await el.callStage.requestFullscreen(); } catch { toast('Tela cheia não foi liberada pelo navegador.', 'error'); }
});
el.participantVideoButton.addEventListener('click', () => {
  state.settings.participantVideo = !state.settings.participantVideo; saveSettings(); syncSettingsControls(); updateControlStates(); renderVideoGrid();
});
el.selfViewButton.addEventListener('click', () => {
  state.settings.selfView = !state.settings.selfView; saveSettings(); syncSettingsControls(); updateControlStates(); renderVideoGrid();
});
el.screenPreviewButton.addEventListener('click', () => {
  state.settings.screenPreview = !state.settings.screenPreview; saveSettings(); syncSettingsControls(); updateControlStates(); renderVideoGrid();
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
  el.viewMenu.classList.add('hidden');
  if (!el.settingsOverlay.classList.contains('hidden')) closeSettings();
  else if (state.annotationPanelOpen) closeAnnotationPanel();
});

el.avatarInput.addEventListener('change', () => prepareAvatar(el.avatarInput.files?.[0]));
el.removeAvatar.addEventListener('click', () => { state.pendingAvatar = ''; updateSelfUI(); el.profileFeedback.textContent = 'Foto removida. Clique em Salvar perfil.'; });
el.saveProfile.addEventListener('click', saveProfile);

el.masterVolume.addEventListener('input', () => {
  state.settings.masterVolume = Number(el.masterVolume.value); el.masterVolumeValue.value = `${state.settings.masterVolume}%`;
  saveSettings();
  if (state.callProvider === 'jitsi') applyJitsiDeafen(); else applyRemoteAudio();
  el.micLoopbackAudio.volume = Math.min(1, state.settings.masterVolume / 100);
});
el.micSensitivity.addEventListener('input', () => {
  state.settings.sensitivity = Number(el.micSensitivity.value); el.sensitivityValue.value = `${state.settings.sensitivity}%`;
  el.sensitivityThreshold.style.left = `${state.settings.sensitivity}%`; saveSettings();
});
el.inputDevice.addEventListener('change', async () => {
  state.settings.microphoneId = el.inputDevice.value; saveSettings();
  if (state.callProvider === 'jitsi') { toast('Troque o microfone pelas configurações dentro da chamada.'); return; }
  try { await ensureMicrophone(true); postMediaState(); } catch { toast('Não consegui trocar o microfone.', 'error'); }
});
el.outputDevice.addEventListener('change', () => {
  state.settings.speakerId = el.outputDevice.value; saveSettings();
  if (state.callProvider === 'jitsi') toast('Troque a saída de áudio pelas configurações dentro da chamada.');
  else setOutputDevice(state.settings.speakerId);
});
el.cameraDevice.addEventListener('change', async () => {
  state.settings.cameraId = el.cameraDevice.value; saveSettings();
  if (state.callProvider === 'jitsi') { toast('Troque a câmera pelas configurações dentro da chamada.'); return; }
  if (state.cameraStream) { stopCamera(); await toggleCamera(); }
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
el.desktopOverlay.addEventListener('change', async () => {
  state.settings.desktopOverlay = el.desktopOverlay.checked; saveSettings();
  if (!state.screenStream || !window.concordDesktop?.isDesktop) return;
  if (state.settings.desktopOverlay && state.desktopOverlayAvailable) {
    await window.concordDesktop.startAnnotationOverlay().catch(() => false); syncDesktopAnnotationOverlay();
  } else window.concordDesktop.stopAnnotationOverlay?.().catch(() => {});
});

const processSettings = [
  [el.noiseSuppression, 'noiseSuppression'], [el.echoCancellation, 'echoCancellation'], [el.autoGain, 'autoGainControl'],
];
processSettings.forEach(([control, key]) => control.addEventListener('change', async () => {
  state.settings[key] = control.checked; saveSettings();
  processSettings.forEach(([item]) => { item.disabled = true; });
  try { await applyAudioProcessing(); } finally { processSettings.forEach(([item]) => { item.disabled = false; }); }
}));

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
  if (!event.target.closest('#view-menu') && !event.target.closest('#layout-button')) el.viewMenu.classList.add('hidden');
  for (const peer of state.peers.values()) for (const node of peer.audioNodes) if (!node.gain) node.audio.play().catch(() => {});
});
window.addEventListener('resize', () => {
  document.querySelectorAll('.annotation-canvas').forEach((canvas) => redrawCanvas(canvas, canvas.dataset.shareOwner));
});
document.addEventListener('fullscreenchange', () => el.fullscreenButton.classList.toggle('active', Boolean(document.fullscreenElement)));
navigator.mediaDevices?.addEventListener?.('devicechange', refreshDevices);
window.addEventListener('storage', (event) => {
  if (DEV_MULTITAB || event.key !== ACTIVE_TAB_KEY || !state.tabActive) return;
  const owner = readActiveTab();
  if (owner?.tabId !== state.tabId && owner?.expiresAt > Date.now()) enterTabStandby();
});
window.addEventListener('beforeunload', () => {
  if (DEV_MULTITAB) return;
  const owner = readActiveTab();
  if (owner?.tabId === state.tabId) localStorage.removeItem(ACTIVE_TAB_KEY);
});

applyAppearance(); syncSettingsControls(); updateSelfUI(); updateControlStates(); updateProcessingStatus();
state.annotationsEnabled = state.settings.annotations;
activateTab(false);
