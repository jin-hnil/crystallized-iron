import { WebSocket } from 'ws';
import { Player } from './Player.js';
import { MapManager } from './MapManager.js';
import { ExplorationManager } from './ExplorationManager.js';
import {
    ClientEventType,
    ServerEventType
} from './types.js';
import type {
    ClientMessage,
    ServerMessage,
    PlayerState
} from './types.js';
import { v4 as uuidv4 } from 'uuid';

export class GameServer {
    private players: Map<string, Player>;
    private maxCCU: number;
    private mapManager: MapManager;
    private explorationManager: ExplorationManager;

    constructor(maxCCU: number = 1000) {
        this.players = new Map();
        this.maxCCU = maxCCU;
        this.mapManager = new MapManager();
        this.explorationManager = new ExplorationManager(this.mapManager);
    }

    public getMapManager(): MapManager {
        return this.mapManager;
    }

    public handleConnection(ws: WebSocket) {
        // Check CCU limit
        if (this.players.size >= this.maxCCU) {
            ws.send(JSON.stringify({
                type: ServerEventType.SERVER_FULL,
                payload: { message: `Server is at max capacity (${this.maxCCU}). Please try another server.` }
            }));
            ws.close(1008, 'Server Full');
            return;
        }

        const playerId = uuidv4();

        ws.on('message', (data: string) => {
            try {
                const message = JSON.parse(data) as ClientMessage;
                this.processClientMessage(playerId, ws, message);
            } catch (err) {
                console.error('Failed to parse client message:', err);
            }
        });

        ws.on('close', () => {
            this.handlePlayerDisconnect(playerId);
        });

        ws.on('error', (err) => {
            console.error(`WebSocket error for player ${playerId}:`, err);
            this.handlePlayerDisconnect(playerId);
        });
    }

    private processClientMessage(playerId: string, ws: WebSocket, message: ClientMessage) {
        switch (message.type) {
            case ClientEventType.JOIN:
                this.handlePlayerJoin(playerId, ws, message.payload.name);
                break;
            case ClientEventType.CHAT:
                this.handleChat(playerId, message.payload.text);
                break;
            case ClientEventType.GET_MAPS:
                this.handleGetMaps(playerId);
                break;
            case ClientEventType.START_EXPLORE:
                this.handleStartExplore(playerId, message.payload.mapId);
                break;
            case ClientEventType.STOP_EXPLORE:
                this.handleStopExplore(playerId);
                break;
            default:
                console.warn(`Unknown message type: ${message.type}`);
        }
    }

    private handlePlayerJoin(playerId: string, ws: WebSocket, name: string) {
        if (this.players.has(playerId)) return;

        const playerName = name || `Collector_${playerId.substring(0, 4)}`;
        const newPlayer = new Player(playerId, ws, playerName);

        this.players.set(playerId, newPlayer);
        console.log(`Player joined: ${playerName} (${playerId}). Current CCU: ${this.players.size}/${this.maxCCU}`);

        // Gửi danh sách map cùng init state
        const allPlayersState: PlayerState[] = [];
        for (const [id, p] of this.players.entries()) {
            if (id !== playerId) {
                allPlayersState.push(p.getState());
            }
        }

        newPlayer.send({
            type: ServerEventType.INIT_STATE,
            payload: {
                me: newPlayer.getState(),
                others: allPlayersState,
                maps: this.mapManager.getAllMaps()
            }
        });

        // Notify others
        this.broadcast({
            type: ServerEventType.PLAYER_JOINED,
            payload: newPlayer.getState()
        }, playerId);
    }

    private handleGetMaps(playerId: string) {
        const player = this.players.get(playerId);
        if (!player) return;

        player.send({
            type: ServerEventType.MAP_LIST,
            payload: { maps: this.mapManager.getAllMaps() }
        });
    }

    private handleStartExplore(playerId: string, mapId: string) {
        const player = this.players.get(playerId);
        if (!player) return;

        const map = this.mapManager.getMap(mapId);
        if (!map) {
            player.send({
                type: ServerEventType.ERROR,
                payload: { message: `Map ${mapId} not found.` }
            });
            return;
        }

        // Gửi dữ liệu map đầy đủ cho client render minimap
        player.send({
            type: ServerEventType.MAP_DATA,
            payload: map
        });

        player.currentMapId = mapId;

        const started = this.explorationManager.startExploration(
            player,
            mapId,
            (result) => {
                player.currentNodeId = result.nodeId;
                player.send({
                    type: ServerEventType.EXPLORE_NODE,
                    payload: {
                        ...result,
                        playerHp: player.hp,
                        playerMaxHp: player.maxHp,
                        playerLevel: player.level,
                        playerExp: player.experience,
                    }
                });
            },
            () => {
                // Player chết
                player.currentMapId = undefined;
                player.currentNodeId = undefined;
                player.send({
                    type: ServerEventType.PLAYER_DEATH,
                    payload: {
                        message: `${player.name} đã gục ngã... Hồi sinh tại trại.`,
                        playerHp: player.hp,
                        playerMaxHp: player.maxHp,
                    }
                });
            }
        );

        if (!started) {
            player.send({
                type: ServerEventType.ERROR,
                payload: { message: 'Failed to start exploration.' }
            });
        }
    }

    private handleStopExplore(playerId: string) {
        const player = this.players.get(playerId);
        if (!player) return;

        this.explorationManager.stopExploration(playerId);
        player.currentMapId = undefined;
        player.currentNodeId = undefined;

        player.send({
            type: ServerEventType.EXPLORE_STOPPED,
            payload: { message: 'Exploration stopped.' }
        });
    }

    private handleChat(playerId: string, text: string) {
        const player = this.players.get(playerId);
        if (!player || !text) return;

        this.broadcast({
            type: ServerEventType.CHAT_MESSAGE,
            payload: {
                senderId: playerId,
                senderName: player.name,
                text
            }
        }); // Send to everyone including sender
    }

    private handlePlayerDisconnect(playerId: string) {
        const player = this.players.get(playerId);
        if (player) {
            console.log(`Player left: ${player.name} (${playerId}).`);
            this.explorationManager.stopExploration(playerId);
            this.players.delete(playerId);

            this.broadcast({
                type: ServerEventType.PLAYER_LEFT,
                payload: { id: playerId }
            });
        }
    }

    private broadcast(message: ServerMessage, excludePlayerId?: string) {
        for (const [id, player] of this.players.entries()) {
            if (id !== excludePlayerId) {
                player.send(message);
            }
        }
    }
}
