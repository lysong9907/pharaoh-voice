// ============================================
//  PHARAOH VOICE — Client Logic
//  i18n · WebRTC · Sound FX · Speaking Ring
// ============================================

// ====== i18n ======
const I18N = {
  en: {
    brand: 'PHARAOH VOICE',
    tagline: 'Elite Encrypted Voice Chambers',
    nameLabel: 'Your Name',
    namePh: 'Enter your name',
    randomName: 'Random name',
    roomLabel: 'Chamber Name',
    roomPh: 'Agree on a name with allies',
    enter: 'Enter Chamber',
    hint: 'Share the chamber link with allies to connect',
    featVoice: 'Voice', featText: 'Text', featEmoji: 'Emoji',
    participants: 'Members',
    copyLink: 'Copy invite link',
    leave: 'Leave chamber',
    send: 'Send',
    msgPh: 'Type a message...',
    micOn: 'Unmute', micOff: 'Mute',
    speaking: 'Speaking', muted: 'Muted',
    me: 'You', you: 'You', anonymous: 'Pharaoh',
    connStable: 'Connected', connReconnecting: 'Reconnecting...', connLost: 'Connection lost',
    joinedRoom: '{name} joined the chamber',
    leftRoom: '{name} left the chamber',
    copySuccess: 'Link copied!',
    micDenied: 'Microphone access denied',
    typing: '{name} is typing',
    emptyState: 'The chamber is silent. Send the first message.',
    connRestored: 'Connection restored',
    soundOn: 'Sounds on', soundOff: 'Sounds off'
  },
  ar: {
    brand: 'صوت الفرعون',
    tagline: 'غرف صوتية مشفرة نخبوية',
    nameLabel: 'اسمك',
    namePh: 'أدخل اسمك',
    randomName: 'اسم عشوائي',
    roomLabel: 'اسم الغرفة',
    roomPh: 'اتفق على اسم مع حلفائك',
    enter: 'دخول الغرفة',
    hint: 'شارك رابط الغرفة مع حلفائك للاتصال',
    featVoice: 'صوت', featText: 'نص', featEmoji: 'رموز',
    participants: 'الأعضاء',
    copyLink: 'نسخ رابط الدعوة',
    leave: 'مغادرة الغرفة',
    send: 'إرسال',
    msgPh: 'اكتب رسالة...',
    micOn: 'فتح الميكروفون', micOff: 'كتم الميكروفون',
    speaking: 'يتحدث', muted: 'كتم',
    me: 'أنت', you: 'أنت', anonymous: 'فرعون',
    connStable: 'متصل', connReconnecting: 'إعادة الاتصال...', connLost: 'انقطع الاتصال',
    joinedRoom: '{name} انضم إلى الغرفة',
    leftRoom: '{name} غادر الغرفة',
    copySuccess: 'تم نسخ الرابط!',
    micDenied: 'تم رفض الوصول إلى الميكروفون',
    typing: '{name} يكتب',
    emptyState: 'الغرفة صامتة. أرسل أول رسالة.',
    connRestored: 'تم استعادة الاتصال',
    soundOn: 'الصوت مفعّل', soundOff: 'الصوت مكتوم'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key, params) {
  let str = (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
  if (params) Object.keys(params).forEach(k => { str = str.replace('{' + k + '}', params[k]); });
  return str;
}

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  langToggle.textContent = lang === 'ar' ? 'EN' : 'ع';
  updateParticipants();
}

// ====== Constants ======
const EMOJIS = [
  '😀','😂','🥰','😎','🤔','😴','🥳','😭',
  '😡','🤯','😱','🤗','🤩','😇','🙃','🥱',
  '👍','👎','👏','🙏','💪','🤝','✌️','🤞',
  '❤️','🔥','✨','🎉','🎊','💀','👻','🤡',
  '☕','🍕','🍔','🍻','🐱','🐶','🦄','🌈',
  '⭐','💯','💥','💫','🌙','☀️','⚡','💎'
];

const EGYPTIAN_NAMES = [
  'Anubis','Cleopatra','Horus','Ra','Nefertiti','Osiris','Isis','Sphinx',
  'Bastet','Thoth','Sobek','Amun','Hathor','Khonsu','Maat','Ptah',
  'Tutankhamun','Ramses','Akhenaten','Scarab','Pharaoh','Nile','Khepri','Sekhmet'
];

const AVATAR_GRADIENTS = [
  ['#f6d365','#d4af37'], ['#e74c3c','#c0392b'], ['#3b6fe0','#1e3a8a'],
  ['#2ecc71','#16a085'], ['#9b59b6','#6c3483'], ['#e67e22','#ca6f1e'],
  ['#1abc9c','#0e6655'], ['#e84393','#a93c78']
];

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  { urls: 'stun:stun.openrelay.metered.ca:80' },
  { urls: 'stun:global.stun.twilio.com:3478' },
  // Free TURN (OpenRelay) — critical for Middle East symmetric NAT
  { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' }
];

// ====== Helpers ======
function getAvatarGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const g = AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
  return `linear-gradient(135deg, ${g[0]}, ${g[1]})`;
}
function getInitial(name) { return (name || '?').charAt(0).toUpperCase(); }
function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
function fmtTime(ts) {
  const d = new Date(ts);
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}
function haptic(ms) { try { navigator.vibrate && navigator.vibrate(ms || 8); } catch (e) {} }

