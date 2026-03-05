// ============================================
// Admin Panel — TypeScript Types
// ============================================

// Navigation
export type PageId =
    | 'dashboard'
    | 'accounts'
    | 'characters'
    | 'items'
    | 'maps'
    | 'mobs'
    | 'logs';

export interface NavItem {
    id: PageId;
    label: string;
    icon: string;
    section: string;
}

// MySQL: accounts
export interface Account {
    id: number;
    username: string;
    email: string;
    status: 'active' | 'banned' | 'suspended';
    last_login_at: string | null;
    last_login_ip: string | null;
    created_at: string;
}

// MySQL: characters
export interface Character {
    id: number;
    account_id: number;
    name: string;
    level: number;
    experience: number;
    hp: number;
    max_hp: number;
    mp: number;
    max_mp: number;
    attack: number;
    defense: number;
    accuracy: number;
    evasion: number;
    speed: number;
    crit_chance: number;
    magic_resistance: number;
    effect_resistance: number;
    stat_points: number;
    current_map_id: string | null;
    current_node_id: string | null;
    created_at: string;
}

// MySQL: inventory item (instance)
export interface InventoryItem {
    id: number;
    character_id: number;
    item_template_id: string;
    rarity: number;
    level: number;
    is_equipped: boolean;
    slot_type: 'weapon' | 'armor' | 'accessory' | 'gem' | 'material' | 'consumable';
    main_stat_type: string;
    main_stat_value: number;
    sub_stats: SubStat[];
    socket_count: number;
    set_id: string | null;
}

export interface SubStat {
    type: string;
    value: number;
}

// MongoDB: item_templates
export interface ItemTemplate {
    _id: string;
    name: string;
    description: string;
    category: string;
    slotType: string;
    mainStat: {
        type: string;
        baseValue: number;
        growthPerLevel: number;
    };
    subStatPool: { type: string; minValue: number; maxValue: number }[];
    possibleRarities: number[];
    maxSockets: number;
    setId: string | null;
    requirements: { minLevel: number };
    dropInfo: {
        mapIds: string[];
        baseDropRate: number;
    };
}

// MongoDB: mob_configs
export interface MobConfig {
    _id: string;
    name: string;
    description: string;
    baseStats: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
        critChance: number;
    };
    scalingPerLevel: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
    };
    rewards: {
        baseExp: number;
        baseGold: number;
        expScaling: number;
        goldScaling: number;
    };
    dropTable: { itemTemplateId: string; dropRate: number; minQty: number; maxQty: number }[];
    spawnMaps: string[];
    isBoss: boolean;
}

// Map Node (from MapSystem_Architecture)
export interface MapNode {
    id: string;
    label: string;
    type: 'empty' | 'mob' | 'boss' | 'treasure' | 'event';
    x: number;
    y: number;
    connections: string[];
}

export interface GameMap {
    id: string;
    name: string;
    description: string;
    level: number;
    nodes: MapNode[];
}

// Dashboard stats
export interface DashboardStats {
    totalAccounts: number;
    totalCharacters: number;
    totalItems: number;
    totalMaps: number;
    totalMobs: number;
    onlineNow: number;
}

// Toast notification
export interface Toast {
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
}
