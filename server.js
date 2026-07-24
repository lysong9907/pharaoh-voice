const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  maxHttpBufferSize: 1e5,
  pingInterval: 10000,
  pingTimeout: 30000,
  transports: ['websocket', 'polling']
});

// --- Security: HTML sanitizer to prevent XSS ---
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .slice(0, 2000);
}

// ====== State ======
// rooms: Map<roomName, Map<socketId, {name, avatar, role, audioOn, mutedByAdmin}>>
// role: 'owner' | 'admin' | 'member'
const rooms = new Map();
// games: Map<roomName, gameState>
const games = new Map();

const VALID_AVATARS = ['bastet','mau','nefertiti','cleocatra','luna','isis','sphinx','rose'];
function cleanAvatar(a) {
  return VALID_AVATARS.includes(a) ? a : VALID_AVATARS[Math.floor(Math.random() * VALID_AVATARS.length)];
}

function getRoom(name) {
  if (!rooms.has(name)) rooms.set(name, new Map());
  return rooms.get(name);
}

function roster(roomName) {
  const room = getRoom(roomName);
  return Array.from(room.entries()).map(([id, u]) => ({
    id, name: u.name, avatar: u.avatar, role: u.role,
    audioOn: u.audioOn, muted: u.mutedByAdmin
  }));
}

function broadcastRoster(roomName) {
  io.to(roomName).emit('roster', roster(roomName));
}

// --- Role hierarchy validation (server is the only authority) ---
function canManage(actor, target, action) {
  if (!actor || !target || actor === target) return false;
  if (actor.role === 'owner') return target.role !== 'owner';
  if (actor.role === 'admin') return target.role === 'member' && ['kick', 'mute', 'unmute'].includes(action);
  return false;
}

// ====== Golden Mau Game ======
const WIN_SCORE = 5;

function getGame(roomName) {
  if (!games.has(roomName)) {
    games.set(roomName, {
      active: false, scores: new Map(), round: 0, phase: 'idle',
      timer: null, escapeTimer: null, catShownAt: 0
    });
  }
  return games.get(roomName);
}

function clearGameTimers(g) {
  clearTimeout(g.timer);
  clearTimeout(g.escapeTimer);
}

function scoresWithNames(roomName, game) {
  const room = getRoom(roomName);
  const out = {};
  game.scores.forEach((score, id) => {
    const u = room.get(id);
    if (u) out[id] = { score, name: u.name, avatar: u.avatar };
  });
  return out;
}

function scheduleRound(roomName) {
  const game = getGame(roomName);
  if (!game.active) return;
  game.phase = 'waiting';
  game.round++;
  io.to(roomName).emit('game-round', { round: game.round, scores: scoresWithNames(roomName, game) });

  const delay = 1500 + Math.random() * 2500;
  game.timer = setTimeout(() => {
    if (!game.active) return;
    game.phase = 'shown';
    game.catShownAt = Date.now();
    const x = 10 + Math.random() * 72; // percent
    const y = 12 + Math.random() * 66;
    io.to(roomName).emit('game-cat', { round: game.round, x, y });

    game.escapeTimer = setTimeout(() => {
      if (!game.active || game.phase !== 'shown') return;
      game.phase = 'resolved';
      io.to(roomName).emit('game-escape', { round: game.round });
      game.timer = setTimeout(() => scheduleRound(roomName), 1400);
    }, 2600);
  }, delay);
}

function endGame(roomName, reason) {
  const game = getGame(roomName);
  game.active = false;
  clearGameTimers(game);
  game.phase = 'idle';
  io.to(roomName).emit('game-ended', { reason: reason || '' });
}

