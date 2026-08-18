const channels = {
  geral: { name: 'geral', symbol: '#', description: 'Conversa livre para todo mundo', kind: 'text' },
  projetos: { name: 'projetos', symbol: '#', description: 'Ideias, trabalhos e coisas em construção', kind: 'text' },
  cafe: { name: 'café', symbol: '#', description: 'Pausa rápida e conversa descontraída', kind: 'text' },
  lobby: { name: 'Lobby', symbol: '◖', description: 'Sala de voz aberta para a comunidade', kind: 'voice' },
  jogos: { name: 'Jogatina', symbol: '◖', description: 'Chamada para jogar com a galera', kind: 'voice' },
  musica: { name: 'Música & chill', symbol: '◖', description: 'Um canto tranquilo para ouvir e conversar', kind: 'voice' },
};

const defaultSettings = {
  microphoneId: 'default',
  speakerId: 'default',
  cameraId: 'default',
  sensitivity: 55,
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: true,
  shareQuality: '720',
  autoFocusShares: true,
  defaultLayout: 'grid',
  accent: 'purple',
  compactMode: false,
};

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('concord-settings') || '{}');
    return { ...defaultSettings, ...saved };
  } catch {
    return { ...defaultSettings };
  }
}

const migratedClientId = sessionStorage.getItem('concord-client-id')
  || sessionStorage.getItem('lume-client-id')
  || crypto.randomUUID();
const migratedName = localStorage.getItem('concord-name')
  || localStorage.getItem('lume-name')
  || '';

const state = {
  clientId: migratedClientId,
  name: migratedName,
  room: 'geral',
  eventSource: null,
  users: [],
  callUsers: [],
  inCall: false,
  localStream: null,
  screenStream: null,
  peers: new Map(),
  minimized: false,
  pendingCallJoin: false,
  settings: loadSettings(),
  callLayout: 'grid',
  pinnedUserId: null,
  autoFocusedShareId: null,
  speakingUsers: new Set(),
  audioContext: null,
  audioMonitors: new Map(),
  voiceFrame: null,
  micTestStream: null,
  micTestActive: false,
};
sessionStorage.setItem('concord-client-id', state.clientId);

const elementIds = [
  'app', 'welcome-modal', 'welcome-form', 'name-input', 'profile-name', 'profile-avatar',
  'profile-status', 'room-symbol', 'room-name', 'room-description', 'messages', 'message-form',
  'message-input', 'network-status', 'members-list', 'member-count', 'members-panel', 'toggle-members',
  'call-stage', 'call-title', 'video-grid', 'mic-button', 'camera-button', 'screen-button', 'leave-button',
  'connection-panel', 'connected-room', 'disconnect-compact', 'mic-compact', 'settings-button',
  'copy-invite', 'minimize-call', 'toast-region', 'source-modal', 'source-grid', 'close-source-modal',
  'layout-button', 'fullscreen-button', 'settings-modal', 'close-settings', 'settings-avatar',
  'settings-preview-name', 'settings-name-input', 'save-profile', 'name-settings-hint', 'microphone-select',
  'speaker-select', 'camera-select', 'share-quality', 'sensitivity-range', 'sensitivity-value',
  'noise-suppression', 'echo-cancellation', 'auto-gain', 'auto-focus-shares', 'compact-mode',
  'mic-test-button', 'mic-test-status', 'mic-level-fill', 'reset-settings',
];
const elements = Object.fromEntries(elementIds.map((id) => [
  id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
  document.getElementById(id),
]));

function initials(name) {
  return String(name || 'Visitante').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function colorFor(value) {
  let hash = 0;
  for (const char of value) hash = char.charCodeAt(0) + ((hash << 5) - hash);
  const hues = [258, 214, 174, 330, 195, 32];
  return hues[Math.abs(hash) % hues.length];
}

function toast(message, kind = '') {
  const item = document.createElement('div');
  item.className = `toast ${kind}`;
  item.textContent = message;
  elements.toastRegion.append(item);
  setTimeout(() => item.remove(), 3500);
}

async function api(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room: state.room, clientId: state.clientId, ...body }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Não foi possível concluir a ação.');
  return result;
}

function connectEvents() {
  if (state.eventSource) state.eventSource.close();
  const query = new URLSearchParams({ room: state.room, clientId: state.clientId, name: state.name });
  const source = new EventSource(`/api/events?${query}`);
  state.eventSource = source;
  elements.networkStatus.classList.remove('offline');
  elements.networkStatus.lastChild.textContent = ' Conectando…';

  source.onopen = () => {
    elements.networkStatus.classList.remove('offline');
    elements.networkStatus.lastChild.textContent = ' Conectado';
    if (state.inCall) {
      api('/api/call', { action: 'join' })
        .then(() => ensurePeerConnections())
        .then(() => announceMediaState())
        .catch(() => {});
    }
    if (state.pendingCallJoin) {
      state.pendingCallJoin = false;
      joinCall();
    }
  };

  source.onerror = () => {
    elements.networkStatus.classList.add('offline');
    elements.networkStatus.lastChild.textContent = ' Reconectando…';
  };

  source.onmessage = async (event) => {
    const payload = JSON.parse(event.data);
    if (payload.type === 'hello') {
      renderMessages(payload.messages || []);
      state.users = payload.users || [];
      renderMembers();
    } else if (payload.type === 'presence') {
      state.users = payload.users || [];
      renderMembers();
    } else if (payload.type === 'message') {
      appendMessage(payload.message);
    } else if (payload.type === 'call-state') {
      state.callUsers = payload.users || [];
      renderMembers();
      renderCallRoster();
      if (state.inCall) await ensurePeerConnections();
    } else if (payload.type === 'signal') {
      await handleSignal(payload.from, payload.data);
    } else if (payload.type === 'peer-left') {
      removePeer(payload.id);
    } else if (payload.type === 'server-restarting') {
      toast('O servidor está sendo atualizado. Reconectando…');
    }
  };
}

