// ============================================
// EXPLORATION MANAGER
// Quản lý vòng lặp Auto-Explore cho từng player.
// Nhân vật tự động di chuyển qua các Node,
// gặp quái → chạy Battle Log, nhặt đồ, v.v.
// ============================================

import { Player } from './Player.js';
import { MapManager } from './MapManager.js';
import type { MapNode } from './MapManager.js';

export interface BattleLogEntry {
    turn: number;
    text: string;
}

export interface ExplorationResult {
    nodeId: string;
    nodeLabel: string;
    nodeType: string;
    /** Battle log nếu gặp quái */
    battleLog?: BattleLogEntry[];
    battleWon?: boolean;
    /** Phần thưởng */
    expGained: number;
    goldGained: number;
    /** Sát thương nhận vào (trừ HP) */
    hpLost: number;
}

export class ExplorationManager {
    private mapManager: MapManager;
    /** Lưu trạng thái thám hiểm: playerId -> { mapId, currentNodeId, intervalId } */
    private explorations: Map<string, {
        mapId: string;
        currentNodeId: string;
        intervalId: ReturnType<typeof setInterval>;
    }> = new Map();

    constructor(mapManager: MapManager) {
        this.mapManager = mapManager;
    }

    /**
     * Bắt đầu thám hiểm map cho một player.
     * Trả về thông tin map hoặc null nếu map không tồn tại.
     */
    public startExploration(
        player: Player,
        mapId: string,
        onResult: (result: ExplorationResult) => void,
        onDeath: () => void
    ): boolean {
        const map = this.mapManager.getMap(mapId);
        if (!map) return false;

        // Dừng exploration cũ nếu có
        this.stopExploration(player.id);

        const startNode = map.nodes.find(n => n.id === map.startNodeId);
        if (!startNode) return false;

        // Gửi kết quả node đầu tiên
        onResult({
            nodeId: startNode.id,
            nodeLabel: startNode.label,
            nodeType: startNode.type,
            expGained: 0,
            goldGained: 0,
            hpLost: 0,
        });

        // Thiết lập vòng lặp tick: mỗi 4 giây nhảy sang node tiếp theo
        const tickMs = 4000;
        let currentNodeId = startNode.id;

        const intervalId = setInterval(() => {
            // Lấy các node kề
            const adjacentNodes = this.mapManager.getAdjacentNodes(mapId, currentNodeId);
            if (adjacentNodes.length === 0) {
                // Hết đường, quay lại đầu
                currentNodeId = map.startNodeId;
                return;
            }

            // Chọn ngẫu nhiên node tiếp theo
            const nextNode = adjacentNodes[Math.floor(Math.random() * adjacentNodes.length)];
            if (!nextNode) return;
            currentNodeId = nextNode.id;

            // Xử lý sự kiện tại node
            const result = this.processNode(player, nextNode);
            onResult(result);

            // Cập nhật state
            const state = this.explorations.get(player.id);
            if (state) state.currentNodeId = currentNodeId;

            // Kiểm tra chết
            if (player.hp <= 0) {
                this.stopExploration(player.id);
                player.hp = player.maxHp; // Hồi sinh
                onDeath();
            }
        }, tickMs);

        this.explorations.set(player.id, {
            mapId,
            currentNodeId: startNode.id,
            intervalId,
        });

        return true;
    }

    public stopExploration(playerId: string) {
        const state = this.explorations.get(playerId);
        if (state) {
            clearInterval(state.intervalId);
            this.explorations.delete(playerId);
        }
    }

    public isExploring(playerId: string): boolean {
        return this.explorations.has(playerId);
    }

