import { useState } from 'react';
import { storage } from '../../utils/storage';
import { type User } from '../../types/index';
import { MerchantDashboard } from './MerchantDashboard';
import { ManageMenu } from './ManageMenu';
import { ManageOrders } from './ManageOrders';

type MerchantView = 'dashboard' | 'menu' | 'orders';

interface NavItem {
  id: MerchantView;
  label: string;
  icon: React.ReactNode;
}

function LayoutIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: <LayoutIcon /> },
  { id: 'menu', label: 'Quản lý Menu', icon: <MenuIcon /> },
  { id: 'orders', label: 'Đơn hàng', icon: <OrderIcon /> },
];

export function MerchantLayout() {
  const [activeView, setActiveView] = useState<MerchantView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = storage.get<User | null>('currentUser', null);

  function handleLogout() {
    storage.remove('currentUser');
    window.location.replace('/login');
  }

  function renderView() {
    switch (activeView) {
      case 'dashboard':
        return <MerchantDashboard />;
      case 'menu':
        return <ManageMenu />;
      case 'orders':
        return <ManageOrders />;
      default:
        return <MerchantDashboard />;
    }
  }

  const viewLabels: Record<MerchantView, string> = {
    dashboard: 'Tổng quan',
    menu: 'Quản lý Menu',
    orders: 'Đơn hàng',
  };

  return (
    <div className="min-h-screen bg-[#fffbf7] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-orange-100
          flex flex-col z-30 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-orange-100">
          <div className="w-9 h-9 rounded-xl bg-[#f57c00] flex items-center justify-center text-white shadow-sm">
            <StoreIcon />
          </div>
          <div>
            <p className="font-display font-700 text-[#252422] text-sm leading-tight">
              Quản lý nhà hàng
            </p>
            <p className="text-[10px] text-[#f57c00] font-medium uppercase tracking-wide">
              Merchant Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? 'bg-[#f57c00] text-white shadow-sm shadow-orange-200'
                      : 'text-[#6b6b6b] hover:bg-orange-50 hover:text-[#f57c00]'
                  }
                `}
              >
                <span className={isActive ? 'text-white' : 'text-[#f57c00]'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-orange-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-[#f57c00] font-bold text-sm">
                {currentUser?.name?.charAt(0).toUpperCase() ?? 'M'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[#252422] text-sm font-semibold truncate">
                {currentUser?.name ?? 'Merchant'}
              </p>
              <p className="text-[#9b9b9b] text-xs truncate">
                {currentUser?.email ?? ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-500
              hover:bg-red-50 transition-colors duration-150 font-medium"
          >
            <LogoutIcon />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-orange-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-orange-50 text-[#6b6b6b]"
              onClick={() => setSidebarOpen(true)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="font-display font-bold text-[#252422] text-lg leading-tight">
                {viewLabels[activeView]}
              </h1>
              <p className="text-xs text-[#9b9b9b] hidden sm:block">
                Chào mừng trở lại, {currentUser?.name ?? 'Merchant'} 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-orange-50 text-[#f57c00] px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Đang mở cửa
            </div>
            <a
              href="/"
              className="text-xs text-[#9b9b9b] hover:text-[#f57c00] transition-colors px-3 py-1.5
                border border-orange-100 rounded-full hover:border-orange-300"
            >
              Trang chủ
            </a>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{renderView()}</main>
      </div>
    </div>
  );
}
