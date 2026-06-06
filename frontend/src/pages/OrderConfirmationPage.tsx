import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { CheckCircle } from 'lucide-react';

interface Order {
  order_id: string;
  order_code: string;
  restaurant_name: string;
  payment_method: string;
  delivery_address: string;
  note?: string;
  total: number;
}

export function OrderConfirmationPage() {
  const [orderId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('orderId');
  });

  const [order] = useState<Order | null>(() => {
    const currentUser = storage.get('currentUser', null);
    if (!currentUser || !orderId) {
      return null;
    }

    const orders = storage.get<Order[]>('orders', []) || [];
    return orders.find((o) => o.order_id === orderId) || null;
  });

  useEffect(() => {
    const currentUser = storage.get('currentUser', null);

    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    if (!orderId || !order) {
      window.location.href = '/';
    }
  }, [orderId, order]);

  if (!orderId || !order) {
    const currentUser = storage.get('currentUser', null);
    if (!currentUser || !orderId || !order) {
      return (
        <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin">⏳</div>
            <p className="mt-2 text-[#7A7570]">Đang xử lý điều hướng...</p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 text-center mb-8">
          <CheckCircle
            size={64}
            className="text-green-500 mx-auto mb-4"
            strokeWidth={1.5}
          />
          <h1 className="text-3xl font-bold text-[#252422] mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-[#7A7570]">Cảm ơn bạn đã tin tưởng ZestyDash</p>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-[#252422] mb-6">
            Thông tin đơn hàng
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-[#7A7570]">Mã đơn hàng:</span>
              <span className="font-bold text-[#252422]">
                {order.order_code}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-[#7A7570]">Nhà hàng:</span>
              <span className="font-bold text-[#252422]">
                {order.restaurant_name}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-[#7A7570]">Phương thức thanh toán:</span>
              <span className="font-bold text-[#252422] capitalize">
                {order.payment_method === 'cash'
                  ? 'Tiền mặt'
                  : order.payment_method}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-[#7A7570]">Địa chỉ giao:</span>
              <span className="font-bold text-[#252422] text-right max-w-xs">
                {order.delivery_address}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-[#7A7570]">Ghi chú:</span>
              <span className="font-bold text-[#252422]">
                {order.note || '(Không có)'}
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-lg font-bold text-[#252422]">
                Tổng cộng:
              </span>
              <span className="text-2xl font-bold text-[#EB5E28]">
                {order.total?.toLocaleString()}₫
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
          <p className="text-sm text-blue-700">
            ℹ️ Đơn hàng của bạn đang được chuẩn bị. Bạn sẽ nhận được cập nhật
            qua SMS và email.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => (window.location.href = '/orders')}
            className="w-full py-3 rounded-full bg-[#EB5E28] text-white font-bold
                       text-lg hover:bg-[#d44e1e] active:scale-95 transition-all"
          >
            Xem đơn hàng
          </button>

          <button
            onClick={() => (window.location.href = '/restaurants')}
            className="w-full py-3 rounded-full border-2 border-[#E0E0E0] text-[#252422] font-bold
                       text-lg hover:bg-[#F5F0EB] active:scale-95 transition-all"
          >
            Tiếp tục mua hàng
          </button>
        </div>
      </div>
    </div>
  );
}
