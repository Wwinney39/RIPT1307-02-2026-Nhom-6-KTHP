import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import useToast from '../hooks/useToast';
import type { PaymentMethod } from '../types';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] =
  [
    { value: 'cash', label: 'Tiền mặt khi nhận hàng', icon: '💵' },
    { value: 'momo', label: 'Ví MoMo', icon: '💜' },
    { value: 'vnpay', label: 'VNPay', icon: '🔵' },
    { value: 'zalopay', label: 'ZaloPay', icon: '🟢' },
    { value: 'card', label: 'Thẻ tín dụng / Ghi nợ', icon: '💳' },
  ];

export function PaymentPage() {
  const { showToast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [loading, setLoading] = useState(false);
  const [orderSummary] = useState(() => {
    return storage.get('orderSummary', null);
  });

  useEffect(() => {
    if (!orderSummary) {
      window.location.href = '/checkout';
    }
  }, [orderSummary]);

  function handleConfirmPayment() {
    if (!orderSummary) return;

    setLoading(true);
    try {
      const order = {
        ...orderSummary,
        payment_method: paymentMethod,
        payment_status: 'pending',
        created_at: new Date().toISOString(),
      };

      const orders = storage.get('orders', []) || [];
      orders.push(order);
      storage.set('orders', orders);

      storage.remove('orderSummary');
      storage.remove('cart');

      showToast('Đơn hàng đã được đặt thành công!');

      setTimeout(() => {
        window.location.href = `/order-confirmation?orderId=${order.order_id}`;
      }, 500);
    } catch (error) {
      showToast('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  }

  if (!orderSummary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#252422] mb-8">Thanh toán</h1>

        <div className="bg-white rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-[#252422] mb-6">
            Chọn phương thức thanh toán
          </h2>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                style={{
                  borderColor:
                    paymentMethod === method.value ? '#EB5E28' : '#E0E0E0',
                  backgroundColor:
                    paymentMethod === method.value ? '#FFF5F0' : '#FFFFFF',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as PaymentMethod)
                  }
                  className="w-5 h-5"
                />
                <span className="text-2xl mx-3">{method.icon}</span>
                <span className="font-semibold text-[#252422]">
                  {method.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-[#252422] mb-4">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-2 text-[#7A7570]">
            <div className="flex justify-between">
              <span>Tiền hàng:</span>
              <span>{orderSummary.subtotal?.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between">
              <span>Phí giao hàng:</span>
              <span>{orderSummary.shipping_fee?.toLocaleString()}₫</span>
            </div>
            {orderSummary.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span>-{orderSummary.discount?.toLocaleString()}₫</span>
              </div>
            )}
          </div>

          <div className="border-t border-[#E0E0E0] pt-4 mt-4 flex justify-between font-bold text-lg text-[#252422]">
            <span>Tổng cộng:</span>
            <span className="text-[#EB5E28]">
              {orderSummary.total?.toLocaleString()}₫
            </span>
          </div>
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#EB5E28] text-white font-bold
                     text-lg hover:bg-[#d44e1e] active:scale-95 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
        </button>

        <button
          onClick={() => window.location.href = '/checkout'}
          className="w-full py-3 rounded-full border-2 border-[#E0E0E0] text-[#252422] font-bold
                     text-lg hover:bg-[#F5F0EB] active:scale-95 transition-all mt-3"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}
