// ─── Navigation (UI-only) ─────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

// ─── Toast (UI-only) ──────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
}

// ─── users ────────────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'restaurant_owner' | 'admin';

export interface User {
  user_id: number; // pk, increment
  name: string;
  phone: string; // unique
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
}

// ─── user_addresses ───────────────────────────────────────────────────────────

export interface UserAddress {
  address_id: number; // pk, increment
  user_id: number;
  address_text: string;
  is_default: boolean;
}

// ─── restaurants ─────────────────────────────────────────────────────────────

export type RestaurantStatus = 'open' | 'closed' | 'suspended';

export interface Restaurant {
  restaurant_id: number; // pk, increment
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: RestaurantStatus;
}

// ─── menu_items ───────────────────────────────────────────────────────────────

export interface MenuItem {
  item_id: number; // pk, increment
  restaurant_id: number;
  name: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

// ─── cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  cart_id: number; // pk, increment
  user_id: number;
  item_id: number;
  quantity: number;
  // Joined display fields (not stored in cart table)
  name?: string;
  price?: number;
  image_url?: string;
  restaurant_name?: string;
}

// ─── vouchers ─────────────────────────────────────────────────────────────────

export interface Voucher {
  voucher_id: number; // pk, increment
  code: string; // unique
  discount_percent: number;
  max_discount_amount: number;
  min_order_amount: number;
  expiry_date: string;
  max_uses: number;
  used_count: number;
}

// ─── orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  order_id: number; // pk, increment
  user_id: number;
  restaurant_id: number;
  address_id: number;
  voucher_id: number | null;
  total_price: number;
  status: OrderStatus;
  created_at: string;
}

// ─── order_details ────────────────────────────────────────────────────────────

export interface OrderDetail {
  detail_id: number; // pk, increment
  order_id: number;
  item_id: number;
  quantity: number;
  note: string;
  // Joined display fields
  item_name?: string;
  item_price?: number;
}

// ─── payments ─────────────────────────────────────────────────────────────────

export type PaymentMethod = 'cash' | 'card' | 'momo' | 'vnpay' | 'zalopay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Payment {
  payment_id: number; // pk, increment
  order_id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

// ─── delivery_logs ────────────────────────────────────────────────────────────

export type DeliveryStatus =
  | 'assigned'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'failed';

export interface DeliveryLog {
  log_id: number; // pk, increment
  order_id: number;
  status: DeliveryStatus;
  updated_at: string;
}

// ─── reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  review_id: number; // pk, increment
  user_id: number;
  restaurant_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

// ─── UI-only helpers (no ERD table — kept for landing page only) ──────────────

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