function renderMessages(messages) {
  elements.messages.replaceChildren();
  if (!messages.length) renderEmptyState();
  messages.forEach(appendMessage);
}

function renderEmptyState() {
  const channel = channels[state.room];
  const wrapper = document.createElement('div');
  wrapper.className = 'empty-state';
  wrapper.innerHTML = '<div class="empty-icon"></div><h3></h3><p></p>';
  wrapper.querySelector('.empty-icon').textContent = channel.symbol;
  wrapper.querySelector('h3').textContent = `Bem-vindo a ${channel.symbol}${channel.name}`;
  wrapper.querySelector('p').textContent = channel.kind === 'voice'
    ? 'Este é o começo desta sala. Entre na chamada e convide alguém para testar voz, vídeo e compartilhamento de tela.'
    : 'Este é o começo deste canal. Mande a primeira mensagem e faça a conversa acontecer.';
  elements.messages.append(wrapper);
}

function appendMessage(message) {
  elements.messages.querySelector('.empty-state')?.remove();
  const article = document.createElement('article');
  article.className = 'message';
  const hue = colorFor(message.clientId || message.name);
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.style.background = `linear-gradient(145deg, hsl(${hue} 58% 54%), hsl(${hue} 48% 36%))`;
  avatar.textContent = initials(message.name);

  const copy = document.createElement('div');
  copy.className = 'message-copy';
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  const author = document.createElement('strong');
  author.textContent = message.name;
  const time = document.createElement('time');
  time.dateTime = message.createdAt;
  time.textContent = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(message.createdAt));
  const text = document.createElement('p');
  text.textContent = message.text;
  meta.append(author, time);
  copy.append(meta, text);
  article.append(avatar, copy);
  elements.messages.append(article);
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function renderMembers() {
  elements.memberCount.textContent = state.users.length;
  elements.membersList.replaceChildren();
  [...state.users].sort((a, b) => Number(b.inCall) - Number(a.inCall) || a.name.localeCompare(b.name)).forEach((user) => {
    const row = document.createElement('div');
    row.className = `member${state.speakingUsers.has(user.id) ? ' speaking' : ''}`;
    row.dataset.userId = user.id;
    const hue = colorFor(user.id);
    row.innerHTML = `
      <div class="avatar"></div>
      <div class="member-copy"><strong></strong><span></span></div>
      ${user.inCall ? '<div class="call-indicator" title="Na chamada">◖</div>' : ''}
    `;
    const avatar = row.querySelector('.avatar');
    avatar.textContent = initials(user.name);
    avatar.style.background = `linear-gradient(145deg, hsl(${hue} 58% 54%), hsl(${hue} 48% 36%))`;
    row.querySelector('strong').textContent = user.id === state.clientId ? `${user.name} (você)` : user.name;
    row.querySelector('.member-copy span').textContent = state.speakingUsers.has(user.id)
      ? 'Falando'
      : user.inCall ? 'Na chamada' : 'Disponível';
    elements.membersList.append(row);
  });
}

function switchRoom(roomId, joinVoice = false) {
  if (roomId === state.room && (!joinVoice || state.inCall)) return;
  const previousRoom = state.room;
  const finish = async () => {
    if (state.inCall) await leaveCall(false, previousRoom);
    state.room = roomId;
    document.querySelectorAll('.channel').forEach((button) => button.classList.toggle('active', button.dataset.room === roomId));
    const channel = channels[roomId];
    elements.roomSymbol.textContent = channel.symbol;
    elements.roomName.textContent = channel.name;
    elements.roomDescription.textContent = channel.description;
    elements.messageInput.placeholder = `Conversar em ${channel.symbol}${channel.name}`;
    elements.messages.replaceChildren();
    renderEmptyState();
    state.pendingCallJoin = joinVoice;
    connectEvents();
  };
  finish().catch((error) => toast(error.message, 'error'));
}

function selectedDeviceConstraint(id) {
  return id && id !== 'default' ? { exact: id } : undefined;
}

function audioConstraints() {
  return {
    deviceId: selectedDeviceConstraint(state.settings.microphoneId),
    noiseSuppression: state.settings.noiseSuppression,
    echoCancellation: state.settings.echoCancellation,
    autoGainControl: state.settings.autoGainControl,
  };
}

function cameraConstraints() {
  return {
    deviceId: selectedDeviceConstraint(state.settings.cameraId),
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 30 },
  };
}

function shareConstraints() {
  const sizes = {
    720: { width: 1280, height: 720, frameRate: 30 },
    1080: { width: 1920, height: 1080, frameRate: 30 },
    1440: { width: 2560, height: 1440, frameRate: 30 },
  };
  return sizes[state.settings.shareQuality] || sizes[720];
}

