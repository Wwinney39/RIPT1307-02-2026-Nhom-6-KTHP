<<<<<<< HEAD
// ─── Navigation (UI-only) ─────────────────────────────────────────────────────

=======
>>>>>>> 7ac46ab (new file)
export interface NavLink {
  label: string;
  href: string;
}

<<<<<<< HEAD
// ─── Toast (UI-only) ──────────────────────────────────────────────────────────

=======
>>>>>>> 7ac46ab (new file)
export interface Toast {
  id: string;
  message: string;
}

<<<<<<< HEAD
// ─── users ────────────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'restaurant_owner' | 'admin';

export interface User {
  user_id: number; // pk, increment
  name: string;
  phone: string; // unique
=======
export type UserRole = 'customer' | 'restaurant_owner' | 'admin';

export interface User {
  user_id: number;
  name: string;
  phone: string;
>>>>>>> 7ac46ab (new file)
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
}

<<<<<<< HEAD
// ─── user_addresses ───────────────────────────────────────────────────────────

export interface UserAddress {
  address_id: number; // pk, increment
=======
export interface UserAddress {
  address_id: number;
>>>>>>> 7ac46ab (new file)
  user_id: number;
  address_text: string;
  is_default: boolean;
}

<<<<<<< HEAD
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
=======
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
>>>>>>> 7ac46ab (new file)
  restaurant_id: number;
  name: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

<<<<<<< HEAD
// ─── cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  cart_id: number; // pk, increment
  user_id: number;
  item_id: number;
  quantity: number;
  // Joined display fields (not stored in cart table)
=======
export interface CartItem {
  cart_id: number;
  user_id: number;
  item_id: number;
  quantity: number;
>>>>>>> 7ac46ab (new file)
  name?: string;
  price?: number;
  image_url?: string;
  restaurant_name?: string;
}

<<<<<<< HEAD
// ─── vouchers ─────────────────────────────────────────────────────────────────

export interface Voucher {
  voucher_id: number; // pk, increment
  code: string; // unique
=======
export interface Voucher {
  voucher_id: number;
  code: string;
>>>>>>> 7ac46ab (new file)
  discount_percent: number;
  max_discount_amount: number;
  min_order_amount: number;
  expiry_date: string;
  max_uses: number;
  used_count: number;
}

<<<<<<< HEAD
// ─── orders ───────────────────────────────────────────────────────────────────

=======
>>>>>>> 7ac46ab (new file)
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
<<<<<<< HEAD
  order_id: number; // pk, increment
=======
  order_id: number;
>>>>>>> 7ac46ab (new file)
  user_id: number;
  restaurant_id: number;
  address_id: number;
  voucher_id: number | null;
  total_price: number;
  status: OrderStatus;
  created_at: string;
}

<<<<<<< HEAD
// ─── order_details ────────────────────────────────────────────────────────────

export interface OrderDetail {
  detail_id: number; // pk, increment
=======
export interface OrderDetail {
  detail_id: number;
>>>>>>> 7ac46ab (new file)
  order_id: number;
  item_id: number;
  quantity: number;
  note: string;
<<<<<<< HEAD
  // Joined display fields
=======
>>>>>>> 7ac46ab (new file)
  item_name?: string;
  item_price?: number;
}

<<<<<<< HEAD
// ─── payments ─────────────────────────────────────────────────────────────────

=======
>>>>>>> 7ac46ab (new file)
export type PaymentMethod = 'cash' | 'card' | 'momo' | 'vnpay' | 'zalopay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Payment {
<<<<<<< HEAD
  payment_id: number; // pk, increment
=======
  payment_id: number;
>>>>>>> 7ac46ab (new file)
  order_id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

<<<<<<< HEAD
// ─── delivery_logs ────────────────────────────────────────────────────────────

=======
>>>>>>> 7ac46ab (new file)
export type DeliveryStatus =
  | 'assigned'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'failed';

export interface DeliveryLog {
<<<<<<< HEAD
  log_id: number; // pk, increment
=======
  log_id: number;
>>>>>>> 7ac46ab (new file)
  order_id: number;
  status: DeliveryStatus;
  updated_at: string;
}

<<<<<<< HEAD
// ─── reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  review_id: number; // pk, increment
=======
export interface Review {
  review_id: number;
>>>>>>> 7ac46ab (new file)
  user_id: number;
  restaurant_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

<<<<<<< HEAD
// ─── UI-only helpers (no ERD table — kept for landing page only) ──────────────
=======
export interface DeliveryAddress {
  text: string;
  setAt: string;
}
>>>>>>> 7ac46ab (new file)

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
