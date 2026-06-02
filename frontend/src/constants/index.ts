import type { NavLink, HowItWorksStep, FooterLinkGroup } from '../types';

// ─── Header ───────────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: 'Nhà hàng', href: '/restaurants' },
  { label: 'Theo dõi đơn hàng', href: '/orders' },
];

export const HEADER_SEARCH_PLACEHOLDER = 'Nhập địa chỉ giao hàng của bạn...';
export const BTN_LOGIN_LABEL = 'Đăng nhập';
export const BTN_REGISTER_LABEL = 'Đăng ký';

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const HERO_CHIP_TEXT = 'Giao hàng trong 30 phút';
export const HERO_TITLE_LINE_1 = 'Món ngon bạn yêu,';
export const HERO_TITLE_LINE_2 = 'giao ngay tích tắc';
export const HERO_SUBTITLE =
  'Đặt món từ hàng trăm nhà hàng địa phương và thưởng thức bữa ăn nóng hổi trong vài phút.';
export const HERO_SEARCH_PLACEHOLDER = 'Nhập địa chỉ giao hàng...';
export const HERO_SEARCH_BTN = 'Tìm kiếm';

// ─── How It Works ─────────────────────────────────────────────────────────────
// UI-only section — not mapped to any ERD table, kept as onboarding copy.

export const HOW_IT_WORKS_TITLE = 'Đặt hàng dễ dàng chỉ 3 bước';

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    emoji: '📍',
    title: 'Nhập địa chỉ',
    description: 'Cho chúng tôi biết bạn đang ở đâu để tìm nhà hàng gần nhất.',
  },
  {
    step: 2,
    emoji: '🍽️',
    title: 'Chọn món yêu thích',
    description: 'Duyệt qua thực đơn và thêm vào giỏ hàng những món bạn thích.',
  },
  {
    step: 3,
    emoji: '🛵',
    title: 'Nhận hàng tận nơi',
    description: 'Shipper sẽ giao món ăn nóng hổi đến tận cửa nhà bạn.',
  },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FOOTER_BRAND_TAGLINE =
  'Nền tảng giao đồ ăn hàng đầu — kết nối bạn với hàng trăm nhà hàng chất lượng trong vài phút.';

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: 'Khám phá',
    links: [
      { label: 'Nhà hàng', href: '/restaurants' },
      { label: 'Theo dõi đơn hàng', href: '/orders' },
    ],
  },
  {
    title: 'Tài khoản',
    links: [
      { label: 'Đăng nhập', href: '/login' },
      { label: 'Đăng ký', href: '/register' },
      { label: 'Đơn hàng của tôi', href: '/orders' },
      { label: 'Hồ sơ cá nhân', href: '/profile' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Liên hệ chúng tôi', href: '#' },
      { label: 'Chính sách bảo mật', href: '#' },
      { label: 'Điều khoản dịch vụ', href: '#' },
    ],
  },
];

export const FOOTER_COPYRIGHT = '© 2024 ZestyDash. Bảo lưu mọi quyền.';

// ─── Shared labels ────────────────────────────────────────────────────────────

export const DELIVERY_TIME_LABEL = 'phút';
export const MIN_PRICE_PREFIX = 'Từ';
export const MIN_PRICE_SUFFIX = 'đ';
