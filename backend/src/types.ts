export interface Vector2 {
    x: number;
    y: number;
}

export enum ClientEventType {
    JOIN = "JOIN",
    MOVE = "MOVE",
    CHAT = "CHAT",
    LEAVE = "LEAVE"
}

export enum ServerEventType {
    INIT_STATE = "INIT_STATE",
    PLAYER_JOINED = "PLAYER_JOINED",
    PLAYER_MOVED = "PLAYER_MOVED",
    PLAYER_LEFT = "PLAYER_LEFT",
    CHAT_MESSAGE = "CHAT_MESSAGE",
    ERROR = "ERROR",
    SERVER_FULL = "SERVER_FULL"
}

export interface ClientMessage {
    type: ClientEventType;
    payload: any;
}

export interface ServerMessage {
    type: ServerEventType;
    payload: any;
}

export interface PlayerState {
    id: string;
    name: string;
    position: Vector2;
    // Core Base Stats
    level: number;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;

    // Combat Stats (derived or allocated)
    physicalAttack: number; // Sát thương vật lý
    magicAttack: number; // Sát thương phép thuật
    armor: number; // Defense/Damage Reduction
    magicResistance: number; // Reduces magic damage
    effectResistance: number; // Reduces chance/duration of status ailments
    critChance: number; // 0.0 to 1.0 representing percentage

    // Growth
    statPoints: number; // Points to distribute
    experience: number;
}
