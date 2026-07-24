// ============================================
//  PHARAOH VOICE — Client Logic
//  i18n + WebRTC + Persistent Connections
// ============================================

// ====== i18n Translations ======
const I18N = {
  en: {
    brand: 'PHARAOH VOICE',
    tagline: 'Elite Encrypted Voice Chambers',
    nameLabel: 'Your Name',
    namePh: 'Enter your name',
    roomLabel: 'Chamber Name',
    roomPh: 'Agree on a name with allies',
    enter: 'Enter Chamber',
    hint: 'Share the chamber link with allies to connect',
    featVoice: 'Voice',
    featText: 'Text',
    featEmoji: 'Emoji',
    participants: 'Members',
    copyLink: 'Copy invite link',
    leave: 'Leave chamber',
    emoji: 'Emojis',
    send: 'Send',
    msgPh: 'Type a message...',
    micOn: 'Unmute',
    micOff: 'Mute',
    speaking: 'Speaking',
    muted: 'Muted',
    me: 'You',
    connStable: 'Connected',
    connReconnecting: 'Reconnecting...',
    connLost: 'Connection lost',
    joinedRoom: '{name} joined the chamber',
    leftRoom: '{name} left the chamber',
    copySuccess: 'Link copied!',
    micDenied: 'Microphone access denied',
    you: 'You',
    anonymous: 'Pharaoh'
  },
  ar: {
    brand: 'صوت الفرعون',
    tagline: 'غرف صوتية مشفرة نخبوية',
    nameLabel: 'اسمك',
    namePh: 'أدخل اسمك',
    roomLabel: 'اسم الغرفة',
    roomPh: 'اتفق على اسم مع حلفائك',
    enter: 'دخول الغرفة',
    hint: 'شارك رابط الغرفة مع حلفائك للاتصال',
    featVoice: 'صوت',
    featText: 'نص',
    featEmoji: 'رموز',
    participants: 'الأعضاء',
    copyLink: 'نسخ رابط الدعوة',
    leave: 'مغادرة الغرفة',
    emoji: 'الرموز التعبيرية',
    send: 'إرسال',
    msgPh: 'اكتب رسالة...',
    micOn: 'فتح الميكروفون',
    micOff: 'كتم الميكروفون',
    speaking: 'يتحدث',
    muted: 'كتم',
    me: 'أنت',
    connStable: 'متصل',
    connReconnecting: 'إعادة الاتصال...',
    connLost: 'انقطع الاتصال',
    joinedRoom: '{name} انضم إلى الغرفة',
    leftRoom: '{name} غادر الغرفة',
    copySuccess: 'تم نسخ الرابط!',
    micDenied: 'تم رفض الوصول إلى الميكروفون',
    you: 'أنت',
    anonymous: 'فرعون'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key, params) {
  let str = (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
  if (params) {
    Object.keys(params).forEach(k => {
      str = str.replace('{' + k + '}', params[k]);
    });
  }
  return str;
}

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update all text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  // Update placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  // Update titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// ====== Configuration ======
const EMOJIS = [
  '😀','😂','🥰','😎','🤔','😴','🥳','😭',
  '😡','🤯','😱','🤗','🤩','😇','🙃','🥱',
  '👍','👎','👏','🙏','💪','🤝','✌️','🤞',
  '❤️','🔥','✨','🎉','🎊','💀','👻','🤡',
  '☕','🍕','🍔','🍻','🐱','🐶','🦄','🌈',
  '⭐','💯','💥','💫','🌙','☀️','⚡','💎'
];

const AVATAR_COLORS = [
  '#e74c3c','#e67e22','#d4af37','#2ecc71',
  '#1abc9c','#3498db','#9b59b6','#e84393'
];

// STUN servers — multiple providers for Middle East reliability
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  { urls: 'stun:stun.openrelay.metered.ca:80' },
  { urls: 'stun:global.stun.twilio.com:3478' },
  // Free TURN servers (OpenRelay) — critical for Middle East NAT traversal
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject'
  }
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitial(name) {
  return (name || '?').charAt(0).toUpperCase();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ====== State ======
let socket = null;
let localStream = null;
let micOn = false;
let myName = '';
let myRoom = '';
let myId = '';
const peerConnections = new Map();
const userNames = new Map();
let reconnectingPeers = new Set();

// ====== DOM ======
const joinScreen = document.getElementById('join-screen');
const chatScreen = document.getElementById('chat-screen');
const nameInput = document.getElementById('name-input');
const roomInput = document.getElementById('room-input');
const joinBtn = document.getElementById('join-btn');
const roomNameDisplay = document.getElementById('room-name-display');
const userCount = document.getElementById('user-count');
const participantsList = document.getElementById('participants-list');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const emojiGrid = document.getElementById('emoji-grid');
const micToggle = document.getElementById('mic-toggle');
const micLabel = micToggle.querySelector('.mic-label');
const leaveBtn = document.getElementById('leave-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');
const connStatus = document.getElementById('conn-status');
const connStatusText = connStatus.querySelector('.conn-text');

// ====== Init ======
applyLang(currentLang);

// URL params
const urlParams = new URLSearchParams(window.location.search);
const urlRoom = urlParams.get('room');
if (urlRoom) {
  roomInput.value = urlRoom;
}

// Emoji picker
EMOJIS.forEach(emoji => {
  const btn = document.createElement('button');
  btn.className = 'emoji-item';
  btn.textContent = emoji;
  btn.onclick = () => {
    messageInput.value += emoji;
    messageInput.focus();
  };
  emojiGrid.appendChild(btn);
});

// Language buttons
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.onclick = () => applyLang(btn.dataset.lang);
});

