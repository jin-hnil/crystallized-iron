// ============================================
// Characters Page — Quản lý Nhân vật
// ============================================

import { useState } from 'react';
import type { Character } from '../types';

interface Props {
    characters: Character[];
    onUpdate: (characters: Character[]) => void;
    onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function CharactersPage({ characters, onUpdate, onToast }: Props) {
    const [search, setSearch] = useState('');
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Character>>({});

    const filtered = characters.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.id.toString().includes(search)
    );

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('vi-VN');

    const handleEdit = (char: Character) => {
        setSelectedChar(char);
        setEditForm({ ...char });
        setEditMode(true);
    };

    const handleSave = () => {
        if (!editForm || !selectedChar) return;
        const updated = characters.map((c) =>
            c.id === selectedChar.id ? { ...c, ...editForm } as Character : c
        );
        onUpdate(updated);
        setEditMode(false);
        setSelectedChar({ ...selectedChar, ...editForm } as Character);
        onToast('success', `Đã cập nhật nhân vật "${editForm.name}"`);
    };

    const handleDelete = (char: Character) => {
        if (!confirm(`Xóa nhân vật "${char.name}"? Hành động này không thể hoàn tác!`)) return;
        const updated = characters.filter((c) => c.id !== char.id);
        onUpdate(updated);
        setSelectedChar(null);
        onToast('info', `Đã xóa nhân vật "${char.name}"`);
    };

