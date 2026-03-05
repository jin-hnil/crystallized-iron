import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameServer } from './GameServer.js';
import { initMySQL } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const MAX_CCU = 1000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
    res.status(200).send({ status: 'OK', ccuLimit: MAX_CCU });
});

// Map API Routes (read-only, data giờ quản lý qua GameServer/MapManager)
const gameServer = new GameServer(MAX_CCU);

app.get('/api/maps', (_req, res) => {
    res.json(gameServer.getMapManager().getAllMaps());
});

app.get('/api/maps/:id', (req, res) => {
    const mapItem = gameServer.getMapManager().getMap(req.params.id);
    if (mapItem) {
        res.json(mapItem);
    } else {
        res.status(404).json({ error: "Map not found" });
    }
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    gameServer.handleConnection(ws);
});

async function startServer() {
    await initMySQL();

    server.listen(port, () => {
        console.log(`[Server] Game WebSocket server starting on port ${port}`);
        console.log(`[Server] Max CCU (Concurrent Users): ${MAX_CCU}`);
        console.log(`[Server] Maps loaded: ${gameServer.getMapManager().getAllMaps().length}`);
    });
}

startServer();
