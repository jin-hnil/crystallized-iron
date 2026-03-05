// ============================================
// Dashboard Page — Tổng quan hệ thống
// ============================================

import type { DashboardStats } from '../types';

interface Props {
    stats: DashboardStats;
}

export default function DashboardPage({ stats }: Props) {
    return (
        <>
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">📊</span>
                    Tổng quan Hệ thống
                </h2>
            </div>

            <div className="stats-grid">
                <div className="stat-card cyan">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{stats.totalAccounts.toLocaleString()}</div>
                    <div className="stat-label">Tài khoản</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon">⚔️</div>
                    <div className="stat-value">{stats.totalCharacters.toLocaleString()}</div>
                    <div className="stat-label">Nhân vật</div>
                </div>
                <div className="stat-card amber">
                    <div className="stat-icon">🎴</div>
                    <div className="stat-value">{stats.totalItems.toLocaleString()}</div>
                    <div className="stat-label">Item Templates</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon">🗺️</div>
                    <div className="stat-value">{stats.totalMaps}</div>
                    <div className="stat-label">Bản đồ</div>
                </div>
                <div className="stat-card red">
                    <div className="stat-icon">👾</div>
                    <div className="stat-value">{stats.totalMobs}</div>
                    <div className="stat-label">Quái vật</div>
                </div>
                <div className="stat-card cyan">
                    <div className="stat-icon">🟢</div>
                    <div className="stat-value">{stats.onlineNow}</div>
                    <div className="stat-label">Đang online</div>
                </div>
            </div>

            {/* Quick Info Panels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="panel">
                    <div className="panel-header">
                        <span className="panel-title">🗄️ MySQL Tables</span>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Bảng</th>
                                    <th>Mô tả</th>
                                    <th>Engine</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['accounts', 'Tài khoản người chơi', 'InnoDB'],
                                    ['characters', 'Nhân vật', 'InnoDB'],
                                    ['currencies', 'Tiền tệ (Gold / Diamonds)', 'InnoDB'],
                                    ['inventory', 'Kho vật phẩm', 'InnoDB'],
                                    ['transactions', 'Lịch sử giao dịch', 'InnoDB'],
                                    ['gacha_history', 'Lịch sử mở rương', 'InnoDB'],
                                ].map(([table, desc, engine]) => (
                                    <tr key={table}>
                                        <td className="cell-id">{table}</td>
                                        <td>{desc}</td>
                                        <td><span className="badge badge-active">{engine}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <span className="panel-title">🍃 MongoDB Collections</span>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Collection</th>
                                    <th>Mô tả</th>
                                    <th>TTL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['item_templates', 'Khuôn mẫu vật phẩm', '—'],
                                    ['battle_logs', 'Nhật ký chiến đấu', '90 ngày'],
                                    ['chat_logs', 'Tin nhắn chat', '30 ngày'],
                                    ['mob_configs', 'Cấu hình quái vật', '—'],
                                    ['exploration_logs', 'Lịch sử thám hiểm', '—'],
                                    ['set_definitions', 'Bộ trang bị', '—'],
                                ].map(([col, desc, ttl]) => (
                                    <tr key={col}>
                                        <td className="cell-id">{col}</td>
                                        <td>{desc}</td>
                                        <td><span className="text-xs text-muted">{ttl}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
