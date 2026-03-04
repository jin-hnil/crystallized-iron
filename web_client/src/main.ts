import './style.css';

interface Vector2 { x: number; y: number; }
interface PlayerState {
  id: string;
  name: string;
  position: Vector2;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  level: number;
}

const WS_URL = 'ws://localhost:8080';
let ws: WebSocket | null = null;
let myId: string | null = null;
const players: Map<string, PlayerState> = new Map();

// UI Elements
const loginScreen = document.getElementById('login-screen') as HTMLDivElement;
const gameUI = document.getElementById('game-ui') as HTMLDivElement;
const joinBtn = document.getElementById('join-btn') as HTMLButtonElement;
const errorP = document.getElementById('login-error') as HTMLParagraphElement;
const usernameInput = document.getElementById('username-input') as HTMLInputElement;

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Chat UI
const chatInput = document.getElementById('chat-input') as HTMLInputElement;
const sendChatBtn = document.getElementById('send-chat-btn') as HTMLButtonElement;
const chatMessages = document.getElementById('chat-messages') as HTMLDivElement;

// HUD UI
const hudName = document.getElementById('hud-name') as HTMLSpanElement;
const hudLevel = document.getElementById('hud-level') as HTMLSpanElement;

// Input State
const keys: { [key: string]: boolean } = {
  w: false, a: false, s: false, d: false,
  arrowup: false, arrowdown: false, arrowleft: false, arrowright: false
};
let targetPosition: Vector2 | null = null;
const speed = 5;

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function appendChat(name: string, text: string, isMe: boolean) {
  const el = document.createElement('div');
  el.className = 'chat-msg';
  el.innerHTML = `<span class="name ${isMe ? 'me' : ''}">[${name}]:</span> ${text}`;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

joinBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (!name) return;
  connectServer(name);
});

function connectServer(name: string) {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    // Send join payload
    ws?.send(JSON.stringify({
      type: 'JOIN',
      payload: { name }
    }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    switch (msg.type) {
      case 'SERVER_FULL':
        errorP.innerText = msg.payload.message;
        ws?.close();
        break;
      case 'INIT_STATE':
        myId = msg.payload.me.id;
        players.set(myId!, msg.payload.me);
        msg.payload.others.forEach((p: PlayerState) => players.set(p.id, p));

        // Setup HUD
        hudName.innerText = msg.payload.me.name;
        hudLevel.innerText = `Lv.${msg.payload.me.level}`;

        loginScreen.style.display = 'none';
        gameUI.style.display = 'block';
        requestAnimationFrame(gameLoop);
        break;
      case 'PLAYER_JOINED':
        players.set(msg.payload.id, msg.payload);
        appendChat('System', `${msg.payload.name} joined the map.`, false);
        break;
      case 'PLAYER_MOVED':
        const p = players.get(msg.payload.id);
        if (p && p.id !== myId) {
          p.position = msg.payload.position;
        }
        break;
      case 'PLAYER_LEFT':
        const leftPlayer = players.get(msg.payload.id);
        if (leftPlayer) {
          appendChat('System', `${leftPlayer.name} left.`, false);
          players.delete(msg.payload.id);
        }
        break;
      case 'CHAT_MESSAGE':
        const isMe = msg.payload.senderId === myId;
        appendChat(msg.payload.senderName, msg.payload.text, isMe);
        break;
    }
  };

  ws.onerror = () => {
    errorP.innerText = "Connection failed. Is the server running?";
  };
  ws.onclose = () => {
    if (myId) {
      alert("Disconnected from server.");
      location.reload();
    }
  };
}

// Controls Handle
window.addEventListener('keydown', (e) => {
  if (document.activeElement === chatInput) {
    if (e.key === 'Enter') sendChat();
    return;
  }
  if (keys.hasOwnProperty(e.key.toLowerCase())) {
    keys[e.key.toLowerCase()] = true;
  }
  if (e.key === 'Enter') {
    chatInput.focus();
  }
});

window.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key.toLowerCase())) {
    keys[e.key.toLowerCase()] = false;
  }
});

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (!myId) return;
  const me = players.get(myId);
  if (!me) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const camX = me.position.x - canvas.width / 2;
  const camY = me.position.y - canvas.height / 2;

  targetPosition = {
    x: clickX + camX,
    y: clickY + camY
  };
});

sendChatBtn.addEventListener('click', sendChat);
function sendChat() {
  const text = chatInput.value.trim();
  if (!text || !ws) return;
  ws.send(JSON.stringify({
    type: 'CHAT',
    payload: { text }
  }));
  chatInput.value = '';
  canvas.focus();
}

function updateMovement() {
  if (!myId) return;
  const me = players.get(myId);
  if (!me) return;

  let dx = 0; let dy = 0;
  if (keys['w'] || keys['arrowup']) dy -= speed;
  if (keys['s'] || keys['arrowdown']) dy += speed;
  if (keys['a'] || keys['arrowleft']) dx -= speed;
  if (keys['d'] || keys['arrowright']) dx += speed;

  let isMoving = false;

  if (dx !== 0 || dy !== 0) {
    targetPosition = null; // override auto movement
    me.position.x += dx;
    me.position.y += dy;
    isMoving = true;
  } else if (targetPosition) {
    const distX = targetPosition.x - me.position.x;
    const distY = targetPosition.y - me.position.y;
    const dist = Math.sqrt(distX * distX + distY * distY);

    if (dist <= speed) {
      me.position.x = targetPosition.x;
      me.position.y = targetPosition.y;
      targetPosition = null; // Reached target
    } else {
      me.position.x += (distX / dist) * speed;
      me.position.y += (distY / dist) * speed;
    }
    isMoving = true;
  }

  if (isMoving) {
    // Broadcast my move
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'MOVE',
        payload: { x: me.position.x, y: me.position.y }
      }));
    }
  }
}

function drawGrid(cameraX: number, cameraY: number) {
  ctx.strokeStyle = '#111b2b';
  ctx.lineWidth = 1;
  const gridSize = 50;

  const offsetX = -(cameraX % gridSize);
  const offsetY = -(cameraY % gridSize);

  ctx.beginPath();
  for (let x = offsetX; x < canvas.width; x += gridSize) {
    ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
  }
  for (let y = offsetY; y < canvas.height; y += gridSize) {
    ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
  }
  ctx.stroke();
}

function gameLoop() {
  updateMovement();

  // Clear Screen
  ctx.fillStyle = '#0b101a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Camera Logic (Centered on Me)
  let camX = 0, camY = 0;
  const me = myId ? players.get(myId) : null;
  if (me) {
    camX = me.position.x - canvas.width / 2;
    camY = me.position.y - canvas.height / 2;
  }

  drawGrid(camX, camY);

  // Draw Target Position marker
  if (targetPosition) {
    const screenTargetX = targetPosition.x - camX;
    const screenTargetY = targetPosition.y - camY;

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(screenTargetX, screenTargetY, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(screenTargetX - 10, screenTargetY);
    ctx.lineTo(screenTargetX + 10, screenTargetY);
    ctx.moveTo(screenTargetX, screenTargetY - 10);
    ctx.lineTo(screenTargetX, screenTargetY + 10);
    ctx.stroke();
  }

  // Draw Players
  players.forEach(p => {
    const screenX = p.position.x - camX;
    const screenY = p.position.y - camY;

    // Draw Character Body
    ctx.fillStyle = p.id === myId ? '#00f0ff' : '#ff3366';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Draw Name
    ctx.fillStyle = '#fff';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(p.name, screenX, screenY - 25);
  });

  requestAnimationFrame(gameLoop);
}
