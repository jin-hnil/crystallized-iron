import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameServer } from './GameServer.js';
import { MapManager } from './MapManager.js';
import { initMySQL } from './db.js';

dotenv.config();

const mapManager = new MapManager();

const app = express();
const port = process.env.PORT || 8080;
const MAX_CCU = 1000; // soft limit defined in design

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
    res.status(200).send({ status: 'OK', ccuLimit: MAX_CCU });
});

// Map API Routes
app.get('/api/maps', (req, res) => {
    res.json(mapManager.getAllMaps());
});

app.get('/api/maps/:id', (req, res) => {
    const mapItem = mapManager.getMap(req.params.id);
    if (mapItem) {
        res.json(mapItem);
    } else {
        res.status(404).json({ error: "Map not found" });
    }
});

app.post('/api/maps', (req, res) => {
    const newMap = req.body;
    if (!newMap || !newMap.id) {
        res.status(400).json({ error: "Invalid map data. Needs an ID." });
        return;
    }
    mapManager.saveMap(newMap);
    res.status(201).json({ message: "Map saved successfully" });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const gameServer = new GameServer(MAX_CCU);

wss.on('connection', (ws) => {
    // Pass connection to GameServer for logic and limit checking
    gameServer.handleConnection(ws);
});

async function startServer() {
    await initMySQL();

    server.listen(port, () => {
        console.log(`[Server] Game WebSocket server starting on port ${port}`);
        console.log(`[Server] Max CCU (Concurrent Users) configured: ${MAX_CCU}`);
    });
}

startServer();
