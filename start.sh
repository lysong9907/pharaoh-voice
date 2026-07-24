#!/bin/bash
# ============================================
#  PHARAOH VOICE — One-click start script
#  Auto-detects ngrok or Cloudflare Tunnel
# ============================================

set -e

PORT=${1:-3456}
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# Colors
G='\033[0;32m'
Y='\033[1;33m'
R='\033[0;31m'
C='\033[0;36m'
GOLD='\033[0;33m'
N='\033[0m'

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   PHARAOH VOICE — Starting...        ║"
echo "╚══════════════════════════════════════╝"
echo ""

# --- Find node ---
if command -v node &> /dev/null; then
  NODE=$(which node)
elif [ -f "/opt/homebrew/bin/node" ]; then
  NODE="/opt/homebrew/bin/node"
elif [ -f "/usr/local/bin/node" ]; then
  NODE="/usr/local/bin/node"
else
  echo -e "${R}Error: Node.js not found!${N}"
  echo "Install from: https://nodejs.org/"
  exit 1
fi

# --- Install deps ---
if [ ! -d "node_modules" ]; then
  echo -e "${Y}Installing dependencies...${N}"
  npm install
  echo ""
fi

# --- Start server ---
echo -e "${GOLD}Starting Pharaoh Voice on port ${PORT}...${N}"
$NODE server.js &
SERVER_PID=$!
sleep 2

# --- Local IP ---
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "unknown")

echo ""
echo "════════════════════════════════════════"
echo -e "  ${G}Server is running!${N}"
echo "════════════════════════════════════════"
echo ""
echo -e "  ${C}Local:    ${N}http://localhost:${PORT}"
echo -e "  ${C}Network:  ${N}http://${LOCAL_IP}:${PORT}"
echo -e "  ${C}Room URL: ${N}http://${LOCAL_IP}:${PORT}?room=myroom"
echo ""

# --- Tunnel: prefer cloudflared (better for Middle East), fallback ngrok ---
TUNNEL_PID=""
TUNNEL_URL=""

if command -v cloudflared &> /dev/null; then
  echo -e "${G}Cloudflare Tunnel detected (best for Middle East access).${N}"
  echo -e "${Y}Starting tunnel...${N}"
  cloudflared tunnel --url http://localhost:${PORT} > /tmp/cf-tunnel.log 2>&1 &
  TUNNEL_PID=$!
  sleep 5

  # Extract URL from cloudflared logs
  TUNNEL_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cf-tunnel.log 2>/dev/null | head -1)

  if [ -n "$TUNNEL_URL" ]; then
    echo ""
    echo -e "  ${G}Cloudflare tunnel is up!${N}"
    echo -e "  ${C}Public:   ${N}${TUNNEL_URL}"
    echo -e "  ${C}Room URL: ${N}${TUNNEL_URL}?room=myroom"
    echo ""
    echo -e "  ${GOLD}Share the Room URL with friends in Egypt/Middle East!${N}"
    echo -e "  ${Y}Cloudflare has CDN nodes in Cairo & Dubai = low latency${N}"
  else
    echo -e "  ${Y}Tunnel started. Check: /tmp/cf-tunnel.log${N}"
  fi

elif command -v ngrok &> /dev/null; then
  echo -e "${Y}ngrok detected. Starting tunnel...${N}"
  ngrok http ${PORT} --log=stdout > /dev/null 2>&1 &
  TUNNEL_PID=$!
  sleep 3

  TUNNEL_URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | \
    grep -o '"public_url":"[^"]*"' | head -1 | cut -d'"' -f4)

  if [ -n "$TUNNEL_URL" ]; then
    echo ""
    echo -e "  ${G}ngrok tunnel is up!${N}"
    echo -e "  ${C}Public:   ${N}${TUNNEL_URL}"
    echo -e "  ${C}Room URL: ${N}${TUNNEL_URL}?room=myroom"
    echo ""
    echo -e "  ${GOLD}Share the Room URL with your friends!${N}"
  else
    echo -e "  ${Y}ngrok started. Dashboard: http://127.0.0.1:4040${N}"
  fi

else
  echo -e "  ${Y}No tunnel tool installed.${N}"
  echo ""
  echo "  For remote access (pick one):"
  echo ""
  echo -e "  ${C}Option A — Cloudflare Tunnel (recommended for Middle East):${N}"
  echo "    brew install cloudflared"
  echo "    cloudflared tunnel --url http://localhost:${PORT}"
  echo ""
  echo -e "  ${C}Option B — ngrok:${N}"
  echo "    brew install ngrok"
  echo "    ngrok http ${PORT}"
  echo ""
  echo "  Then re-run this script for auto-tunnel."
fi

echo ""
echo "════════════════════════════════════════"
echo "  Press Ctrl+C to stop everything"
echo "════════════════════════════════════════"

# --- Cleanup ---
cleanup() {
  echo ""
  echo -e "${Y}Shutting down Pharaoh Voice...${N}"
  kill $SERVER_PID 2>/dev/null
  if [ -n "$TUNNEL_PID" ]; then
    kill $TUNNEL_PID 2>/dev/null
  fi
  echo -e "${G}Done. Hail Pharaoh!${N}"
}

trap cleanup EXIT INT TERM
wait $SERVER_PID
