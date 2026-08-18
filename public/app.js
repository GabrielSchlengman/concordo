const channels = {
  geral: { name: 'geral', symbol: '#', description: 'Conversa livre para todo mundo', kind: 'text' },
  projetos: { name: 'projetos', symbol: '#', description: 'Ideias, trabalhos e coisas em construção', kind: 'text' },
  cafe: { name: 'café', symbol: '#', description: 'Pausa rápida e conversa descontraída', kind: 'text' },
  lobby: { name: 'Lobby', symbol: '◖', description: 'Sala de voz aberta para a comunidade', kind: 'voice' },
  jogos: { name: 'Jogatina', symbol: '◖', description: 'Chamada para jogar com a galera', kind: 'voice' },
  musica: { name: 'Música & chill', symbol: '◖', description: 'Um canto tranquilo para ouvir e conversar', kind: 'voice' },
};

const state = {
  clientId: sessionStorage.getItem('lume-client-id') || crypto.randomUUID(),
  name: localStorage.getItem('lume-name') || '',
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
};
sessionStorage.setItem('lume-client-id', state.clientId);

const elements = Object.fromEntries([
  'app', 'welcome-modal', 'welcome-form', 'name-input', 'profile-name', 'profile-avatar',
  'profile-status', 'room-symbol', 'room-name', 'room-description', 'messages', 'message-form',
  'message-input', 'network-status', 'members-list', 'member-count', 'members-panel', 'toggle-members',
  'call-stage', 'call-title', 'video-grid', 'mic-button', 'camera-button', 'screen-button', 'leave-button',
  'connection-panel', 'connected-room', 'disconnect-compact', 'mic-compact', 'settings-button',
  'copy-invite', 'minimize-call', 'toast-region'
  , 'source-modal', 'source-grid', 'close-source-modal'
].map((id) => [id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), document.getElementById(id)]));

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
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
  wrapper.innerHTML = `
    <div class="empty-icon"></div>
    <h3></h3>
    <p></p>
  `;
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
    row.className = 'member';
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
    row.querySelector('.member-copy span').textContent = user.inCall ? 'Na chamada' : 'Disponível';
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

