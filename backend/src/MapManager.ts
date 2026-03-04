export interface MapLayer {
    name: string;
    data: number[];
}

export interface GameMap {
    id: string;
    name: string;
    width: number;
    height: number;
    tileSize: number;
    layers: MapLayer[];
}

// In-memory map storage for now. Later this could be loaded from JSON/MongoDB
export class MapManager {
    private maps: Map<string, GameMap> = new Map();

    // Create a default simple map
    constructor() {
        this.createDefaultMap();
    }

    private createDefaultMap() {
        const width = 20;
        const height = 15;
        const defaultData = new Array(width * height).fill(0);

        // Add some random walls
        for (let i = 0; i < width; i++) {
            defaultData[i] = 1; // top wall
            defaultData[(height - 1) * width + i] = 1; // bottom wall
        }
        for (let i = 0; i < height; i++) {
            defaultData[i * width] = 1; // left wall
            defaultData[i * width + width - 1] = 1; // right wall
        }

        const defaultMap = {
            id: "default_zone",
            name: "Trại Di Cư",
            width,
            height,
            tileSize: 50,
            layers: [
                {
                    name: "background",
                    data: new Array(width * height).fill(0) // 0 = empty/floor
                },
                {
                    name: "collision",
                    data: defaultData // 1 = wall
                }
            ]
        };
        this.maps.set(defaultMap.id, defaultMap);
    }

    public getMap(id: string): GameMap | undefined {
        return this.maps.get(id);
    }

    public saveMap(mapData: GameMap) {
        this.maps.set(mapData.id, mapData);
        console.log(`[MapManager] Map Saved: ${mapData.id} - ${mapData.name}`);
    }

    public getAllMaps(): object[] {
        const result: object[] = [];
        for (const [id, map] of this.maps.entries()) {
            result.push({
                id,
                name: map.name,
                width: map.width,
                height: map.height
            });
        }
        return result;
    }
}
