const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  maxHttpBufferSize: 1e5,
  pingInterval: 10000,   // send ping every 10s
  pingTimeout: 30000,    // wait 30s before considering disconnected
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

// --- Room state ---
const rooms = new Map();

function getRoom(name) {
  if (!rooms.has(name)) {
    rooms.set(name, new Map());
  }
  return rooms.get(name);
}

// --- Serve static files ---
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Socket.io signaling ---
io.on('connection', (socket) => {
  console.log(`[connect] ${socket.id}`);

  let currentRoom = null;
  let userName = 'Pharaoh';
  let isReconnecting = false;

  // --- Join room ---
  socket.on('join-room', (data) => {
    const roomName = sanitize(data.room || 'pyramid').slice(0, 50);
    const name = sanitize(data.name || 'Pharaoh').slice(0, 20);

    // leave previous room if switching
    if (currentRoom && currentRoom !== roomName) {
      const oldRoom = getRoom(currentRoom);
      oldRoom.delete(socket.id);
      socket.to(currentRoom).emit('user-left', socket.id);
    }

    currentRoom = roomName;
    userName = name;

    const room = getRoom(roomName);

    // Check if this is a reconnection (user was in this room before)
    isReconnecting = room.has(socket.id);

    const existingUsers = Array.from(room.keys()).filter(id => id !== socket.id);

    // store user
    room.set(socket.id, { name, audioOn: false });

    socket.join(roomName);
    console.log(`[join] ${socket.id} -> room "${roomName}" as "${name}" (${room.size} users)${isReconnecting ? ' [reconnect]' : ''}`);

    // tell new user about existing users
    socket.emit('room-users', existingUsers);

    // tell existing users about new/reconnected user
    socket.to(roomName).emit('user-joined', { id: socket.id, name });
  });

  // --- WebRTC signaling ---
  socket.on('webrtc-offer', (data) => {
    if (!data || !data.target) return;
    io.to(data.target).emit('webrtc-offer', {
      from: socket.id,
      sdp: data.sdp
    });
  });

  socket.on('webrtc-answer', (data) => {
    if (!data || !data.target) return;
    io.to(data.target).emit('webrtc-answer', {
      from: socket.id,
      sdp: data.sdp
    });
  });

  socket.on('webrtc-ice', (data) => {
    if (!data || !data.target) return;
    io.to(data.target).emit('webrtc-ice', {
      from: socket.id,
      candidate: data.candidate
    });
  });

  // --- Audio state ---
  socket.on('audio-toggle', (data) => {
    if (!currentRoom) return;
    const room = getRoom(currentRoom);
    const user = room.get(socket.id);
    if (user) {
      user.audioOn = !!data.on;
      socket.to(currentRoom).emit('audio-state', {
        id: socket.id,
        on: user.audioOn
      });
    }
  });

  // --- Text chat ---
  socket.on('chat-message', (data) => {
    if (!currentRoom) return;
    const msg = sanitize(data.message || '').slice(0, 500);
    const emoji = sanitize(data.emoji || '').slice(0, 10);
    if (!msg && !emoji) return;

    io.to(currentRoom).emit('chat-message', {
      id: socket.id,
      name: userName,
      message: msg,
      emoji: emoji,
      timestamp: Date.now()
    });
  });

  // --- Keep-alive ping ---
  socket.on('ping', (timestamp) => {
    socket.emit('pong', timestamp);
  });

  // --- Disconnect with grace period (allows brief network blips) ---
  socket.on('disconnect', (reason) => {
    console.log(`[disconnect] ${socket.id} (${reason})`);
    if (currentRoom) {
      const room = getRoom(currentRoom);
      // Delay removal: if client reconnects quickly, they stay
      setTimeout(() => {
        // Check if socket is still gone (not reconnected with same id)
        if (!io.sockets.sockets.has(socket.id)) {
          room.delete(socket.id);
          socket.to(currentRoom).emit('user-left', socket.id);
          // Clean up empty rooms
          if (room.size === 0) {
            rooms.delete(currentRoom);
          }
          console.log(`[cleanup] ${socket.id} removed from "${currentRoom}"`);
        }
      }, 5000); // 5 second grace period
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
  console.log(`  Network: http://<your-ip>:${PORT}`);
  console.log('');
  console.log('  Deployed on Render — share the public URL');
  console.log('');
  console.log('  STUN/TURN: Google + OpenRelay + Twilio');
  console.log('  (Global reach incl. Middle East NAT traversal)');
  console.log('');
  console.log('════════════════════════════════════════');
});
