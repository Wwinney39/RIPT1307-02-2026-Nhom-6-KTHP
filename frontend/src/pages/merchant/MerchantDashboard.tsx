import { storage } from '../../utils/storage';
import { type Order, type MenuItem } from '../../types/index';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  bg: string;
}

function StatCard({ title, value, subtitle, icon, accent, bg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-orange-50 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}
      >
        <span className={accent}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#9b9b9b] uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className="text-2xl font-display font-bold text-[#252422] leading-tight truncate">
          {value}
        </p>
        <p className="text-xs text-[#9b9b9b] mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function RevenueIcon() {
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
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function OrderWaitIcon() {
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
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function DishIcon() {
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
        d="M3 10h18M3 14h18M10.5 3a7 7 0 010 18M13.5 3a7 7 0 010 18"
      />
    </svg>
  );
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  out_for_delivery: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
};

const RECENT_ORDERS_LIMIT = 5;

export function MerchantDashboard() {
  const orders = storage.get<Order[]>('orders', []);
  const menuItems = storage.get<MenuItem[]>('menuItems', []);

  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const totalRevenue = deliveredOrders.reduce(
    (sum, o) => sum + (o.total_price ?? 0),
    0,
  );

  const pendingCount = orders.filter(
    (o) =>
      o.status === 'pending' ||
      o.status === 'confirmed' ||
      o.status === 'preparing',
  ).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, RECENT_ORDERS_LIMIT);

  const activeMenuCount = menuItems.filter((m) => m.is_available).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Doanh thu"
          value={formatVND(totalRevenue)}
          subtitle="Từ đơn hàng đã giao"
          icon={<RevenueIcon />}
          accent="text-[#f57c00]"
          bg="bg-orange-50"
        />
        <StatCard
          title="Đơn hàng chờ"
          value={pendingCount}
          subtitle="Cần xử lý ngay"
          icon={<OrderWaitIcon />}
          accent="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          title="Món ăn"
          value={`${activeMenuCount} / ${menuItems.length}`}
          subtitle="Đang bán / Tổng món"
          icon={<DishIcon />}
          accent="text-emerald-600"
          bg="bg-emerald-50"
        />
      </div>

      <div className="bg-white rounded-2xl border border-orange-50 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-orange-50 flex items-center justify-between">
          <h2 className="font-display font-bold text-[#252422]">
            Đơn hàng gần đây
          </h2>
          <span className="text-xs text-[#9b9b9b]">
            {orders.length} đơn tổng cộng
          </span>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#c4c4c4]">
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-sm">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-orange-50/60">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide">
                    Mã đơn
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide">
                    Trạng thái
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide">
                    Tổng tiền
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide">
                    Ngày đặt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {recentOrders.map((order) => (
                  <tr
                    key={order.order_id}
                    className="hover:bg-orange-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-[#f57c00]">
                      #{order.order_id}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#252422]">
                      {formatVND(order.total_price)}
                    </td>
                    <td className="px-6 py-4 text-[#9b9b9b]">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-orange-100 text-orange-700',
    out_for_delivery: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  const label = ORDER_STATUS_LABEL[status] ?? status;
  const cls = styles[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
