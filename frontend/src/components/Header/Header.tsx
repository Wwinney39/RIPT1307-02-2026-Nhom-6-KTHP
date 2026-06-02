import { useState, useRef, useEffect } from 'react';
import {
  NAV_LINKS,
  HEADER_SEARCH_PLACEHOLDER,
  BTN_LOGIN_LABEL,
  BTN_REGISTER_LABEL,
} from '../../constants';
import { SearchIcon, ShoppingBagIcon } from '../common/Icons';
import useToast from '../../hooks/useToast';

// Import các icon dùng riêng cho phần Dropdown Menu tài khoản
import { ChevronDown, UserCircle, KeyRound, LogOut } from 'lucide-react';

// Import thêm kiểu dữ liệu CartItem để đếm số lượng món ăn
import type { CartItem } from '../../types';

// ─── Định nghĩa kiểu dữ liệu User ─────────────────────────────────────────────
interface LoggedInUser {
  name: string;
  email: string;
  avatarInitial: string;
}

// ─── Component Dropdown Menu ──────────────────────────────────────────────────
interface UserDropdownProps {
  user: LoggedInUser;
  onClose: () => void;
  onLogout: () => void;
}

function UserDropdown({ user, onClose, onLogout }: UserDropdownProps) {
  const menuItems = [
    {
      icon: <UserCircle size={16} />,
      label: 'Xem thông tin',
      onClick: () => {
        window.location.href = '/profile';
        onClose();
      },
    },
    {
      icon: <KeyRound size={16} />,
      label: 'Đổi mật khẩu',
      onClick: () => {
        window.location.href = '/change-password';
        onClose();
      },
    },
  ];

  return (
    <div
      className="absolute right-0 top-[calc(100%+10px)] w-64 bg-white rounded-2xl
                 border border-black/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.12)]
                 overflow-hidden z-50 animate-fade-down"
      role="menu"
      aria-label="Menu tài khoản"
    >
      <div className="flex items-center gap-3 px-4 py-4 bg-[#FFFBF7] border-b border-black/[0.06]">
        <div className="w-10 h-10 rounded-full bg-[#EB5E28] flex items-center justify-center text-white font-display font-bold text-base shrink-0 select-none">
          {user.avatarInitial}
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-[#252422] text-sm truncate">
            {user.name}
          </p>
          <p className="text-xs text-[#7A7570] truncate">{user.email}</p>
        </div>
      </div>

      <div className="py-1.5">
        {menuItems.map((item) => (
          <button
            key={item.label}
            role="menuitem"
            onClick={item.onClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                       text-[#252422] hover:bg-[#F5F0EB] transition-colors text-left"
          >
            <span className="text-[#7A7570] shrink-0">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="border-t border-black/[0.06] mx-3" />

      <div className="py-1.5">
        <button
          role="menuitem"
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                     text-red-500 hover:bg-red-50 transition-colors text-left"
        >
          <LogOut size={16} className="shrink-0" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

// ─── Component Header Chính ───────────────────────────────────────────────────
interface HeaderProps {
  cartCount?: number;
}

export function Header({ cartCount: propCartCount }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ KHẮC PHỤC LỖI 2: Đọc và tính tổng số lượng món trực tiếp ngay khi khởi tạo State.
  // Cách này giúp giao diện có ngay số lượng đúng lúc nạp trang mà không cần gọi setState trong useEffect nữa.
  const [localCartCount, setLocalCartCount] = useState<number>(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(savedCart);
        return cartItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
      } catch {
        return 0;
      }
    }
    return 0;
  });

  // Đọc trạng thái đăng nhập thực tế từ bộ nhớ trình duyệt
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Hàm cập nhật số lượng khi có sự kiện thay đổi từ bên ngoài (Click dấu cộng ở trang Menu)
  const updateCountFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(savedCart);
        const total = cartItems.reduce(
          (sum, item) => sum + (item.quantity ?? 0),
          0,
        );
        setLocalCartCount(total);
      } catch {
        // ✅ KHẮC PHỤC LỖI 1: Bỏ chữ 'e' đi, chỉ viết 'catch' trống nếu không sử dụng biến lỗi
        setLocalCartCount(0);
      }
    } else {
      setLocalCartCount(0);
    }
  };

  // useEffect chỉ làm đúng nhiệm vụ lắng nghe các hệ thống bên ngoài gửỉ tín hiệu tới
  useEffect(() => {
    // Lắng nghe sự kiện chuyển trang/chuyển tab trình duyệt
    window.addEventListener('storage', updateCountFromStorage);

    // Lắng nghe sự kiện tùy chỉnh khi người dùng click bấm nút '+' ở trang Menu
    window.addEventListener('cartUpdated', updateCountFromStorage);

    return () => {
      window.removeEventListener('storage', updateCountFromStorage);
      window.removeEventListener('cartUpdated', updateCountFromStorage);
    };
  }, []);

  // Nếu phía ngoài có truyền prop cứng vào thì dùng prop, ngược lại dùng state tự động đếm
  const displayCartCount =
    propCartCount !== undefined ? propCartCount : localCartCount;

  // Đóng dropdown khi click ra ngoài vùng menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Đóng dropdown khi nhấn phím ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      showToast(`Đang tìm kiếm: <strong>${searchValue}</strong>`);
    }
  }

  function handleLogin() {
    window.location.href = '/login';
  }

  function handleRegister() {
    window.location.href = '/register';
  }

  function handleLogout() {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setDropdownOpen(false);
    showToast('Đã đăng xuất thành công.');
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-b-black/10
                 bg-[#FFFBF7]/90 backdrop-blur-md"
    >
      <div className="max-w-[1200px] mx-auto px-6 h-[68px] flex items-center gap-5">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-1.5 font-display font-extrabold text-2xl
                     tracking-tight text-[#252422] shrink-0 select-none"
          aria-label="ZestyDash – Trang chủ"
        >
          ZestyDash
          <span
            className="inline-block w-2.5 h-2.5 rounded-full bg-[#EB5E28] mb-0.5"
            aria-hidden="true"
          />
        </a>

        {/* Address search */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-sm relative hidden sm:flex items-center"
          role="search"
        >
          <SearchIcon
            size={15}
            className="absolute left-3 text-[#7A7570] pointer-events-none"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={HEADER_SEARCH_PLACEHOLDER}
            className="w-full pl-9 pr-4 py-[9px] rounded-full border border-black/10
                       bg-[#F5F0EB] text-sm text-[#252422] placeholder:text-[#7A7570]
                       outline-none focus:border-[#EB5E28] focus:bg-white
                       focus:ring-2 focus:ring-[#EB5E28]/15 transition-all"
            aria-label="Tìm kiếm địa chỉ giao hàng"
          />
        </form>

        {/* Desktop navigation */}
        <nav
          className="hidden lg:flex items-center gap-0.5 ml-auto"
          aria-label="Menu chính"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#3d3a37] px-3 py-2 rounded-lg
                         hover:bg-[#F5F0EB] hover:text-[#252422] transition-colors
                         whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Cart Button */}
        <a
          href="/cart"
          className="relative flex items-center justify-center w-10 h-10 rounded-full
                     border border-black/10 bg-[#F5F0EB] text-[#252422]
                     hover:bg-[#ebe5df] transition-colors shrink-0"
          aria-label={`Giỏ hàng – ${displayCartCount} món`}
        >
          <ShoppingBagIcon size={17} />
          {displayCartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                         flex items-center justify-center rounded-full
                         bg-[#EB5E28] text-white text-[10px] font-bold leading-none"
              aria-hidden="true"
            >
              {displayCartCount}
            </span>
          )}
        </a>

        {/* Khu vực xử lý trạng thái Đăng nhập / Đăng ký */}
        {!currentUser && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLogin}
              className="hidden sm:inline-flex text-sm font-semibold text-[#252422]
                         px-3 py-2 rounded-lg hover:bg-[#F5F0EB] transition-colors"
            >
              {BTN_LOGIN_LABEL}
            </button>
            <button
              onClick={handleRegister}
              className="text-sm font-bold text-white bg-[#EB5E28] px-5 py-2
                         rounded-full hover:bg-[#d44e1e] active:scale-95
                         transition-all whitespace-nowrap"
            >
              {BTN_REGISTER_LABEL}
            </button>
          </div>
        )}

        {/* Nếu đã đăng nhập thành công */}
        {currentUser && (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-label="Menu tài khoản"
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full
                         border border-black/10 bg-[#F5F0EB]
                         hover:bg-[#ebe5df] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full bg-[#EB5E28] flex items-center
                           justify-center text-white font-display font-bold text-sm
                           shrink-0 select-none"
                aria-hidden="true"
              >
                {currentUser.avatarInitial}
              </div>

              <span
                className="hidden sm:block text-sm font-semibold text-[#252422]
                               max-w-[80px] truncate"
              >
                {currentUser.name}
              </span>

              <ChevronDown
                size={14}
                className={`text-[#7A7570] transition-transform duration-200
                            ${dropdownOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {dropdownOpen && (
              <UserDropdown
                user={currentUser}
                onClose={() => setDropdownOpen(false)}
                onLogout={handleLogout}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