async function joinCall() {
  if (state.inCall) return;
  if (!navigator.mediaDevices?.getUserMedia) {
    toast('Seu navegador não oferece acesso ao microfone.', 'error');
    return;
  }

  try {
    try {
      state.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const videoTrack = state.localStream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = false;
    } catch {
      state.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }
    state.inCall = true;
    await api('/api/call', { action: 'join' });
    elements.callStage.classList.remove('is-hidden');
    elements.connectionPanel.classList.remove('is-hidden');
    elements.connectedRoom.textContent = channels[state.room].name;
    elements.profileStatus.textContent = 'Na chamada';
    elements.callTitle.textContent = channels[state.room].name;
    renderCallRoster();
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
  try { await api('/api/call', { action: 'leave' }); } catch { /* conexão pode já ter fechado */ }
  state.room = oldRoom;
  state.inCall = false;
  state.screenStream?.getTracks().forEach((track) => track.stop());
  state.localStream?.getTracks().forEach((track) => track.stop());
  state.screenStream = null;
  state.localStream = null;
  for (const peerId of [...state.peers.keys()]) removePeer(peerId);
  elements.callStage.classList.add('is-hidden');
  elements.connectionPanel.classList.add('is-hidden');
  elements.profileStatus.textContent = 'Disponível';
  elements.micButton.classList.remove('disabled');
  elements.cameraButton.classList.remove('active');
  elements.screenButton.classList.remove('active');
  if (notify) toast('Você saiu da chamada.');
}

function createPeer(peerId) {
  if (state.peers.has(peerId)) return state.peers.get(peerId);
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });
  const peer = { pc, stream: new MediaStream(), negotiating: false };
  state.peers.set(peerId, peer);

  state.localStream?.getTracks().forEach((track) => pc.addTrack(track, state.localStream));

  pc.onicecandidate = ({ candidate }) => {
    if (candidate) sendSignal(peerId, { candidate }).catch(() => {});
  };
  pc.ontrack = ({ track, streams }) => {
    peer.stream = streams[0] || peer.stream;
    if (!streams[0]) peer.stream.addTrack(track);
    renderCallRoster();
  };
  pc.onconnectionstatechange = () => {
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

async function handleSignal(from, data) {
  if (!state.inCall) return;
  const peer = createPeer(from);
  const pc = peer.pc;
  try {
    if (data.description) {
      const offerCollision = data.description.type === 'offer' && (peer.negotiating || pc.signalingState !== 'stable');
      const polite = state.clientId > from;
      if (offerCollision && !polite) return;
      if (offerCollision) await pc.setLocalDescription({ type: 'rollback' });
      await pc.setRemoteDescription(data.description);
      if (data.description.type === 'offer') {
        await pc.setLocalDescription(await pc.createAnswer());
        await sendSignal(from, { description: pc.localDescription });
      }
    } else if (data.candidate) {
      await pc.addIceCandidate(data.candidate);
    }
  } catch (error) {
    console.warn('Falha na sinalização', error);
  }
}

function removePeer(peerId) {
  const peer = state.peers.get(peerId);
  if (!peer) return;
  peer.pc.close();
  state.peers.delete(peerId);
  renderCallRoster();
}

function renderCallRoster() {
  if (!state.inCall) return;
  elements.videoGrid.replaceChildren();
  const selfUser = { id: state.clientId, name: state.name, self: true };
  renderVideoTile(selfUser, state.localStream);
  state.callUsers.filter((user) => user.id !== state.clientId).forEach((user) => {
    renderVideoTile(user, state.peers.get(user.id)?.stream);
  });
}

function renderVideoTile(user, stream) {
  const tile = document.createElement('div');
  tile.className = 'video-tile';
  const videoTrack = stream?.getVideoTracks().find((track) => track.readyState === 'live');
  const avatar = document.createElement('div');
  avatar.className = 'tile-avatar';
  avatar.textContent = initials(user.name);
  if (videoTrack && (user.self ? videoTrack.enabled : true)) {
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = Boolean(user.self);
    video.srcObject = stream;
    tile.append(video);
  }
  tile.append(avatar);
  const label = document.createElement('div');
  label.className = 'tile-label';
  label.textContent = user.self ? `${user.name} (você)` : user.name;
  tile.append(label);
  if (user.self && state.localStream?.getAudioTracks().every((track) => !track.enabled)) {
    const muted = document.createElement('div');
    muted.className = 'muted-badge';
    muted.textContent = '×';
    tile.append(muted);
  }
  elements.videoGrid.append(tile);
}

function toggleMic() {
  if (!state.inCall) return;
  const tracks = state.localStream?.getAudioTracks() || [];
  const nextEnabled = !tracks.some((track) => track.enabled);
  tracks.forEach((track) => { track.enabled = nextEnabled; });
  elements.micButton.classList.toggle('disabled', !nextEnabled);
  elements.micCompact.classList.toggle('disabled', !nextEnabled);
  renderCallRoster();
}

async function toggleCamera() {
  if (!state.inCall) return;
  let track = state.localStream?.getVideoTracks()[0];
  try {
    if (!track) {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      track = cameraStream.getVideoTracks()[0];
      state.localStream.addTrack(track);
      for (const { pc } of state.peers.values()) pc.addTrack(track, state.localStream);
    } else {
      track.enabled = !track.enabled;
    }
    elements.cameraButton.classList.toggle('active', track.enabled);
    renderCallRoster();
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
    if (window.lumeDesktop?.isDesktop) {
      const sourceId = await chooseDesktopSource();
      if (!sourceId) return;
      const selected = await window.lumeDesktop.selectDisplaySource(sourceId);
      if (!selected) throw new Error('A fonte de compartilhamento não pôde ser selecionada.');
    }
    const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    const screenTrack = display.getVideoTracks()[0];
    state.screenStream = display;
    for (const { pc } of state.peers.values()) {
      const sender = pc.getSenders().find((item) => item.track?.kind === 'video');
      if (sender) await sender.replaceTrack(screenTrack);
      else pc.addTrack(screenTrack, display);
    }
    screenTrack.addEventListener('ended', stopScreenShare, { once: true });
    elements.screenButton.classList.add('active');
    elements.screenButton.querySelector('small').textContent = 'Parar tela';
    toast('Sua tela está sendo compartilhada.');
  } catch (error) {
    if (error.name !== 'NotAllowedError') toast('Não foi possível compartilhar a tela.', 'error');
  }
}

function chooseDesktopSource() {
  return new Promise(async (resolve) => {
    try {
      const sources = await window.lumeDesktop.getDisplaySources();
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
  const cameraTrack = state.localStream?.getVideoTracks()[0] || null;
  for (const { pc } of state.peers.values()) {
    const sender = pc.getSenders().find((item) => item.track?.kind === 'video');
    if (sender) await sender.replaceTrack(cameraTrack);
  }
  state.screenStream.getTracks().forEach((track) => track.stop());
  state.screenStream = null;
  elements.screenButton.classList.remove('active');
  elements.screenButton.querySelector('small').textContent = 'Compartilhar';
}

function startApp() {
  elements.welcomeModal.classList.add('is-hidden');
  elements.app.classList.remove('is-hidden');
  elements.profileName.textContent = state.name;
  elements.profileAvatar.textContent = initials(state.name);
  elements.nameInput.value = state.name;
  connectEvents();
}

elements.welcomeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.name = elements.nameInput.value.trim().slice(0, 32);
  if (!state.name) return;
  localStorage.setItem('lume-name', state.name);
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
elements.toggleMembers.addEventListener('click', () => elements.membersPanel.classList.toggle('open'));
elements.copyInvite.addEventListener('click', async () => {
  await navigator.clipboard.writeText(location.href);
  toast('Convite copiado.');
});
elements.settingsButton.addEventListener('click', () => {
  if (state.inCall) {
    toast('Saia da chamada antes de trocar seu nome.');
    return;
  }
  state.eventSource?.close();
  elements.app.classList.add('is-hidden');
  elements.welcomeModal.classList.remove('is-hidden');
  elements.nameInput.value = state.name;
  elements.nameInput.focus();
});

window.addEventListener('beforeunload', () => {
  state.eventSource?.close();
  state.localStream?.getTracks().forEach((track) => track.stop());
  state.screenStream?.getTracks().forEach((track) => track.stop());
});

if (state.name) startApp();
else setTimeout(() => elements.nameInput.focus(), 100);

setInterval(() => {
  if (state.eventSource?.readyState === EventSource.OPEN) {
    fetch('/api/health', { cache: 'no-store' }).catch(() => {});
  }
}, 4 * 60 * 1000);