    return (
        <>
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">⚔️</span>
                    Quản lý Nhân vật
                </h2>
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Tìm tên nhân vật hoặc ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">📋 Nhân vật ({filtered.length})</span>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Level</th>
                            <th>HP</th>
                            <th>ATK</th>
                            <th>DEF</th>
                            <th>SPD</th>
                            <th>Map hiện tại</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((char) => (
                            <tr key={char.id}>
                                <td className="cell-id">#{char.id}</td>
                                <td className="cell-name">{char.name}</td>
                                <td>
                                    <span className="text-cyan font-bold">Lv.{char.level}</span>
                                </td>
                                <td>{char.hp}/{char.max_hp}</td>
                                <td className="text-red">{char.attack}</td>
                                <td>{char.defense}</td>
                                <td>{char.speed}</td>
                                <td className="cell-id">{char.current_map_id || '—'}</td>
                                <td className="cell-actions">
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => { setSelectedChar(char); setEditMode(false); }}
                                    >
                                        👁️
                                    </button>
                                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(char)}>
                                        ✏️
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(char)}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Character Detail / Edit Modal */}
            {selectedChar && (
                <div className="modal-overlay" onClick={() => { setSelectedChar(null); setEditMode(false); }}>
                    <div className="modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editMode ? '✏️ Sửa' : '📄 Chi tiết'} — {selectedChar.name}</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedChar(null); setEditMode(false); }}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            {!editMode ? (
                                <>
                                    <div className="detail-grid">
                                        <div className="detail-label">ID</div>
                                        <div className="detail-value mono">#{selectedChar.id}</div>

                                        <div className="detail-label">Account ID</div>
                                        <div className="detail-value mono">#{selectedChar.account_id}</div>

                                        <div className="detail-label">Tên</div>
                                        <div className="detail-value">{selectedChar.name}</div>

                                        <div className="detail-label">Level</div>
                                        <div className="detail-value text-cyan font-bold">Lv.{selectedChar.level}</div>

                                        <div className="detail-label">EXP</div>
                                        <div className="detail-value mono">{selectedChar.experience.toLocaleString()}</div>

                                        <div className="detail-label">HP / Max HP</div>
                                        <div className="detail-value">{selectedChar.hp} / {selectedChar.max_hp}</div>

                                        <div className="detail-label">MP / Max MP</div>
                                        <div className="detail-value">{selectedChar.mp} / {selectedChar.max_mp}</div>
                                    </div>

                                    <div className="mt-16" style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
                                        <div className="form-label" style={{ marginBottom: '12px' }}>Chỉ số Chiến đấu</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                            {[
                                                ['⚔️ ATK', selectedChar.attack],
                                                ['🛡️ DEF', selectedChar.defense],
                                                ['🎯 ACC', selectedChar.accuracy],
                                                ['💨 EVA', selectedChar.evasion],
                                                ['⚡ SPD', selectedChar.speed],
                                                ['💥 CRIT', `${(selectedChar.crit_chance * 100).toFixed(1)}%`],
                                                ['🔮 MRES', selectedChar.magic_resistance],
                                                ['🌀 ERES', selectedChar.effect_resistance],
                                                ['📊 SP', selectedChar.stat_points],
                                            ].map(([label, value]) => (
                                                <div key={String(label)} style={{ background: 'var(--bg-primary)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                                                    <div className="text-xs text-muted">{label}</div>
                                                    <div className="font-bold text-mono" style={{ fontSize: '16px', marginTop: '4px' }}>{value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-16" style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
                                        <div className="detail-grid">
                                            <div className="detail-label">Map hiện tại</div>
                                            <div className="detail-value mono">{selectedChar.current_map_id || '— (không thám hiểm)'}</div>

                                            <div className="detail-label">Node hiện tại</div>
                                            <div className="detail-value mono">{selectedChar.current_node_id || '—'}</div>

                                            <div className="detail-label">Ngày tạo</div>
                                            <div className="detail-value mono">{formatDate(selectedChar.created_at)}</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Tên</label>
                                            <input className="form-input" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Level</label>
                                            <input className="form-input" type="number" value={editForm.level || 1} onChange={(e) => setEditForm({ ...editForm, level: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Max HP</label>
                                            <input className="form-input" type="number" value={editForm.max_hp || 100} onChange={(e) => setEditForm({ ...editForm, max_hp: Number(e.target.value), hp: Number(e.target.value) })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Max MP</label>
                                            <input className="form-input" type="number" value={editForm.max_mp || 50} onChange={(e) => setEditForm({ ...editForm, max_mp: Number(e.target.value), mp: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Attack</label>
                                            <input className="form-input" type="number" value={editForm.attack || 10} onChange={(e) => setEditForm({ ...editForm, attack: Number(e.target.value) })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Defense</label>
                                            <input className="form-input" type="number" value={editForm.defense || 5} onChange={(e) => setEditForm({ ...editForm, defense: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Accuracy</label>
                                            <input className="form-input" type="number" value={editForm.accuracy || 100} onChange={(e) => setEditForm({ ...editForm, accuracy: Number(e.target.value) })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Evasion</label>
                                            <input className="form-input" type="number" value={editForm.evasion || 5} onChange={(e) => setEditForm({ ...editForm, evasion: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Speed</label>
                                            <input className="form-input" type="number" value={editForm.speed || 10} onChange={(e) => setEditForm({ ...editForm, speed: Number(e.target.value) })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Crit Chance</label>
                                            <input className="form-input" type="number" step="0.01" value={editForm.crit_chance || 0.05} onChange={(e) => setEditForm({ ...editForm, crit_chance: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Magic Resistance</label>
                                            <input className="form-input" type="number" value={editForm.magic_resistance || 0} onChange={(e) => setEditForm({ ...editForm, magic_resistance: Number(e.target.value) })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Effect Resistance</label>
                                            <input className="form-input" type="number" value={editForm.effect_resistance || 0} onChange={(e) => setEditForm({ ...editForm, effect_resistance: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stat Points</label>
                                        <input className="form-input" type="number" value={editForm.stat_points || 0} onChange={(e) => setEditForm({ ...editForm, stat_points: Number(e.target.value) })} />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            {editMode ? (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setEditMode(false)}>Hủy</button>
                                    <button className="btn btn-primary" onClick={handleSave}>💾 Lưu thay đổi</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-ghost" onClick={() => handleEdit(selectedChar)}>✏️ Sửa</button>
                                    <button className="btn btn-ghost" onClick={() => { setSelectedChar(null); setEditMode(false); }}>Đóng</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