async function joinCall() {
  if (state.inCall) return;
  if (!navigator.mediaDevices?.getUserMedia) {
    toast('Seu navegador não oferece acesso ao microfone.', 'error');
    return;
  }
  try {
    state.localStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints(), video: false });
    state.inCall = true;
    state.callLayout = state.settings.defaultLayout;
    await api('/api/call', { action: 'join' });
    await monitorAudio(state.clientId, state.localStream);
    elements.callStage.classList.remove('is-hidden');
    elements.connectionPanel.classList.remove('is-hidden');
    elements.connectedRoom.textContent = channels[state.room].name;
    elements.profileStatus.textContent = 'Na chamada';
    elements.callTitle.textContent = channels[state.room].name;
    updateCallLayout();
    renderCallRoster();
    refreshDevices().catch(() => {});
    toast(`Você entrou em ${channels[state.room].name}.`);
  } catch (error) {
    state.inCall = false;
    state.localStream?.getTracks().forEach((track) => track.stop());
    state.localStream = null;
    toast(error.name === 'NotAllowedError' ? 'Permita o acesso ao microfone para entrar.' : error.message, 'error');
  }
}

async function leaveCall(notify = true, roomOverride = state.room) {
  if (!state.inCall) return;
  const oldRoom = state.room;
  if (roomOverride !== oldRoom) state.room = roomOverride;
  try { await api('/api/call', { action: 'leave' }); } catch { /* a conexão pode já ter fechado */ }
  state.room = oldRoom;
  state.inCall = false;
  const shared = state.screenStream;
  state.screenStream = null;
  shared?.getTracks().forEach((track) => track.stop());
  state.localStream?.getTracks().forEach((track) => track.stop());
  state.localStream = null;
  for (const peerId of [...state.peers.keys()]) removePeer(peerId);
  stopAudioMonitor(state.clientId);
  state.speakingUsers.clear();
  state.pinnedUserId = null;
  state.autoFocusedShareId = null;
  elements.callStage.classList.add('is-hidden');
  elements.connectionPanel.classList.add('is-hidden');
  elements.profileStatus.textContent = 'Disponível';
  elements.micButton.classList.remove('disabled');
  elements.micCompact.classList.remove('disabled');
  elements.cameraButton.classList.remove('active');
  elements.screenButton.classList.remove('active');
  elements.screenButton.querySelector('small').textContent = 'Compartilhar';
  document.querySelector('.profile-bar')?.classList.remove('speaking');
  if (document.fullscreenElement && elements.callStage.contains(document.fullscreenElement)) document.exitFullscreen().catch(() => {});
  if (notify) toast('Você saiu da chamada.');
}

function currentVideoTrack() {
  return state.screenStream?.getVideoTracks()[0] || state.localStream?.getVideoTracks()[0] || null;
}

function createPeer(peerId) {
  if (state.peers.has(peerId)) return state.peers.get(peerId);
  const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  const peer = {
    pc,
    stream: new MediaStream(),
    negotiating: false,
    pendingCandidates: [],
    media: { micEnabled: true, cameraEnabled: false, screenSharing: false },
  };
  state.peers.set(peerId, peer);
  state.localStream?.getAudioTracks().forEach((track) => pc.addTrack(track, state.localStream));
  const videoTrack = currentVideoTrack();
  if (videoTrack) pc.addTrack(videoTrack, state.screenStream || state.localStream);

  pc.onicecandidate = ({ candidate }) => {
    if (candidate) sendSignal(peerId, { candidate }).catch(() => {});
  };
  pc.ontrack = ({ track, streams }) => {
    if (streams[0]) peer.stream = streams[0];
    else if (!peer.stream.getTracks().some((item) => item.id === track.id)) peer.stream.addTrack(track);
    if (track.kind === 'audio') monitorAudio(peerId, peer.stream).catch(() => {});
    track.addEventListener('ended', () => renderCallRoster(), { once: true });
    renderCallRoster();
  };
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') announceMediaStateTo(peerId).catch(() => {});
    if (['failed', 'closed'].includes(pc.connectionState)) removePeer(peerId);
    renderCallRoster();
  };
  pc.onnegotiationneeded = async () => {
    if (!state.inCall || peer.negotiating) return;
    try {
      peer.negotiating = true;
      await pc.setLocalDescription(await pc.createOffer());
      await sendSignal(peerId, { description: pc.localDescription });
    } catch (error) {
      console.warn('Falha ao negociar mídia', error);
    } finally {
      peer.negotiating = false;
    }
  };
  return peer;
}

async function ensurePeerConnections() {
  for (const user of state.callUsers) {
    if (user.id === state.clientId) continue;
    if (!state.peers.has(user.id)) createPeer(user.id);
  }
  for (const peerId of [...state.peers.keys()]) {
    if (!state.callUsers.some((user) => user.id === peerId)) removePeer(peerId);
  }
}

async function sendSignal(target, data) {
  await api('/api/signal', { target, data });
}

function localMediaState() {
  const microphone = state.localStream?.getAudioTracks()[0];
  const camera = state.localStream?.getVideoTracks()[0];
  return {
    micEnabled: Boolean(microphone?.enabled && microphone.readyState === 'live'),
    cameraEnabled: Boolean(camera?.enabled && camera.readyState === 'live'),
    screenSharing: Boolean(state.screenStream),
  };
}

async function announceMediaStateTo(target) {
  if (!state.inCall) return;
  await sendSignal(target, { mediaState: localMediaState() });
}

function announceMediaState() {
  for (const peerId of state.peers.keys()) announceMediaStateTo(peerId).catch(() => {});
}

