import { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '../types';
import { storage } from '../utils/storage';

interface ExtendedOrder extends Order {
  restaurant_name: string;
  restaurant_emoji?: string;
  order_code?: string;
  item_summary?: string;
  items_summary?: string;
  address_text?: string;
}

const STATUS_META: Record<
  OrderStatus,
  { label: string; emoji: string; pill: string }
> = {
  pending: {
    label: 'Chờ xác nhận',
    emoji: '🕐',
    pill: 'bg-yellow-50  text-yellow-700 border-yellow-200',
  },
  confirmed: {
    label: 'Đã xác nhận',
    emoji: '✅',
    pill: 'bg-blue-50    text-blue-700   border-blue-200',
  },
  preparing: {
    label: 'Đang chuẩn bị',
    emoji: '🍳',
    pill: 'bg-orange-50  text-orange-700 border-orange-200',
  },
  out_for_delivery: {
    label: 'Đang giao',
    emoji: '🚴',
    pill: 'bg-indigo-50  text-indigo-700 border-indigo-200',
  },
  delivered: {
    label: 'Đã giao',
    emoji: '🎉',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  cancelled: {
    label: 'Đã huỷ',
    emoji: '✕',
    pill: 'bg-red-50    text-red-600    border-red-200',
  },
};

function StatusPill({ status }: { status: OrderStatus }) {
  const m = STATUS_META[status] || STATUS_META['pending'];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${m.pill}`}
    >
      <span>{m.emoji}</span>
      {m.label}
    </span>
  );
}

export function OrdersListPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token =
          storage.get<string | null>('authToken', null) ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          storage.get<any>('currentUser', null)?.token;
        const API_BASE_URL = 'http://localhost:3000/api';

        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const resBody = await response.json();
          const fetchedOrders = Array.isArray(resBody.data)
            ? resBody.data
            : resBody.orders || resBody.data || [];
          setOrders(fetchedOrders);
        }
      } catch (error) {
        console.error('Lỗi kết nối API lấy danh sách đơn hàng:', error);
      }
    }

    fetchOrders();
  }, []);

  async function executeCancelOrder(orderId: number) {
    try {
      const token = storage.get<string | null>('authToken', null);
      const API_BASE_URL = 'http://localhost:3000/api';

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedOrders = orders.map((order) => {
          if (order.order_id === orderId) {
            return { ...order, status: 'cancelled' as OrderStatus };
          }
          return order;
        });
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API hủy đơn hàng:', error);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] relative">
      {selectedOrderId !== null ? (
        <OrderDetailPage
          orderId={selectedOrderId}
          orders={orders}
          onBack={() => setSelectedOrderId(null)}
          onCancel={(id) => setCancelOrderId(id)}
        />
      ) : (
        <>
          <div className="sticky top-0 z-10 bg-[#FFFBF7]/90 backdrop-blur-md border-b border-black/[0.06] px-4 py-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.history.back()}
                  className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center text-[#252422] hover:bg-[#F5F0EB] transition-colors"
                >
                  ←
                </button>

                <h1 className="font-display font-bold text-xl text-[#252422]">
                  Đơn hàng của tôi
                </h1>
              </div>

              <button
                onClick={() => (window.location.href = '/')}
                className="px-4 py-2 rounded-full bg-[#EB5E28] text-white text-sm font-bold hover:bg-[#d44e1e] transition-all"
              >
                🏠 Trang chủ
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
            {orders.map((order: ExtendedOrder) => {
              const isPreparing = order.status === 'preparing';
              const isDelivering = order.status === 'out_for_delivery';
              const isDelivered = order.status === 'delivered';
              const isCancelled = order.status === 'cancelled';
              const displayId = order.order_code || order.order_id;

              return (
                <div
                  key={order.order_id}
                  className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden shadow-sm"
                >
                  {(isPreparing || isDelivering) && (
                    <div className="h-1 bg-gradient-to-r from-[#EB5E28] to-orange-400" />
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#F5F0EB] flex items-center justify-center text-2xl shrink-0">
                          {order.restaurant_emoji || '🛍️'}
                        </div>
                        <div>
                          <p className="font-display font-bold text-[#252422] text-[15px]">
                            {order.restaurant_name}
                          </p>
                          <p className="text-xs text-[#7A7570] mt-0.5">
                            Đơn #{displayId} &nbsp;·&nbsp; {order.created_at}
                          </p>
                        </div>
                      </div>
                      <StatusPill status={order.status} />
                    </div>

                    <p className="text-sm text-[#7A7570] truncate mb-4 pl-[60px]">
                      {order.item_summary || order.items_summary}
                    </p>

                    <div className="border-t border-black/[0.05] mb-4" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#7A7570]">
                          Tổng thanh toán
                        </p>
                        <p className="font-display font-bold text-[#EB5E28] text-lg">
                          {(
                            order.total_price ||
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (order as any).total ||
                            0
                          ).toLocaleString('vi-VN')}{' '}
                          đ
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {isPreparing && (
                          <button
                            onClick={() => setCancelOrderId(order.order_id)}
                            className="px-4 py-2 rounded-full border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 active:scale-95 transition-all"
                          >
                            ✕ Huỷ đơn
                          </button>
                        )}

                        {isDelivering && (
                          <button
                            onClick={() =>
                              (window.location.href = `/delivery/${order.order_id}`)
                            }
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EB5E28] text-white font-bold text-xs hover:bg-[#d44e1e] active:scale-95 transition-all"
                          >
                            🚴 Theo dõi
                          </button>
                        )}

                        {(isDelivered || isCancelled) && (
                          <button
                            onClick={() =>
                              (window.location.href = `/menu?restaurant=${order.restaurant_id || 1}`)
                            }
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EB5E28] text-[#EB5E28] font-bold text-xs hover:bg-orange-50 active:scale-95 transition-all"
                          >
                            🔁 Đặt lại
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrderId(order.order_id)}
                          className="flex items-center gap-1 px-4 py-2 rounded-full border border-black/10 text-[#252422] font-bold text-xs hover:bg-[#F5F0EB] active:scale-95 transition-all"
                        >
                          Chi tiết →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.04] space-y-3">
                <span className="text-4xl block">📦</span>
                <p className="text-sm font-semibold text-[#252422]">
                  Chưa có đơn hàng nào
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {cancelOrderId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-black/[0.08] shadow-2xl p-6 max-w-sm w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xl mx-auto">
              ⚠️
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#252422]">
                Xác nhận huỷ đơn
              </h3>
              <p className="text-sm text-[#7A7570] mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn huỷ đơn hàng này không? Hành động này
                không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelOrderId(null)}
                className="flex-1 py-3 rounded-full border border-black/10 font-bold text-sm text-[#252422] hover:bg-[#F5F0EB] transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  executeCancelOrder(cancelOrderId);
                  setCancelOrderId(null);
                }}
                className="flex-1 py-3 rounded-full bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface OrderDetailPageProps {
  orderId: number;
  orders: ExtendedOrder[];
  onBack: () => void;
  onCancel: (id: number) => void;
}

function OrderDetailPage({
  orderId,
  orders,
  onBack,
  onCancel,
}: OrderDetailPageProps) {
  const order: ExtendedOrder | undefined = orders.find(
    (o) => o.order_id === orderId,
  );

  if (!order) return null;

  const isPreparing = order.status === 'preparing';
  const isDelivering = order.status === 'out_for_delivery';
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';
  const displaySummary = order.item_summary || order.items_summary;
  const displayId = order.order_code || order.order_id;

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <div className="sticky top-0 z-10 bg-[#FFFBF7]/90 backdrop-blur-md border-b border-black/[0.06] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center text-[#252422] hover:bg-[#F5F0EB]"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-lg text-[#252422] leading-tight">
              Đơn #{displayId}
            </h1>
            <p className="text-xs text-[#7A7570]">{order.created_at}</p>
          </div>
          <StatusPill status={order.status} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-black/[0.07] p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F0EB] flex items-center justify-center text-3xl shrink-0">
            {order.restaurant_emoji || '🛍️'}
          </div>
          <div>
            <p className="font-display font-bold text-[#252422]">
              {order.restaurant_name}
            </p>
            <p className="text-xs text-[#7A7570] mt-0.5">{displaySummary}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-black/[0.05]">
            <p className="font-display font-bold text-[#252422]">
              🧾 Các món đã đặt
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm font-medium text-[#252422] leading-relaxed">
              {displaySummary}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
          <p className="font-display font-bold text-[#252422] mb-3">
            📍 Địa chỉ giao hàng
          </p>
          <p className="text-sm text-[#7A7570]">
            {order.address_text || 'Chưa xác định địa chỉ'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-5 space-y-3">
          <p className="font-display font-bold text-[#252422] border-b border-black/[0.05] pb-2">
            💳 Chi tiết thanh toán
          </p>
          <div className="flex justify-between text-sm text-[#7A7570]">
            <span>Tổng cộng</span>
            <span className="font-bold text-[#EB5E28]">
              {order.total_price.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        {isPreparing && (
          <button
            onClick={() => onCancel(order.order_id)}
            className="w-full py-4 rounded-2xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 active:scale-[0.99] transition-all"
          >
            ✕ Huỷ đơn hàng ngay lúc này
          </button>
        )}

        {isDelivering && (
          <button
            onClick={() =>
              (window.location.href = `/delivery/${order.order_id}`)
            }
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#252422] text-white font-bold hover:bg-[#3d3a37] active:scale-[0.99] transition-all shadow-lg"
          >
            🚴 Theo dõi tài xế trực tiếp
          </button>
        )}

        {isCancelled && (
          <button
            onClick={() =>
              (window.location.href = `/menu?restaurant=${order.restaurant_id || 1}`)
            }
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-[#EB5E28] text-[#EB5E28] font-bold hover:bg-orange-50 active:scale-[0.99] transition-all"
          >
            🔁 Đơn đã huỷ · Đặt lại món ngay
          </button>
        )}

        {isDelivered && (
          <button
            onClick={() => {
              const name = encodeURIComponent(order.restaurant_name);
              const emoji = encodeURIComponent(order.restaurant_emoji || '🛍️');
              window.location.href = `/reviews?restaurant_name=${name}&restaurant_emoji=${emoji}`;
            }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-lg"
          >
            ⭐ Đơn hàng đã giao thành công · Viết đánh giá ngay
          </button>
        )}
      </div>
    </div>
  );
}
