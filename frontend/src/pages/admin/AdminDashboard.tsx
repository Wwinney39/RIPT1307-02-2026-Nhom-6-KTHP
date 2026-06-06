import { useState } from 'react';
import type {
  Order,
  Payment,
  PaymentMethod,
  OrderStatus,
} from '../../types/index';

interface DashboardOrder extends Order {
  payment: Payment;
  restaurantName: string;
}

const MOCK_DATA: DashboardOrder[] = [
  {
    order_id: 1001,
    user_id: 3,
    restaurant_id: 5,
    address_id: 2,
    voucher_id: null,
    total_price: 185000,
    status: 'delivered',
    created_at: '2025-06-04T08:12:00Z',
    restaurantName: 'Phở Thìn Lò Đúc',
    payment: {
      payment_id: 201,
      order_id: 1001,
      amount: 185000,
      method: 'momo',
      status: 'paid',
    },
  },
  {
    order_id: 1002,
    user_id: 7,
    restaurant_id: 2,
    address_id: 4,
    voucher_id: 1,
    total_price: 95000,
    status: 'out_for_delivery',
    created_at: '2025-06-04T09:45:00Z',
    restaurantName: 'Bún Bò Huế Ngon',
    payment: {
      payment_id: 202,
      order_id: 1002,
      amount: 95000,
      method: 'cash',
      status: 'pending',
    },
  },
  {
    order_id: 1003,
    user_id: 12,
    restaurant_id: 8,
    address_id: 7,
    voucher_id: null,
    total_price: 340000,
    status: 'preparing',
    created_at: '2025-06-04T10:01:00Z',
    restaurantName: 'Lẩu Thái Suki',
    payment: {
      payment_id: 203,
      order_id: 1003,
      amount: 340000,
      method: 'vnpay',
      status: 'paid',
    },
  },
  {
    order_id: 1004,
    user_id: 2,
    restaurant_id: 1,
    address_id: 1,
    voucher_id: null,
    total_price: 210000,
    status: 'confirmed',
    created_at: '2025-06-04T10:30:00Z',
    restaurantName: 'Cơm Tấm Sài Gòn',
    payment: {
      payment_id: 204,
      order_id: 1004,
      amount: 210000,
      method: 'zalopay',
      status: 'paid',
    },
  },
  {
    order_id: 1005,
    user_id: 9,
    restaurant_id: 3,
    address_id: 5,
    voucher_id: 2,
    total_price: 75000,
    status: 'cancelled',
    created_at: '2025-06-04T11:00:00Z',
    restaurantName: 'Bánh Mì Hội An',
    payment: {
      payment_id: 205,
      order_id: 1005,
      amount: 75000,
      method: 'card',
      status: 'refunded',
    },
  },
  {
    order_id: 1006,
    user_id: 4,
    restaurant_id: 6,
    address_id: 3,
    voucher_id: null,
    total_price: 450000,
    status: 'delivered',
    created_at: '2025-06-04T12:15:00Z',
    restaurantName: 'Nhà Hàng BBQ Garden',
    payment: {
      payment_id: 206,
      order_id: 1006,
      amount: 450000,
      method: 'momo',
      status: 'paid',
    },
  },
  {
    order_id: 1007,
    user_id: 15,
    restaurant_id: 4,
    address_id: 9,
    voucher_id: null,
    total_price: 128000,
    status: 'pending',
    created_at: '2025-06-04T12:50:00Z',
    restaurantName: 'Pizza & Pasta Corner',
    payment: {
      payment_id: 207,
      order_id: 1007,
      amount: 128000,
      method: 'cash',
      status: 'pending',
    },
  },
];

const TOTAL_USERS = 1_482;
const ACTIVE_RESTAURANTS = 37;

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  preparing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  out_for_delivery: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  out_for_delivery: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
};

const METHOD_ICON: Record<PaymentMethod, string> = {
  cash: '💵',
  card: '💳',
  momo: '📱',
  vnpay: '🏦',
  zalopay: '⚡',
};

const METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: 'Tiền mặt',
  card: 'Thẻ',
  momo: 'MoMo',
  vnpay: 'VNPay',
  zalopay: 'ZaloPay',
};

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + '₫';
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: string;
  sub?: string;
  iconBg: string;
}

function MetricCard({ label, value, icon, sub, iconBg }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
            {value}
          </p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [orders] = useState<DashboardOrder[]>(MOCK_DATA);

  const totalRevenue = orders
    .filter((o) => o.payment.status === 'paid')
    .reduce((s, o) => s + o.payment.amount, 0);

  function handleAction(orderId: number) {
    alert(`Xem chi tiết đơn hàng #${orderId}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Chào mừng trở lại! Đây là tình hình hôm nay.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Tổng doanh thu"
          value={fmt(totalRevenue)}
          icon="💰"
          sub="Từ đơn đã thanh toán"
          iconBg="bg-orange-50"
        />
        <MetricCard
          label="Tổng đơn hàng"
          value={orders.length.toString()}
          icon="📦"
          sub="Tất cả thời gian"
          iconBg="bg-blue-50"
        />
        <MetricCard
          label="Nhà hàng hoạt động"
          value={ACTIVE_RESTAURANTS.toString()}
          icon="🍽️"
          sub="Đang mở cửa"
          iconBg="bg-green-50"
        />
        <MetricCard
          label="Người dùng đã đăng ký"
          value={TOTAL_USERS.toLocaleString()}
          icon="👥"
          sub="Tổng tài khoản"
          iconBg="bg-purple-50"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            Đơn hàng &amp; Thanh toán gần đây
          </h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {orders.length} bản ghi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Mã đơn
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Nhà hàng
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Tổng tiền
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Thanh toán
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Trạng thái
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="hover:bg-orange-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5 font-mono text-gray-400 text-xs font-medium">
                    #{order.order_id}
                  </td>
                  <td className="px-6 py-3.5 text-gray-700 font-medium">
                    {order.restaurantName}
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-gray-900">
                    {fmt(order.total_price)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-gray-600 text-xs">
                      {METHOD_ICON[order.payment.method]}
                      {METHOD_LABEL[order.payment.method]}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md border text-xs font-medium ${STATUS_STYLE[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => handleAction(order.order_id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all font-medium"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
