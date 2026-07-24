# Pharaoh Voice

Free real-time voice + text chat room with Egyptian-tech aesthetic.

## Features

- Voice chat (WebRTC P2P)
- Text messaging with emoji picker
- English / Arabic bilingual UI (RTL support)
- Persistent WebSocket connections with auto-reconnect
- STUN + TURN servers for global NAT traversal (incl. Middle East)
- XSS-protected input sanitization

## Deploy on Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml`
5. Click Deploy — done!

Your app will be live at `https://pharaoh-voice.onrender.com`

Share the link with friends: `https://pharaoh-voice.onrender.com?room=your-room-name`

## Local Development

```bash
npm install
npm start
# Open http://localhost:3456
```

## Tech Stack

- Express + Socket.io (signaling server)
- WebRTC (P2P voice)
- Vanilla JS frontend (no framework, no build step)
