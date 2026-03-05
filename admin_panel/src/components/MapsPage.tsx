// ============================================
// Maps Page — Quản lý Bản đồ Node Graph
// ============================================

import { useState, useRef, useEffect, useCallback } from 'react';
import type { GameMap, MapNode } from '../types';

interface Props {
    maps: GameMap[];
    onUpdate: (maps: GameMap[]) => void;
    onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const NODE_COLORS: Record<string, string> = {
    empty: '#4d5870',
    mob: '#ff3366',
    boss: '#ffb020',
    treasure: '#00e676',
    event: '#b44dff',
};

const NODE_ICONS: Record<string, string> = {
    empty: '○',
    mob: '⚔',
    boss: '👑',
    treasure: '💰',
    event: '⚡',
};

export default function MapsPage({ maps, onUpdate, onToast }: Props) {
    const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
    const [editingNode, setEditingNode] = useState<MapNode | null>(null);
    const [showAddMap, setShowAddMap] = useState(false);
    const [newMapName, setNewMapName] = useState('');
    const [newMapId, setNewMapId] = useState('');
    const [newMapLevel, setNewMapLevel] = useState(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const selectedMap = maps.find((m) => m.id === selectedMapId) || null;

    // Draw Node Graph on Canvas
    const drawGraph = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !selectedMap) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = 700;
        const H = 440;
        canvas.width = W;
        canvas.height = H;

        // Background
        ctx.fillStyle = '#0a0e17';
        ctx.fillRect(0, 0, W, H);

        // Grid
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        const nodes = selectedMap.nodes;

        // Draw connections
        ctx.lineWidth = 2;
        nodes.forEach((node) => {
            node.connections.forEach((connId) => {
                const target = nodes.find((n) => n.id === connId);
                if (!target) return;
                // Avoid drawing duplicate lines
                if (node.id > connId) return;

                ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(target.x, target.y);
                ctx.stroke();

                // Animated dash effect
                ctx.setLineDash([6, 4]);
                ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
                ctx.stroke();
                ctx.setLineDash([]);
            });
        });

        // Draw nodes
        nodes.forEach((node) => {
            const color = NODE_COLORS[node.type] || '#4d5870';
            const radius = node.type === 'boss' ? 22 : 16;

            // Outer glow
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
            ctx.fillStyle = color + '15';
            ctx.fill();

            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#0f1520';
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Icon text
            ctx.fillStyle = color;
            ctx.font = `${radius - 4}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(NODE_ICONS[node.type] || '○', node.x, node.y);

            // Label below
            ctx.fillStyle = '#8892a8';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + radius + 14);

            // ID above
            ctx.fillStyle = '#4d5870';
            ctx.font = '9px JetBrains Mono, monospace';
            ctx.fillText(node.id, node.x, node.y - radius - 8);
        });
    }, [selectedMap]);

    useEffect(() => {
        drawGraph();
    }, [drawGraph]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!selectedMap || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find clicked node
        const clicked = selectedMap.nodes.find((n) => {
            const dx = n.x - x;
            const dy = n.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 22;
        });

        if (clicked) {
            setEditingNode({ ...clicked });
        }
    };

    const handleNodeSave = () => {
        if (!editingNode || !selectedMap) return;
        const updatedNodes = selectedMap.nodes.map((n) =>
            n.id === editingNode.id ? editingNode : n
        );
        const updatedMaps = maps.map((m) =>
            m.id === selectedMap.id ? { ...m, nodes: updatedNodes } : m
        );
        onUpdate(updatedMaps);
        setEditingNode(null);
        onToast('success', `Đã cập nhật node "${editingNode.label}"`);
    };

    const handleAddMap = () => {
        if (!newMapId || !newMapName) {
            onToast('error', 'ID và Tên map không được để trống!');
            return;
        }
        const newMap: GameMap = {
            id: newMapId,
            name: newMapName,
            description: '',
            level: newMapLevel,
            nodes: [
                { id: 'n1', label: 'Cổng Vào', type: 'empty', x: 100, y: 220, connections: [] },
            ],
        };
        onUpdate([...maps, newMap]);
        setShowAddMap(false);
        setSelectedMapId(newMapId);
        setNewMapId('');
        setNewMapName('');
        setNewMapLevel(1);
        onToast('success', `Đã tạo map "${newMapName}"`);
    };

    const handleDeleteMap = (id: string) => {
        const map = maps.find((m) => m.id === id);
        if (!confirm(`Xóa map "${map?.name}"?`)) return;
        onUpdate(maps.filter((m) => m.id !== id));
        if (selectedMapId === id) setSelectedMapId(null);
        onToast('info', `Đã xóa map "${map?.name}"`);
    };

    return (
        <>
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">🗺️</span>
                    Quản lý Bản đồ
                </h2>
                <button className="btn btn-primary" onClick={() => setShowAddMap(true)}>
                    ➕ Tạo map mới
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }}>
                {/* Map List */}
                <div className="panel" style={{ height: 'fit-content' }}>
                    <div className="panel-header">
                        <span className="panel-title">📂 Maps ({maps.length})</span>
                    </div>
                    <div style={{ padding: '8px' }}>
                        {maps.map((map) => (
                            <div
                                key={map.id}
                                className={`nav-item ${selectedMapId === map.id ? 'active' : ''}`}
                                onClick={() => setSelectedMapId(map.id)}
                                style={{ margin: '2px 0' }}
                            >
                                <span className="nav-icon">🗺️</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{map.name}</div>
                                    <div className="text-xs text-muted">Lv.{map.level} • {map.nodes.length} nodes</div>
                                </div>
                                <button
                                    className="btn btn-danger btn-sm btn-icon"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteMap(map.id); }}
                                    style={{ padding: '4px 6px', fontSize: '11px' }}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        {maps.length === 0 && (
                            <div className="empty-state" style={{ padding: '30px' }}>
                                <div className="empty-text">Chưa có map nào</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Viewer */}
                <div>
                    {!selectedMap ? (
                        <div className="panel">
                            <div className="empty-state">
                                <div className="empty-icon">🗺️</div>
                                <div className="empty-text">Chọn một map để xem Node Graph</div>
                                <div className="empty-sub">Click vào node trên đồ thị để chỉnh sửa</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="panel" style={{ marginBottom: '16px' }}>
                                <div className="panel-header">
                                    <span className="panel-title">
                                        🗺️ {selectedMap.name}
                                        <span className="text-muted text-sm" style={{ marginLeft: '8px' }}>
                                            ({selectedMap.id}) — Lv.{selectedMap.level}
                                        </span>
                                    </span>
                                    <div className="flex gap-8">
                                        {Object.entries(NODE_COLORS).map(([type, color]) => (
                                            <div key={type} className="flex items-center gap-8" style={{ fontSize: '11px' }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }}></span>
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ padding: '16px' }}>
                                    <div className="map-canvas-container">
                                        <canvas
                                            ref={canvasRef}
                                            onClick={handleCanvasClick}
                                            style={{ cursor: 'pointer', width: '100%', maxWidth: '700px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Nodes List */}
                            <div className="panel">
                                <div className="panel-header">
                                    <span className="panel-title">📍 Nodes ({selectedMap.nodes.length})</span>
                                </div>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Label</th>
                                            <th>Type</th>
                                            <th>Pos X</th>
                                            <th>Pos Y</th>
                                            <th>Connections</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedMap.nodes.map((node) => (
                                            <tr key={node.id}>
                                                <td className="cell-id">{node.id}</td>
                                                <td className="cell-name">{node.label}</td>
                                                <td>
                                                    <span style={{ color: NODE_COLORS[node.type] }}>
                                                        {NODE_ICONS[node.type]} {node.type}
                                                    </span>
                                                </td>
                                                <td className="text-muted">{node.x}</td>
                                                <td className="text-muted">{node.y}</td>
                                                <td className="cell-id">{node.connections.join(', ')}</td>
                                                <td>
                                                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingNode({ ...node })}>
                                                        ✏️ Sửa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Edit Node Modal */}
            {editingNode && (
                <div className="modal-overlay" onClick={() => setEditingNode(null)}>
                    <div className="modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Sửa Node — {editingNode.id}</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setEditingNode(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Label</label>
                                <input className="form-input" value={editingNode.label} onChange={(e) => setEditingNode({ ...editingNode, label: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select className="form-select" value={editingNode.type} onChange={(e) => setEditingNode({ ...editingNode, type: e.target.value as MapNode['type'] })}>
                                    <option value="empty">Empty</option>
                                    <option value="mob">Mob</option>
                                    <option value="boss">Boss</option>
                                    <option value="treasure">Treasure</option>
                                    <option value="event">Event</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Pos X</label>
                                    <input className="form-input" type="number" value={editingNode.x} onChange={(e) => setEditingNode({ ...editingNode, x: Number(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pos Y</label>
                                    <input className="form-input" type="number" value={editingNode.y} onChange={(e) => setEditingNode({ ...editingNode, y: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Connections (comma-separated)</label>
                                <input
                                    className="form-input form-input-mono"
                                    value={editingNode.connections.join(', ')}
                                    onChange={(e) => setEditingNode({ ...editingNode, connections: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setEditingNode(null)}>Hủy</button>
                            <button className="btn btn-primary" onClick={handleNodeSave}>💾 Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Map Modal */}
            {showAddMap && (
                <div className="modal-overlay" onClick={() => setShowAddMap(false)}>
                    <div className="modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>➕ Tạo Map mới</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddMap(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Map ID *</label>
                                <input className="form-input form-input-mono" placeholder="vd: area_dark_cave" value={newMapId} onChange={(e) => setNewMapId(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tên Map *</label>
                                <input className="form-input" placeholder="vd: Hang Động Tối" value={newMapName} onChange={(e) => setNewMapName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Level khuyến nghị</label>
                                <input className="form-input" type="number" value={newMapLevel} onChange={(e) => setNewMapLevel(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowAddMap(false)}>Hủy</button>
                            <button className="btn btn-primary" onClick={handleAddMap}>💾 Tạo Map</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
