import { WebSocket } from 'ws';
import type { PlayerState, Vector2 } from './types.js';

export class Player {
    public id: string;
    public ws: WebSocket;
    public name: string;
    public position: Vector2;
    public hp: number;
    public maxHp: number;
    public mp: number;
    public maxMp: number;
    public level: number;
    public physicalAttack: number;
    public magicAttack: number;
    public armor: number;
    public magicResistance: number;
    public effectResistance: number;
    public critChance: number;
    public statPoints: number;
    public experience: number; // Renamed to spell correctly

    constructor(id: string, ws: WebSocket, name: string) {
        this.id = id;
        this.ws = ws;
        this.name = name;

        // Default initial values
        this.position = { x: 0, y: 0 };
        this.hp = 100;
        this.maxHp = 100;
        this.mp = 50;
        this.maxMp = 50;
        this.level = 1;
        this.physicalAttack = 10;
        this.magicAttack = 10;
        this.armor = 5;
        this.magicResistance = 5;
        this.effectResistance = 0;
        this.critChance = 0.05; // 5% base crit
        this.statPoints = 0;
        this.experience = 0;
    }

    public getState(): PlayerState {
        return {
            id: this.id,
            name: this.name,
            position: this.position,
            hp: this.hp,
            maxHp: this.maxHp,
            mp: this.mp,
            maxMp: this.maxMp,
            level: this.level,
            physicalAttack: this.physicalAttack,
            magicAttack: this.magicAttack,
            armor: this.armor,
            magicResistance: this.magicResistance,
            effectResistance: this.effectResistance,
            critChance: this.critChance,
            statPoints: this.statPoints,
            experience: this.experience
        };
    }

    public send(message: any) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    public updatePosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
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
