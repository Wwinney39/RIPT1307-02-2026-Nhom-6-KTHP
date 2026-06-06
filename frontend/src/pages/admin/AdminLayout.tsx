import { useState } from 'react';
import { storage } from '../../utils/storage';
import type { User } from '../../types/index';
import { AdminDashboard } from './AdminDashboard';
import { ManageUsers } from './ManageUsers';
import { ManageRestaurants } from './ManageRestaurants';
import { ManageVouchers } from './ManageVouchers';

export type AdminView = 'dashboard' | 'users' | 'restaurants' | 'vouchers';

const NAV_ITEMS: { view: AdminView; label: string; icon: string }[] = [
  { view: 'dashboard', label: 'Tổng quan', icon: '▦' },
  { view: 'users', label: 'Người dùng', icon: '👤' },
  { view: 'restaurants', label: 'Nhà hàng', icon: '🍽️' },
  { view: 'vouchers', label: 'Mã giảm giá', icon: '🏷️' },
];

function renderView(view: AdminView) {
  switch (view) {
    case 'dashboard':
      return <AdminDashboard />;
    case 'users':
      return <ManageUsers />;
    case 'restaurants':
      return <ManageRestaurants />;
    case 'vouchers':
      return <ManageVouchers />;
    default:
      return <AdminDashboard />;
  }
}

export function AdminLayout() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const admin = storage.get<User | null>('currentUser', null);

  function handleLogout() {
    storage.remove('currentUser');
    window.location.pathname = '/login';
  }

  const viewLabel =
    NAV_ITEMS.find((n) => n.view === activeView)?.label ?? 'Admin';

  return (
    <div
      className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      <aside
        className={`flex flex-col shrink-0 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-sm font-bold leading-none">F</span>
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-tight tracking-tight truncate">
                ZestyDash
              </p>
              <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-widest">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-hidden">
          {NAV_ITEMS.map(({ view, label, icon }) => {
            const active = activeView === view;
            return (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                title={!sidebarOpen ? label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span
                  className={`text-base shrink-0 ${active ? '' : 'grayscale opacity-60'}`}
                >
                  {icon}
                </span>
                {sidebarOpen && (
                  <span className="whitespace-nowrap">{label}</span>
                )}
                {active && sidebarOpen && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-2 pb-4 border-t border-gray-100 pt-3 shrink-0">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <span className="shrink-0 text-base">←</span>
            {sidebarOpen && <span>Về trang chủ</span>}
          </a>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-200 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-lg"
              title="Ẩn/hiện thanh bên"
            >
              ☰
            </button>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-gray-400">Quản trị</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-700 font-semibold">{viewLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {admin?.name ?? 'Quản trị viên'}
              </p>
              <p className="text-xs text-gray-400">
                {admin?.email ?? 'admin@foodapp.vn'}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-orange-600 text-sm font-bold uppercase select-none">
              {admin?.name?.[0] ?? 'A'}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all font-medium"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderView(activeView)}
        </main>
      </div>
    </div>
  );
}
