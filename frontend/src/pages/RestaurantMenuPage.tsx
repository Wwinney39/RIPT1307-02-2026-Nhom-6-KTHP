import { useState } from 'react';
import type { MenuItem, Restaurant, CartItem } from '../types';
import useToast from '../hooks/useToast';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_RESTAURANT: Restaurant = {
  restaurant_id: 1,
  name: 'Pizza Saigon',
  address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  latitude: 10.7769,
  longitude: 106.7009,
  status: 'open',
};

const UI_AVERAGE_RATING = 4.8;
const UI_DELIVERY_TIME = '20–30 phút';

const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    item_id: 1,
    restaurant_id: 1,
    name: 'Pizza Margherita',
    price: 129000,
    image_url: '',
    is_available: true,
  },
  {
    item_id: 2,
    restaurant_id: 1,
    name: 'Pizza Pepperoni',
    price: 149000,
    image_url: '',
    is_available: true,
  },
  {
    item_id: 3,
    restaurant_id: 1,
    name: 'Pizza 4 Phô Mai',
    price: 169000,
    image_url: '',
    is_available: true,
  },
  {
    item_id: 4,
    restaurant_id: 1,
    name: 'Pizza Hải Sản',
    price: 185000,
    image_url: '',
    is_available: false,
  },
  {
    item_id: 5,
    restaurant_id: 1,
    name: 'Mì Ý Bò Bằm',
    price: 89000,
    image_url: '',
    is_available: true,
  },
  {
    item_id: 6,
    restaurant_id: 1,
    name: 'Salad Caesar',
    price: 75000,
    image_url: '',
    is_available: true,
  },
];

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABEL: Record<Restaurant['status'], string> = {
  open: '● Đang mở cửa',
  closed: '● Đóng cửa',
  suspended: '● Tạm ngưng',
};

const STATUS_COLOR: Record<Restaurant['status'], string> = {
  open: 'bg-emerald-500/20 text-emerald-300',
  closed: 'bg-red-500/20 text-red-300',
  suspended: 'bg-gray-500/20 text-gray-300',
};

// ─── MenuItemCard ─────────────────────────────────────────────────────────────

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-black/[0.07] p-4 flex gap-4
                  transition-shadow hover:shadow-md
                  ${!item.is_available ? 'opacity-50' : ''}`}
    >
      <div
        className="w-20 h-20 rounded-xl bg-[#F5F0EB] flex items-center
                      justify-center text-3xl shrink-0 overflow-hidden"
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          '🍽️'
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-sm text-[#252422] truncate">
          {item.name}
        </h3>

        {!item.is_available && (
          <span className="text-xs text-red-500 font-medium">Tạm hết hàng</span>
        )}

        <p className="text-[#EB5E28] font-bold text-sm mt-1">
          {item.price.toLocaleString('vi-VN')} đ
        </p>
      </div>

      <button
        disabled={!item.is_available}
        onClick={() => onAddToCart(item)}
        className="self-center shrink-0 w-9 h-9 rounded-full bg-[#EB5E28] text-white
                   text-xl font-bold flex items-center justify-center
                   hover:bg-[#d44e1e] active:scale-95 transition-all
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label={`Thêm ${item.name} vào giỏ`}
      >
        +
      </button>
    </div>
  );
}

// ─── RestaurantMenuPage ───────────────────────────────────────────────────────

export function RestaurantMenuPage() {
  const { showToast } = useToast();
  const restaurant = MOCK_RESTAURANT;
  const menuItems = MOCK_MENU_ITEMS;

  // Khởi tạo state giỏ hàng từ localStorage
  const [cartList, setCartList] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  function handleAddToCart(item: MenuItem) {
    const existingIndex = cartList.findIndex((c) => c.item_id === item.item_id);

    const updatedCart: CartItem[] =
      existingIndex > -1
        ? cartList.map((c, idx) =>
            idx === existingIndex ? { ...c, quantity: c.quantity + 1 } : c,
          )
        : [
            ...cartList,
            {
              cart_id: item.item_id,
              user_id: 1,
              item_id: item.item_id,
              quantity: 1,
              name: item.name,
              price: item.price,
              image_url: item.image_url || '',
              restaurant_name: restaurant.name,
            },
          ];

    setCartList(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    window.dispatchEvent(new Event('cartUpdated'));

    showToast(`Đã thêm <strong>${item.name}</strong> vào giỏ hàng`);
  }

  const totalCartItems = cartList.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      {/* Restaurant header */}
      <div className="bg-[#252422] px-6 py-10 text-center">
        <div className="text-5xl mb-3" aria-hidden="true">
          🍽️
        </div>

        <h1 className="font-display font-extrabold text-2xl text-white">
          {restaurant.name}
        </h1>

        <p className="text-white/55 text-sm mt-1">{restaurant.address}</p>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full
                            ${STATUS_COLOR[restaurant.status]}`}
          >
            {STATUS_LABEL[restaurant.status]}
          </span>

          <span className="text-xs text-white/55">⏱ {UI_DELIVERY_TIME}</span>

          <span className="text-xs text-white/55">⭐ {UI_AVERAGE_RATING}</span>
        </div>
      </div>

      {/* Menu items */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="font-display font-bold text-xl text-[#252422] mb-5">
          Thực đơn
        </h2>

        <div className="space-y-3">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.item_id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* Sticky cart CTA */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40 animate-fade-up">
          <a
            href="/cart"
            className="max-w-2xl mx-auto flex items-center justify-between
                       bg-[#EB5E28] text-white px-6 py-4 rounded-2xl shadow-2xl
                       font-bold text-sm hover:bg-[#d44e1e] active:scale-98 transition-all"
          >
            <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs">
              {totalCartItems} món
            </span>
            <span>Xem giỏ hàng</span>
            <span aria-hidden="true">›</span>
          </a>
        </div>
      )}
    </div>
  );
}