async function handleSignal(from, data) {
  if (!state.inCall) return;
  const peer = createPeer(from);
  const pc = peer.pc;
  try {
    if (data.mediaState) {
      peer.media = { ...peer.media, ...data.mediaState };
      renderCallRoster();
      return;
    }
    if (data.description) {
      const offerCollision = data.description.type === 'offer' && (peer.negotiating || pc.signalingState !== 'stable');
      const polite = state.clientId > from;
      if (offerCollision && !polite) return;
      if (offerCollision) await pc.setLocalDescription({ type: 'rollback' });
      await pc.setRemoteDescription(data.description);
      while (peer.pendingCandidates.length) await pc.addIceCandidate(peer.pendingCandidates.shift());
      if (data.description.type === 'offer') {
        await pc.setLocalDescription(await pc.createAnswer());
        await sendSignal(from, { description: pc.localDescription });
      }
      announceMediaStateTo(from).catch(() => {});
    } else if (data.candidate) {
      if (pc.remoteDescription) await pc.addIceCandidate(data.candidate);
      else peer.pendingCandidates.push(data.candidate);
    }
  } catch (error) {
    console.warn('Falha na sinalização', error);
  }
}

function removePeer(peerId) {
  const peer = state.peers.get(peerId);
  if (!peer) return;
  peer.pc.close();
  peer.stream.getTracks().forEach((track) => track.stop());
  state.peers.delete(peerId);
  stopAudioMonitor(peerId);
  state.speakingUsers.delete(peerId);
  if (state.pinnedUserId === peerId) state.pinnedUserId = null;
  renderCallRoster();
}

async function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!state.audioContext) state.audioContext = new AudioContextClass();
  if (state.audioContext.state === 'suspended') await state.audioContext.resume();
  return state.audioContext;
}

async function monitorAudio(userId, stream) {
  const track = stream?.getAudioTracks().find((item) => item.readyState === 'live');
  if (!track) return;
  const existing = state.audioMonitors.get(userId);
  if (existing?.trackId === track.id) return;
  stopAudioMonitor(userId);
  const context = await ensureAudioContext();
  if (!context) return;
  const audioStream = new MediaStream([track]);
  const source = context.createMediaStreamSource(audioStream);
  const analyser = context.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = .55;
  source.connect(analyser);
  state.audioMonitors.set(userId, {
    trackId: track.id,
    track,
    source,
    analyser,
    data: new Uint8Array(analyser.fftSize),
    level: 0,
  });
  startVoiceLoop();
}

function stopAudioMonitor(userId) {
  const monitor = state.audioMonitors.get(userId);
  if (!monitor) return;
  try { monitor.source.disconnect(); } catch { /* já desconectado */ }
  state.audioMonitors.delete(userId);
  setSpeaking(userId, false);
}

