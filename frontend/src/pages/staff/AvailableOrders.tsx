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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-[#c4c4c4]">
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
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p className="text-sm font-medium">Không có đơn hàng nào đang chờ giao</p>
      <p className="text-xs mt-1">
        Các đơn ở trạng thái "Đang chuẩn bị" sẽ hiển thị tại đây
      </p>
    </div>
  );
}

export function AvailableOrders({ staffId }: Props) {
  const [orders, setOrders] = useState<Order[]>(() =>
    storage.get<Order[]>('orders', []),
  );
  const restaurants = storage.get<Restaurant[]>('restaurants', []);

  const available = orders.filter((o) => o.status === 'preparing');

  function handleAccept(orderId: number) {
    const updated = orders.map((o) =>
      o.order_id === orderId
        ? { ...o, status: 'out_for_delivery' as const, staff_id: staffId }
        : o,
    );
    setOrders(updated);
    storage.set('orders', updated);
  }

  function getRestaurantAddress(restaurantId: number): string {
    const found = restaurants.find((r) => r.restaurant_id === restaurantId);
    return found?.address ?? `Nhà hàng #${restaurantId}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#9b9b9b]">
          {available.length > 0
            ? `${available.length} đơn đang chờ tài xế nhận`
            : 'Không có đơn mới'}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-[#f57c00] font-semibold bg-orange-50 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f57c00] animate-pulse" />
          Đang chuẩn bị
        </div>
      </div>

      {available.length === 0 ? (
        <div className="bg-white rounded-2xl border border-orange-50 shadow-sm">
          <EmptyState />
        </div>
      ) : (
        <div className="space-y-3">
          {available.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-2xl border border-orange-50 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="font-mono font-bold text-[#f57c00] text-lg">
                      Đơn #{order.order_id}
                    </span>
                    <p className="text-xs text-[#9b9b9b] mt-0.5">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <p className="font-display font-bold text-[#252422] text-xl">
                    {formatVND(order.total_price)}
                  </p>
                </div>

                <div className="space-y-2.5 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-[#f57c00]"
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
                    <div>
                      <p className="text-[10px] font-semibold text-[#9b9b9b] uppercase tracking-wide">
                        Lấy hàng tại
                      </p>
                      <p className="text-sm text-[#252422] font-medium">
                        {getRestaurantAddress(order.restaurant_id)}
                      </p>
                    </div>
                  </div>

                  <div className="ml-3.5 w-px h-4 bg-orange-100" />

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-green-600"
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
                    <div>
                      <p className="text-[10px] font-semibold text-[#9b9b9b] uppercase tracking-wide">
                        Giao đến
                      </p>
                      <p className="text-sm text-[#252422] font-medium">
                        Địa chỉ khách hàng #{order.address_id}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAccept(order.order_id)}
                  className="w-full py-2.5 bg-[#f57c00] text-white rounded-xl text-sm font-semibold
                    hover:bg-[#e65100] active:scale-95 transition-all shadow-sm shadow-orange-200"
                >
                  Nhận đơn giao này
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
