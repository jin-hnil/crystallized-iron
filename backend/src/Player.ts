import { WebSocket } from 'ws';
import type { PlayerState } from './types.js';

export class Player {
    public id: string;
    public ws: WebSocket;
    public name: string;
    public hp: number;
    public maxHp: number;
    public mp: number;
    public maxMp: number;
    public level: number;
    public attack: number;
    public defense: number;
    public accuracy: number;
    public evasion: number;
    public speed: number;
    public critChance: number;
    public statPoints: number;
    public experience: number;

    // Exploration State
    public currentMapId: string | undefined;
    public currentNodeId: string | undefined;

    constructor(id: string, ws: WebSocket, name: string) {
        this.id = id;
        this.ws = ws;
        this.name = name;

        // Default initial values
        this.hp = 100;
        this.maxHp = 100;
        this.mp = 50;
        this.maxMp = 50;
        this.level = 1;
        this.attack = 10;
        this.defense = 5;
        this.accuracy = 100;
        this.evasion = 5;
        this.speed = 10;
        this.critChance = 0.05; // 5% base crit
        this.statPoints = 0;
        this.experience = 0;
    }

    public getState(): PlayerState {
        return {
            id: this.id,
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            level: this.level,
            attack: this.attack,
            defense: this.defense,
            accuracy: this.accuracy,
            evasion: this.evasion,
            speed: this.speed,
            critChance: this.critChance,
            statPoints: this.statPoints,
            experience: this.experience,
            currentMapId: this.currentMapId,
            currentNodeId: this.currentNodeId,
        };
    }

    public send(message: any) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    public getRequiredExp(level: number): number {
        if (level >= 100) return Infinity; // Max level

        // Công thức: 100 * (level ^ 2.5) + 500 * level
        let exp = Math.floor(100 * Math.pow(level, 2.5) + 500 * level);
        return exp;
    }

    public addExperience(xpGained: number) {
        this.experience += xpGained;
        let leveledUp = false;

        while (this.experience >= this.getRequiredExp(this.level)) {
            // Deduct required XP for the current level
            this.experience -= this.getRequiredExp(this.level);

            this.level++;
            // Nhận 5 điểm chỉ số mỗi cấp
            this.statPoints += 5;

            // Auto-heal on level up
            this.hp = this.maxHp;
            this.mp = this.maxMp;
            leveledUp = true;

            console.log(`[LevelUp] Chúc mừng ${this.name} lên cấp ${this.level}!`);
        }

        return leveledUp;
    }
}