function startVoiceLoop() {
  if (state.voiceFrame) return;
  const sample = () => {
    state.voiceFrame = null;
    const threshold = .082 - (Number(state.settings.sensitivity) / 100) * .068;
    for (const [userId, monitor] of state.audioMonitors) {
      monitor.analyser.getByteTimeDomainData(monitor.data);
      let sum = 0;
      for (const sampleValue of monitor.data) {
        const normalized = (sampleValue - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / monitor.data.length);
      monitor.level = monitor.level * .62 + rms * .38;
      const trackEnabled = monitor.track.readyState === 'live' && monitor.track.enabled;
      if (userId === '__mic_test') {
        if (state.micTestActive) updateMicMeter(monitor.level);
      } else {
        setSpeaking(userId, trackEnabled && monitor.level > threshold);
        if (userId === state.clientId && state.micTestActive) updateMicMeter(monitor.level);
      }
    }
    if (state.audioMonitors.size) state.voiceFrame = requestAnimationFrame(sample);
  };
  state.voiceFrame = requestAnimationFrame(sample);
}

function updateMicMeter(level) {
  const percent = Math.min(100, Math.max(2, level * 850));
  elements.micLevelFill.style.width = `${percent}%`;
  elements.micTestStatus.textContent = percent > 34 ? 'Ouvindo sua voz — tudo certo' : 'Fale para conferir seu volume';
}

function setSpeaking(userId, speaking) {
  const changed = speaking ? !state.speakingUsers.has(userId) : state.speakingUsers.has(userId);
  if (speaking) state.speakingUsers.add(userId);
  else state.speakingUsers.delete(userId);
  if (!changed) return;
  document.querySelectorAll('[data-user-id]').forEach((node) => {
    if (node.dataset.userId !== userId) return;
    node.classList.toggle('speaking', speaking);
    const status = node.matches('.member') ? node.querySelector('.member-copy span') : null;
    if (status) {
      const user = state.users.find((item) => item.id === userId);
      status.textContent = speaking ? 'Falando' : user?.inCall ? 'Na chamada' : 'Disponível';
    }
  });
  if (userId === state.clientId) document.querySelector('.profile-bar')?.classList.toggle('speaking', speaking);
}

function participantList() {
  const self = {
    id: state.clientId,
    name: state.name,
    self: true,
    stream: state.screenStream || state.localStream,
    media: localMediaState(),
  };
  const others = state.callUsers.filter((user) => user.id !== state.clientId).map((user) => {
    const peer = state.peers.get(user.id);
    return { ...user, self: false, stream: peer?.stream, media: peer?.media || {} };
  });
  return [self, ...others];
}

function renderCallRoster() {
  if (!state.inCall) return;
  const participants = participantList();
  const activeShare = participants.find((participant) => participant.media.screenSharing);
  if (!activeShare) state.autoFocusedShareId = null;
  if (activeShare && state.settings.autoFocusShares && state.autoFocusedShareId !== activeShare.id) {
    state.autoFocusedShareId = activeShare.id;
    state.pinnedUserId = activeShare.id;
    state.callLayout = 'focus';
  }
  if (!participants.some((participant) => participant.id === state.pinnedUserId)) state.pinnedUserId = null;
  if (state.callLayout === 'focus' && !state.pinnedUserId) state.pinnedUserId = activeShare?.id || participants[0]?.id || null;
  elements.videoGrid.replaceChildren();
  elements.videoGrid.classList.toggle('layout-focus', state.callLayout === 'focus');
  participants.forEach((participant) => renderVideoTile(participant));
  updateCallLayout();
}

function applyOutputDevice(media) {
  if (!media?.setSinkId || !state.settings.speakerId || state.settings.speakerId === 'default') return;
  media.setSinkId(state.settings.speakerId).catch(() => {});
}

function renderVideoTile(user) {
  const stream = user.stream;
  const tile = document.createElement('div');
  const sharing = Boolean(user.media?.screenSharing);
  const muted = user.media?.micEnabled === false;
  tile.className = [
    'video-tile',
    sharing ? 'screen' : '',
    state.speakingUsers.has(user.id) ? 'speaking' : '',
    state.pinnedUserId === user.id ? 'pinned' : '',
  ].filter(Boolean).join(' ');
  tile.dataset.userId = user.id;
  tile.tabIndex = 0;

  const videoTrack = stream?.getVideoTracks().find((track) => track.readyState === 'live');
  const audioTrack = stream?.getAudioTracks().find((track) => track.readyState === 'live');
  const avatar = document.createElement('div');
  avatar.className = 'tile-avatar';
  avatar.textContent = initials(user.name);
  if (videoTrack && (user.self ? (sharing || videoTrack.enabled) : true)) {
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = Boolean(user.self);
    video.srcObject = stream;
    applyOutputDevice(video);
    tile.append(video);
  } else if (audioTrack && !user.self) {
    const audio = document.createElement('audio');
    audio.autoplay = true;
    audio.srcObject = stream;
    applyOutputDevice(audio);
    tile.append(audio);
  }
  tile.append(avatar);

  const label = document.createElement('div');
  label.className = 'tile-label';
  const name = document.createElement('span');
  name.textContent = user.self ? `${user.name} (você)` : user.name;
  label.append(name);
  if (sharing) {
    const badge = document.createElement('span');
    badge.className = 'screen-badge';
    badge.textContent = 'TELA';
    label.append(badge);
  }
  tile.append(label);

  const actions = document.createElement('div');
  actions.className = 'tile-actions';
  const focusButton = document.createElement('button');
  focusButton.type = 'button';
  focusButton.title = state.pinnedUserId === user.id ? 'Voltar para grade' : 'Colocar em destaque';
  focusButton.setAttribute('aria-label', focusButton.title);
  focusButton.textContent = '⌖';
  focusButton.classList.toggle('active', state.pinnedUserId === user.id && state.callLayout === 'focus');
  focusButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleParticipantFocus(user.id);
  });
  const fullButton = document.createElement('button');
  fullButton.type = 'button';
  fullButton.title = 'Ver em tela cheia';
  fullButton.setAttribute('aria-label', fullButton.title);
  fullButton.textContent = '⛶';
  fullButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleFullscreen(tile);
  });
  actions.append(focusButton, fullButton);
  tile.append(actions);
  if (muted) {
    const badge = document.createElement('div');
    badge.className = 'muted-badge';
    badge.title = 'Microfone desligado';
    badge.textContent = '×';
    tile.append(badge);
  }
  tile.addEventListener('dblclick', () => toggleFullscreen(tile));
  elements.videoGrid.append(tile);
}

function toggleParticipantFocus(userId) {
  if (state.callLayout === 'focus' && state.pinnedUserId === userId) {
    state.callLayout = 'grid';
    state.pinnedUserId = null;
  } else {
    state.callLayout = 'focus';
    state.pinnedUserId = userId;
  }
  state.autoFocusedShareId = participantList().find((item) => item.media.screenSharing)?.id || null;
  renderCallRoster();
}

function updateCallLayout() {
  const isFocus = state.callLayout === 'focus';
  elements.layoutButton.classList.toggle('active', isFocus);
  elements.layoutButton.querySelector('span').textContent = isFocus ? '▰' : '▦';
  elements.layoutButton.querySelector('small').textContent = isFocus ? 'Destaque' : 'Grade';
}

async function toggleFullscreen(target = elements.callStage) {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await target.requestFullscreen();
  } catch {
    toast('Não foi possível abrir a tela cheia.', 'error');
  }
}

function toggleMic() {
  if (!state.inCall) return;
  const tracks = state.localStream?.getAudioTracks() || [];
  const nextEnabled = !tracks.some((track) => track.enabled);
  tracks.forEach((track) => { track.enabled = nextEnabled; });
  elements.micButton.classList.toggle('disabled', !nextEnabled);
  elements.micCompact.classList.toggle('disabled', !nextEnabled);
  if (!nextEnabled) setSpeaking(state.clientId, false);
  announceMediaState();
  renderCallRoster();
}

async function toggleCamera() {
  if (!state.inCall) return;
  let track = state.localStream?.getVideoTracks()[0];
  try {
    if (!track) {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: cameraConstraints() });
      track = cameraStream.getVideoTracks()[0];
      state.localStream.addTrack(track);
      if (!state.screenStream) {
        for (const { pc } of state.peers.values()) {
          const sender = pc.getSenders().find((item) => item.track?.kind === 'video');
          if (sender) await sender.replaceTrack(track);
          else pc.addTrack(track, state.localStream);
        }
      }
      track.addEventListener('ended', () => {
        elements.cameraButton.classList.remove('active');
        announceMediaState();
        renderCallRoster();
      }, { once: true });
    } else {
      track.enabled = !track.enabled;
    }
    elements.cameraButton.classList.toggle('active', track.enabled);
    announceMediaState();
    renderCallRoster();
    refreshDevices().catch(() => {});
  } catch {
    toast('Não foi possível acessar sua câmera.', 'error');
  }
}

