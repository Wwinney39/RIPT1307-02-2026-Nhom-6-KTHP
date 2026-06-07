export interface NavLink {
  label: string;
  href: string;
}

export interface Toast {
  id: string;
  message: string;
}

export type UserRole = 'customer' | 'restaurant_owner' | 'admin' | 'staff';

export interface User {
  user_id: number;
  name: string;
  phone: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
}

export interface UserAddress {
  address_id: number;
  user_id: number;
  address_text: string;
  is_default: boolean;
}

export type RestaurantStatus = 'open' | 'closed' | 'suspended';

export interface Restaurant {
  restaurant_id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: RestaurantStatus;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  image_url?: string;
  isPopular: boolean;
  isFastDelivery: boolean;
}

export interface RestaurantListing extends Restaurant {
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  image_url?: string;
  isPopular: boolean;
  isFastDelivery: boolean;
}

export interface MenuItem {
  item_id: number;
  restaurant_id: number;
  name: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

export interface CartItem {
  cart_id: number;
  user_id: number;
  item_id: number;
  quantity: number;
  name?: string;
  price?: number;
  image_url?: string;
  restaurant_name?: string;
  shipping_fee?: number;
  restaurant_shipping_fee?: number | string;
}

export interface Voucher {
  voucher_id: number;
  code: string;
  discount_percent: number;
  max_discount_amount: number;
  min_order_amount: number;
  expiry_date: string;
  max_uses: number;
  used_count: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  order_id: number;
  user_id: number;
  restaurant_id: number;
  address_id: number;
  voucher_id: number | null;
  total_price: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderDetail {
  detail_id: number;
  order_id: number;
  item_id: number;
  quantity: number;
  note: string;
  item_name?: string;
  item_price?: number;
}

export type PaymentMethod = 'cash' | 'card' | 'momo' | 'vnpay' | 'zalopay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Payment {
  payment_id: number;
  order_id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

export type DeliveryStatus =
  | 'assigned'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'failed';

export interface DeliveryLog {
  log_id: number;
  order_id: number;
  status: DeliveryStatus;
  updated_at: string;
}

export interface Review {
  review_id: number;
  user_id: number;
  restaurant_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface DeliveryAddress {
  text: string;
  setAt: string;
}

export interface HowItWorksStep {
  step: number;
  emoji: string;
  title: string;
  description: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}
