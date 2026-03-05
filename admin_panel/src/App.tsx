// ============================================
// Crystallized Iron — Admin Panel
// Bảng điều khiển quản trị (CHỈ localhost)
// ============================================

import { useState, useCallback, useEffect } from 'react';
import type { PageId, Toast, Account, Character, ItemTemplate, MobConfig, GameMap } from './types';
import {
  mockStats,
  mockAccounts,
  mockCharacters,
  mockItemTemplates,
  mockMobs,
  mockMaps,
} from './mockData';

import DashboardPage from './components/DashboardPage';
import AccountsPage from './components/AccountsPage';
import CharactersPage from './components/CharactersPage';
import ItemsPage from './components/ItemsPage';
import MapsPage from './components/MapsPage';
import MobsPage from './components/MobsPage';

const NAV_ITEMS: { section: string; items: { id: PageId; icon: string; label: string }[] }[] = [
  {
    section: 'TỔNG QUAN',
    items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    ],
  },
  {
    section: 'MYSQL — DỮ LIỆU CỐT LÕI',
    items: [
      { id: 'accounts', icon: '👥', label: 'Tài khoản' },
      { id: 'characters', icon: '⚔️', label: 'Nhân vật' },
    ],
  },
  {
    section: 'MONGODB — GAME DATA',
    items: [
      { id: 'items', icon: '🎴', label: 'Item Templates' },
      { id: 'mobs', icon: '👾', label: 'Quái vật' },
      { id: 'maps', icon: '🗺️', label: 'Bản đồ' },
    ],
  },
];

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Tổng quan hệ thống' },
  accounts: { title: 'Tài khoản', subtitle: 'MySQL → accounts' },
  characters: { title: 'Nhân vật', subtitle: 'MySQL → characters' },
  items: { title: 'Item Templates', subtitle: 'MongoDB → item_templates' },
  maps: { title: 'Bản đồ', subtitle: 'MongoDB → maps (Node Graph)' },
  mobs: { title: 'Quái vật', subtitle: 'MongoDB → mob_configs' },
  logs: { title: 'Logs', subtitle: 'MongoDB → battle_logs / chat_logs' },
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Data states (mock — sẽ thay bằng API)
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [characters, setCharacters] = useState<Character[]>(mockCharacters);
  const [itemTemplates, setItemTemplates] = useState<ItemTemplate[]>(mockItemTemplates);
  const [mobs, setMobConfigs] = useState<MobConfig[]>(mockMobs);
  const [maps, setMaps] = useState<GameMap[]>(mockMaps);

  // Toast system
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  // Auto-dismiss toasts
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const pageInfo = PAGE_TITLES[currentPage];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage stats={mockStats} />;
      case 'accounts':
        return <AccountsPage accounts={accounts} onUpdate={setAccounts} onToast={addToast} />;
      case 'characters':
        return <CharactersPage characters={characters} onUpdate={setCharacters} onToast={addToast} />;
      case 'items':
        return <ItemsPage items={itemTemplates} onUpdate={setItemTemplates} onToast={addToast} />;
      case 'maps':
        return <MapsPage maps={maps} onUpdate={setMaps} onToast={addToast} />;
      case 'mobs':
        return <MobsPage mobs={mobs} onUpdate={setMobConfigs} onToast={addToast} />;
      default:
        return (
          <div className="empty-state">
            <div className="empty-icon">🚧</div>
            <div className="empty-text">Trang này đang phát triển</div>
          </div>
        );
    }
  };

  return (
    <div className="admin-layout">
      {/* ============================================ */}
      {/* Sidebar */}
      {/* ============================================ */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">CI</div>
            <div>
              <div className="logo-text">Crystallized Iron</div>
              <div className="logo-sub">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((section) => (
            <div key={section.section}>
              <div className="nav-section-label">{section.section}</div>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="localhost-badge">
            <span className="localhost-dot"></span>
            <span>localhost:5174</span>
          </div>
        </div>
      </aside>

      {/* ============================================ */}
      {/* Main Content */}
      {/* ============================================ */}
      <main className="main-content">
        {/* Localhost security banner */}
        <div className="localhost-banner">
          🔒 Admin Panel — Chỉ truy cập được từ localhost (127.0.0.1)
          <span style={{ marginLeft: 'auto', opacity: 0.6 }}>
            {new Date().toLocaleDateString('vi-VN')}
          </span>
        </div>

        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div>
              <div className="topbar-title">{pageInfo.title}</div>
              <div className="topbar-subtitle">{pageInfo.subtitle}</div>
            </div>
          </div>
          <div className="topbar-right">
            <span className="text-xs text-muted text-mono">v1.0.0</span>
          </div>
        </div>

        {/* Content */}
        <div className="content-body">
          {renderPage()}
        </div>
      </main>

      {/* ============================================ */}
      {/* Toast Notifications */}
      {/* ============================================ */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <span>
                {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