async function toggleScreenShare() {
  if (!state.inCall) return;
  if (state.screenStream) {
    await stopScreenShare();
    return;
  }
  try {
    const desktop = window.concordDesktop || window.lumeDesktop;
    if (desktop?.isDesktop) {
      const sourceId = await chooseDesktopSource(desktop);
      if (!sourceId) return;
      const selected = await desktop.selectDisplaySource(sourceId);
      if (!selected) throw new Error('A fonte de compartilhamento não pôde ser selecionada.');
    }
    const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    const screenTrack = display.getVideoTracks()[0];
    const quality = shareConstraints();
    await screenTrack.applyConstraints({
      width: { ideal: quality.width },
      height: { ideal: quality.height },
      frameRate: { ideal: quality.frameRate, max: quality.frameRate },
    }).catch(() => {});
    state.screenStream = display;
    for (const { pc } of state.peers.values()) {
      const sender = pc.getSenders().find((item) => item.track?.kind === 'video');
      if (sender) await sender.replaceTrack(screenTrack);
      else pc.addTrack(screenTrack, display);
    }
    screenTrack.addEventListener('ended', () => stopScreenShare(), { once: true });
    elements.screenButton.classList.add('active');
    elements.screenButton.querySelector('small').textContent = 'Parar tela';
    announceMediaState();
    renderCallRoster();
    toast('Sua tela está sendo compartilhada.');
  } catch (error) {
    if (error.name !== 'NotAllowedError') toast('Não foi possível compartilhar a tela.', 'error');
  }
}

function chooseDesktopSource(desktop) {
  return new Promise(async (resolve) => {
    try {
      const sources = await desktop.getDisplaySources();
      if (!sources.length) {
        resolve(null);
        toast('Nenhuma tela ou janela foi encontrada.', 'error');
        return;
      }
      elements.sourceGrid.replaceChildren();
      const finish = (sourceId = null) => {
        elements.sourceModal.classList.add('is-hidden');
        elements.closeSourceModal.onclick = null;
        resolve(sourceId);
      };
      sources.forEach((source) => {
        const button = document.createElement('button');
        button.className = 'source-option';
        const thumbnail = document.createElement('img');
        thumbnail.src = source.thumbnail;
        thumbnail.alt = '';
        const name = document.createElement('span');
        name.textContent = source.name;
        button.append(thumbnail, name);
        button.addEventListener('click', () => finish(source.id), { once: true });
        elements.sourceGrid.append(button);
      });
      elements.closeSourceModal.onclick = () => finish();
      elements.sourceModal.classList.remove('is-hidden');
    } catch {
      resolve(null);
      toast('Não foi possível listar as telas disponíveis.', 'error');
    }
  });
}

async function stopScreenShare() {
  if (!state.screenStream) return;
  const shared = state.screenStream;
  state.screenStream = null;
  const cameraTrack = state.localStream?.getVideoTracks()[0] || null;
  for (const { pc } of state.peers.values()) {
    const sender = pc.getSenders().find((item) => item.track?.kind === 'video');
    if (sender) await sender.replaceTrack(cameraTrack);
  }
  shared.getTracks().forEach((track) => track.stop());
  state.autoFocusedShareId = null;
  elements.screenButton.classList.remove('active');
  elements.screenButton.querySelector('small').textContent = 'Compartilhar';
  announceMediaState();
  renderCallRoster();
}

function saveSettings() {
  localStorage.setItem('concord-settings', JSON.stringify(state.settings));
  applyAppearance();
}

function applyAppearance() {
  document.body.dataset.accent = state.settings.accent;
  document.body.classList.toggle('compact', state.settings.compactMode);
  document.querySelectorAll('.accent-choice').forEach((button) => {
    button.classList.toggle('active', button.dataset.accent === state.settings.accent);
  });
  document.querySelectorAll('.layout-choice').forEach((button) => {
    button.classList.toggle('active', button.dataset.layoutChoice === state.settings.defaultLayout);
  });
}

function fillSettingsForm() {
  elements.settingsNameInput.value = state.name;
  elements.settingsPreviewName.textContent = state.name || 'Visitante';
  elements.settingsAvatar.textContent = initials(state.name);
  elements.settingsNameInput.disabled = state.inCall;
  elements.saveProfile.disabled = state.inCall;
  elements.nameSettingsHint.textContent = state.inCall
    ? 'Saia da chamada para trocar seu nome.'
    : 'O nome é mostrado para todo mundo na sala.';
  elements.sensitivityRange.value = state.settings.sensitivity;
  elements.sensitivityValue.value = `${state.settings.sensitivity}%`;
  elements.noiseSuppression.checked = state.settings.noiseSuppression;
  elements.echoCancellation.checked = state.settings.echoCancellation;
  elements.autoGain.checked = state.settings.autoGainControl;
  elements.autoFocusShares.checked = state.settings.autoFocusShares;
  elements.compactMode.checked = state.settings.compactMode;
  elements.shareQuality.value = state.settings.shareQuality;
  applyAppearance();
}

async function openSettings() {
  fillSettingsForm();
  elements.settingsModal.classList.remove('is-hidden');
  await refreshDevices().catch(() => {});
}

function closeSettings() {
  stopMicTest();
  elements.settingsModal.classList.add('is-hidden');
}

