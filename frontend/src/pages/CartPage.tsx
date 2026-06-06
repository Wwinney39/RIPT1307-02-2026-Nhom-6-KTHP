import { useState } from 'react';
import type { CartItem, Voucher } from '../types';
import useToast from '../hooks/useToast';
import { storage } from '../utils/storage';

const MOCK_VOUCHER: Voucher = {
  voucher_id: 1,
  code: 'BANMOI200',
  discount_percent: 20,
  max_discount_amount: 200000,
  min_order_amount: 150000,
  expiry_date: '2025-12-31T23:59:59',
  max_uses: 1000,
  used_count: 42,
};

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (cart_id: number, qty: number) => void;
  onRemove: (cart_id: number) => void;
}

function CartItemRow({ item, onUpdateQty, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-black/[0.06] last:border-0">
      <div className="w-14 h-14 rounded-xl bg-[#F5F0EB] flex items-center justify-center text-2xl shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          '🍽️'
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#252422] truncate">
          {item.name}
        </p>
        <p className="text-xs text-[#7A7570]">{item.restaurant_name}</p>
        <p className="text-[#EB5E28] font-bold text-sm mt-0.5">
          {((item.price ?? 0) * item.quantity).toLocaleString('vi-VN')} đ
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            item.quantity > 1
              ? onUpdateQty(item.cart_id, item.quantity - 1)
              : onRemove(item.cart_id)
          }
          className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center
                     text-sm font-bold text-[#252422] hover:bg-[#F5F0EB] transition-colors"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-bold">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQty(item.cart_id, item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-[#EB5E28] text-white flex items-center justify-center
                     text-sm font-bold hover:bg-[#d44e1e] transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function CartPage() {
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return storage.get<CartItem[]>('cart', []);
  });

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  function handleUpdateQty(cart_id: number, qty: number) {
    setCartItems((items) => {
      const updated = items.map((i) =>
        i.cart_id === cart_id ? { ...i, quantity: qty } : i,
      );
      storage.set('cart', updated);
      return updated;
    });
  }

  function handleRemove(cart_id: number) {
    setCartItems((items) => {
      const updated = items.filter((i) => i.cart_id !== cart_id);
      storage.set('cart', updated);
      return updated;
    });
  }

  function handleApplyVoucher() {
    if (voucherCode.toUpperCase() === MOCK_VOUCHER.code) {
      if (subtotal < MOCK_VOUCHER.min_order_amount) {
        showToast(
          `Đơn tối thiểu ${MOCK_VOUCHER.min_order_amount.toLocaleString('vi-VN')}đ để dùng mã này.`,
        );
        return;
      }
      setAppliedVoucher(MOCK_VOUCHER);
      showToast(`Áp dụng mã <strong>${MOCK_VOUCHER.code}</strong> thành công!`);
    } else {
      showToast('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  }

  function handleCheckout() {
    const isLoggedIn =
      storage.get<string>('isLoggedIn', 'false') === 'true' ||
      !!storage.get<string | null>('user_token', null);

    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      window.location.href = '/checkout';
    }
  }

  const subtotal = cartItems.reduce(
    (s, i) => s + (i.price ?? 0) * i.quantity,
    0,
  );

  const discount = appliedVoucher
    ? Math.min(
        (subtotal * appliedVoucher.discount_percent) / 100,
        appliedVoucher.max_discount_amount,
      )
    : 0;

  const total = subtotal - discount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFBF7] flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl">🛒</div>
        <h2 className="font-display font-bold text-xl text-[#252422]">
          Giỏ hàng trống
        </h2>
        <p className="text-sm text-[#7A7570]">
          Hãy thêm món ăn yêu thích của bạn!
        </p>
        <a
          href="/restaurants"
          className="px-6 py-3 rounded-full bg-[#EB5E28] text-white font-bold text-sm
                     hover:bg-[#d44e1e] transition-colors shadow-sm"
        >
          Khám phá nhà hàng
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] px-4 py-8 relative">
     <button
        onClick={() => (window.location.href = '/')}
        className="fixed top-4 left-4 z-50
                  bg-[#EB5E28] text-white
                  shadow-lg rounded-full
                  px-4 py-2
                  flex items-center gap-2
                  font-bold"
      >
        🏠 Trang chủ
      </button>
      <div className="max-w-xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-[#252422] mb-6">
          Giỏ hàng của bạn
        </h1>

        <div className="bg-white rounded-2xl border border-black/[0.07] px-5 mb-4">
          {cartItems.map((item) => (
            <CartItemRow
              key={item.cart_id}
              item={item}
              onUpdateQty={handleUpdateQty}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-5 mb-4">
          <p className="font-semibold text-sm text-[#252422] mb-3">
            Mã giảm giá
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Nhập mã voucher..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 bg-[#F5F0EB]
                         text-sm placeholder:text-[#7A7570] outline-none
                         focus:border-[#EB5E28] focus:bg-white focus:ring-2
                         focus:ring-[#EB5E28]/15 transition-all uppercase"
            />
            <button
              onClick={handleApplyVoucher}
              className="px-5 py-2.5 rounded-xl bg-[#EB5E28] text-white font-bold text-sm
                         hover:bg-[#d44e1e] transition-colors whitespace-nowrap"
            >
              Áp dụng
            </button>
          </div>
          {appliedVoucher && (
            <p className="text-emerald-600 text-xs font-semibold mt-2">
              ✓ Giảm {appliedVoucher.discount_percent}% (tối đa{' '}
              {appliedVoucher.max_discount_amount.toLocaleString('vi-VN')}đ)
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-5 mb-6">
          <p className="font-semibold text-sm text-[#252422] mb-3">
            Tóm tắt đơn hàng
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#7A7570]">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString('vi-VN')} đ</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Giảm giá ({appliedVoucher?.code})</span>
                <span>−{discount.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
            <div className="flex justify-between text-[#7A7570]">
              <span>Phí giao hàng</span>
              <span className="text-emerald-600 font-semibold">Miễn phí</span>
            </div>
            <div
              className="flex justify-between font-bold text-[#252422] text-base pt-2
                            border-t border-black/[0.07]"
            >
              <span>Tổng cộng</span>
              <span className="text-[#EB5E28]">
                {total.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          className="block w-full text-center py-3.5 rounded-full bg-[#EB5E28] text-white
                     font-bold hover:bg-[#d44e1e] active:scale-95 transition-all cursor-pointer"
        >
          Tiến hành thanh toán
        </button>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLoginModal(false)}
          />

          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>

            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 mb-4">
              <svg
                className="h-6 w-6 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m0-6h.01M12 2a10 10 0 00-10 10v1.17c0 .86.31 1.7.87 2.36l1.32 1.57A2 2 0 005.7 18H18.3a2 2 0 001.51-.67l1.32-1.57c.56-.66.87-1.5.87-2.36V12A10 10 0 0012 2z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-[#252422] mb-2">
              Yêu cầu đăng nhập
            </h3>
            <p className="text-sm text-[#7A7570] leading-relaxed mb-6 px-2">
              Vui lòng đăng nhập vào tài khoản của bạn để thanh toán và hoàn tất
              đơn hàng. Nếu bạn chưa có tài khoản, hãy đăng ký để trải nghiệm
              dịch vụ tốt nhất từ chúng tôi!
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-all min-w-[100px]"
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = '/login')}
                className="px-5 py-2.5 rounded-xl bg-[#EB5E28] hover:bg-[#d44e1e] text-white text-sm font-bold shadow-md transition-all min-w-[120px]"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
