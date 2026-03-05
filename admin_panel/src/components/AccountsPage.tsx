// ============================================
// Accounts Page — Quản lý Tài khoản
// ============================================

import { useState } from 'react';
import type { Account } from '../types';

interface Props {
    accounts: Account[];
    onUpdate: (accounts: Account[]) => void;
    onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function AccountsPage({ accounts, onUpdate, onToast }: Props) {
    const [search, setSearch] = useState('');
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);

    const filtered = accounts.filter(
        (a) =>
            a.username.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleStatusChange = (id: number, status: Account['status']) => {
        const updated = accounts.map((a) => (a.id === id ? { ...a, status } : a));
        onUpdate(updated);
        onToast('success', `Đã cập nhật trạng thái tài khoản #${id} → ${status}`);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('vi-VN');
    };

    const statusBadge = (status: Account['status']) => {
        const map = {
            active: { cls: 'badge-active', label: 'Active' },
            banned: { cls: 'badge-banned', label: 'Banned' },
            suspended: { cls: 'badge-suspended', label: 'Suspended' },
        };
        const s = map[status];
        return <span className={`badge ${s.cls}`}>{s.label}</span>;
    };

    return (
        <>
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">👥</span>
                    Quản lý Tài khoản
                </h2>
                <div className="flex gap-8">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm username hoặc email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">
                        📋 Danh sách Tài khoản ({filtered.length})
                    </span>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Trạng thái</th>
                            <th>Đăng nhập cuối</th>
                            <th>IP cuối</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((acc) => (
                            <tr key={acc.id}>
                                <td className="cell-id">#{acc.id}</td>
                                <td className="cell-name">{acc.username}</td>
                                <td>{acc.email}</td>
                                <td>{statusBadge(acc.status)}</td>
                                <td className="text-sm text-muted">{formatDate(acc.last_login_at)}</td>
                                <td className="cell-id">{acc.last_login_ip || '—'}</td>
                                <td className="text-sm text-muted">{formatDate(acc.created_at)}</td>
                                <td className="cell-actions">
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => setEditingAccount(acc)}
                                    >
                                        👁️ Xem
                                    </button>
                                    {acc.status !== 'banned' ? (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleStatusChange(acc.id, 'banned')}
                                        >
                                            🚫 Ban
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleStatusChange(acc.id, 'active')}
                                        >
                                            ✅ Unban
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={8}>
                                    <div className="empty-state">
                                        <div className="empty-icon">🔍</div>
                                        <div className="empty-text">Không tìm thấy tài khoản</div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {editingAccount && (
                <div className="modal-overlay" onClick={() => setEditingAccount(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📄 Chi tiết Tài khoản #{editingAccount.id}</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setEditingAccount(null)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-label">ID</div>
                                <div className="detail-value mono">#{editingAccount.id}</div>

                                <div className="detail-label">Username</div>
                                <div className="detail-value">{editingAccount.username}</div>

                                <div className="detail-label">Email</div>
                                <div className="detail-value">{editingAccount.email}</div>

                                <div className="detail-label">Trạng thái</div>
                                <div className="detail-value">{statusBadge(editingAccount.status)}</div>

                                <div className="detail-label">Đăng nhập cuối</div>
                                <div className="detail-value mono">{formatDate(editingAccount.last_login_at)}</div>

                                <div className="detail-label">IP cuối</div>
                                <div className="detail-value mono">{editingAccount.last_login_ip || '—'}</div>

                                <div className="detail-label">Ngày tạo</div>
                                <div className="detail-value mono">{formatDate(editingAccount.created_at)}</div>
                            </div>

                            <div className="mt-16">
                                <div className="form-label" style={{ marginBottom: '8px' }}>Đổi trạng thái</div>
                                <div className="flex gap-8">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => { handleStatusChange(editingAccount.id, 'active'); setEditingAccount({ ...editingAccount, status: 'active' }); }}
                                    >
                                        ✅ Active
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => { handleStatusChange(editingAccount.id, 'suspended'); setEditingAccount({ ...editingAccount, status: 'suspended' }); }}
                                    >
                                        ⏸️ Suspend
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => { handleStatusChange(editingAccount.id, 'banned'); setEditingAccount({ ...editingAccount, status: 'banned' }); }}
                                    >
                                        🚫 Ban
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setEditingAccount(null)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
