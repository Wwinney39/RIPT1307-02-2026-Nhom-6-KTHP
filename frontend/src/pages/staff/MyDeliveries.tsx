import { useState } from 'react';
import { storage } from '../../utils/storage';
import { type Order, type Restaurant } from '../../types/index';

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

type DeliveryStep = 'out_for_delivery' | 'delivered';

const STEP_CONFIG: Record<
  DeliveryStep,
  { label: string; next: string; nextStatus: 'delivered' | null; color: string }
> = {
  out_for_delivery: {
    label: 'Đang trên đường giao',
    next: 'Đã giao thành công',
    nextStatus: 'delivered',
    color: 'bg-purple-100 text-purple-700',
  },
  delivered: {
    label: 'Đã giao thành công',
    next: '',
    nextStatus: null,
    color: 'bg-green-100 text-green-700',
  },
};

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-orange-50 shadow-sm flex flex-col items-center justify-center py-24 text-[#c4c4c4]">
      <svg
        className="w-16 h-16 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
        />
      </svg>
      <p className="text-sm font-medium">Bạn chưa nhận đơn nào</p>
      <p className="text-xs mt-1">Hãy nhận đơn từ mục "Đơn hàng mới"</p>
    </div>
  );
}

export function MyDeliveries({ staffId }: Props) {
  const [orders, setOrders] = useState<Order[]>(() =>
    storage.get<Order[]>('orders', []),
  );
  const restaurants = storage.get<Restaurant[]>('restaurants', []);

  const myOrders = orders.filter(
    (o) =>
      (o as Order & { staff_id?: number }).staff_id === staffId &&
      (o.status === 'out_for_delivery' || o.status === 'delivered'),
  );

  const active = myOrders.filter((o) => o.status === 'out_for_delivery');
  const recentDone = myOrders
    .filter((o) => o.status === 'delivered')
    .slice(0, 3);

  function handleAdvance(orderId: number) {
    const updated = orders.map((o) => {
      if (o.order_id !== orderId) return o;
      const step = STEP_CONFIG[o.status as DeliveryStep];
      if (!step?.nextStatus) return o;
      return { ...o, status: step.nextStatus };
    });
    setOrders(updated);
    storage.set('orders', updated);
  }

  function getRestaurantAddress(restaurantId: number): string {
    const found = restaurants.find((r) => r.restaurant_id === restaurantId);
    return found?.address ?? `Nhà hàng #${restaurantId}`;
  }

  if (myOrders.length === 0) return <EmptyState />;

  return (
    <div className="space-y-6">
      {active.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display font-bold text-[#252422] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Đang giao hàng
          </h2>

          {active.map((order) => {
            const step = STEP_CONFIG[order.status as DeliveryStep];
            return (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl border border-orange-50 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <span className="font-mono font-bold text-[#f57c00] text-lg">
                        Đơn #{order.order_id}
                      </span>
                      <p className="text-xs text-[#9b9b9b] mt-0.5">
                        {new Date(order.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-[#252422] text-xl">
                        {formatVND(order.total_price)}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${step.color}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  </div>

                  <div className="bg-orange-50/60 rounded-xl p-4 mb-4 space-y-3">
                    <p className="text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide mb-3">
                      Lộ trình giao hàng
                    </p>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#f57c00] flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div className="w-px flex-1 bg-orange-200 my-1" />
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-[10px] font-semibold text-[#9b9b9b] uppercase tracking-wide">
                            Lấy hàng tại
                          </p>
                          <p className="text-sm font-semibold text-[#252422] mt-0.5">
                            {getRestaurantAddress(order.restaurant_id)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-[#9b9b9b] uppercase tracking-wide">
                            Giao đến
                          </p>
                          <p className="text-sm font-semibold text-[#252422] mt-0.5">
                            Địa chỉ khách hàng #{order.address_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {step.nextStatus && (
                    <button
                      onClick={() => handleAdvance(order.order_id)}
                      className="w-full py-2.5 bg-[#f57c00] text-white rounded-xl text-sm font-semibold
                        hover:bg-[#e65100] active:scale-95 transition-all shadow-sm shadow-orange-200"
                    >
                      {step.next}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {recentDone.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display font-bold text-[#252422] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Vừa hoàn thành
          </h2>

          {recentDone.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-2xl border border-orange-50 shadow-sm overflow-hidden"
            >
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono font-semibold text-[#f57c00]">
                    Đơn #{order.order_id}
                  </span>
                  <p className="text-xs text-[#9b9b9b] mt-0.5">
                    {new Date(order.created_at).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#252422]">
                    {formatVND(order.total_price)}
                  </p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Đã giao
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
