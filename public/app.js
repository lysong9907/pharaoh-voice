// ============================================
//  PHARAOH VOICE v3 — Client Logic
//  Avatars · Roles · Search · Golden Mau
// ============================================

// ====== i18n ======
const I18N = {
  en: {
    brand: 'PHARAOH VOICE', tagline: 'Elite Encrypted Voice Chambers',
    avatarLabel: 'Choose your cat',
    nameLabel: 'Your Name', namePh: 'Enter your name',
    randomName: 'Random name',
    roomLabel: 'Chamber Name', roomPh: 'Agree on a name with allies',
    enter: 'Enter Chamber',
    hint: 'Share the chamber link with allies to connect',
    featVoice: 'Voice', featText: 'Text', featGame: 'Game',
    participants: 'Members',
    copyLink: 'Copy invite link', leave: 'Leave chamber',
    send: 'Send', msgPh: 'Type a message...',
    micOn: 'Unmute', micOff: 'Mute',
    speaking: 'Speaking', muted: 'Muted', you: 'You',
    connStable: 'Connected', connReconnecting: 'Reconnecting...', connLost: 'Connection lost',
    joinedRoom: '{name} joined the chamber', leftRoom: '{name} left the chamber',
    copySuccess: 'Link copied!', micDenied: 'Microphone access denied',
    typing: '{name} is typing', emptyState: 'The chamber is silent. Send the first message.',
    connRestored: 'Connection restored', soundOn: 'Sounds on', soundOff: 'Sounds off',
    searchPh: 'Search messages...', searchTitle: 'Search', clearChat: 'Clear chat',
    gameTitle: 'Golden Mau', gameDesc: 'Catch the golden cat! First to 5 wins.',
    startGame: 'Start Game', endGame: 'End Game',
    gameStarted: 'Golden Mau has begun!', gameCatch: 'Caught!',
    gameEscaped: 'Too slow!', gameOver: '{name} wins Golden Mau!',
    kickedTitle: 'Removed from chamber', kickedBody: 'The Pharaoh has asked you to leave.',
    rejoin: 'Return to Entrance', forceMuted: 'You have been muted by a moderator',
    forceUnmuted: 'You can speak again',
    roleOwner: 'Pharaoh', roleAdmin: 'Vizier', roleMember: 'Guest',
    actionKick: 'Remove from chamber', actionMute: 'Force mute',
    actionUnmute: 'Allow to speak', actionPromote: 'Promote to Vizier',
    actionDemote: 'Demote to Guest',
    promoted: '{name} is now a Vizier', demoted: '{name} is now a Guest',
    cancel: 'Cancel', roleChanged: 'Your role is now: {role}',
    gameCat: 'Golden Mau appeared! Tap it!',
    wrongCode: 'Incorrect access code',
    codeLabel: 'Access Code', codePh: 'Enter the secret code',
    stickerTitle: 'Stickers', stickerCats: '🐱 Cats', stickerMoods: '💫 Moods', stickerEgypt: '☥ Egypt',
    gameInvite: 'A game of Golden Mau is on! Tap 🐱 to join'
  },
  ar: {
    brand: 'صوت الفرعون', tagline: 'غرف صوتية مشفرة نخبوية',
    avatarLabel: 'اختر قطتك',
    nameLabel: 'اسمك', namePh: 'أدخل اسمك',
    randomName: 'اسم عشوائي',
    roomLabel: 'اسم الغرفة', roomPh: 'اتفق على اسم مع حلفائك',
    enter: 'دخول الغرفة',
    hint: 'شارك رابط الغرفة مع حلفائك للاتصال',
    featVoice: 'صوت', featText: 'نص', featGame: 'لعبة',
    participants: 'الأعضاء',
    copyLink: 'نسخ رابط الدعوة', leave: 'مغادرة الغرفة',
    send: 'إرسال', msgPh: 'اكتب رسالة...',
    micOn: 'فتح الميكروفون', micOff: 'كتم الميكروفون',
    speaking: 'يتحدث', muted: 'كتم', you: 'أنت',
    connStable: 'متصل', connReconnecting: 'إعادة الاتصال...', connLost: 'انقطع الاتصال',
    joinedRoom: '{name} انضم إلى الغرفة', leftRoom: '{name} غادر الغرفة',
    copySuccess: 'تم نسخ الرابط!', micDenied: 'تم رفض الوصول إلى الميكروفون',
    typing: '{name} يكتب', emptyState: 'الغرفة صامتة. أرسل أول رسالة.',
    connRestored: 'تم استعادة الاتصال', soundOn: 'الصوت مفعّل', soundOff: 'الصوت مكتوم',
    searchPh: 'ابحث في الرسائل...', searchTitle: 'بحث', clearChat: 'مسح المحادثة',
    gameTitle: 'القط الذهبي', gameDesc: 'التقط القط الذهبي! أول من يحصل على 5 نقاط.',
    startGame: 'ابدأ اللعبة', endGame: 'إنهاء اللعبة',
    gameStarted: 'بدأ القط الذهبي!', gameCatch: 'تم الالتقاط!',
    gameEscaped: 'بطيء جدًا!', gameOver: '{name} يفوز بالقط الذهبي!',
    kickedTitle: 'تم إخراجك من الغرفة', kickedBody: 'طلب منك الفرعون المغادرة.',
    rejoin: 'العودة إلى المدخل', forceMuted: 'تم كتم صوتك من قبل المشرف',
    forceUnmuted: 'يمكنك التحدث مرة أخرى',
    roleOwner: 'فرعون', roleAdmin: 'وزير', roleMember: 'ضيف',
    actionKick: 'إخراج', actionMute: 'كتم الصوت',
    actionUnmute: 'السماح بالتحدث', actionPromote: 'ترقية إلى وزير',
    actionDemote: 'خفض إلى ضيف',
    promoted: '{name} أصبح وزيرًا', demoted: '{name} أصبح ضيفًا',
    cancel: 'إلغاء', roleChanged: 'دورك الحالي: {role}',
    gameCat: 'ظهر القط الذهبي! المسه!',
    wrongCode: 'رمز الدخول غير صحيح',
    codeLabel: 'رمز الدخول', codePh: 'أدخل الرمز السري',
    stickerTitle: 'ملصقات', stickerCats: '🐱 قطط', stickerMoods: '💫 مشاعر', stickerEgypt: '☥ مصر',
    gameInvite: 'لعبة القط الذهبي بدأت! اضغط 🐱 للانضمام'
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
  renderGameScoreboard();
}

// ====== Constants ======
const EMOJIS = [
  '😀','😂','🥰','😎','🤔','😴','🥳','😭','😡','🤯','😱','🤗','🤩','😇','🙃','🥱',
  '👍','👎','👏','🙏','💪','🤝','✌️','🤞','❤️','🔥','✨','🎉','🎊','💀','👻','🤡',
  '☕','🍕','🍔','🍻','🐱','🐶','🦄','🌈','⭐','💯','💥','💫','🌙','☀️','⚡','💎'
];

const EGYPTIAN_NAMES = [
  'Anubis','Cleopatra','Horus','Ra','Nefertiti','Osiris','Isis','Sphinx',
  'Bastet','Thoth','Sobek','Amun','Hathor','Khonsu','Maat','Ptah',
  'Tutankhamun','Ramses','Akhenaten','Scarab','Pharaoh','Nile','Khepri','Sekhmet'
];

// 8 cat avatars — Egyptian goddess theme
const CAT_AVATARS = [
  { id:'bastet',   name:'Bastet',   body:'#1a1a2e', eye:'#f6d365', accent:'#d4af37', desc:'Golden eye · Guardian' },
  { id:'mau',      name:'Mau',      body:'#2c1810', eye:'#34c759', accent:'#b8860b', desc:'Emerald eye · Swift' },
  { id:'nefertiti',name:'Nefertiti',body:'#0d0d1a', eye:'#3b6fe0', accent:'#9b59b6', desc:'Sapphire eye · Royal' },
  { id:'cleocatra',name:'Cleocatra',body:'#1a0a1e', eye:'#e84393', accent:'#f6d365', desc:'Rose eye · Charmer' },
  { id:'luna',     name:'Luna',     body:'#0f111a', eye:'#e0e0e0', accent:'#c0c0c0', desc:'Moon eye · Mystic' },
  { id:'isis',     name:'Isis',     body:'#122018', eye:'#2ecc71', accent:'#1abc9c', desc:'Jade eye · Healer' },
  { id:'sphinx',   name:'Sphinx',   body:'#1c120a', eye:'#ff9f0a', accent:'#d4af37', desc:'Amber eye · Watcher' },
  { id:'rose',     name:'Rose',     body:'#1a0d14', eye:'#ff6b81', accent:'#fdcb6e', desc:'Blush eye · Beloved' }
];

// Built-in sticker packs (SVG-based, no external assets)
const STICKER_PACKS = {
  cats: [
    { id:'cat-love',   emoji:'😻' },
    { id:'cat-cool',   emoji:'😺' },
    { id:'cat-cry',    emoji:'😿' },
    { id:'cat-angry',  emoji:'😾' },
    { id:'cat-wow',    emoji:'🙀' },
    { id:'cat-heart',  emoji:'😽' },
    { id:'cat-party',  emoji:'🎉🐱' },
    { id:'cat-sleep',  emoji:'😴🐱' },
  ],
  moods: [
    { id:'mood-love',   emoji:'💕' },
    { id:'mood-fire',   emoji:'🔥' },
    { id:'mood-star',   emoji:'✨' },
    { id:'mood-crown',  emoji:'👑' },
    { id:'mood-100',    emoji:'💯' },
    { id:'mood-lol',    emoji:'😂' },
    { id:'mood-wow',    emoji:'🤩' },
    { id:'mood-ghost',  emoji:'👻' },
  ],
  egypt: [
    { id:'egypt-ankh',  emoji:'☥' },
    { id:'egypt-eye',   emoji:'🧿' },
    { id:'egypt-cat',   emoji:'🐈' },
    { id:'egypt-moon',  emoji:'🌙' },
    { id:'egypt-sun',   emoji:'☀️' },
    { id:'egypt-pyramid', emoji:'🔺' },
    { id:'egypt-gold',  emoji:'🥇' },
    { id:'egypt-bless', emoji:'🙏✨' },
  ]
};

let stickerTab = 'cats';

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  { urls: 'stun:stun.openrelay.metered.ca:80' },
  { urls: 'stun:global.stun.twilio.com:3478' },
  { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' }
];

// ====== Helpers ======
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

// ====== Sound FX ======
const SoundFX = {
  ctx: null, enabled: localStorage.getItem('sounds') !== 'off',
  ensure() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(freq, dur, delay, gain, type) {
    if (!this.enabled) return; this.ensure(); if (!this.ctx) return;
    const t0 = this.ctx.currentTime + (delay || 0);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type || 'sine'; osc.frequency.value = freq;
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
  tap()     { this.tone(880, 0.05, 0, 0.025); },
  catchEm() { this.tone(660, 0.06, 0, 0.06); this.tone(880, 0.08, 0.06, 0.05); this.tone(1100, 0.1, 0.12, 0.04); },
  gameOver(){ this.tone(440, 0.15, 0, 0.06); this.tone(554, 0.12, 0.15, 0.05); this.tone(660, 0.2, 0.3, 0.06); },
  meow() { this.tone(580, 0.15, 0, 0.05, 'triangle'); this.tone(720, 0.12, 0.06, 0.04, 'triangle'); this.tone(520, 0.18, 0.12, 0.03, 'triangle'); }
};

// ====== State ======
let socket = null, localStream = null;
let micOn = false, myName = '', myRoom = '', myId = '', myRole = 'member', myAvatar = 'bastet';
const peerConnections = new Map();
const userNames = new Map();     // id -> name
const userAvatars = new Map();   // id -> avatarId
const userRoles = new Map();     // id -> role
const userAudioOn = new Map();   // id -> audioOn
const userMuted = new Map();     // id -> mutedByAdmin
const userSpeaking = new Map();  // id -> bool
let reconnectingPeers = new Set();
let unread = 0, typingTimer = null, typingHideTimer = null, lastTypingSent = 0;
let audioCtx = null, analyser = null, isSpeakingLocal = false;

// Game state
let gameActive = false, gameScores = {}, gameRound = 0, gamePhase = 'idle';
let selectedAvatar = 'bastet';

// ====== DOM ======
const joinScreen = document.getElementById('join-screen');
const chatScreen = document.getElementById('chat-screen');
const nameInput = document.getElementById('name-input');
const roomInput = document.getElementById('room-input');
const joinBtn = document.getElementById('join-btn');
const diceBtn = document.getElementById('dice-btn');
const avatarRow = document.getElementById('avatar-row');
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
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const searchToggleBtn = document.getElementById('search-toggle-btn');
const searchCloseBtn = document.getElementById('search-close-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const actionSheet = document.getElementById('action-sheet');
const actionTarget = document.getElementById('action-target');
const actionButtons = document.getElementById('action-buttons');
const actionCancel = document.getElementById('action-cancel');
const gamePanel = document.getElementById('game-panel');
const gameBtn = document.getElementById('game-btn');
const gameCloseBtn = document.getElementById('game-close-btn');
const gameScoreboard = document.getElementById('game-scoreboard');
const gameArena = document.getElementById('game-arena');
const gameCat = document.getElementById('game-cat');
const gameMessage = document.getElementById('game-message');
const gameStartBtn = document.getElementById('game-start-btn');
const gameEndBtn = document.getElementById('game-end-btn');
const kickedOverlay = document.getElementById('kicked-overlay');
const codeInput = document.getElementById('code-input');
const joinError = document.getElementById('join-error');
const stickerBtn = document.getElementById('sticker-btn');
const stickerPicker = document.getElementById('sticker-picker');
const stickerGrid = document.getElementById('sticker-grid');
const gameBadge = document.getElementById('game-badge');

// ====== Init ======
applyLang(currentLang);
const urlRoom = new URLSearchParams(window.location.search).get('room');
if (urlRoom) roomInput.value = urlRoom;
nameInput.placeholder = EGYPTIAN_NAMES[Math.floor(Math.random() * EGYPTIAN_NAMES.length)];

// --- Avatar picker ---
function renderAvatars() {
  avatarRow.innerHTML = '';
  CAT_AVATARS.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'avatar-choice' + (cat.id === selectedAvatar ? ' selected' : '');
    btn.dataset.avatar = cat.id;
    btn.title = cat.name + ' · ' + cat.desc;
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', cat.id === selectedAvatar ? 'true' : 'false');
    btn.innerHTML = renderCatSVG(cat.id, 44);
    const label = document.createElement('span');
    label.className = 'avatar-label';
    label.textContent = cat.name;
    btn.appendChild(label);
    btn.onclick = () => {
      haptic(5); SoundFX.tap();
      selectedAvatar = cat.id;
      renderAvatars();
    };
    avatarRow.appendChild(btn);
  });
}

function renderCatSVG(avatarId, size) {
  const cat = CAT_AVATARS.find(c => c.id === avatarId) || CAT_AVATARS[0];
  const s = size || 44;
  const strokeW = Math.max(1.5, s * 0.045);
  const earH = s * 0.28, earW = s * 0.16;
  const eyeR = s * 0.08, eyeY = s * 0.42, eyeOffX = s * 0.16;
  const noseY = s * 0.52, noseH = s * 0.05, noseW = s * 0.06;
  const mouthY = s * 0.58;
  const whiskerY = s * 0.5, whiskerLen = s * 0.18, whiskerOff = s * 0.08;

  return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
    <defs>
      <radialGradient id="glow-${avatarId}" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stop-color="${cat.accent}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${cat.accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="${s/2}" cy="${s/2}" r="${s*0.42}" fill="url(#glow-${avatarId})"/>
    <!-- Head -->
    <ellipse cx="${s/2}" cy="${s*0.48}" rx="${s*0.32}" ry="${s*0.30}" fill="${cat.body}"/>
    <!-- Ears -->
    <polygon points="${s*0.22},${s*0.22} ${s*0.30},${s*0.10} ${s*0.38},${s*0.24}" fill="${cat.body}"/>
    <polygon points="${s*0.78},${s*0.22} ${s*0.70},${s*0.10} ${s*0.62},${s*0.24}" fill="${cat.body}"/>
    <polygon points="${s*0.25},${s*0.21} ${s*0.30},${s*0.13} ${s*0.35},${s*0.23}" fill="${cat.accent}" opacity="0.3"/>
    <polygon points="${s*0.75},${s*0.21} ${s*0.70},${s*0.13} ${s*0.65},${s*0.23}" fill="${cat.accent}" opacity="0.3"/>
    <!-- Eyes -->
    <ellipse cx="${s/2 - eyeOffX}" cy="${eyeY}" rx="${eyeR*1.3}" ry="${eyeR}" fill="${cat.eye}"/>
    <ellipse cx="${s/2 + eyeOffX}" cy="${eyeY}" rx="${eyeR*1.3}" ry="${eyeR}" fill="${cat.eye}"/>
    <ellipse cx="${s/2 - eyeOffX}" cy="${eyeY}" rx="${eyeR*0.5}" ry="${eyeR*0.8}" fill="#111"/>
    <ellipse cx="${s/2 + eyeOffX}" cy="${eyeY}" rx="${eyeR*0.5}" ry="${eyeR*0.8}" fill="#111"/>
    <circle cx="${s/2 - eyeOffX + eyeR*0.15}" cy="${eyeY - eyeR*0.15}" r="${eyeR*0.2}" fill="#fff" opacity="0.8"/>
    <circle cx="${s/2 + eyeOffX + eyeR*0.15}" cy="${eyeY - eyeR*0.15}" r="${eyeR*0.2}" fill="#fff" opacity="0.8"/>
    <!-- Nose -->
    <polygon points="${s/2 - noseW},${noseY} ${s/2 + noseW},${noseY} ${s/2},${noseY + noseH}" fill="${cat.accent}" opacity="0.7"/>
    <!-- Mouth -->
    <path d="M${s/2},${noseY + noseH} Q${s/2 - eyeR},${mouthY} ${s/2 - eyeR*1.5},${mouthY + s*0.04}" fill="none" stroke="${cat.accent}" stroke-width="${strokeW*0.6}" stroke-opacity="0.5" stroke-linecap="round"/>
    <path d="M${s/2},${noseY + noseH} Q${s/2 + eyeR},${mouthY} ${s/2 + eyeR*1.5},${mouthY + s*0.04}" fill="none" stroke="${cat.accent}" stroke-width="${strokeW*0.6}" stroke-opacity="0.5" stroke-linecap="round"/>
    <!-- Whiskers -->
    <line x1="${s/2 - whiskerOff}" y1="${whiskerY}" x2="${s/2 - whiskerOff - whiskerLen}" y2="${whiskerY - s*0.04}" stroke="${cat.accent}" stroke-width="${strokeW*0.35}" stroke-opacity="0.35" stroke-linecap="round"/>
    <line x1="${s/2 - whiskerOff}" y1="${whiskerY + s*0.04}" x2="${s/2 - whiskerOff - whiskerLen}" y2="${whiskerY + s*0.08}" stroke="${cat.accent}" stroke-width="${strokeW*0.35}" stroke-opacity="0.35" stroke-linecap="round"/>
    <line x1="${s/2 + whiskerOff}" y1="${whiskerY}" x2="${s/2 + whiskerOff + whiskerLen}" y2="${whiskerY - s*0.04}" stroke="${cat.accent}" stroke-width="${strokeW*0.35}" stroke-opacity="0.35" stroke-linecap="round"/>
    <line x1="${s/2 + whiskerOff}" y1="${whiskerY + s*0.04}" x2="${s/2 + whiskerOff + whiskerLen}" y2="${whiskerY + s*0.08}" stroke="${cat.accent}" stroke-width="${strokeW*0.35}" stroke-opacity="0.35" stroke-linecap="round"/>
    <!-- Crown on head (pharaoh cat!) -->
    <path d="M${s*0.35},${s*0.17} L${s*0.31},${s*0.08} L${s*0.38},${s*0.13} L${s*0.44},${s*0.06} L${s*0.5},${s*0.14} L${s*0.56},${s*0.06} L${s*0.62},${s*0.13} L${s*0.69},${s*0.08} L${s*0.65},${s*0.17}" fill="${cat.accent}" opacity="0.6"/>
  </svg>`;
}

renderAvatars();

// Dice button
diceBtn.onclick = () => {
  nameInput.value = EGYPTIAN_NAMES[Math.floor(Math.random() * EGYPTIAN_NAMES.length)];
  haptic(6); SoundFX.tap();
};

// Emoji grid
EMOJIS.forEach(emoji => {
  const btn = document.createElement('button');
  btn.className = 'emoji-item';
  btn.textContent = emoji;
  btn.onclick = () => { messageInput.value += emoji; messageInput.focus(); haptic(4); };
  emojiGrid.appendChild(btn);
});

// Sticker grid
function renderStickerGrid(tab) {
  stickerGrid.innerHTML = '';
  const stickers = STICKER_PACKS[tab] || STICKER_PACKS.cats;
  stickers.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'sticker-item';
    btn.innerHTML = '<span class="sticker-emoji" style="font-size:38px">' + s.emoji + '</span>';
    btn.onclick = () => {
      sendSticker(s.emoji);
      stickerPicker.classList.add('hidden');
      haptic(8);
    };
    stickerGrid.appendChild(btn);
  });
}
renderStickerGrid(stickerTab);

// Sticker tab switches
document.querySelectorAll('.picker-tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.picker-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    stickerTab = tab.dataset.tab;
    renderStickerGrid(stickerTab);
    haptic(4);
  };
});

// Sticker button
stickerBtn.onclick = (e) => {
  e.stopPropagation();
  stickerPicker.classList.toggle('hidden');
  emojiPicker.classList.add('hidden');
  haptic(5);
};
document.addEventListener('click', (e) => {
  if (!stickerPicker.contains(e.target) && e.target !== stickerBtn && !stickerBtn.contains(e.target)) {
    stickerPicker.classList.add('hidden');
  }
});

function sendSticker(emoji) {
  if (!socket || !socket.connected) return;
  socket.emit('chat-message', { message: '', emoji: emoji });
  SoundFX.send();
  haptic(6);
}

// Language controls
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

// ====== Unread badge ======
function bumpUnread() {
  if (document.hidden) { unread++; document.title = `(${unread}) Pharaoh Voice`; }
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { unread = 0; document.title = 'Pharaoh Voice'; }
});

// ====== Drawer ======
function openDrawer() { participantsPanel.classList.add('drawer-open'); drawerBackdrop.classList.remove('hidden'); }
function closeDrawer() { participantsPanel.classList.remove('drawer-open'); drawerBackdrop.classList.add('hidden'); }
menuBtn.onclick = () => { participantsPanel.classList.contains('drawer-open') ? closeDrawer() : openDrawer(); haptic(5); };
drawerBackdrop.onclick = closeDrawer;

// ====== Role helpers ======
function roleBadge(role) {
  if (role === 'owner') return ' 👑';
  if (role === 'admin') return ' ⭐';
  return '';
}

function roleLabel(role) {
  if (role === 'owner') return t('roleOwner');
  if (role === 'admin') return t('roleAdmin');
  return t('roleMember');
}

// ====== Action Sheet ======
function openActionSheet(userId) {
  if (userId === myId) return;
  const targetRole = userRoles.get(userId) || 'member';
  const targetName = userNames.get(userId) || 'Member';
  const targetAv = userAvatars.get(userId) || 'bastet';

  actionTarget.innerHTML = `
    <div class="action-avatar">${renderCatSVG(targetAv, 48)}</div>
    <div class="action-name">${escapeHtml(targetName)} <span class="action-role">${roleLabel(targetRole)}</span></div>
  `;
  actionButtons.innerHTML = '';

  const actions = [];
  if (myRole === 'owner') {
    actions.push(
      { action: 'kick', label: t('actionKick'), cls: 'danger' },
      { action: 'mute', label: t('actionMute'), cls: '' },
      { action: 'unmute', label: t('actionUnmute'), cls: '' }
    );
    if (targetRole === 'member') actions.push({ action: 'promote', label: t('actionPromote'), cls: '' });
    if (targetRole === 'admin') actions.push({ action: 'demote', label: t('actionDemote'), cls: '' });
  } else if (myRole === 'admin') {
    if (targetRole === 'member') {
      actions.push(
        { action: 'kick', label: t('actionKick'), cls: 'danger' },
        { action: 'mute', label: t('actionMute'), cls: '' },
        { action: 'unmute', label: t('actionUnmute'), cls: '' }
      );
    }
  }

  if (actions.length === 0) {
    actionButtons.innerHTML = '<div class="action-hint">' + t('roleOwner') + ' / ' + t('roleAdmin') + ' only</div>';
  } else {
    actions.forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'sheet-btn' + (a.cls ? ' ' + a.cls : '');
      btn.textContent = a.label;
      btn.onclick = () => {
        socket.emit('admin-action', { target: userId, action: a.action });
        closeActionSheet();
        haptic(8);
      };
      actionButtons.appendChild(btn);
    });
  }

  // Store target id
  actionSheet.dataset.target = userId;
  actionSheet.classList.remove('hidden');
}

function closeActionSheet() {
  actionSheet.classList.add('hidden');
  actionSheet.dataset.target = '';
}
actionCancel.onclick = closeActionSheet;
actionSheet.addEventListener('click', (e) => {
  if (e.target === actionSheet) closeActionSheet();
});

// ====== Participants ======
function updateParticipants() {
  participantsList.innerHTML = '';

  // Me
  const meLi = document.createElement('li');
  meLi.className = 'participant' + (isSpeakingLocal ? ' speaking' : '');
  meLi.innerHTML = `
    <div class="avatar av-svg">${renderCatSVG(myAvatar, 38)}</div>
    <div class="info">
      <div class="name">${escapeHtml(myName)}
        <span class="you-tag">(${t('you')})</span>
        <span class="role-badge">${roleBadge(myRole)}</span>
      </div>
      <div class="status">${isSpeakingLocal ? t('speaking') : (micOn ? t('micOff') : t('muted'))}</div>
    </div>
    <div class="mic-indicator ${micOn ? 'mic-on' : 'mic-off'}">${micOn ? '🎙' : '🔇'}</div>
  `;
  participantsList.appendChild(meLi);

  // Others — sorted: owner first, then admins, then members
  const sorted = Array.from(userNames.entries()).sort((a, b) => {
    const rA = userRoles.get(a[0]) || 'member';
    const rB = userRoles.get(b[0]) || 'member';
    const order = { owner: 0, admin: 1, member: 2 };
    return (order[rA] || 2) - (order[rB] || 2);
  });

  sorted.forEach(([id, name]) => {
    const audioOn = userAudioOn.get(id) || false;
    const muted = userMuted.get(id) || false;
    const speaking = userSpeaking.get(id) || false;
    const role = userRoles.get(id) || 'member';
    const av = userAvatars.get(id) || 'bastet';

    const p = document.createElement('li');
    p.className = 'participant clickable' + (speaking ? ' speaking' : '');
    p.id = 'participant-' + id;
    p.dataset.userId = id;
    p.innerHTML = `
      <div class="avatar av-svg">${renderCatSVG(av, 38)}</div>
      <div class="info">
        <div class="name">${escapeHtml(name)}<span class="role-badge">${roleBadge(role)}</span></div>
        <div class="status">${speaking ? t('speaking') : (muted ? t('muted') + ' 🔒' : (audioOn ? t('micOff') : t('muted')))}</div>
      </div>
      <div class="mic-indicator ${audioOn ? 'mic-on' : 'mic-off'}">${muted ? '🔒' : (audioOn ? '🎙' : '🔇')}</div>
    `;

    p.onclick = () => {
      if (myRole === 'owner' || myRole === 'admin') {
        openActionSheet(id);
        haptic(5);
      }
    };
    participantsList.appendChild(p);
  });

  userCount.textContent = 1 + userNames.size;
}

// ====== Chat ======
function ensureNotEmpty() {
  if (emptyState && emptyState.parentNode) emptyState.remove();
}

function addChatMessage(id, name, avatarId, text, emoji, isSelf, timestamp) {
  ensureNotEmpty();
  const msg = document.createElement('div');
  msg.className = 'message' + (isSelf ? ' self' : '');
  msg.dataset.text = (text + ' ' + (emoji || '')).toLowerCase();
  msg.dataset.sender = name.toLowerCase();
  msg.dataset.self = isSelf ? '1' : '0';

  if (!isSelf) {
    const avatar = document.createElement('div');
    avatar.className = 'avatar av-svg';
    avatar.innerHTML = renderCatSVG(avatarId || 'bastet', 34);
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
  const isSticker = emoji && !text;
  bubble.className = 'bubble' + (isSticker ? ' sticker-bubble' : '');
  const textEl = document.createElement('div');
  textEl.className = 'text';
  if (isSticker) {
    textEl.classList.add('emoji-only');
    if (emoji.length <= 6) {
      // Large emoji sticker
      textEl.innerHTML = '<span class="sticker-emoji">' + escapeHtml(emoji) + '</span>';
    } else {
      textEl.textContent = emoji;
    }
  }
  else { textEl.textContent = text; if (emoji) textEl.textContent += ' ' + emoji; }
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

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit('chat-message', { message: text, emoji: '' });
  messageInput.value = '';
  emojiPicker.classList.add('hidden');
  SoundFX.send(); haptic(6);
}

sendBtn.onclick = sendMessage;
messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

messageInput.addEventListener('input', () => {
  const now = Date.now();
  if (socket && socket.connected && messageInput.value.trim() && now - lastTypingSent > 1500) {
    lastTypingSent = now;
    socket.emit('typing');
  }
});

// ====== Chat Search ======
searchToggleBtn.onclick = () => {
  searchBar.classList.toggle('hidden');
  if (!searchBar.classList.contains('hidden')) searchInput.focus();
  else { searchInput.value = ''; filterMessages(''); }
  haptic(5);
};

searchCloseBtn.onclick = () => {
  searchBar.classList.add('hidden');
  searchInput.value = '';
  filterMessages('');
};

searchInput.addEventListener('input', () => {
  filterMessages(searchInput.value.toLowerCase());
});

function filterMessages(query) {
  const msgs = chatMessages.querySelectorAll('.message');
  msgs.forEach(m => {
    if (!query) { m.classList.remove('search-hidden'); return; }
    const text = m.dataset.text || '';
    const sender = m.dataset.sender || '';
    m.classList.toggle('search-hidden', !text.includes(query) && !sender.includes(query));
  });
}

// Clear chat
clearChatBtn.onclick = () => {
  haptic(8);
  const msgs = chatMessages.querySelectorAll('.message');
  msgs.forEach(m => m.remove());
  // Re-insert empty state if no more messages
  if (chatMessages.querySelectorAll('.message').length === 0 && !chatMessages.contains(emptyState)) {
    chatMessages.appendChild(emptyState);
  }
  showToast('Chat cleared locally');
};

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
    micOn = false; isSpeakingLocal = false;
    micToggle.classList.remove('mic-on'); micToggle.classList.add('mic-off');
    socket.emit('audio-toggle', { on: false });
    socket.emit('speaking', { speaking: false });
  }
  updateParticipants();
};

// ====== Speaking Detection ======
function startSpeakingDetection(stream) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    (function loop() {
      if (!micOn) { if (isSpeakingLocal) { isSpeakingLocal = false; socket.emit('speaking', { speaking: false }); updateParticipants(); } return; }
      analyser.getByteFrequencyData(data);
      let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i];
      const speaking = (sum / data.length) > 12;
      if (speaking !== isSpeakingLocal) { isSpeakingLocal = speaking; socket.emit('speaking', { speaking }); updateParticipants(); }
      requestAnimationFrame(loop);
    })();
  } catch (e) {}
}

// ====== WebRTC ======
function createPeerConnection(userId, isInitiator) {
  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS, iceTransportPolicy: 'all' });
  if (localStream) localStream.getAudioTracks().forEach(track => pc.addTrack(track, localStream));

  pc.ontrack = (event) => {
    const audioId = 'audio-' + userId;
    let audioEl = document.getElementById(audioId);
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = audioId; audioEl.autoplay = true; audioEl.setAttribute('playsinline', '');
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
          pc.close(); peerConnections.delete(userId);
          createPeerConnection(userId, true);
          reconnectingPeers.delete(userId);
        }
      }, 3000);
    }
  };

  peerConnections.set(userId, pc);
  if (isInitiator) {
    pc.createOffer().then(offer => pc.setLocalDescription(offer))
      .then(() => socket.emit('webrtc-offer', { target: userId, sdp: pc.localDescription }))
      .catch(e => console.error('[WebRTC] Offer error:', e));
  }
  return pc;
}

// ====== Copy Link ======
copyLinkBtn.onclick = () => {
  const url = window.location.origin + '?room=' + encodeURIComponent(myRoom);
  haptic(8);
  navigator.clipboard.writeText(url).then(() => showToast(t('copySuccess'), true))
    .catch(() => { prompt(t('copyLink') + ':', url); });
};

// ====== Leave ======
leaveBtn.onclick = () => {
  haptic(10);
  cleanupAndReload();
};
function cleanupAndReload() {
  if (socket) socket.disconnect();
  if (localStream) localStream.getTracks().forEach(tr => tr.stop());
  peerConnections.forEach(pc => pc.close()); peerConnections.clear();
  location.reload();
}

// ====== Golden Mau Game ======
function renderGameScoreboard() {
  if (!gameActive) {
    gameScoreboard.innerHTML = '';
    return;
  }
  const sorted = Object.entries(gameScores).sort((a, b) => b[1].score - a[1].score);
  gameScoreboard.innerHTML = sorted.map(([id, s]) => {
    const av = userAvatars.get(id) || 'bastet';
    const name = s.name || userNames.get(id) || 'Player';
    return `<div class="game-player" id="game-player-${id}">
      <span class="game-avatar">${renderCatSVG(av, 28)}</span>
      <span class="game-name">${escapeHtml(name)}</span>
      <span class="game-bar-wrap"><span class="game-bar" style="width:${(s.score/WIN_SCORE)*100}%"></span></span>
      <span class="game-score">${s.score}/${WIN_SCORE}</span>
    </div>`;
  }).join('');
}

function openGame() { gamePanel.classList.remove('hidden'); gameBadge.classList.add('hidden'); }
function closeGame() { gamePanel.classList.add('hidden'); }
gameBtn.onclick = () => { openGame(); haptic(5); };
gameCloseBtn.onclick = closeGame;
gamePanel.addEventListener('click', (e) => { if (e.target === gamePanel) closeGame(); });

gameStartBtn.onclick = () => {
  socket.emit('game-start');
  haptic(8);
};

gameEndBtn.onclick = () => {
  socket.emit('game-end');
  haptic(8);
};

// Game events
function handleGameCat(data) {
  if (!gameActive) return;
  gamePhase = 'shown';
  gameRound = data.round;
  gameCat.classList.remove('hidden');
  gameCat.style.left = data.x + '%';
  gameCat.style.top = data.y + '%';
  gameCat.style.setProperty('--cat-x', data.x + '%');
  gameCat.style.setProperty('--cat-y', data.y + '%');
  gameMessage.textContent = t('gameCat');
  gameMessage.className = 'game-message active';
}

gameCat.onclick = () => {
  if (gamePhase !== 'shown') return;
  socket.emit('game-catch', { round: gameRound });
  gameCat.classList.add('hidden');
  gamePhase = 'resolved';
  haptic(20);
  SoundFX.catchEm();
  SoundFX.meow();
};

function handleGameResult(data) {
  gameScores = data.scores;
  gameMessage.textContent = data.winnerId === myId ? t('gameCatch') : (data.winnerName + ' ' + t('gameCatch'));
  gameMessage.className = 'game-message active';
  renderGameScoreboard();
  gameCat.classList.add('hidden');
  gamePhase = 'resolved';
}

function handleGameEscape(data) {
  gameScores = data.scores;
  gameMessage.textContent = t('gameEscaped');
  gameMessage.className = 'game-message escaped';
  gameCat.classList.add('hidden');
  gamePhase = 'resolved';
  setTimeout(() => { renderGameScoreboard(); }, 500);
}

function handleGameOver(data) {
  gameActive = false;
  gamePhase = 'idle';
  gameScores = {};
  SoundFX.gameOver();
  gameMessage.innerHTML = '<span class="trophy">🏆</span> ' + t('gameOver', { name: data.championName });
  gameMessage.className = 'game-message winner';
  gameCat.classList.add('hidden');
  renderGameScoreboard();
  gameStartBtn.classList.remove('hidden');
  gameEndBtn.classList.add('hidden');
}

// Restore game state if already active
function restoreGameState() {
  if (gameActive) {
    gameStartBtn.classList.add('hidden');
    gameEndBtn.classList.remove('hidden');
    renderGameScoreboard();
    if (gamePhase === 'shown') {
      gameMessage.textContent = t('gameCat');
      gameMessage.className = 'game-message active';
    }
  }
}

// ====== Join Room ======
joinBtn.onclick = () => {
  const name = nameInput.value.trim() || nameInput.placeholder || ('Pharaoh' + Math.floor(Math.random() * 1000));
  const room = roomInput.value.trim() || 'pyramid';
  const code = codeInput.value.trim();
  myName = name;
  myRoom = room;
  myAvatar = selectedAvatar;

  SoundFX.ensure();
  haptic(10);

  socket = io({
    reconnection: true, reconnectionAttempts: Infinity,
    reconnectionDelay: 1000, reconnectionDelayMax: 8000,
    timeout: 20000, transports: ['websocket', 'polling']
  });

  // --- Access denied ---
  socket.on('access-denied', () => {
    joinError.classList.remove('hidden');
    codeInput.focus();
    codeInput.select();
    haptic(15);
    setTimeout(() => joinError.classList.add('hidden'), 3000);
  });

  // --- Connection lifecycle ---
  socket.on('connect', () => {
    setConnStatus('stable');
    socket.emit('join-room', { name, room, avatar: myAvatar, code });
  });
  socket.on('connect_error', () => setConnStatus('reconnecting'));
  socket.on('disconnect', () => setConnStatus('reconnecting'));
  socket.on('reconnect', () => {
    setConnStatus('stable');
    showToast(t('connRestored'), true);
    socket.emit('join-room', { name: myName, room: myRoom, avatar: myAvatar, code: codeInput.value.trim() });
    userNames.forEach((_, userId) => {
      if (!peerConnections.has(userId)) createPeerConnection(userId, true);
    });
  });
  socket.on('reconnect_attempt', () => setConnStatus('reconnecting'));

  // --- Joined: receive YOUR identity ---
  socket.on('joined', (data) => {
    myId = data.id;
    myRole = data.role || 'member';
    if (data.game && data.game.active) {
      gameActive = true;
      gameScores = data.game.scores || {};
      gameRound = data.game.round || 0;
    }
    restoreGameState();
  });

  // --- Roster: full member list with roles ---
  socket.on('roster', (roster) => {
    userNames.clear(); userAvatars.clear(); userRoles.clear();
    userAudioOn.clear(); userMuted.clear();
    roster.forEach(u => {
      if (u.id === myId) { myRole = u.role || 'member'; return; }
      userNames.set(u.id, u.name);
      userAvatars.set(u.id, u.avatar || 'bastet');
      userRoles.set(u.id, u.role || 'member');
      userAudioOn.set(u.id, u.audioOn || false);
      userMuted.set(u.id, u.muted || false);
      if (!peerConnections.has(u.id)) createPeerConnection(u.id, true);
    });
    updateParticipants();
  });

  // --- User joined ---
  socket.on('user-joined', (data) => {
    userNames.set(data.id, data.name);
    userAvatars.set(data.id, data.avatar || 'bastet');
    userRoles.set(data.id, 'member');
    userAudioOn.set(data.id, false);
    userMuted.set(data.id, false);
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
    if (pc) { try { await pc.addIceCandidate(data.candidate); } catch (e) {} }
  });

  // --- Audio state ---
  socket.on('audio-state', (data) => {
    userAudioOn.set(data.id, !!data.on);
    if (!data.on) userSpeaking.set(data.id, false);
    updateParticipants();
  });

  socket.on('user-speaking', (data) => {
    userSpeaking.set(data.id, !!data.speaking);
    const el = document.getElementById('participant-' + data.id);
    if (el) {
      el.classList.toggle('speaking', !!data.speaking);
      const status = el.querySelector('.status');
      if (status) status.textContent = data.speaking ? t('speaking') : (userMuted.get(data.id) ? t('muted') + ' 🔒' : (userAudioOn.get(data.id) ? t('micOff') : t('muted')));
    }
  });

  // --- Typing ---
  socket.on('user-typing', (data) => {
    if (data.id === myId) return;
    typingText.textContent = t('typing', { name: data.name });
    typingIndicator.classList.remove('hidden');
    clearTimeout(typingHideTimer);
    typingHideTimer = setTimeout(() => typingIndicator.classList.add('hidden'), 3000);
  });

  // --- Chat ---
  socket.on('chat-message', (data) => {
    const isSelf = data.id === myId;
    addChatMessage(data.id, data.name, data.avatar, data.message, data.emoji, isSelf, data.timestamp);
    if (!isSelf) { SoundFX.receive(); bumpUnread(); }
    typingIndicator.classList.add('hidden');
  });

  // --- User left ---
  socket.on('user-left', (userId) => {
    const name = userNames.get(userId) || 'Member';
    addSystemMessage(t('leftRoom', { name }));
    SoundFX.leave();
    userNames.delete(userId); userAvatars.delete(userId); userRoles.delete(userId);
    userAudioOn.delete(userId); userMuted.delete(userId); userSpeaking.delete(userId);
    const pc = peerConnections.get(userId);
    if (pc) { pc.close(); peerConnections.delete(userId); }
    const audioEl = document.getElementById('audio-' + userId);
    if (audioEl) audioEl.remove();
    updateParticipants();
  });

  // --- Role changed event ---
  socket.on('role-changed', (data) => {
    myRole = data.role;
    showToast(t('roleChanged', { role: roleLabel(data.role) }), true);
    updateParticipants();
  });

  // --- Force mute (by admin) ---
  socket.on('force-muted', () => {
    if (localStream) localStream.getAudioTracks().forEach(tr => tr.enabled = false);
    micOn = false; isSpeakingLocal = false;
    micToggle.classList.remove('mic-on'); micToggle.classList.add('mic-off');
    socket.emit('speaking', { speaking: false });
    updateParticipants();
    showToast(t('forceMuted'));
  });

  socket.on('force-unmuted', () => {
    showToast(t('forceUnmuted'), true);
  });

  // --- Kicked ---
  socket.on('kicked', () => {
    kickedOverlay.classList.remove('hidden');
    // Clean up connections but don't reload yet
    if (socket) socket.disconnect();
    if (localStream) localStream.getTracks().forEach(tr => tr.stop());
    peerConnections.forEach(pc => pc.close()); peerConnections.clear();
  });

  // ====== Golden Mau game events ======
  socket.on('game-started', (data) => {
    gameActive = true;
    gameScores = data.scores || {};
    gamePhase = 'waiting';
    gameMessage.textContent = t('gameStarted');
    gameMessage.className = 'game-message active';
    gameStartBtn.classList.add('hidden');
    gameEndBtn.classList.remove('hidden');
    renderGameScoreboard();
    // Show badge notification instead of force-opening panel
    gameBadge.textContent = '!';
    gameBadge.classList.remove('hidden');
    showToast(t('gameInvite'), true);
    SoundFX.tap();
  });

  socket.on('game-round', (data) => {
    gameScores = data.scores;
    gameRound = data.round;
    gamePhase = 'waiting';
    gameMessage.textContent = '☥ Round ' + data.round + ' — ' + t('gameDesc');
    gameMessage.className = 'game-message';
    gameCat.classList.add('hidden');
    renderGameScoreboard();
  });

  socket.on('game-cat', (data) => {
    handleGameCat(data);
  });

  socket.on('game-result', (data) => {
    handleGameResult(data);
  });

  socket.on('game-escape', (data) => {
    handleGameEscape(data);
  });

  socket.on('game-over', (data) => {
    handleGameOver(data);
    gameBadge.classList.add('hidden');
  });

  socket.on('game-ended', (data) => {
    gameActive = false;
    gamePhase = 'idle';
    gameScores = {};
    gameMessage.textContent = data.reason === 'stopped' ? 'Game ended by host' : t('gameDesc');
    gameMessage.className = 'game-message';
    gameCat.classList.add('hidden');
    renderGameScoreboard();
    gameStartBtn.classList.remove('hidden');
    gameEndBtn.classList.add('hidden');
    gameBadge.classList.add('hidden');
  });

  // --- Keep alive ---
  socket.on('pong', () => {});

  // Switch screens
  joinScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  roomNameDisplay.textContent = room;
  messageInput.focus();
};

// ====== Enter key to join ======
[nameInput, roomInput].forEach(input => {
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') joinBtn.click(); });
});

// ====== Cleanup ======
window.addEventListener('beforeunload', () => {
  if (localStream) localStream.getTracks().forEach(tr => tr.stop());
  if (socket) socket.disconnect();
});

// ====== Keep-alive ======
setInterval(() => {
  if (socket && socket.connected) socket.emit('ping', Date.now());
}, 25000);
