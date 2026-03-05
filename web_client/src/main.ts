import './style.css';

// ============================================
// TYPES
// ============================================
interface PlayerState {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  accuracy: number;
  evasion: number;
  speed: number;
  critChance: number;
  statPoints: number;
  experience: number;
  currentMapId?: string;
  currentNodeId?: string;
}

interface MapSummary {
  id: string;
  name: string;
  difficultyLevel: number;
  nodeCount: number;
}

interface MapNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
}

interface MapPath {
  from: string;
  to: string;
}

interface AreaMap {
  id: string;
  name: string;
  difficultyLevel: number;
  nodes: MapNode[];
  paths: MapPath[];
  startNodeId: string;
}

interface BattleLogEntry {
  turn: number;
  text: string;
}

interface ExploreNodeResult {
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  battleLog?: BattleLogEntry[];
  battleWon?: boolean;
  expGained: number;
  goldGained: number;
  hpLost: number;
  playerHp: number;
  playerMaxHp: number;
  playerLevel: number;
  playerExp: number;
}

// ============================================
// STATE
// ============================================
const WS_URL = 'ws://localhost:8080';
let ws: WebSocket | null = null;
let myId: string | null = null;
let myState: PlayerState | null = null;
let totalGold = 0;

let mapList: MapSummary[] = [];
let currentMap: AreaMap | null = null;
let currentNodeId: string | null = null;

// Log system
type LogType = 'chat' | 'battle';
const LOG_CHAT: LogType = 'chat';
const LOG_BATTLE: LogType = 'battle';
let activeLogTab: LogType = LOG_BATTLE;
const logs: { type: LogType; text: string; isMe?: boolean }[] = [];

// ============================================
// DOM ELEMENTS
// ============================================
const loginScreen = document.getElementById('login-screen') as HTMLDivElement;
const gameUI = document.getElementById('game-ui') as HTMLDivElement;
const joinBtn = document.getElementById('join-btn') as HTMLButtonElement;
const errorP = document.getElementById('login-error') as HTMLParagraphElement;
const usernameInput = document.getElementById('username-input') as HTMLInputElement;

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// HUD
const hudName = document.getElementById('hud-name') as HTMLSpanElement;
const hudLevel = document.getElementById('hud-level') as HTMLSpanElement;

// Log System
const tabBattle = document.getElementById('tab-battle') as HTMLButtonElement;
const tabChat = document.getElementById('tab-chat') as HTMLButtonElement;
const logMessagesEl = document.getElementById('log-messages') as HTMLDivElement;
const chatInputArea = document.getElementById('chat-input-area') as HTMLDivElement;
const chatInput = document.getElementById('chat-input') as HTMLInputElement;
const sendChatBtn = document.getElementById('send-chat-btn') as HTMLButtonElement;

// ============================================
// CANVAS SETUP (Minimap)
// ============================================
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawMinimap();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ============================================
// LOG SYSTEM
// ============================================
function renderLogs() {
  logMessagesEl.innerHTML = '';
  const filtered = logs.filter(l => l.type === activeLogTab);
  // Show last 50
  const slice = filtered.slice(-50);
  slice.forEach(l => {
    const el = document.createElement('div');
    if (l.type === LOG_BATTLE) {
      el.className = 'log-msg battle';
      el.textContent = l.text;
    } else {
      el.className = 'log-msg chat';
      el.textContent = l.text;
    }
    logMessagesEl.appendChild(el);
  });
  logMessagesEl.scrollTop = logMessagesEl.scrollHeight;
}

function appendLog(type: LogType, text: string, isMe: boolean = false) {
  logs.push({ type, text, isMe });
  if (logs.length > 300) logs.shift();
  if (activeLogTab === type) renderLogs();
}

tabBattle.addEventListener('click', () => {
  activeLogTab = LOG_BATTLE;
  tabBattle.classList.add('active');
  tabChat.classList.remove('active');
  chatInputArea.style.display = 'none';
  renderLogs();
});

tabChat.addEventListener('click', () => {
  activeLogTab = LOG_CHAT;
  tabChat.classList.add('active');
  tabBattle.classList.remove('active');
  chatInputArea.style.display = 'flex';
  renderLogs();
  chatInput.focus();
});

// ============================================
// CHAT
// ============================================
sendChatBtn.addEventListener('click', sendChat);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendChat();
});

function sendChat() {
  const text = chatInput.value.trim();
  if (!text || !ws) return;
  ws.send(JSON.stringify({ type: 'CHAT', payload: { text } }));
  chatInput.value = '';
}

// ============================================
// CONNECTION
// ============================================
joinBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (!name) return;
  connectServer(name);
});

