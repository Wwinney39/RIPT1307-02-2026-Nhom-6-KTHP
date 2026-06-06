import { useState } from 'react';
import { storage } from '../../utils/storage';
import { type User } from '../../types/index';
import { AvailableOrders } from './AvailableOrders';
import { MyDeliveries } from './MyDeliveries';
import { DeliveryHistory } from './DeliveryHistory';

type StaffView = 'available' | 'mine' | 'history';

interface NavItem {
  id: StaffView;
  label: string;
  icon: React.ReactNode;
}

function InboxIcon() {
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
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );
}

function TruckIcon() {
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
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      />
    </svg>
  );
}

function HistoryIcon() {
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
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function BikeIcon() {
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
        d="M12 6v6m0 0l-3-3m3 3l3-3M5.5 17a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm13 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 12H8.5"
      />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { id: 'available', label: 'Đơn hàng mới', icon: <InboxIcon /> },
  { id: 'mine', label: 'Đơn của tôi', icon: <TruckIcon /> },
  { id: 'history', label: 'Lịch sử giao', icon: <HistoryIcon /> },
];

const VIEW_LABELS: Record<StaffView, string> = {
  available: 'Đơn hàng mới',
  mine: 'Đơn của tôi',
  history: 'Lịch sử giao',
};

export function StaffLayout() {
  const [activeView, setActiveView] = useState<StaffView>('available');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = storage.get<User | null>('currentUser', null);

  function handleLogout() {
    storage.remove('currentUser');
    window.location.replace('/login');
  }

  function renderView() {
    const staffId = currentUser?.user_id ?? 0;
    switch (activeView) {
      case 'available':
        return <AvailableOrders staffId={staffId} />;
      case 'mine':
        return <MyDeliveries staffId={staffId} />;
      case 'history':
        return <DeliveryHistory staffId={staffId} />;
      default:
        return <AvailableOrders staffId={staffId} />;
    }
  }

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
            <BikeIcon />
          </div>
          <div>
            <p className="font-display font-bold text-[#252422] text-sm leading-tight">
              Nhân viên giao hàng
            </p>
            <p className="text-[10px] text-[#f57c00] font-medium uppercase tracking-wide">
              Staff Panel
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
                {currentUser?.name?.charAt(0).toUpperCase() ?? 'S'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[#252422] text-sm font-semibold truncate">
                {currentUser?.name ?? 'Staff'}
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
                {VIEW_LABELS[activeView]}
              </h1>
              <p className="text-xs text-[#9b9b9b] hidden sm:block">
                Xin chào, {currentUser?.name ?? 'Staff'} 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Đang trực
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