// ====== Connection Status ======
function setConnStatus(state) {
  connStatus.className = 'conn-status conn-' + state;
  if (state === 'stable') connStatusText.textContent = t('connStable');
  else if (state === 'reconnecting') connStatusText.textContent = t('connReconnecting');
  else if (state === 'lost') connStatusText.textContent = t('connLost');
}

// ====== Join Room ======
joinBtn.onclick = () => {
  const name = nameInput.value.trim() || t('anonymous') + Math.floor(Math.random() * 1000);
  const room = roomInput.value.trim() || 'pyramid';

  myName = name;
  myRoom = room;

  // Connect with persistent reconnection
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

  socket.on('connect_error', () => {
    setConnStatus('reconnecting');
  });

  socket.on('disconnect', () => {
    setConnStatus('reconnecting');
  });

  socket.on('reconnect', () => {
    setConnStatus('stable');
    // Rejoin room
    socket.emit('join-room', { name: myName, room: myRoom });
    // Re-establish WebRTC with all known users
    userNames.forEach((userName, userId) => {
      if (!peerConnections.has(userId)) {
        createPeerConnection(userId, true);
      }
    });
  });

  socket.on('reconnect_attempt', (attempt) => {
    setConnStatus('reconnecting');
  });

  // --- Room events ---
  socket.on('room-users', (users) => {
    users.forEach(userId => {
      userNames.set(userId, 'Member');
      createPeerConnection(userId, true);
    });
    updateParticipants();
  });

  socket.on('user-joined', (data) => {
    userNames.set(data.id, data.name);
    addSystemMessage(t('joinedRoom', { name: data.name }));
    updateParticipants();
  });

  // --- WebRTC signaling ---
  socket.on('webrtc-offer', async (data) => {
    let pc = peerConnections.get(data.from);
    if (!pc) {
      userNames.set(data.from, 'Member');
      pc = createPeerConnection(data.from, false);
    }
    if (pc.signalingState !== 'stable') {
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
      try {
        await pc.addIceCandidate(data.candidate);
      } catch (e) { /* stale candidate */ }
    }
  });

  socket.on('audio-state', (data) => {
    updateParticipantMic(data.id, data.on);
  });

  socket.on('chat-message', (data) => {
    const isSelf = data.id === myId;
    addChatMessage(isSelf ? t('me') : data.name, data.message, data.emoji, isSelf);
  });

  socket.on('user-left', (userId) => {
    const name = userNames.get(userId) || 'Member';
    addSystemMessage(t('leftRoom', { name }));
    userNames.delete(userId);
    const pc = peerConnections.get(userId);
    if (pc) {
      pc.close();
      peerConnections.delete(userId);
    }
    updateParticipants();
  });

  // Switch screen
  joinScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  roomNameDisplay.textContent = room;
  messageInput.focus();
};

