export interface Vector2 {
    x: number;
    y: number;
}

export enum ClientEventType {
    JOIN = "JOIN",
    CHAT = "CHAT",
    LEAVE = "LEAVE",
    START_EXPLORE = "START_EXPLORE",
    STOP_EXPLORE = "STOP_EXPLORE",
    GET_MAPS = "GET_MAPS"
}

export enum ServerEventType {
    INIT_STATE = "INIT_STATE",
    PLAYER_JOINED = "PLAYER_JOINED",
    PLAYER_LEFT = "PLAYER_LEFT",
    CHAT_MESSAGE = "CHAT_MESSAGE",
    ERROR = "ERROR",
    SERVER_FULL = "SERVER_FULL",
    MAP_LIST = "MAP_LIST",
    MAP_DATA = "MAP_DATA",
    EXPLORE_NODE = "EXPLORE_NODE",
    EXPLORE_STOPPED = "EXPLORE_STOPPED",
    PLAYER_DEATH = "PLAYER_DEATH"
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
    // Core Base Stats
    level: number;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;

    // Combat Stats (derived or allocated)
    attack: number;
    defense: number;
    accuracy: number;
    evasion: number;
    speed: number;
    critChance: number;

    // Growth
    statPoints: number;
    experience: number;

    // Exploration state
    currentMapId?: string | undefined;
    currentNodeId?: string | undefined;
}