// ====== Toast ======
const toastContainer = document.getElementById('toast-container');
function showToast(msg, gold) {
  const el = document.createElement('div');
  el.className = 'toast' + (gold ? ' gold' : '');
  el.textContent = msg;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

// ====== Sound FX (Web Audio, no files) ======
const SoundFX = {
  ctx: null,
  enabled: localStorage.getItem('sounds') !== 'off',
  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(freq, dur, delay, gain, type) {
    if (!this.enabled) return;
    this.ensure();
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + (delay || 0);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain || 0.06, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  },
  send()    { this.tone(740, 0.09, 0, 0.05); this.tone(980, 0.1, 0.05, 0.04); },
  receive() { this.tone(520, 0.12, 0, 0.045); },
  join()    { this.tone(440, 0.12, 0, 0.05); this.tone(660, 0.16, 0.1, 0.05); },
  leave()   { this.tone(660, 0.12, 0, 0.04); this.tone(440, 0.16, 0.1, 0.04); },
  tap()     { this.tone(880, 0.05, 0, 0.025); }
};

// ====== State ======
let socket = null;
let localStream = null;
let micOn = false;
let myName = '';
let myRoom = '';
let myId = '';
const peerConnections = new Map();
const userNames = new Map();
const micStates = new Map();
const speakingStates = new Map();
let reconnectingPeers = new Set();
let unread = 0;
let typingTimer = null;
let typingHideTimer = null;
let lastTypingSent = 0;

// Speaking detection (local)
let audioCtx = null, analyser = null, isSpeakingLocal = false;

// ====== DOM ======
const joinScreen = document.getElementById('join-screen');
const chatScreen = document.getElementById('chat-screen');
const nameInput = document.getElementById('name-input');
const roomInput = document.getElementById('room-input');
const joinBtn = document.getElementById('join-btn');
const diceBtn = document.getElementById('dice-btn');
const roomNameDisplay = document.getElementById('room-name-display');
const userCount = document.getElementById('user-count');
const participantsPanel = document.getElementById('participants-panel');
const participantsList = document.getElementById('participants-list');
const drawerBackdrop = document.getElementById('drawer-backdrop');
const menuBtn = document.getElementById('menu-btn');
const chatMessages = document.getElementById('chat-messages');
const emptyState = document.getElementById('empty-state');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const emojiGrid = document.getElementById('emoji-grid');
const micToggle = document.getElementById('mic-toggle');
const leaveBtn = document.getElementById('leave-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');
const connStatus = document.getElementById('conn-status');
const connStatusText = connStatus.querySelector('.conn-text');
const typingIndicator = document.getElementById('typing-indicator');
const typingText = document.getElementById('typing-text');
const soundToggle = document.getElementById('sound-toggle');
const langToggle = document.getElementById('lang-toggle');

// ====== Init ======
applyLang(currentLang);

const urlParams = new URLSearchParams(window.location.search);
const urlRoom = urlParams.get('room');
if (urlRoom) roomInput.value = urlRoom;

// Pre-fill a random Egyptian name as placeholder suggestion
nameInput.placeholder = EGYPTIAN_NAMES[Math.floor(Math.random() * EGYPTIAN_NAMES.length)];

diceBtn.onclick = () => {
  nameInput.value = EGYPTIAN_NAMES[Math.floor(Math.random() * EGYPTIAN_NAMES.length)];
  haptic(6);
  SoundFX.tap();
};

EMOJIS.forEach(emoji => {
  const btn = document.createElement('button');
  btn.className = 'emoji-item';
  btn.textContent = emoji;
  btn.onclick = () => {
    messageInput.value += emoji;
    messageInput.focus();
    haptic(4);
  };
  emojiGrid.appendChild(btn);
});

document.querySelectorAll('.lang-btn').forEach(btn => { btn.onclick = () => applyLang(btn.dataset.lang); });
langToggle.onclick = () => applyLang(currentLang === 'en' ? 'ar' : 'en');

soundToggle.textContent = SoundFX.enabled ? '🔊' : '🔇';
soundToggle.onclick = () => {
  SoundFX.enabled = !SoundFX.enabled;
  localStorage.setItem('sounds', SoundFX.enabled ? 'on' : 'off');
  soundToggle.textContent = SoundFX.enabled ? '🔊' : '🔇';
  showToast(t(SoundFX.enabled ? 'soundOn' : 'soundOff'));
};

// ====== Connection Status ======
function setConnStatus(state) {
  connStatus.className = 'conn-dot conn-' + state;
  if (state === 'stable') connStatusText.textContent = t('connStable');
  else if (state === 'reconnecting') connStatusText.textContent = t('connReconnecting');
  else connStatusText.textContent = t('connLost');
}

// ====== Unread badge in title ======
function bumpUnread() {
  if (document.hidden) {
    unread++;
    document.title = `(${unread}) Pharaoh Voice`;
  }
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { unread = 0; document.title = 'Pharaoh Voice'; }
});

