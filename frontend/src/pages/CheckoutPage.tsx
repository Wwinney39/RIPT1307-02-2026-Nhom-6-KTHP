import { useState } from 'react';
import type { UserAddress, CartItem } from '../types';
import useToast from '../hooks/useToast';
import { storage } from '../utils/storage';

const DEFAULT_ADDRESSES: UserAddress[] = [
  {
    address_id: 1,
    user_id: 1,
    address_text: '122 Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội',
    is_default: true,
  },
  {
    address_id: 2,
    user_id: 1,
    address_text: '96A Đ. Trần Phú, Hà Đông, Hà Nội',
    is_default: false,
  },
];

const generateOrderMeta = () => {
  return {
    uniqueId: Date.now().toString(),
    randomCode: `10${Math.floor(10 + Math.random() * 90)}`,
  };
};

export function CheckoutPage() {
  const { showToast } = useToast();

  const [cartItems] = useState<CartItem[]>(() => {
    return storage.get<CartItem[]>('cart', []);
  });

  const [addresses] = useState<UserAddress[]>(() => {
    return storage.get<UserAddress[]>('user_addresses', DEFAULT_ADDRESSES);
  });

  const [selectedAddressId, setSelectedAddressId] = useState<number>(() => {
    return (
      addresses.find((a) => a.is_default)?.address_id ??
      addresses[0]?.address_id ??
      0
    );
  });

  const [itemNote, setItemNote] = useState('');

  const shippingFee = (() => {
    if (cartItems.length === 0) return 0;
    const feeRaw =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cartItems[0] as any).shipping_fee ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cartItems[0] as any).restaurant_shipping_fee;

    if (!feeRaw || feeRaw === 'Miễn phí' || feeRaw === 0 || feeRaw === '0') {
      return 0;
    }

    if (typeof feeRaw === 'string') {
      const parsedFee = parseInt(feeRaw.replace(/[^0-9]/g, ''), 10);
      return isNaN(parsedFee) ? 15000 : parsedFee;
    }

    return typeof feeRaw === 'number' ? feeRaw : 15000;
  })();

  const subtotal = cartItems.reduce(
    (s, i) => s + (i.price ?? 0) * i.quantity,
    0,
  );
  const discount = 0;
  const total = subtotal - discount + shippingFee;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      showToast('Giỏ hàng của bạn đang trống, không thể đặt hàng!');
      return;
    }

    const selectedAddress =
      addresses.find((a) => a.address_id === selectedAddressId)?.address_text ||
      '';

    const discountAmount = 0;
    const { uniqueId, randomCode } = generateOrderMeta();

    const orderSummary = {
      order_id: uniqueId,
      order_code: randomCode,
      restaurant_name: cartItems[0]?.restaurant_name || 'Nhà hàng ZestyDash',
      item_summary: cartItems
        .map(
          (item) =>
            `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`,
        )
        .join(', '),
      items: cartItems,
      subtotal,
      shipping_fee: shippingFee,
      discount: discountAmount,
      total: subtotal + shippingFee - discountAmount,
      delivery_address: selectedAddress,
      note: itemNote,
      created_at: new Date().toISOString(),
    };

    storage.set('orderSummary', orderSummary);
    showToast('Chuyển đến thanh toán...');

    setTimeout(() => {
      window.location.href = '/payment';
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] px-4 py-8">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="font-display font-bold text-2xl text-[#252422]">
          Xác nhận đơn hàng
        </h1>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
          <div className="mb-3">
            <p className="font-semibold text-sm text-[#252422]">
              📍 Địa chỉ giao hàng
            </p>
          </div>
          <div className="space-y-2">
            {addresses.map((addr) => (
              <label
                key={addr.address_id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedAddressId === addr.address_id ? 'border-[#EB5E28] bg-orange-50' : 'border-black/10 hover:bg-[#F5F0EB]'}`}
              >
                <input
                  type="radio"
                  name="address"
                  value={addr.address_id}
                  checked={selectedAddressId === addr.address_id}
                  onChange={() => setSelectedAddressId(addr.address_id)}
                  className="mt-0.5 accent-[#EB5E28]"
                />
                <div>
                  <p className="text-sm text-[#252422]">{addr.address_text}</p>
                  {addr.is_default && (
                    <span className="text-xs text-[#EB5E28] font-semibold">
                      Mặc định
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
          <p className="font-semibold text-sm text-[#252422] mb-3">
            📝 Ghi chú cho nhà hàng
          </p>
          <textarea
            value={itemNote}
            onChange={(e) => setItemNote(e.target.value)}
            placeholder="Ví dụ: Không hành, ít cay, thêm tương ớt..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB] text-sm placeholder:text-[#7A7570] outline-none resize-none focus:border-[#EB5E28] focus:bg-white focus:ring-2 focus:ring-[#EB5E28]/15 transition-all"
          />
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
          <p className="font-semibold text-sm text-[#252422] mb-3">
            🧾 Tóm tắt thanh toán
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#7A7570]">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-[#7A7570]">
              <span>Phí giao hàng</span>
              <span className="text-[#252422] font-semibold">
                {shippingFee === 0
                  ? 'Miễn phí'
                  : `${shippingFee.toLocaleString('vi-VN')} đ`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-[#252422] text-base pt-2 border-t border-black/[0.07]">
              <span>Tổng cộng</span>
              <span className="text-[#EB5E28]">
                {total.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full py-3.5 rounded-full bg-[#EB5E28] text-white font-bold hover:bg-[#d44e1e] active:scale-95 transition-all"
        >
          Đặt hàng ngay
        </button>
      </div>
    </div>
  );
}
