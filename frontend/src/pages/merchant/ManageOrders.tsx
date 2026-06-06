import { useState, useCallback } from 'react';
import { storage } from '../../utils/storage';
import { type Order, type OrderStatus } from '../../types/index';

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  out_for_delivery: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: 'Xác nhận',
  confirmed: 'Bắt đầu chuẩn bị',
  preparing: 'Giao hàng',
  out_for_delivery: 'Đã giao',
};

const FILTER_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'preparing', label: 'Đang chuẩn bị' },
  { value: 'out_for_delivery', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã huỷ' },
];

export function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>(() =>
    storage.get<Order[]>('orders', []),
  );
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const persist = useCallback((updated: Order[]) => {
    setOrders(updated);
    storage.set('orders', updated);
  }, []);

  function handleAdvanceStatus(orderId: number, current: OrderStatus) {
    const next = NEXT_STATUS[current];
    if (!next) return;
    persist(
      orders.map((o) => (o.order_id === orderId ? { ...o, status: next } : o)),
    );
  }

  function handleCancel(orderId: number) {
    persist(
      orders.map((o) =>
        o.order_id === orderId ? { ...o, status: 'cancelled' } : o,
      ),
    );
  }

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map((opt) => {
          const count =
            opt.value === 'all'
              ? orders.length
              : orders.filter((o) => o.status === opt.value).length;
          const isActive = filter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5
                ${
                  isActive
                    ? 'bg-[#f57c00] text-white shadow-sm shadow-orange-200'
                    : 'bg-white border border-orange-100 text-[#6b6b6b] hover:border-orange-300 hover:text-[#f57c00]'
                }`}
            >
              {opt.label}
              <span
                className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold
                  ${isActive ? 'bg-white/30 text-white' : 'bg-orange-50 text-[#f57c00]'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-orange-50 flex flex-col items-center justify-center py-20 text-[#c4c4c4]">
            <svg
              className="w-14 h-14 mb-3"
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
            <p className="text-sm font-medium">Không có đơn hàng nào</p>
          </div>
        ) : (
          sorted.map((order) => (
            <OrderCard
              key={order.order_id}
              order={order}
              onAdvance={() =>
                handleAdvanceStatus(order.order_id, order.status)
              }
              onCancel={() => handleCancel(order.order_id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  onAdvance: () => void;
  onCancel: () => void;
}

function OrderCard({ order, onAdvance, onCancel }: OrderCardProps) {
  const nextLabel = NEXT_LABEL[order.status];
  const canCancel = order.status === 'pending' || order.status === 'confirmed';
  const isDone = order.status === 'delivered' || order.status === 'cancelled';

  return (
    <div className="bg-white rounded-2xl border border-orange-50 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <span className="font-mono font-bold text-[#f57c00] text-base">
              Đơn #{order.order_id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[order.status]}`}
            >
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#9b9b9b] flex-wrap">
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(order.created_at).toLocaleString('vi-VN')}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Khách #{order.user_id}
            </span>
            {order.voucher_id && (
              <span className="flex items-center gap-1 text-green-600">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Voucher áp dụng
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="font-display font-bold text-[#252422] text-lg">
            {formatVND(order.total_price)}
          </p>
        </div>

        {!isDone && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {nextLabel && (
              <button
                onClick={onAdvance}
                className="px-4 py-2 bg-[#f57c00] text-white rounded-xl text-xs font-semibold
                  hover:bg-[#e65100] active:scale-95 transition-all shadow-sm"
              >
                {nextLabel}
              </button>
            )}
            {canCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-semibold
                  hover:bg-red-50 active:scale-95 transition-all"
              >
                Huỷ đơn
              </button>
            )}
          </div>
        )}

        {isDone && (
          <div className="flex-shrink-0">
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl
              ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}
            >
              {order.status === 'delivered' ? '✓ Hoàn thành' : '✕ Đã huỷ'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