// ====== Drawer (mobile) ======
function openDrawer() { participantsPanel.classList.add('drawer-open'); drawerBackdrop.classList.remove('hidden'); }
function closeDrawer() { participantsPanel.classList.remove('drawer-open'); drawerBackdrop.classList.add('hidden'); }
menuBtn.onclick = () => { participantsPanel.classList.contains('drawer-open') ? closeDrawer() : openDrawer(); haptic(5); };
drawerBackdrop.onclick = closeDrawer;

// ====== Join Room ======
joinBtn.onclick = () => {
  const name = nameInput.value.trim() || nameInput.placeholder || (t('anonymous') + Math.floor(Math.random() * 1000));
  const room = roomInput.value.trim() || 'pyramid';
  myName = name;
  myRoom = room;

  SoundFX.ensure(); // unlock audio on user gesture (iOS)
  haptic(10);

  socket = io({
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000,
    timeout: 20000,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    myId = socket.id;
    setConnStatus('stable');
    socket.emit('join-room', { name, room });
  });

  socket.on('connect_error', () => setConnStatus('reconnecting'));
  socket.on('disconnect', () => setConnStatus('reconnecting'));

  socket.on('reconnect', () => {
    setConnStatus('stable');
    showToast(t('connRestored'), true);
    socket.emit('join-room', { name: myName, room: myRoom });
    userNames.forEach((userName, userId) => {
      if (!peerConnections.has(userId)) createPeerConnection(userId, true);
    });
  });

  socket.on('reconnect_attempt', () => setConnStatus('reconnecting'));

  // --- Room events ---
  socket.on('room-users', (users) => {
    users.forEach(userId => {
      if (!userNames.has(userId)) userNames.set(userId, 'Member');
      if (!micStates.has(userId)) micStates.set(userId, false);
      createPeerConnection(userId, true);
    });
    updateParticipants();
  });

  socket.on('user-joined', (data) => {
    userNames.set(data.id, data.name);
    micStates.set(data.id, false);
    addSystemMessage(t('joinedRoom', { name: data.name }));
    SoundFX.join();
    updateParticipants();
  });

  // --- WebRTC signaling ---
  socket.on('webrtc-offer', async (data) => {
    let pc = peerConnections.get(data.from);
    if (!pc) {
      userNames.set(data.from, userNames.get(data.from) || 'Member');
      pc = createPeerConnection(data.from, false);
    }
    if (pc.signalingState === 'stable') {
      await pc.setRemoteDescription(data.sdp);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc-answer', { target: data.from, sdp: answer });
    } else if (pc.signalingState === 'have-local-offer') {
      // Glare: both offered at once — roll back, accept incoming
      await pc.setLocalDescription({ type: 'rollback' });
      await pc.setRemoteDescription(data.sdp);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc-answer', { target: data.from, sdp: answer });
    }
  });

  socket.on('webrtc-answer', async (data) => {
    const pc = peerConnections.get(data.from);
    if (pc && pc.signalingState === 'have-local-offer') {
      await pc.setRemoteDescription(data.sdp);
    }
  });

  socket.on('webrtc-ice', async (data) => {
    const pc = peerConnections.get(data.from);
    if (pc) {
      try { await pc.addIceCandidate(data.candidate); } catch (e) { /* stale */ }
    }
  });

  socket.on('audio-state', (data) => {
    micStates.set(data.id, !!data.on);
    if (!data.on) speakingStates.set(data.id, false);
    updateParticipants();
  });

  socket.on('user-speaking', (data) => {
    speakingStates.set(data.id, !!data.speaking);
    updateSpeakingUI(data.id, !!data.speaking);
  });

  socket.on('user-typing', (data) => {
    if (data.id === myId) return;
    typingText.textContent = t('typing', { name: data.name });
    typingIndicator.classList.remove('hidden');
    clearTimeout(typingHideTimer);
    typingHideTimer = setTimeout(() => typingIndicator.classList.add('hidden'), 3000);
  });

  socket.on('chat-message', (data) => {
    const isSelf = data.id === myId;
    addChatMessage(isSelf ? t('me') : data.name, data.message, data.emoji, isSelf, data.timestamp);
    if (!isSelf) { SoundFX.receive(); bumpUnread(); }
    typingIndicator.classList.add('hidden');
  });

  socket.on('user-left', (userId) => {
    const name = userNames.get(userId) || 'Member';
    addSystemMessage(t('leftRoom', { name }));
    SoundFX.leave();
    userNames.delete(userId);
    micStates.delete(userId);
    speakingStates.delete(userId);
    const pc = peerConnections.get(userId);
    if (pc) { pc.close(); peerConnections.delete(userId); }
    const audioEl = document.getElementById('audio-' + userId);
    if (audioEl) audioEl.remove();
    updateParticipants();
  });

  // Switch screens
  joinScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  roomNameDisplay.textContent = room;
  messageInput.focus();
};