// Enter key
[nameInput, roomInput].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinBtn.click();
  });
});

// ====== WebRTC: Create Peer Connection ======
function createPeerConnection(userId, isInitiator) {
  const pc = new RTCPeerConnection({
    iceServers: ICE_SERVERS,
    iceTransportPolicy: 'all'
  });

  // Add local audio
  if (localStream) {
    localStream.getAudioTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });
  }

  // Remote audio
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

  // ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('webrtc-ice', { target: userId, candidate: event.candidate });
    }
  };

  // ====== Auto-reconnect on disconnection ======
  pc.onconnectionstatechange = () => {
    const state = pc.connectionState;

    if (state === 'connected') {
      reconnectingPeers.delete(userId);
    }

    if (state === 'disconnected' || state === 'failed') {
      if (!reconnectingPeers.has(userId) && socket && socket.connected) {
        reconnectingPeers.add(userId);
        console.log('[WebRTC] Peer', userId, 'disconnected, attempting ICE restart...');

        // Try ICE restart first
        try {
          if (pc.signalingState === 'stable') {
            pc.restartIce();
            // If we were the initiator, create a new offer with restart
            if (isInitiator) {
              const offer = pc.createOffer({ iceRestart: true });
              offer.then(o => {
                pc.setLocalDescription(o);
                socket.emit('webrtc-offer', { target: userId, sdp: o });
              });
            }
          }
        } catch (e) {
          console.error('[WebRTC] ICE restart failed:', e);
        }

        // Fallback: full reconnect after 3 seconds
        setTimeout(() => {
          if (reconnectingPeers.has(userId) && socket && socket.connected) {
            console.log('[WebRTC] Full reconnect for peer', userId);
            pc.close();
            peerConnections.delete(userId);
            createPeerConnection(userId, true);
            reconnectingPeers.delete(userId);
          }
        }, 3000);
      }
    }
  };

  peerConnections.set(userId, pc);

  // Initiate offer if needed
  if (isInitiator) {
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => {
        socket.emit('webrtc-offer', { target: userId, sdp: pc.localDescription });
      })
      .catch(e => console.error('[WebRTC] Offer error:', e));
  }

  return pc;
}

// ====== Mic Toggle ======
micToggle.onclick = async () => {
  if (!micOn) {
    try {
      if (!localStream) {
        localStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: false
        });
      } else {
        localStream.getAudioTracks().forEach(t => t.enabled = true);
      }

      // Add tracks to all connections
      peerConnections.forEach((pc) => {
        const senders = pc.getSenders();
        localStream.getAudioTracks().forEach(track => {
          if (senders.length === 0 || !senders.find(s => s.track === track)) {
            pc.addTrack(track, localStream);
          }
        });
      });

      micOn = true;
      micToggle.classList.remove('mic-off');
      micToggle.classList.add('mic-on');
      micLabel.textContent = t('micOff');
      socket.emit('audio-toggle', { on: true });
    } catch (e) {
      alert(t('micDenied') + ': ' + e.message);
    }
  } else {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => { track.enabled = false; });
    }
    micOn = false;
    micToggle.classList.remove('mic-on');
    micToggle.classList.add('mic-off');
    micLabel.textContent = t('micOn');
    socket.emit('audio-toggle', { on: false });
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
}

