// ============================================
// Items Page — Quản lý Item Templates (MongoDB)
// ============================================

import { useState } from 'react';
import type { ItemTemplate } from '../types';

interface Props {
    items: ItemTemplate[];
    onUpdate: (items: ItemTemplate[]) => void;
    onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const RARITY_NAMES: Record<number, string> = {
    1: '⬜ 1★ Trắng',
    2: '🟦 2★ Xanh',
    3: '🟪 3★ Tím',
    4: '🟧 4★ Cam',
    5: '🟥 5★ Đỏ',
    6: '🌟 6★ Huyền thoại',
};

const CATEGORY_ICONS: Record<string, string> = {
    weapon: '⚔️',
    armor: '🛡️',
    accessory: '💍',
    gem: '💎',
    material: '🧱',
    consumable: '🧪',
};

export default function ItemsPage({ items, onUpdate, onToast }: Props) {
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [selectedItem, setSelectedItem] = useState<ItemTemplate | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState<Partial<ItemTemplate>>({
        category: 'weapon',
        slotType: 'weapon',
        mainStat: { type: 'attack', baseValue: 10, growthPerLevel: 2 },
        possibleRarities: [1, 2, 3],
        maxSockets: 0,
        subStatPool: [],
        requirements: { minLevel: 1 },
        dropInfo: { mapIds: [], baseDropRate: 0.05 },
    });

    const filtered = items.filter((item) => {
        const matchSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item._id.toLowerCase().includes(search.toLowerCase());
        const matchCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchSearch && matchCategory;
    });

    const handleDelete = (id: string) => {
        if (!confirm(`Xóa item template "${id}"?`)) return;
        onUpdate(items.filter((i) => i._id !== id));
        onToast('info', `Đã xóa template "${id}"`);
    };

    const handleAdd = () => {
        if (!newItem._id || !newItem.name) {
            onToast('error', 'ID và Tên không được để trống!');
            return;
        }
        if (items.some((i) => i._id === newItem._id)) {
            onToast('error', `ID "${newItem._id}" đã tồn tại!`);
            return;
        }
        const created: ItemTemplate = {
            _id: newItem._id!,
            name: newItem.name!,
            description: newItem.description || '',
            category: newItem.category || 'weapon',
            slotType: newItem.slotType || 'weapon',
            mainStat: newItem.mainStat || { type: 'attack', baseValue: 10, growthPerLevel: 2 },
            subStatPool: newItem.subStatPool || [],
            possibleRarities: newItem.possibleRarities || [1, 2, 3],
            maxSockets: newItem.maxSockets || 0,
            setId: newItem.setId || null,
            requirements: newItem.requirements || { minLevel: 1 },
            dropInfo: newItem.dropInfo || { mapIds: [], baseDropRate: 0.05 },
        };
        onUpdate([...items, created]);
        setShowAddModal(false);
        setNewItem({
            category: 'weapon', slotType: 'weapon',
            mainStat: { type: 'attack', baseValue: 10, growthPerLevel: 2 },
            possibleRarities: [1, 2, 3], maxSockets: 0, subStatPool: [],
            requirements: { minLevel: 1 }, dropInfo: { mapIds: [], baseDropRate: 0.05 },
        });
        onToast('success', `Đã tạo template "${created.name}"`);
    };

    return (
        <>
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">🎴</span>
                    Quản lý Item Templates
                </h2>
                <div className="flex gap-8 items-center">
                    <select
                        className="form-select"
                        style={{ width: '150px' }}
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">Tất cả loại</option>
                        <option value="weapon">⚔️ Weapon</option>
                        <option value="armor">🛡️ Armor</option>
                        <option value="accessory">💍 Accessory</option>
                        <option value="gem">💎 Gem</option>
                        <option value="material">🧱 Material</option>
                        <option value="consumable">🧪 Consumable</option>
                    </select>
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm ID hoặc tên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        ➕ Thêm mới
                    </button>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">📦 Templates ({filtered.length})</span>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Loại</th>
                            <th>Main Stat</th>
                            <th>Growth</th>
                            <th>Rarities</th>
                            <th>Sockets</th>
                            <th>Drop Rate</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item) => (
                            <tr key={item._id}>
                                <td className="cell-id">{item._id}</td>
                                <td className="cell-name">
                                    {CATEGORY_ICONS[item.category] || '📦'} {item.name}
                                </td>
                                <td>
                                    <span className="badge badge-active">{item.category}</span>
                                </td>
                                <td>
                                    {item.mainStat.type}: <span className="text-cyan">{item.mainStat.baseValue}</span>
                                </td>
                                <td className="text-muted">+{item.mainStat.growthPerLevel}/lv</td>
                                <td>
                                    {item.possibleRarities.map((r) => (
                                        <span key={r} className={`badge badge-rarity-${r}`} style={{ marginRight: '2px', padding: '1px 4px', fontSize: '10px' }}>
                                            {r}★
                                        </span>
                                    ))}
                                </td>
                                <td>{item.maxSockets}</td>
                                <td className="text-muted">{(item.dropInfo.baseDropRate * 100).toFixed(1)}%</td>
                                <td className="cell-actions">
                                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedItem(item)}>
                                        👁️
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
                    <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{CATEGORY_ICONS[selectedItem.category]} {selectedItem.name}</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedItem(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-label">Template ID</div>
                                <div className="detail-value mono">{selectedItem._id}</div>

                                <div className="detail-label">Mô tả</div>
                                <div className="detail-value">{selectedItem.description || '—'}</div>

                                <div className="detail-label">Loại / Slot</div>
                                <div className="detail-value">{selectedItem.category} / {selectedItem.slotType}</div>

                                <div className="detail-label">Main Stat</div>
                                <div className="detail-value">
                                    {selectedItem.mainStat.type}: <span className="text-cyan">{selectedItem.mainStat.baseValue}</span> (+{selectedItem.mainStat.growthPerLevel}/lv)
                                </div>

                                <div className="detail-label">Rarities</div>
                                <div className="detail-value">
                                    {selectedItem.possibleRarities.map((r) => RARITY_NAMES[r] || `${r}★`).join(', ')}
                                </div>

                                <div className="detail-label">Max Sockets</div>
                                <div className="detail-value">{selectedItem.maxSockets}</div>

                                <div className="detail-label">Set ID</div>
                                <div className="detail-value mono">{selectedItem.setId || '—'}</div>

                                <div className="detail-label">Min Level</div>
                                <div className="detail-value">{selectedItem.requirements.minLevel}</div>

                                <div className="detail-label">Drop Maps</div>
                                <div className="detail-value mono">{selectedItem.dropInfo.mapIds.join(', ') || '—'}</div>

                                <div className="detail-label">Drop Rate</div>
                                <div className="detail-value">{(selectedItem.dropInfo.baseDropRate * 100).toFixed(1)}%</div>
                            </div>

                            {selectedItem.subStatPool.length > 0 && (
                                <div className="mt-16" style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
                                    <div className="form-label" style={{ marginBottom: '8px' }}>Sub-Stat Pool</div>
                                    <div className="json-viewer">
                                        {JSON.stringify(selectedItem.subStatPool, null, 2)}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setSelectedItem(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>➕ Tạo Item Template mới</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Template ID *</label>
                                <input
                                    className="form-input form-input-mono"
                                    placeholder="vd: weapon_crystal_blade_001"
                                    value={newItem._id || ''}
                                    onChange={(e) => setNewItem({ ...newItem, _id: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tên hiển thị *</label>
                                <input
                                    className="form-input"
                                    placeholder="vd: Kiếm Tinh Thể"
                                    value={newItem.name || ''}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mô tả</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Mô tả vật phẩm..."
                                    value={newItem.description || ''}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Loại</label>
                                    <select className="form-select" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value, slotType: e.target.value })}>
                                        <option value="weapon">Weapon</option>
                                        <option value="armor">Armor</option>
                                        <option value="accessory">Accessory</option>
                                        <option value="gem">Gem</option>
                                        <option value="material">Material</option>
                                        <option value="consumable">Consumable</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Min Level</label>
                                    <input className="form-input" type="number" value={newItem.requirements?.minLevel || 1} onChange={(e) => setNewItem({ ...newItem, requirements: { minLevel: Number(e.target.value) } })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Main Stat Type</label>
                                    <select className="form-select" value={newItem.mainStat?.type || 'attack'} onChange={(e) => setNewItem({ ...newItem, mainStat: { ...newItem.mainStat!, type: e.target.value } })}>
                                        <option value="attack">Attack</option>
                                        <option value="defense">Defense</option>
                                        <option value="hp">HP</option>
                                        <option value="speed">Speed</option>
                                        <option value="accuracy">Accuracy</option>
                                        <option value="evasion">Evasion</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Base Value</label>
                                    <input className="form-input" type="number" value={newItem.mainStat?.baseValue || 10} onChange={(e) => setNewItem({ ...newItem, mainStat: { ...newItem.mainStat!, baseValue: Number(e.target.value) } })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Growth / Level</label>
                                    <input className="form-input" type="number" value={newItem.mainStat?.growthPerLevel || 2} onChange={(e) => setNewItem({ ...newItem, mainStat: { ...newItem.mainStat!, growthPerLevel: Number(e.target.value) } })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Sockets</label>
                                    <input className="form-input" type="number" value={newItem.maxSockets || 0} onChange={(e) => setNewItem({ ...newItem, maxSockets: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Drop Rate (%)</label>
                                <input className="form-input" type="number" step="0.1" value={(newItem.dropInfo?.baseDropRate || 0.05) * 100} onChange={(e) => setNewItem({ ...newItem, dropInfo: { ...newItem.dropInfo!, baseDropRate: Number(e.target.value) / 100 } })} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Hủy</button>
                            <button className="btn btn-primary" onClick={handleAdd}>💾 Tạo Template</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
