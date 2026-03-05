// ============================================
// MAP MANAGER - Node Graph System
// Mỗi AreaMap là một đồ thị gồm các Node (điểm)
// và Path (đường nối) để nhân vật auto-explore.
// ============================================

export type NodeType = 'empty' | 'mob' | 'boss' | 'event' | 'treasure';

export interface MapNode {
    id: string;
    label: string;
    type: NodeType;
    /** Tọa độ hiển thị trên minimap (0-100 tỷ lệ %) */
    x: number;
    y: number;
    /** Encounter rate cho mob/boss (0.0 - 1.0) */
    encounterRate?: number;
    /** Mob stats nếu type = mob hoặc boss */
    mobStats?: {
        name: string;
        hp: number;
        attack: number;
        defense: number;
        speed: number;
        expReward: number;
        goldReward: number;
    };
}

export interface MapPath {
    from: string; // node id
    to: string;   // node id
}

export interface AreaMap {
    id: string;
    name: string;
    difficultyLevel: number;
    nodes: MapNode[];
    paths: MapPath[];
    /** Node khởi đầu khi vào map */
    startNodeId: string;
}

export class MapManager {
    private maps: Map<string, AreaMap> = new Map();

    constructor() {
        this.createDefaultMaps();
    }

    private createDefaultMaps() {
        // === Map 1: Phế Tích Thiết Tinh ===
        const ruinMap: AreaMap = {
            id: 'area_ruined_city',
            name: 'Phế Tích Thiết Tinh',
            difficultyLevel: 1,
            startNodeId: 'n1',
            nodes: [
                { id: 'n1', label: 'Cổng Vào', type: 'empty', x: 10, y: 50 },
                {
                    id: 'n2', label: 'Ngã Ba Rêu', type: 'mob', x: 30, y: 30,
                    encounterRate: 0.7,
                    mobStats: { name: 'Chuột Đột Biến', hp: 50, attack: 8, defense: 2, speed: 12, expReward: 15, goldReward: 10 }
                },
                { id: 'n3', label: 'Khu Phế Liệu', type: 'treasure', x: 30, y: 70 },
                {
                    id: 'n4', label: 'Hành Lang Tối', type: 'mob', x: 55, y: 50,
                    encounterRate: 0.8,
                    mobStats: { name: 'Sâu Sắt', hp: 80, attack: 12, defense: 5, speed: 8, expReward: 25, goldReward: 18 }
                },
                { id: 'n5', label: 'Phòng Kho Cũ', type: 'event', x: 55, y: 15 },
                {
                    id: 'n6', label: 'Lõi Phế Tích', type: 'boss', x: 85, y: 50,
                    encounterRate: 1.0,
                    mobStats: { name: 'Golem Thiết Tinh', hp: 300, attack: 25, defense: 15, speed: 6, expReward: 100, goldReward: 80 }
                },
            ],
            paths: [
                { from: 'n1', to: 'n2' },
                { from: 'n1', to: 'n3' },
                { from: 'n2', to: 'n4' },
                { from: 'n2', to: 'n5' },
                { from: 'n3', to: 'n4' },
                { from: 'n4', to: 'n6' },
                { from: 'n5', to: 'n6' },
            ]
        };
        this.maps.set(ruinMap.id, ruinMap);

        // === Map 2: Rừng Nấm Phát Sáng ===
        const forestMap: AreaMap = {
            id: 'area_glow_forest',
            name: 'Rừng Nấm Phát Sáng',
            difficultyLevel: 2,
            startNodeId: 'f1',
            nodes: [
                { id: 'f1', label: 'Bìa Rừng', type: 'empty', x: 10, y: 50 },
                {
                    id: 'f2', label: 'Bãi Nấm Xanh', type: 'mob', x: 35, y: 25,
                    encounterRate: 0.6,
                    mobStats: { name: 'Nấm Độc', hp: 70, attack: 14, defense: 4, speed: 10, expReward: 30, goldReward: 20 }
                },
                { id: 'f3', label: 'Suối Phát Quang', type: 'event', x: 35, y: 75 },
                {
                    id: 'f4', label: 'Rừng Sâu', type: 'mob', x: 60, y: 50,
                    encounterRate: 0.85,
                    mobStats: { name: 'Nhện Pha Lê', hp: 120, attack: 18, defense: 8, speed: 14, expReward: 45, goldReward: 30 }
                },
                {
                    id: 'f5', label: 'Hang Rễ Cây', type: 'boss', x: 85, y: 50,
                    encounterRate: 1.0,
                    mobStats: { name: 'Cây Cổ Thụ Thức Tỉnh', hp: 500, attack: 35, defense: 20, speed: 5, expReward: 200, goldReward: 150 }
                },
            ],
            paths: [
                { from: 'f1', to: 'f2' },
                { from: 'f1', to: 'f3' },
                { from: 'f2', to: 'f4' },
                { from: 'f3', to: 'f4' },
                { from: 'f4', to: 'f5' },
            ]
        };
        this.maps.set(forestMap.id, forestMap);
    }

    public getMap(id: string): AreaMap | undefined {
        return this.maps.get(id);
    }

    public getAllMaps(): { id: string; name: string; difficultyLevel: number; nodeCount: number }[] {
        const result: { id: string; name: string; difficultyLevel: number; nodeCount: number }[] = [];
        for (const [, map] of this.maps.entries()) {
            result.push({
                id: map.id,
                name: map.name,
                difficultyLevel: map.difficultyLevel,
                nodeCount: map.nodes.length
            });
        }
        return result;
    }

    /** Tìm các node kề (adjacent) từ một node ID */
    public getAdjacentNodes(mapId: string, nodeId: string): MapNode[] {
        const map = this.maps.get(mapId);
        if (!map) return [];

        const adjacentIds = new Set<string>();
        for (const path of map.paths) {
            if (path.from === nodeId) adjacentIds.add(path.to);
            if (path.to === nodeId) adjacentIds.add(path.from);
        }

        return map.nodes.filter(n => adjacentIds.has(n.id));
    }

    public saveMap(mapData: AreaMap) {
        this.maps.set(mapData.id, mapData);
        console.log(`[MapManager] Map Saved: ${mapData.id} - ${mapData.name}`);
    }
}