function populateDeviceSelect(select, devices, kind, savedId, fallbackLabel) {
  const filtered = devices.filter((device) => device.kind === kind);
  select.replaceChildren();
  const fallback = document.createElement('option');
  fallback.value = 'default';
  fallback.textContent = `Padrão do sistema — ${fallbackLabel}`;
  select.append(fallback);
  filtered.forEach((device, index) => {
    if (device.deviceId === 'default') return;
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.textContent = device.label || `${fallbackLabel} ${index + 1}`;
    select.append(option);
  });
  select.value = [...select.options].some((option) => option.value === savedId) ? savedId : 'default';
}

async function refreshDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) return;
  const devices = await navigator.mediaDevices.enumerateDevices();
  populateDeviceSelect(elements.microphoneSelect, devices, 'audioinput', state.settings.microphoneId, 'Microfone');
  populateDeviceSelect(elements.speakerSelect, devices, 'audiooutput', state.settings.speakerId, 'Alto-falante');
  populateDeviceSelect(elements.cameraSelect, devices, 'videoinput', state.settings.cameraId, 'Câmera');
}

async function replaceMicrophoneTrack() {
  if (!state.inCall || !state.localStream) return;
  try {
    const replacementStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints(), video: false });
    const replacement = replacementStream.getAudioTracks()[0];
    const previous = state.localStream.getAudioTracks()[0];
    for (const { pc } of state.peers.values()) {
      const sender = pc.getSenders().find((item) => item.track?.kind === 'audio');
      if (sender) await sender.replaceTrack(replacement);
    }
    if (previous) {
      state.localStream.removeTrack(previous);
      previous.stop();
    }
    state.localStream.addTrack(replacement);
    await monitorAudio(state.clientId, state.localStream);
    announceMediaState();
  } catch {
    toast('Não foi possível trocar o microfone.', 'error');
  }
}

async function replaceCameraTrack() {
  const current = state.localStream?.getVideoTracks()[0];
  if (!state.inCall || !current?.enabled) return;
  try {
    const replacementStream = await navigator.mediaDevices.getUserMedia({ video: cameraConstraints() });
    const replacement = replacementStream.getVideoTracks()[0];
    state.localStream.removeTrack(current);
    current.stop();
    state.localStream.addTrack(replacement);
    if (!state.screenStream) {
      for (const { pc } of state.peers.values()) {
        const sender = pc.getSenders().find((item) => item.track?.kind === 'video');
        if (sender) await sender.replaceTrack(replacement);
      }
    }
    renderCallRoster();
  } catch {
    toast('Não foi possível trocar a câmera.', 'error');
  }
}

async function startMicTest() {
  if (state.micTestActive) {
    stopMicTest();
    return;
  }
  try {
    state.micTestActive = true;
    elements.micTestButton.textContent = 'Parar';
    elements.micTestStatus.textContent = 'Ouvindo seu microfone…';
    if (state.inCall && state.localStream) {
      await monitorAudio(state.clientId, state.localStream);
    } else {
      state.micTestStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints(), video: false });
      await monitorAudio('__mic_test', state.micTestStream);
    }
    refreshDevices().catch(() => {});
  } catch {
    state.micTestActive = false;
    elements.micTestButton.textContent = 'Testar';
    elements.micTestStatus.textContent = 'Não foi possível acessar o microfone';
    toast('Permita o microfone para fazer o teste.', 'error');
  }
}

function stopMicTest() {
  if (!state.micTestActive && !state.micTestStream) return;
  state.micTestActive = false;
  state.micTestStream?.getTracks().forEach((track) => track.stop());
  state.micTestStream = null;
  stopAudioMonitor('__mic_test');
  elements.micLevelFill.style.width = '0%';
  elements.micTestButton.textContent = 'Testar';
  elements.micTestStatus.textContent = 'Fale para conferir seu volume';
}

function updateName() {
  if (state.inCall) return;
  const nextName = elements.settingsNameInput.value.trim().slice(0, 32);
  if (!nextName) {
    toast('Digite um nome para salvar.', 'error');
    return;
  }
  const changed = nextName !== state.name;
  state.name = nextName;
  localStorage.setItem('concord-name', state.name);
  elements.profileName.textContent = state.name;
  elements.profileAvatar.textContent = initials(state.name);
  elements.settingsPreviewName.textContent = state.name;
  elements.settingsAvatar.textContent = initials(state.name);
  if (changed) connectEvents();
  toast('Perfil atualizado.');
}

function startApp() {
  elements.welcomeModal.classList.add('is-hidden');
  elements.app.classList.remove('is-hidden');
  elements.profileName.textContent = state.name;
  elements.profileAvatar.textContent = initials(state.name);
  elements.nameInput.value = state.name;
  applyAppearance();
  connectEvents();
}

elements.welcomeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.name = elements.nameInput.value.trim().slice(0, 32);
  if (!state.name) return;
  localStorage.setItem('concord-name', state.name);
  startApp();
});

document.querySelectorAll('.channel').forEach((button) => {
  button.addEventListener('click', () => switchRoom(button.dataset.room, button.dataset.kind === 'voice'));
});

elements.messageForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = elements.messageInput.value.trim();
  if (!text) return;
  elements.messageInput.value = '';
  elements.messageInput.style.height = 'auto';
  try { await api('/api/message', { text }); } catch (error) { toast(error.message, 'error'); }
});

elements.messageInput.addEventListener('input', () => {
  elements.messageInput.style.height = 'auto';
  elements.messageInput.style.height = `${Math.min(elements.messageInput.scrollHeight, 120)}px`;
});
elements.messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    elements.messageForm.requestSubmit();
  }
});

