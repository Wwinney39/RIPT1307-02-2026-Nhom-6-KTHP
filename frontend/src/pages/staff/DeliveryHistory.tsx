import { useState } from 'react';
import { storage } from '../../utils/storage';
import { type Order } from '../../types/index';

interface Props {
  staffId: number;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_STYLE: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  out_for_delivery: 'bg-purple-100 text-purple-700',
};

const STATUS_LABEL: Record<string, string> = {
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
  out_for_delivery: 'Đang giao',
};

export function DeliveryHistory({ staffId }: Props) {
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'delivered' | 'cancelled'
  >('all');

  const allOrders = storage.get<Order[]>('orders', []);

  const myHistory = allOrders
    .filter((o) => {
      const typed = o as Order & { staff_id?: number };
      return (
        typed.staff_id === staffId &&
        (o.status === 'delivered' ||
          o.status === 'cancelled' ||
          o.status === 'out_for_delivery')
      );
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const filtered =
    filterStatus === 'all'
      ? myHistory
      : myHistory.filter((o) => o.status === filterStatus);

  const totalDelivered = myHistory.filter(
    (o) => o.status === 'delivered',
  ).length;
  const totalRevenue = myHistory
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.total_price ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-orange-50 shadow-sm p-4">
          <p className="text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide mb-1">
            Tổng đơn đã giao
          </p>
          <p className="font-display font-bold text-2xl text-[#252422]">
            {totalDelivered}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-orange-50 shadow-sm p-4">
          <p className="text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide mb-1">
            Tổng thu nhập
          </p>
          <p className="font-display font-bold text-xl text-[#f57c00] truncate">
            {formatVND(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'delivered', 'cancelled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
              ${
                filterStatus === s
                  ? 'bg-[#f57c00] text-white shadow-sm shadow-orange-200'
                  : 'bg-white border border-orange-100 text-[#6b6b6b] hover:border-orange-300 hover:text-[#f57c00]'
              }`}
          >
            {s === 'all' ? 'Tất cả' : s === 'delivered' ? 'Đã giao' : 'Đã huỷ'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-orange-50 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#c4c4c4]">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">Chưa có lịch sử giao hàng</p>
          </div>
        ) : (
          <div className="divide-y divide-orange-50">
            {filtered.map((order) => (
              <div
                key={order.order_id}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-orange-50/20 transition-colors"
              >
                <div>
                  <span className="font-mono font-semibold text-[#f57c00]">
                    Đơn #{order.order_id}
                  </span>
                  <p className="text-xs text-[#9b9b9b] mt-0.5">
                    {new Date(order.created_at).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-[#252422] text-sm">
                    {formatVND(order.total_price)}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
