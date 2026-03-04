import { WebSocket } from 'ws';
import { Player } from './Player.js';
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

    constructor(maxCCU: number = 1000) {
        this.players = new Map();
        this.maxCCU = maxCCU;
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
            case ClientEventType.MOVE:
                this.handlePlayerMove(playerId, message.payload.x, message.payload.y);
                break;
            case ClientEventType.CHAT:
                this.handleChat(playerId, message.payload.text);
                break;
            default:
                console.warn(`Unknown message type: ${message.type}`);
        }
    }

    private handlePlayerJoin(playerId: string, ws: WebSocket, name: string) {
        if (this.players.has(playerId)) return;

        // Default name if not provided
        const playerName = name || `Awakener_${playerId.substring(0, 4)}`;
        const newPlayer = new Player(playerId, ws, playerName);

        this.players.set(playerId, newPlayer);
        console.log(`Player joined: ${playerName} (${playerId}). Current CCU: ${this.players.size}/${this.maxCCU}`);

        // Send initial state to the joining player (who is already in the game)
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
                others: allPlayersState
            }
        });

        // Notify others
        this.broadcast({
            type: ServerEventType.PLAYER_JOINED,
            payload: newPlayer.getState()
        }, playerId);
    }

    private handlePlayerMove(playerId: string, x: number, y: number) {
        const player = this.players.get(playerId);
        if (!player) return;

        player.updatePosition(x, y);

        // In a real MMO, we would only broadcast to players in the same zone/proximity.
        // For this prototype, we broadcast to everyone.
        this.broadcast({
            type: ServerEventType.PLAYER_MOVED,
            payload: { id: playerId, position: { x, y } }
        }, playerId);
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