[nameInput, roomInput].forEach(input => {
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') joinBtn.click(); });
});

// ====== WebRTC ======
function createPeerConnection(userId, isInitiator) {
  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS, iceTransportPolicy: 'all' });

  if (localStream) {
    localStream.getAudioTracks().forEach(track => pc.addTrack(track, localStream));
  }

  pc.ontrack = (event) => {
    const audioId = 'audio-' + userId;
    let audioEl = document.getElementById(audioId);
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = audioId;
      audioEl.autoplay = true;
      audioEl.setAttribute('playsinline', '');
      document.body.appendChild(audioEl);
    }
    audioEl.srcObject = event.streams[0];
    audioEl.play().catch(() => {});
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) socket.emit('webrtc-ice', { target: userId, candidate: event.candidate });
  };

  pc.onconnectionstatechange = () => {
    const state = pc.connectionState;
    if (state === 'connected') reconnectingPeers.delete(userId);

    if ((state === 'disconnected' || state === 'failed') && !reconnectingPeers.has(userId) && socket && socket.connected) {
      reconnectingPeers.add(userId);
      try {
        if (pc.signalingState === 'stable') {
          pc.restartIce();
          if (isInitiator) {
            pc.createOffer({ iceRestart: true }).then(o => {
              pc.setLocalDescription(o);
              socket.emit('webrtc-offer', { target: userId, sdp: o });
            });
          }
        }
      } catch (e) {}

      setTimeout(() => {
        if (reconnectingPeers.has(userId) && socket && socket.connected) {
          pc.close();
          peerConnections.delete(userId);
          createPeerConnection(userId, true);
          reconnectingPeers.delete(userId);
        }
      }, 3000);
    }
  };

  peerConnections.set(userId, pc);

  if (isInitiator) {
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => socket.emit('webrtc-offer', { target: userId, sdp: pc.localDescription }))
      .catch(e => console.error('[WebRTC] Offer error:', e));
  }
  return pc;
}

