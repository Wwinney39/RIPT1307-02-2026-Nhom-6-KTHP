import { useState } from 'react';
import type { User, UserRole } from '../../types/index';

const MOCK_USERS: User[] = [
  {
    user_id: 1,
    name: 'Nguyễn Văn An',
    phone: '0901234567',
    email: 'an.nguyen@email.com',
    password_hash: '',
    role: 'customer',
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    user_id: 2,
    name: 'Trần Thị Bích',
    phone: '0912345678',
    email: 'bich.tran@email.com',
    password_hash: '',
    role: 'customer',
    created_at: '2025-02-20T14:30:00Z',
  },
  {
    user_id: 3,
    name: 'Lê Minh Cường',
    phone: '0923456789',
    email: 'cuong.le@restaurant.vn',
    password_hash: '',
    role: 'restaurant_owner',
    created_at: '2025-01-10T09:15:00Z',
  },
  {
    user_id: 4,
    name: 'Phạm Thị Dung',
    phone: '0934567890',
    email: 'dung.pham@email.com',
    password_hash: '',
    role: 'customer',
    created_at: '2025-03-05T11:20:00Z',
  },
  {
    user_id: 5,
    name: 'Hoàng Văn Em',
    phone: '0945678901',
    email: 'em.hoang@restaurant.vn',
    password_hash: '',
    role: 'restaurant_owner',
    created_at: '2025-01-22T16:45:00Z',
  },
  {
    user_id: 6,
    name: 'Vũ Thị Phượng',
    phone: '0956789012',
    email: 'phuong.vu@email.com',
    password_hash: '',
    role: 'customer',
    created_at: '2025-04-01T08:00:00Z',
  },
  {
    user_id: 7,
    name: 'Đặng Minh Quân',
    phone: '0967890123',
    email: 'admin@foodapp.vn',
    password_hash: '',
    role: 'admin',
    created_at: '2024-12-01T00:00:00Z',
  },
];

const ROLE_STYLE: Record<UserRole, string> = {
  customer: 'bg-blue-50 text-blue-700 border-blue-200',
  restaurant_owner: 'bg-green-50 text-green-700 border-green-200',
  admin: 'bg-orange-50 text-orange-700 border-orange-200',
};

const ROLE_LABEL: Record<UserRole, string> = {
  customer: 'Khách hàng',
  restaurant_owner: 'Chủ nhà hàng',
  admin: 'Quản trị viên',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

export function ManageUsers() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  function handleDeleteUser(userId: number) {
    if (
      !confirm(`Xoá người dùng #${userId}? Hành động này không thể hoàn tác.`)
    )
      return;
    setUsers((prev) => prev.filter((u) => u.user_id !== userId));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {users.length} tài khoản đã đăng ký
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="customer">Khách hàng</option>
          <option value="restaurant_owner">Chủ nhà hàng</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Họ tên
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Số điện thoại
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Vai trò
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Ngày tham gia
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr
                  key={user.user_id}
                  className="hover:bg-orange-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5 font-mono text-gray-400 text-xs">
                    #{user.user_id}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold uppercase shrink-0">
                        {user.name[0]}
                      </div>
                      <span className="text-gray-800 font-medium">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">{user.email}</td>
                  <td className="px-6 py-3.5 text-gray-500">{user.phone}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md border text-xs font-medium ${ROLE_STYLE[user.role]}`}
                    >
                      {ROLE_LABEL[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 text-xs">
                    {fmtDate(user.created_at)}
                  </td>
                  <td className="px-6 py-3.5">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.user_id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all font-medium"
                      >
                        Xoá
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-14 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy người dùng phù hợp.
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