sendBtn.onclick = sendMessage;
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function addChatMessage(name, text, emoji, isSelf) {
  const msg = document.createElement('div');
  msg.className = 'message' + (isSelf ? ' self' : '');

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.style.background = getAvatarColor(name);
  avatar.textContent = getInitial(name);

  const content = document.createElement('div');
  const sender = document.createElement('div');
  sender.className = 'sender';
  sender.textContent = name;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const textEl = document.createElement('div');
  textEl.className = 'text';

  if (emoji && !text) {
    textEl.classList.add('emoji-only');
    textEl.textContent = emoji;
  } else {
    textEl.textContent = text; // textContent prevents XSS
    if (emoji) textEl.textContent += ' ' + emoji;
  }

  bubble.appendChild(textEl);
  content.appendChild(sender);
  content.appendChild(bubble);
  msg.appendChild(avatar);
  msg.appendChild(content);

  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(text) {
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
};

document.addEventListener('click', (e) => {
  if (!emojiPicker.contains(e.target) && e.target !== emojiBtn && !emojiBtn.contains(e.target)) {
    emojiPicker.classList.add('hidden');
  }
});

// ====== Participants List ======
function updateParticipants() {
  participantsList.innerHTML = '';

  // Me
  const me = document.createElement('div');
  me.className = 'participant' + (micOn ? ' is-speaking' : '');
  me.innerHTML = `
    <div class="avatar" style="background: ${getAvatarColor(myName)}">${getInitial(myName)}</div>
    <div class="info">
      <div class="name">${escapeHtml(myName)} <span style="color:var(--gold);font-size:11px">(${t('me')})</span></div>
      <div class="status">${micOn ? t('speaking') : t('muted')}</div>
    </div>
    <div class="mic-indicator ${micOn ? 'mic-on' : 'mic-off'}">${micOn ? '🎙' : '🔇'}</div>
  `;
  participantsList.appendChild(me);

  // Others
  userNames.forEach((name, id) => {
    const p = document.createElement('div');
    p.className = 'participant';
    p.id = 'participant-' + id;
    p.innerHTML = `
      <div class="avatar" style="background: ${getAvatarColor(name)}">${getInitial(name)}</div>
      <div class="info">
        <div class="name">${escapeHtml(name)}</div>
        <div class="status">${t('muted')}</div>
      </div>
      <div class="mic-indicator mic-off">🔇</div>
    `;
    participantsList.appendChild(p);
  });

  const total = 1 + userNames.size;
  userCount.textContent = total;
}

function updateParticipantMic(userId, on) {
  const el = document.getElementById('participant-' + userId);
  if (el) {
    const indicator = el.querySelector('.mic-indicator');
    const status = el.querySelector('.status');
    indicator.className = 'mic-indicator ' + (on ? 'mic-on' : 'mic-off');
    indicator.textContent = on ? '🎙' : '🔇';
    status.textContent = on ? t('speaking') : t('muted');
    el.classList.toggle('is-speaking', on);
  }
}

// ====== Copy Link ======
copyLinkBtn.onclick = () => {
  const url = window.location.origin + '?room=' + encodeURIComponent(myRoom);
  navigator.clipboard.writeText(url).then(() => {
    const original = copyLinkBtn.innerHTML;
    copyLinkBtn.innerHTML = '<span style="font-size:13px;color:var(--gold)">' + t('copySuccess') + '</span>';
    setTimeout(() => { copyLinkBtn.innerHTML = original; }, 1500);
  }).catch(() => {
    prompt(t('copyLink') + ':', url);
  });
};

// ====== Leave ======
leaveBtn.onclick = () => {
  if (socket) socket.disconnect();
  if (localStream) localStream.getTracks().forEach(t => t.stop());
  peerConnections.forEach(pc => pc.close());
  peerConnections.clear();
  userNames.clear();
  micOn = false;
  location.reload();
};

// ====== Cleanup ======
window.addEventListener('beforeunload', () => {
  if (localStream) localStream.getTracks().forEach(t => t.stop());
  if (socket) socket.disconnect();
});

// ====== Keep-alive: periodic ping to maintain connection ======
setInterval(() => {
  if (socket && socket.connected) {
    socket.emit('ping', Date.now());
  }
}, 25000);
