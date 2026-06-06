import { useState } from 'react';
import type { RestaurantStatus } from '../../types/index';

type AdminRestaurantStatus = RestaurantStatus | 'pending';

interface AdminRestaurant {
  restaurant_id: number;
  name: string;
  address: string;
  cuisine: string[];
  rating: number;
  status: AdminRestaurantStatus;
  owner_email: string;
  registered_at: string;
}

const MOCK_RESTAURANTS: AdminRestaurant[] = [
  {
    restaurant_id: 1,
    name: 'Phở Thìn Lò Đúc',
    address: '13 Lò Đúc, Hai Bà Trưng, Hà Nội',
    cuisine: ['Việt Nam', 'Mì, phở'],
    rating: 4.8,
    status: 'open',
    owner_email: 'thin.pho@gmail.com',
    registered_at: '2024-11-01T10:00:00Z',
  },
  {
    restaurant_id: 2,
    name: 'Lẩu Thái Suki Garden',
    address: '45 Nguyễn Chí Thanh, Đống Đa, Hà Nội',
    cuisine: ['Thái Lan', 'Lẩu'],
    rating: 4.5,
    status: 'open',
    owner_email: 'suki.garden@email.vn',
    registered_at: '2024-12-15T14:30:00Z',
  },
  {
    restaurant_id: 3,
    name: 'BBQ House Hà Nội',
    address: '78 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    cuisine: ['Hàn Quốc', 'BBQ'],
    rating: 4.2,
    status: 'closed',
    owner_email: 'bbqhouse.hn@gmail.com',
    registered_at: '2025-01-08T09:00:00Z',
  },
  {
    restaurant_id: 4,
    name: 'Pizza Corner Station',
    address: '102 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội',
    cuisine: ['Ý', 'Đồ ăn nhanh'],
    rating: 3.9,
    status: 'suspended',
    owner_email: 'pizzacorner@email.vn',
    registered_at: '2025-02-20T11:15:00Z',
  },
  {
    restaurant_id: 5,
    name: 'Cơm Niêu Sài Gòn',
    address: '55 Kim Mã, Ba Đình, Hà Nội',
    cuisine: ['Việt Nam'],
    rating: 0,
    status: 'pending',
    owner_email: 'comnieu.sg@gmail.com',
    registered_at: '2025-06-03T08:45:00Z',
  },
  {
    restaurant_id: 6,
    name: 'Bánh Mì Phượng',
    address: '2B Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
    cuisine: ['Việt Nam', 'Bánh mì'],
    rating: 0,
    status: 'pending',
    owner_email: 'banhmiphuong.hn@gmail.com',
    registered_at: '2025-06-04T10:00:00Z',
  },
];

const STATUS_CONFIG: Record<
  AdminRestaurantStatus,
  { label: string; style: string; dot: string }
> = {
  pending: {
    label: 'Chờ duyệt',
    style: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-500',
  },
  open: {
    label: 'Đang mở',
    style: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  closed: {
    label: 'Đã đóng',
    style: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
  },
  suspended: {
    label: 'Đã khoá',
    style: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
};

const STATUS_FILTER_LABELS: Record<AdminRestaurantStatus | 'all', string> = {
  all: 'Tất cả',
  pending: 'Chờ duyệt',
  open: 'Đang mở',
  closed: 'Đã đóng',
  suspended: 'Đã khoá',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

export function ManageRestaurants() {
  const [restaurants, setRestaurants] =
    useState<AdminRestaurant[]>(MOCK_RESTAURANTS);
  const [statusFilter, setStatusFilter] = useState<
    AdminRestaurantStatus | 'all'
  >('all');
  const [search, setSearch] = useState('');

  const filtered = restaurants.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  function updateStatus(id: number, newStatus: AdminRestaurantStatus) {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.restaurant_id === id ? { ...r, status: newStatus } : r,
      ),
    );
  }

  function handleApprove(id: number) {
    updateStatus(id, 'open');
  }

  function handleReject(id: number) {
    if (!confirm(`Từ chối nhà hàng #${id}? Nhà hàng sẽ bị khoá.`)) return;
    updateStatus(id, 'suspended');
  }

  function handleSuspend(id: number) {
    if (!confirm(`Khoá nhà hàng #${id}?`)) return;
    updateStatus(id, 'suspended');
  }

  function handleRestore(id: number) {
    updateStatus(id, 'open');
  }

  const counts = {
    all: restaurants.length,
    pending: restaurants.filter((r) => r.status === 'pending').length,
    open: restaurants.filter((r) => r.status === 'open').length,
    closed: restaurants.filter((r) => r.status === 'closed').length,
    suspended: restaurants.filter((r) => r.status === 'suspended').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Quản lý nhà hàng</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {counts.pending > 0 && (
            <span className="text-orange-600 font-semibold">
              {counts.pending} nhà hàng chờ duyệt ·{' '}
            </span>
          )}
          {restaurants.length} nhà hàng trong hệ thống
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc địa chỉ…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition"
          />
        </div>

        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {(['all', 'pending', 'open', 'closed', 'suspended'] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  statusFilter === s
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {STATUS_FILTER_LABELS[s]}
                <span className="ml-1 opacity-70">({counts[s]})</span>
              </button>
            ),
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Nhà hàng
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Ẩm thực
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Chủ sở hữu
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Đánh giá
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Trạng thái
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Ngày đăng ký
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((restaurant) => {
                const cfg = STATUS_CONFIG[restaurant.status];
                return (
                  <tr
                    key={restaurant.restaurant_id}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-gray-800 font-semibold">
                        {restaurant.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {restaurant.address}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {restaurant.cuisine.map((c) => (
                          <span
                            key={c}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {restaurant.owner_email}
                    </td>
                    <td className="px-6 py-4">
                      {restaurant.rating > 0 ? (
                        <span className="text-yellow-500 font-bold">
                          ★ {restaurant.rating}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">Chưa có</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium ${cfg.style}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                        />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {fmtDate(restaurant.registered_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {restaurant.status === 'pending' && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(restaurant.restaurant_id)
                              }
                              className="text-xs px-3 py-1.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-all font-medium"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() =>
                                handleReject(restaurant.restaurant_id)
                              }
                              className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all font-medium"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        {(restaurant.status === 'open' ||
                          restaurant.status === 'closed') && (
                          <button
                            onClick={() =>
                              handleSuspend(restaurant.restaurant_id)
                            }
                            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all font-medium"
                          >
                            Khoá
                          </button>
                        )}
                        {restaurant.status === 'suspended' && (
                          <button
                            onClick={() =>
                              handleRestore(restaurant.restaurant_id)
                            }
                            className="text-xs px-3 py-1.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-all font-medium"
                          >
                            Khôi phục
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-14 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy nhà hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