    // ============================
    //   XỬ LÝ SỰ KIỆN TẠI NODE
    // ============================
    private processNode(player: Player, node: MapNode): ExplorationResult {
        const result: ExplorationResult = {
            nodeId: node.id,
            nodeLabel: node.label,
            nodeType: node.type,
            expGained: 0,
            goldGained: 0,
            hpLost: 0,
        };

        switch (node.type) {
            case 'mob':
            case 'boss': {
                // Roll encounter
                const roll = Math.random();
                if (roll <= (node.encounterRate ?? 0.5) && node.mobStats) {
                    const battle = this.runBattle(player, node.mobStats);
                    result.battleLog = battle.log;
                    result.battleWon = battle.won;
                    result.hpLost = battle.hpLost;
                    if (battle.won) {
                        result.expGained = node.mobStats.expReward;
                        result.goldGained = node.mobStats.goldReward;
                        player.addExperience(node.mobStats.expReward);
                    }
                }
                break;
            }
            case 'treasure': {
                // Nhặt vàng ngẫu nhiên
                const gold = Math.floor(Math.random() * 30) + 10;
                result.goldGained = gold;
                break;
            }
            case 'event': {
                // Sự kiện ngẫu nhiên: hồi máu hoặc nhặt EXP nhỏ
                const eventRoll = Math.random();
                if (eventRoll < 0.5) {
                    // Hồi máu
                    const heal = Math.floor(player.maxHp * 0.2);
                    player.hp = Math.min(player.hp + heal, player.maxHp);
                    result.expGained = 0;
                } else {
                    result.expGained = Math.floor(Math.random() * 20) + 5;
                    player.addExperience(result.expGained);
                }
                break;
            }
            // 'empty' -> không có gì xảy ra
        }

        return result;
    }

    // ============================
    //   BATTLE ENGINE (Text Log)
    // ============================
    private runBattle(
        player: Player,
        mob: { name: string; hp: number; attack: number; defense: number; speed: number; expReward: number; goldReward: number }
    ): { log: BattleLogEntry[]; won: boolean; hpLost: number } {
        const log: BattleLogEntry[] = [];
        let mobHp = mob.hp;
        const startPlayerHp = player.hp;
        let turn = 1;

        log.push({ turn: 0, text: `⚔️ Gặp ${mob.name}! [HP: ${mob.hp} | ATK: ${mob.attack} | DEF: ${mob.defense}]` });

        while (player.hp > 0 && mobHp > 0 && turn <= 20) {
            // Ai nhanh hơn đánh trước
            const playerFirst = player.speed >= mob.speed;

            if (playerFirst) {
                // Player đánh mob
                const pDmg = this.calcDamage(player.attack, mob.defense, player.critChance);
                mobHp -= pDmg.damage;
                log.push({ turn, text: `${player.name} tấn công ${mob.name}${pDmg.crit ? ' (CHÍ MẠNG!)' : ''} → ${pDmg.damage} sát thương. [Mob HP: ${Math.max(0, mobHp)}]` });

                if (mobHp <= 0) break;

                // Mob đánh player
                const mDmg = this.calcDamage(mob.attack, player.defense, 0.03);
                player.hp -= mDmg.damage;
                log.push({ turn, text: `${mob.name} phản đòn${mDmg.crit ? ' (CHÍ MẠNG!)' : ''} → ${mDmg.damage} sát thương. [HP: ${Math.max(0, player.hp)}/${player.maxHp}]` });
            } else {
                // Mob đánh trước
                const mDmg = this.calcDamage(mob.attack, player.defense, 0.03);
                player.hp -= mDmg.damage;
                log.push({ turn, text: `${mob.name} ra đòn trước${mDmg.crit ? ' (CHÍ MẠNG!)' : ''} → ${mDmg.damage} sát thương. [HP: ${Math.max(0, player.hp)}/${player.maxHp}]` });

                if (player.hp <= 0) break;

                // Player phản đòn
                const pDmg = this.calcDamage(player.attack, mob.defense, player.critChance);
                mobHp -= pDmg.damage;
                log.push({ turn, text: `${player.name} phản đòn${pDmg.crit ? ' (CHÍ MẠNG!)' : ''} → ${pDmg.damage} sát thương. [Mob HP: ${Math.max(0, mobHp)}]` });
            }

            turn++;
        }

        const won = mobHp <= 0;
        if (won) {
            log.push({ turn, text: `✅ Chiến thắng! Nhận ${mob.expReward} EXP và ${mob.goldReward} Vàng.` });
        } else {
            log.push({ turn, text: `💀 ${player.name} gục ngã trước ${mob.name}...` });
        }

        return {
            log,
            won,
            hpLost: Math.max(0, startPlayerHp - player.hp),
        };
    }

    private calcDamage(atk: number, def: number, critChance: number): { damage: number; crit: boolean } {
        let baseDmg = Math.max(1, atk - def);
        // Random dao động ±20%
        baseDmg = Math.floor(baseDmg * (0.8 + Math.random() * 0.4));

        const crit = Math.random() < critChance;
        if (crit) baseDmg = Math.floor(baseDmg * 1.8);

        return { damage: Math.max(1, baseDmg), crit };
    }
}