// ====== Speaking Detection (local mic volume) ======
function startSpeakingDetection(stream) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    (function loop() {
      if (!micOn) {
        if (isSpeakingLocal) { isSpeakingLocal = false; socket.emit('speaking', { speaking: false }); updateParticipants(); }
        return;
      }
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      const speaking = (sum / data.length) > 12;
      if (speaking !== isSpeakingLocal) {
        isSpeakingLocal = speaking;
        socket.emit('speaking', { speaking });
        updateParticipants();
      }
      requestAnimationFrame(loop);
    })();
  } catch (e) {}
}

// ====== Mic Toggle ======
micToggle.onclick = async () => {
  haptic(12);
  if (!micOn) {
    try {
      if (!localStream) {
        localStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          video: false
        });
      } else {
        localStream.getAudioTracks().forEach(tr => tr.enabled = true);
      }

      // Add tracks + renegotiate with every peer
      peerConnections.forEach((pc, userId) => {
        const senders = pc.getSenders();
        localStream.getAudioTracks().forEach(track => {
          if (senders.length === 0 || !senders.find(s => s.track === track)) {
            pc.addTrack(track, localStream);
          }
        });
        if (pc.signalingState === 'stable') {
          pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => socket.emit('webrtc-offer', { target: userId, sdp: pc.localDescription }))
            .catch(e => console.error('[WebRTC] Renegotiation error:', e));
        }
      });

      micOn = true;
      micToggle.classList.remove('mic-off');
      micToggle.classList.add('mic-on');
      socket.emit('audio-toggle', { on: true });
      startSpeakingDetection(localStream);
      SoundFX.tap();
    } catch (e) {
      showToast(t('micDenied') + ': ' + e.message);
    }
  } else {
    if (localStream) localStream.getAudioTracks().forEach(tr => tr.enabled = false);
    micOn = false;
    isSpeakingLocal = false;
    micToggle.classList.remove('mic-on');
    micToggle.classList.add('mic-off');
    socket.emit('audio-toggle', { on: false });
    socket.emit('speaking', { speaking: false });
  }
  updateParticipants();
};

// ====== Chat ======
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit('chat-message', { message: text, emoji: '' });
  messageInput.value = '';
  emojiPicker.classList.add('hidden');
  SoundFX.send();
  haptic(6);
}

sendBtn.onclick = sendMessage;
messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

// Typing indicator (throttled)
messageInput.addEventListener('input', () => {
  const now = Date.now();
  if (socket && socket.connected && messageInput.value.trim() && now - lastTypingSent > 1500) {
    lastTypingSent = now;
    socket.emit('typing');
  }
});

function ensureNotEmpty() {
  if (emptyState && emptyState.parentNode) emptyState.remove();
}

