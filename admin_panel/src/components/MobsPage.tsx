// ============================================
// Mobs Page — Quản lý Cấu hình Quái vật (MongoDB)
// ============================================

import { useState } from 'react';
import type { MobConfig } from '../types';

interface Props {
    mobs: MobConfig[];
    onUpdate: (mobs: MobConfig[]) => void;
    onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function MobsPage({ mobs, onUpdate, onToast }: Props) {
    const [search, setSearch] = useState('');
    const [selectedMob, setSelectedMob] = useState<MobConfig | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMob, setNewMob] = useState<Partial<MobConfig>>({
        baseStats: { hp: 50, attack: 10, defense: 5, speed: 10, critChance: 0.02 },
        scalingPerLevel: { hp: 10, attack: 3, defense: 1, speed: 1 },
        rewards: { baseExp: 15, baseGold: 10, expScaling: 5, goldScaling: 3 },
        dropTable: [],
        spawnMaps: [],
        isBoss: false,
    });

    const filtered = mobs.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m._id.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string) => {
        const mob = mobs.find((m) => m._id === id);
        if (!confirm(`Xóa quái "${mob?.name}"?`)) return;
        onUpdate(mobs.filter((m) => m._id !== id));
        onToast('info', `Đã xóa quái "${mob?.name}"`);
    };

    const handleAdd = () => {
        if (!newMob._id || !newMob.name) {
            onToast('error', 'ID và Tên không được để trống!');
            return;
        }
        const created: MobConfig = {
            _id: newMob._id!,
            name: newMob.name!,
            description: newMob.description || '',
            baseStats: newMob.baseStats || { hp: 50, attack: 10, defense: 5, speed: 10, critChance: 0.02 },
            scalingPerLevel: newMob.scalingPerLevel || { hp: 10, attack: 3, defense: 1, speed: 1 },
            rewards: newMob.rewards || { baseExp: 15, baseGold: 10, expScaling: 5, goldScaling: 3 },
            dropTable: newMob.dropTable || [],
            spawnMaps: newMob.spawnMaps || [],
            isBoss: newMob.isBoss || false,
        };
        onUpdate([...mobs, created]);
        setShowAddModal(false);
        setNewMob({
            baseStats: { hp: 50, attack: 10, defense: 5, speed: 10, critChance: 0.02 },
            scalingPerLevel: { hp: 10, attack: 3, defense: 1, speed: 1 },
            rewards: { baseExp: 15, baseGold: 10, expScaling: 5, goldScaling: 3 },
            dropTable: [], spawnMaps: [], isBoss: false,
        });
        onToast('success', `Đã tạo quái "${created.name}"`);
    };

    return (
        <>
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">👾</span>
                    Quản lý Quái vật
                </h2>
                <div className="flex gap-8 items-center">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm ID hoặc tên quái..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        ➕ Thêm quái
                    </button>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">📋 Mob Configs ({filtered.length})</span>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Boss</th>
                            <th>HP</th>
                            <th>ATK</th>
                            <th>DEF</th>
                            <th>SPD</th>
                            <th>EXP/Gold</th>
                            <th>Maps</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((mob) => (
                            <tr key={mob._id}>
                                <td className="cell-id">{mob._id}</td>
                                <td className="cell-name">{mob.isBoss ? '👑 ' : '👾 '}{mob.name}</td>
                                <td>
                                    {mob.isBoss ? (
                                        <span className="badge badge-suspended">BOSS</span>
                                    ) : (
                                        <span className="text-muted">—</span>
                                    )}
                                </td>
                                <td>{mob.baseStats.hp}</td>
                                <td className="text-red">{mob.baseStats.attack}</td>
                                <td>{mob.baseStats.defense}</td>
                                <td>{mob.baseStats.speed}</td>
                                <td>
                                    <span className="text-cyan">{mob.rewards.baseExp}</span>
                                    <span className="text-muted"> / </span>
                                    <span style={{ color: 'var(--accent-amber)' }}>{mob.rewards.baseGold}</span>
                                </td>
                                <td className="cell-id">{mob.spawnMaps.join(', ')}</td>
                                <td className="cell-actions">
                                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedMob(mob)}>
                                        👁️
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(mob._id)}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedMob && (
                <div className="modal-overlay" onClick={() => setSelectedMob(null)}>
                    <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedMob.isBoss ? '👑' : '👾'} {selectedMob.name}</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedMob(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-label">Mob ID</div>
                                <div className="detail-value mono">{selectedMob._id}</div>

                                <div className="detail-label">Mô tả</div>
                                <div className="detail-value">{selectedMob.description}</div>

                                <div className="detail-label">Boss</div>
                                <div className="detail-value">{selectedMob.isBoss ? '✅ Có' : '❌ Không'}</div>

                                <div className="detail-label">Spawn Maps</div>
                                <div className="detail-value mono">{selectedMob.spawnMaps.join(', ')}</div>
                            </div>

                            <div className="mt-16" style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
                                <div className="form-label" style={{ marginBottom: '12px' }}>Base Stats (Lv.1)</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                                    {[
                                        ['❤️ HP', selectedMob.baseStats.hp, `+${selectedMob.scalingPerLevel.hp}/lv`],
                                        ['⚔️ ATK', selectedMob.baseStats.attack, `+${selectedMob.scalingPerLevel.attack}/lv`],
                                        ['🛡️ DEF', selectedMob.baseStats.defense, `+${selectedMob.scalingPerLevel.defense}/lv`],
                                        ['⚡ SPD', selectedMob.baseStats.speed, `+${selectedMob.scalingPerLevel.speed}/lv`],
                                        ['💥 CRIT', `${(selectedMob.baseStats.critChance * 100).toFixed(0)}%`, '—'],
                                    ].map(([label, value, scale]) => (
                                        <div key={String(label)} style={{ background: 'var(--bg-primary)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                                            <div className="text-xs text-muted">{label}</div>
                                            <div className="font-bold" style={{ fontSize: '16px', marginTop: '4px' }}>{value}</div>
                                            <div className="text-xs text-muted">{scale}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-16" style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
                                <div className="form-label" style={{ marginBottom: '12px' }}>Rewards</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                    {[
                                        ['⭐ EXP', selectedMob.rewards.baseExp, `+${selectedMob.rewards.expScaling}/lv`],
                                        ['🪙 Gold', selectedMob.rewards.baseGold, `+${selectedMob.rewards.goldScaling}/lv`],
                                    ].map(([label, value, scale]) => (
                                        <div key={String(label)} style={{ background: 'var(--bg-primary)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                                            <div className="text-xs text-muted">{label}</div>
                                            <div className="font-bold text-cyan" style={{ fontSize: '16px', marginTop: '4px' }}>{value}</div>
                                            <div className="text-xs text-muted">{scale}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedMob.dropTable.length > 0 && (
                                <div className="mt-16" style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
                                    <div className="form-label" style={{ marginBottom: '8px' }}>Drop Table</div>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Item Template</th>
                                                <th>Drop Rate</th>
                                                <th>Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedMob.dropTable.map((drop, i) => (
                                                <tr key={i}>
                                                    <td className="cell-id">{drop.itemTemplateId}</td>
                                                    <td>{(drop.dropRate * 100).toFixed(1)}%</td>
                                                    <td>{drop.minQty}-{drop.maxQty}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setSelectedMob(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>➕ Tạo Quái mới</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Mob ID *</label>
                                <input className="form-input form-input-mono" placeholder="vd: mob_shadow_wolf" value={newMob._id || ''} onChange={(e) => setNewMob({ ...newMob, _id: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Tên *</label>
                                    <input className="form-input" placeholder="vd: Sói Bóng Đêm" value={newMob.name || ''} onChange={(e) => setNewMob({ ...newMob, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Boss?</label>
                                    <select className="form-select" value={newMob.isBoss ? 'true' : 'false'} onChange={(e) => setNewMob({ ...newMob, isBoss: e.target.value === 'true' })}>
                                        <option value="false">Không</option>
                                        <option value="true">Có — Boss</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mô tả</label>
                                <textarea className="form-textarea" value={newMob.description || ''} onChange={(e) => setNewMob({ ...newMob, description: e.target.value })} />
                            </div>

                            <div className="form-label mt-8" style={{ marginBottom: '8px' }}>Base Stats</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">HP</label>
                                    <input className="form-input" type="number" value={newMob.baseStats?.hp || 50} onChange={(e) => setNewMob({ ...newMob, baseStats: { ...newMob.baseStats!, hp: Number(e.target.value) } })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Attack</label>
                                    <input className="form-input" type="number" value={newMob.baseStats?.attack || 10} onChange={(e) => setNewMob({ ...newMob, baseStats: { ...newMob.baseStats!, attack: Number(e.target.value) } })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Defense</label>
                                    <input className="form-input" type="number" value={newMob.baseStats?.defense || 5} onChange={(e) => setNewMob({ ...newMob, baseStats: { ...newMob.baseStats!, defense: Number(e.target.value) } })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Speed</label>
                                    <input className="form-input" type="number" value={newMob.baseStats?.speed || 10} onChange={(e) => setNewMob({ ...newMob, baseStats: { ...newMob.baseStats!, speed: Number(e.target.value) } })} />
                                </div>
                            </div>

                            <div className="form-label mt-8" style={{ marginBottom: '8px' }}>Rewards</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Base EXP</label>
                                    <input className="form-input" type="number" value={newMob.rewards?.baseExp || 15} onChange={(e) => setNewMob({ ...newMob, rewards: { ...newMob.rewards!, baseExp: Number(e.target.value) } })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Base Gold</label>
                                    <input className="form-input" type="number" value={newMob.rewards?.baseGold || 10} onChange={(e) => setNewMob({ ...newMob, rewards: { ...newMob.rewards!, baseGold: Number(e.target.value) } })} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Hủy</button>
                            <button className="btn btn-primary" onClick={handleAdd}>💾 Tạo Quái</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