// --- Serve static files ---
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ====== Socket.io ======
io.on('connection', (socket) => {
  console.log(`[connect] ${socket.id}`);

  let currentRoom = null;
  let userName = 'Pharaoh';

  // --- Join room ---
  socket.on('join-room', (data) => {
    const roomName = sanitize(data.room || 'pyramid').slice(0, 50);
    const name = sanitize(data.name || 'Pharaoh').slice(0, 20);
    const avatar = cleanAvatar(data.avatar);

    if (currentRoom && currentRoom !== roomName) {
      const oldRoom = getRoom(currentRoom);
      oldRoom.delete(socket.id);
      socket.to(currentRoom).emit('user-left', socket.id);
      broadcastRoster(currentRoom);
    }

    currentRoom = roomName;
    userName = name;

    const room = getRoom(roomName);
    const role = room.size === 0 ? 'owner' : 'member';

    room.set(socket.id, { name, avatar, role, audioOn: false, mutedByAdmin: false });
    socket.join(roomName);
    console.log(`[join] ${socket.id} -> "${roomName}" as "${name}" (${role})`);

    // Auto-join active game
    const game = games.get(roomName);
    if (game && game.active) game.scores.set(socket.id, 0);

    // Tell the joiner their identity + game snapshot
    socket.emit('joined', {
      id: socket.id,
      role,
      game: game && game.active
        ? { active: true, round: game.round, scores: scoresWithNames(roomName, game) }
        : { active: false }
    });

    broadcastRoster(roomName);
    socket.to(roomName).emit('user-joined', { id: socket.id, name, avatar });
  });

  // --- WebRTC signaling ---
  socket.on('webrtc-offer', (data) => {
    if (!data || !data.target) return;
    io.to(data.target).emit('webrtc-offer', { from: socket.id, sdp: data.sdp });
  });

  socket.on('webrtc-answer', (data) => {
    if (!data || !data.target) return;
    io.to(data.target).emit('webrtc-answer', { from: socket.id, sdp: data.sdp });
  });

  socket.on('webrtc-ice', (data) => {
    if (!data || !data.target) return;
    io.to(data.target).emit('webrtc-ice', { from: socket.id, candidate: data.candidate });
  });

  // --- Audio state (enforces admin mute) ---
  socket.on('audio-toggle', (data) => {
    if (!currentRoom) return;
    const room = getRoom(currentRoom);
    const user = room.get(socket.id);
    if (!user) return;
    if (user.mutedByAdmin && data.on) {
      socket.emit('force-muted');
      return;
    }
    user.audioOn = !!data.on;
    socket.to(currentRoom).emit('audio-state', { id: socket.id, on: user.audioOn });
    broadcastRoster(currentRoom);
  });

  // --- Admin actions (kick / mute / unmute / promote / demote) ---
  socket.on('admin-action', (data) => {
    if (!currentRoom || !data) return;
    const room = getRoom(currentRoom);
    const actor = room.get(socket.id);
    const target = room.get(data.target);
    const action = data.action;

    if (!canManage(actor, target, action)) return;

    if (action === 'kick') {
      io.to(data.target).emit('kicked');
      const targetSocket = io.sockets.sockets.get(data.target);
      if (targetSocket) targetSocket.disconnect(true);
      room.delete(data.target);
      const game = games.get(currentRoom);
      if (game) game.scores.delete(data.target);
      io.to(currentRoom).emit('user-left', data.target);
      broadcastRoster(currentRoom);
      console.log(`[kick] ${data.target} kicked from "${currentRoom}" by ${socket.id}`);
    } else if (action === 'mute') {
      target.mutedByAdmin = true;
      target.audioOn = false;
      io.to(data.target).emit('force-muted');
      io.to(currentRoom).emit('audio-state', { id: data.target, on: false });
      broadcastRoster(currentRoom);
    } else if (action === 'unmute') {
      target.mutedByAdmin = false;
      io.to(data.target).emit('force-unmuted');
      broadcastRoster(currentRoom);
    } else if (action === 'promote' && actor.role === 'owner') {
      target.role = 'admin';
      io.to(data.target).emit('role-changed', { role: 'admin' });
      broadcastRoster(currentRoom);
    } else if (action === 'demote' && actor.role === 'owner') {
      target.role = 'member';
      io.to(data.target).emit('role-changed', { role: 'member' });
      broadcastRoster(currentRoom);
    }
  });

  // --- Typing indicator ---
  socket.on('typing', () => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('user-typing', { id: socket.id, name: userName });
  });

  // --- Speaking state ---
  socket.on('speaking', (data) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('user-speaking', { id: socket.id, speaking: !!(data && data.speaking) });
  });

  // --- Text chat ---
  socket.on('chat-message', (data) => {
    if (!currentRoom) return;
    const room = getRoom(currentRoom);
    const user = room.get(socket.id);
    const msg = sanitize(data.message || '').slice(0, 500);
    const emoji = sanitize(data.emoji || '').slice(0, 10);
    if (!msg && !emoji) return;

    io.to(currentRoom).emit('chat-message', {
      id: socket.id,
      name: userName,
      avatar: user ? user.avatar : 'bastet',
      message: msg,
      emoji: emoji,
      timestamp: Date.now()
    });
  });

  // ====== Golden Mau game events ======
  socket.on('game-start', () => {
    if (!currentRoom) return;
    const game = getGame(currentRoom);
    if (game.active) return;
    const room = getRoom(currentRoom);
    if (room.size === 0) return;

    game.active = true;
    game.scores = new Map();
    room.forEach((u, id) => game.scores.set(id, 0));
    game.round = 0;
    console.log(`[game] Golden Mau started in "${currentRoom}"`);
    io.to(currentRoom).emit('game-started', { scores: scoresWithNames(currentRoom, game) });
    scheduleRound(currentRoom);
  });

  socket.on('game-catch', (data) => {
    if (!currentRoom || !data) return;
    const game = getGame(currentRoom);
    if (!game.active || game.phase !== 'shown' || data.round !== game.round) return;
    // Anti-cheat: inhuman reaction (<100ms) is ignored
    if (Date.now() - game.catShownAt < 100) return;

    const room = getRoom(currentRoom);
    if (!room.has(socket.id)) return;

    game.phase = 'resolved';
    clearTimeout(game.escapeTimer);

    const newScore = (game.scores.get(socket.id) || 0) + 1;
    game.scores.set(socket.id, newScore);
    const winnerName = room.get(socket.id).name;

    io.to(currentRoom).emit('game-result', {
      round: game.round, winnerId: socket.id, winnerName,
      scores: scoresWithNames(currentRoom, game)
    });

    if (newScore >= WIN_SCORE) {
      const scores = scoresWithNames(currentRoom, game);
      game.active = false;
      clearGameTimers(game);
      game.phase = 'idle';
      io.to(currentRoom).emit('game-over', { championId: socket.id, championName: winnerName, scores });
      console.log(`[game] "${currentRoom}" champion: ${winnerName}`);
    } else {
      game.timer = setTimeout(() => scheduleRound(currentRoom), 1600);
    }
  });

  socket.on('game-end', () => {
    if (!currentRoom) return;
    const room = getRoom(currentRoom);
    const me = room.get(socket.id);
    if (!me || (me.role !== 'owner' && me.role !== 'admin')) return;
    const game = getGame(currentRoom);
    if (game.active) endGame(currentRoom, 'stopped');
  });

  // --- Keep-alive ---
  socket.on('ping', (timestamp) => {
    socket.emit('pong', timestamp);
  });

  // --- Disconnect with grace period ---
  socket.on('disconnect', (reason) => {
    console.log(`[disconnect] ${socket.id} (${reason})`);
    if (currentRoom) {
      const roomName = currentRoom;
      const room = getRoom(roomName);
      setTimeout(() => {
        if (!io.sockets.sockets.has(socket.id)) {
          const user = room.get(socket.id);
          const wasOwner = user && user.role === 'owner';
          room.delete(socket.id);
          const game = games.get(roomName);
          if (game) game.scores.delete(socket.id);

          socket.to(roomName).emit('user-left', socket.id);

          if (room.size === 0) {
            rooms.delete(roomName);
            if (game) { clearGameTimers(game); games.delete(roomName); }
            console.log(`[cleanup] room "${roomName}" deleted`);
          } else {
            // Owner migration: earliest joiner becomes new owner
            if (wasOwner) {
              const nextId = room.keys().next().value;
              const nextUser = room.get(nextId);
              if (nextUser) {
                nextUser.role = 'owner';
                io.to(nextId).emit('role-changed', { role: 'owner' });
                console.log(`[owner] ${nextId} is new owner of "${roomName}"`);
              }
            }
            broadcastRoster(roomName);
          }
        }
      }, 5000);
    }
  });
});

// --- Start server ---
const PORT = process.env.PORT || 3456;
server.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   PHARAOH VOICE — Server Running     ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log('');
  console.log('  Roles: Pharaoh > Vizier > Guest');
  console.log('  Game:  Golden Mau (server-arbitrated)');
  console.log('');
  console.log('════════════════════════════════════════');
});