function addChatMessage(name, text, emoji, isSelf, timestamp) {
  ensureNotEmpty();
  const msg = document.createElement('div');
  msg.className = 'message' + (isSelf ? ' self' : '');

  if (!isSelf) {
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.style.background = getAvatarGradient(name);
    avatar.textContent = getInitial(name);
    msg.appendChild(avatar);
  }

  const content = document.createElement('div');
  content.className = 'content';

  if (!isSelf) {
    const sender = document.createElement('div');
    sender.className = 'sender';
    sender.textContent = name;
    content.appendChild(sender);
  }

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  const textEl = document.createElement('div');
  textEl.className = 'text';
  if (emoji && !text) {
    textEl.classList.add('emoji-only');
    textEl.textContent = emoji;
  } else {
    textEl.textContent = text;
    if (emoji) textEl.textContent += ' ' + emoji;
  }
  bubble.appendChild(textEl);
  content.appendChild(bubble);

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = fmtTime(timestamp || Date.now());
  content.appendChild(meta);

  msg.appendChild(content);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(text) {
  ensureNotEmpty();
  const msg = document.createElement('div');
  msg.className = 'system-message';
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ====== Emoji Picker ======
emojiBtn.onclick = (e) => {
  e.stopPropagation();
  emojiPicker.classList.toggle('hidden');
  haptic(5);
};
document.addEventListener('click', (e) => {
  if (!emojiPicker.contains(e.target) && e.target !== emojiBtn && !emojiBtn.contains(e.target)) {
    emojiPicker.classList.add('hidden');
  }
});

// ====== Participants ======
function updateSpeakingUI(userId, speaking) {
  const el = document.getElementById('participant-' + userId);
  if (el) {
    el.classList.toggle('speaking', speaking);
    const status = el.querySelector('.status');
    if (status) status.textContent = speaking ? t('speaking') : (micStates.get(userId) ? t('micOff') : t('muted'));
  }
}

function updateParticipants() {
  participantsList.innerHTML = '';

  // Me
  const me = document.createElement('li');
  me.className = 'participant' + (isSpeakingLocal ? ' speaking' : '');
  me.innerHTML = `
    <div class="avatar" style="background: ${getAvatarGradient(myName)}">${getInitial(myName)}</div>
    <div class="info">
      <div class="name">${escapeHtml(myName)} <span class="you-tag">(${t('me')})</span></div>
      <div class="status">${isSpeakingLocal ? t('speaking') : (micOn ? t('micOff') : t('muted'))}</div>
    </div>
    <div class="mic-indicator ${micOn ? 'mic-on' : 'mic-off'}">${micOn ? '🎙' : '🔇'}</div>
  `;
  participantsList.appendChild(me);

  // Others
  userNames.forEach((name, id) => {
    const on = micStates.get(id) || false;
    const speaking = speakingStates.get(id) || false;
    const p = document.createElement('li');
    p.className = 'participant' + (speaking ? ' speaking' : '');
    p.id = 'participant-' + id;
    p.innerHTML = `
      <div class="avatar" style="background: ${getAvatarGradient(name)}">${getInitial(name)}</div>
      <div class="info">
        <div class="name">${escapeHtml(name)}</div>
        <div class="status">${speaking ? t('speaking') : (on ? t('micOff') : t('muted'))}</div>
      </div>
      <div class="mic-indicator ${on ? 'mic-on' : 'mic-off'}">${on ? '🎙' : '🔇'}</div>
    `;
    participantsList.appendChild(p);
  });

  userCount.textContent = 1 + userNames.size;
}

// ====== Copy Link ======
copyLinkBtn.onclick = () => {
  const url = window.location.origin + '?room=' + encodeURIComponent(myRoom);
  haptic(8);
  navigator.clipboard.writeText(url).then(() => {
    showToast(t('copySuccess'), true);
  }).catch(() => {
    prompt(t('copyLink') + ':', url);
  });
};

// ====== Leave ======
leaveBtn.onclick = () => {
  haptic(10);
  if (socket) socket.disconnect();
  if (localStream) localStream.getTracks().forEach(tr => tr.stop());
  peerConnections.forEach(pc => pc.close());
  peerConnections.clear();
  location.reload();
};

// ====== Cleanup ======
window.addEventListener('beforeunload', () => {
  if (localStream) localStream.getTracks().forEach(tr => tr.stop());
  if (socket) socket.disconnect();
});

// ====== Keep-alive ======
setInterval(() => {
  if (socket && socket.connected) socket.emit('ping', Date.now());
}, 25000);