elements.micButton.addEventListener('click', toggleMic);
elements.micCompact.addEventListener('click', toggleMic);
elements.cameraButton.addEventListener('click', toggleCamera);
elements.screenButton.addEventListener('click', toggleScreenShare);
elements.leaveButton.addEventListener('click', () => leaveCall());
elements.disconnectCompact.addEventListener('click', () => leaveCall());
elements.minimizeCall.addEventListener('click', () => {
  state.minimized = !state.minimized;
  elements.callStage.classList.toggle('minimized', state.minimized);
  elements.minimizeCall.textContent = state.minimized ? '⌄' : '⌃';
});
elements.layoutButton.addEventListener('click', () => {
  state.callLayout = state.callLayout === 'grid' ? 'focus' : 'grid';
  if (state.callLayout === 'focus' && !state.pinnedUserId) state.pinnedUserId = participantList()[0]?.id || null;
  if (state.callLayout === 'grid') state.pinnedUserId = null;
  state.autoFocusedShareId = participantList().find((item) => item.media.screenSharing)?.id || null;
  renderCallRoster();
});
elements.fullscreenButton.addEventListener('click', () => toggleFullscreen(elements.callStage));
elements.toggleMembers.addEventListener('click', () => elements.membersPanel.classList.toggle('open'));
elements.copyInvite.addEventListener('click', async () => {
  await navigator.clipboard.writeText(location.href);
  toast('Convite copiado.');
});
elements.settingsButton.addEventListener('click', openSettings);
elements.closeSettings.addEventListener('click', closeSettings);
elements.saveProfile.addEventListener('click', updateName);
elements.settingsNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') updateName();
});
elements.micTestButton.addEventListener('click', startMicTest);

document.querySelectorAll('.settings-tab[data-settings-target]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.settings-tab[data-settings-target]').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('.settings-section').forEach((section) => section.classList.toggle('active', section.id === button.dataset.settingsTarget));
  });
});

elements.sensitivityRange.addEventListener('input', () => {
  state.settings.sensitivity = Number(elements.sensitivityRange.value);
  elements.sensitivityValue.value = `${state.settings.sensitivity}%`;
  saveSettings();
});

[
  [elements.noiseSuppression, 'noiseSuppression'],
  [elements.echoCancellation, 'echoCancellation'],
  [elements.autoGain, 'autoGainControl'],
].forEach(([input, key]) => {
  input.addEventListener('change', async () => {
    state.settings[key] = input.checked;
    saveSettings();
    if (state.inCall) await replaceMicrophoneTrack();
    else if (state.micTestActive) stopMicTest();
  });
});

elements.microphoneSelect.addEventListener('change', async () => {
  state.settings.microphoneId = elements.microphoneSelect.value;
  saveSettings();
  if (state.inCall) await replaceMicrophoneTrack();
  else if (state.micTestActive) stopMicTest();
});
elements.speakerSelect.addEventListener('change', () => {
  state.settings.speakerId = elements.speakerSelect.value;
  saveSettings();
  document.querySelectorAll('.video-tile video, .video-tile audio').forEach(applyOutputDevice);
});
elements.cameraSelect.addEventListener('change', async () => {
  state.settings.cameraId = elements.cameraSelect.value;
  saveSettings();
  await replaceCameraTrack();
});
elements.shareQuality.addEventListener('change', () => {
  state.settings.shareQuality = elements.shareQuality.value;
  saveSettings();
});
elements.autoFocusShares.addEventListener('change', () => {
  state.settings.autoFocusShares = elements.autoFocusShares.checked;
  saveSettings();
});
elements.compactMode.addEventListener('change', () => {
  state.settings.compactMode = elements.compactMode.checked;
  saveSettings();
});

document.querySelectorAll('.layout-choice').forEach((button) => {
  button.addEventListener('click', () => {
    state.settings.defaultLayout = button.dataset.layoutChoice;
    state.callLayout = state.settings.defaultLayout;
    saveSettings();
    renderCallRoster();
  });
});
document.querySelectorAll('.accent-choice').forEach((button) => {
  button.addEventListener('click', () => {
    state.settings.accent = button.dataset.accent;
    saveSettings();
  });
});

elements.resetSettings.addEventListener('click', async () => {
  state.settings = { ...defaultSettings };
  saveSettings();
  fillSettingsForm();
  await refreshDevices().catch(() => {});
  if (state.inCall) await replaceMicrophoneTrack();
  toast('Configurações restauradas.');
});

document.addEventListener('fullscreenchange', () => {
  const active = Boolean(document.fullscreenElement);
  elements.fullscreenButton.classList.toggle('active', active);
  elements.fullscreenButton.querySelector('small').textContent = active ? 'Sair da tela' : 'Tela cheia';
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !elements.settingsModal.classList.contains('is-hidden') && !document.fullscreenElement) closeSettings();
});

window.addEventListener('beforeunload', () => {
  state.eventSource?.close();
  state.localStream?.getTracks().forEach((track) => track.stop());
  state.screenStream?.getTracks().forEach((track) => track.stop());
  state.micTestStream?.getTracks().forEach((track) => track.stop());
  state.audioContext?.close().catch(() => {});
});

applyAppearance();
fillSettingsForm();
if (state.name) startApp();
else setTimeout(() => elements.nameInput.focus(), 100);

setInterval(() => {
  if (state.eventSource?.readyState === EventSource.OPEN) {
    fetch('/api/health', { cache: 'no-store' }).catch(() => {});
  }
}, 4 * 60 * 1000);