function connectServer(name: string) {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    ws?.send(JSON.stringify({ type: 'JOIN', payload: { name } }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    handleServerMessage(msg);
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

// ============================================
// SERVER MESSAGE HANDLER
// ============================================
function handleServerMessage(msg: { type: string; payload: any }) {
  switch (msg.type) {
    case 'SERVER_FULL':
      errorP.innerText = msg.payload.message;
      ws?.close();
      break;

    case 'INIT_STATE':
      myId = msg.payload.me.id;
      myState = msg.payload.me;
      mapList = msg.payload.maps || [];

      hudName.innerText = msg.payload.me.name;
      hudLevel.innerText = `Lv.${msg.payload.me.level}`;

      loginScreen.style.display = 'none';
      gameUI.style.display = 'block';

      appendLog(LOG_BATTLE, `🎮 Chào mừng ${myState!.name}! Chọn map để bắt đầu thám hiểm.`);
      drawMinimap();
      drawMapSelector();
      break;

    case 'PLAYER_JOINED':
      appendLog(LOG_CHAT, `[System] ${msg.payload.name} joined.`);
      break;

    case 'PLAYER_LEFT':
      appendLog(LOG_CHAT, `[System] Player left.`);
      break;

    case 'CHAT_MESSAGE': {
      const isMe = msg.payload.senderId === myId;
      const prefix = isMe ? '[Bạn]' : `[${msg.payload.senderName}]`;
      appendLog(LOG_CHAT, `${prefix}: ${msg.payload.text}`, isMe);
      break;
    }

    case 'MAP_DATA':
      currentMap = msg.payload as AreaMap;
      currentNodeId = currentMap.startNodeId;
      appendLog(LOG_BATTLE, `🗺️ Đang thám hiểm: ${currentMap.name} (Lv.${currentMap.difficultyLevel})`);
      drawMinimap();
      break;

    case 'EXPLORE_NODE': {
      const result = msg.payload as ExploreNodeResult;
      currentNodeId = result.nodeId;

      // Update local HP/Level
      if (myState) {
        myState.hp = result.playerHp;
        myState.maxHp = result.playerMaxHp;
        myState.level = result.playerLevel;
        myState.experience = result.playerExp;
        hudLevel.innerText = `Lv.${myState.level}`;
        updateHpBar();
      }

      // Append exploration logs
      const nodeIcon = getNodeIcon(result.nodeType);
      appendLog(LOG_BATTLE, `${nodeIcon} Đến: ${result.nodeLabel}`);

      if (result.battleLog) {
        for (const entry of result.battleLog) {
          appendLog(LOG_BATTLE, `  ${entry.text}`);
        }
      }

      if (result.goldGained > 0) {
        totalGold += result.goldGained;
        appendLog(LOG_BATTLE, `💰 +${result.goldGained} Vàng (Tổng: ${totalGold})`);
      }
      if (result.expGained > 0) {
        appendLog(LOG_BATTLE, `⭐ +${result.expGained} EXP`);
      }

      drawMinimap();
      break;
    }

    case 'PLAYER_DEATH':
      appendLog(LOG_BATTLE, `💀 ${msg.payload.message}`);
      currentMap = null;
      currentNodeId = null;
      if (myState) {
        myState.hp = msg.payload.playerHp;
        myState.maxHp = msg.payload.playerMaxHp;
        updateHpBar();
      }
      drawMinimap();
      drawMapSelector();
      break;

    case 'EXPLORE_STOPPED':
      appendLog(LOG_BATTLE, `⏹️ ${msg.payload.message}`);
      currentMap = null;
      currentNodeId = null;
      drawMinimap();
      drawMapSelector();
      break;

    case 'ERROR':
      appendLog(LOG_BATTLE, `❌ ${msg.payload.message}`);
      break;
  }
}

// ============================================
// HUD HELPERS
// ============================================
function updateHpBar() {
  if (!myState) return;
  const hpFill = document.querySelector('#hp-bar .fill') as HTMLDivElement;
  const mpFill = document.querySelector('#mp-bar .fill') as HTMLDivElement;
  const hpText = document.querySelector('#hp-bar + .bar-text') as HTMLSpanElement;

  if (hpFill) hpFill.style.width = `${(myState.hp / myState.maxHp) * 100}%`;
  if (mpFill) mpFill.style.width = `${(myState.mp / myState.maxMp) * 100}%`;
  if (hpText) hpText.textContent = `${myState.hp}/${myState.maxHp} HP`;
}

function getNodeIcon(type: string): string {
  switch (type) {
    case 'mob': return '🐀';
    case 'boss': return '🐉';
    case 'treasure': return '💎';
    case 'event': return '✨';
    default: return '📍';
  }
}

// ============================================
// MINIMAP DRAWING (Canvas)
// ============================================
function drawMinimap() {
  ctx.fillStyle = '#0b101a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!currentMap) {
    // No map selected - show idle screen
    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.font = '24px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('Chọn khu vực để bắt đầu thám hiểm', canvas.width / 2, canvas.height / 2);
    return;
  }

  const padding = 80;
  const mapW = canvas.width - padding * 2;
  const mapH = canvas.height - padding * 2;

  // Draw title
  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 18px "Courier New"';
  ctx.textAlign = 'center';
  ctx.fillText(`🗺️ ${currentMap.name} (Lv.${currentMap.difficultyLevel})`, canvas.width / 2, 35);

  // Draw Stop button area
  ctx.fillStyle = 'rgba(255, 51, 102, 0.3)';
  ctx.fillRect(canvas.width - 160, 10, 140, 35);
  ctx.fillStyle = '#ff3366';
  ctx.font = '14px "Courier New"';
  ctx.textAlign = 'center';
  ctx.fillText('⏹ Dừng Thám Hiểm', canvas.width - 90, 32);

  // Draw paths (edges)
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
  ctx.lineWidth = 2;
  for (const path of currentMap.paths) {
    const fromNode = currentMap.nodes.find(n => n.id === path.from);
    const toNode = currentMap.nodes.find(n => n.id === path.to);
    if (!fromNode || !toNode) continue;

    const x1 = padding + (fromNode.x / 100) * mapW;
    const y1 = padding + (fromNode.y / 100) * mapH;
    const x2 = padding + (toNode.x / 100) * mapW;
    const y2 = padding + (toNode.y / 100) * mapH;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Draw nodes
  for (const node of currentMap.nodes) {
    const nx = padding + (node.x / 100) * mapW;
    const ny = padding + (node.y / 100) * mapH;
    const isActive = node.id === currentNodeId;
    const radius = isActive ? 18 : 12;

    // Node circle
    ctx.beginPath();
    ctx.arc(nx, ny, radius, 0, Math.PI * 2);

    if (isActive) {
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
    } else {
      ctx.fillStyle = getNodeColor(node.type);
      ctx.shadowBlur = 0;
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    // Node border
    ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.3)';
    ctx.lineWidth = isActive ? 3 : 1;
    ctx.stroke();

    // Node icon
    ctx.font = `${isActive ? 16 : 12}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(getNodeIcon(node.type), nx, ny + 5);

    // Node label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = `${isActive ? 'bold 13px' : '11px'} "Courier New"`;
    ctx.textAlign = 'center';
    ctx.fillText(node.label, nx, ny + radius + 16);
  }

  // Draw player dot on active node
  if (currentNodeId) {
    const activeNode = currentMap.nodes.find(n => n.id === currentNodeId);
    if (activeNode) {
      const px = padding + (activeNode.x / 100) * mapW;
      const py = padding + (activeNode.y / 100) * mapH;

      // Pulsing player indicator
      const pulse = Math.sin(Date.now() / 200) * 5 + 25;
      ctx.beginPath();
      ctx.arc(px, py, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Gold display
  ctx.fillStyle = '#ffaa00';
  ctx.font = 'bold 16px "Courier New"';
  ctx.textAlign = 'left';
  ctx.fillText(`💰 Vàng: ${totalGold}`, 20, canvas.height - 20);

  // Continuous redraw for animation
  requestAnimationFrame(drawMinimap);
}

function getNodeColor(type: string): string {
  switch (type) {
    case 'mob': return 'rgba(255, 100, 50, 0.6)';
    case 'boss': return 'rgba(255, 0, 0, 0.7)';
    case 'treasure': return 'rgba(255, 215, 0, 0.6)';
    case 'event': return 'rgba(100, 200, 255, 0.6)';
    default: return 'rgba(100, 100, 100, 0.4)';
  }
}

// ============================================
// MAP SELECTOR (overlay on canvas)
// ============================================
function drawMapSelector() {
  // We draw map buttons as an overlay; for simplicity we use DOM
  let selectorEl = document.getElementById('map-selector');
  if (!selectorEl) {
    selectorEl = document.createElement('div');
    selectorEl.id = 'map-selector';
    gameUI.appendChild(selectorEl);
  }

  selectorEl.innerHTML = `
    <h3>📋 Chọn Khu Vực Thám Hiểm</h3>
    ${mapList.map(m => `
      <button class="map-select-btn" data-map-id="${m.id}">
        ${m.name} <span class="map-diff">Lv.${m.difficultyLevel}</span>
        <span class="map-nodes">${m.nodeCount} nodes</span>
      </button>
    `).join('')}
  `;

  selectorEl.style.display = 'flex';

  // Bind click events
  selectorEl.querySelectorAll('.map-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mapId = (btn as HTMLElement).dataset.mapId;
      if (mapId && ws) {
        ws.send(JSON.stringify({ type: 'START_EXPLORE', payload: { mapId } }));
        selectorEl!.style.display = 'none';
      }
    });
  });
}

// Click handler for Stop Exploration button area on canvas
canvas.addEventListener('click', (e) => {
  if (!currentMap) return;
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Check if click is in stop button area
  if (clickX >= canvas.width - 160 && clickX <= canvas.width - 20 &&
    clickY >= 10 && clickY <= 45) {
    if (ws) {
      ws.send(JSON.stringify({ type: 'STOP_EXPLORE', payload: {} }));
    }
  }
});
