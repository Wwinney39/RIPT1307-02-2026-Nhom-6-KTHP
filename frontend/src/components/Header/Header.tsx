<<<<<<< HEAD
import { useState, useRef, useEffect } from 'react';
=======
import { useState, useRef, useEffect, useCallback } from 'react';
>>>>>>> 7ac46ab (new file)
import {
  NAV_LINKS,
  HEADER_SEARCH_PLACEHOLDER,
  BTN_LOGIN_LABEL,
  BTN_REGISTER_LABEL,
} from '../../constants';
import { SearchIcon, ShoppingBagIcon } from '../common/Icons';
import useToast from '../../hooks/useToast';
<<<<<<< HEAD
=======
import { useAddress } from '../../context/AddressContext';
>>>>>>> 7ac46ab (new file)
import {
  ChevronDown,
  UserCircle,
  KeyRound,
  LogOut,
  ShieldAlert,
  X,
<<<<<<< HEAD
} from 'lucide-react';
import type { CartItem } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────
=======
  Search,
} from 'lucide-react';
import type { CartItem } from '../../types';
import { storage } from '../../utils/storage';
>>>>>>> 7ac46ab (new file)

interface LoggedInUser {
  name: string;
  email: string;
  avatarInitial: string;
}

interface AuthGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function AuthGuardModal({ isOpen, onClose, onConfirm }: AuthGuardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
<<<<<<< HEAD
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
=======
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white
                   p-6 text-center shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400
                     hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Đóng"
>>>>>>> 7ac46ab (new file)
        >
          <X size={18} />
        </button>

<<<<<<< HEAD
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
=======
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center
                        rounded-full bg-amber-50 text-amber-500"
        >
>>>>>>> 7ac46ab (new file)
          <ShieldAlert size={28} />
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-2">
          Yêu cầu đăng nhập
        </h3>
        <p className="text-sm text-gray-500 mb-6 px-2 leading-relaxed">
          Vui lòng đăng nhập vào tài khoản của bạn để sử dụng tính năng theo dõi
          và quản lý đơn hàng của ZestyDash.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
<<<<<<< HEAD
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
=======
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold
                       text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200
                       active:scale-95 transition-all"
>>>>>>> 7ac46ab (new file)
          >
            Để sau
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
<<<<<<< HEAD
            className="w-full sm:w-auto px-5 py-2 text-sm font-bold text-white bg-[#EB5E28] rounded-xl hover:bg-[#d44e1e] active:scale-95 transition-all shadow-md"
=======
            className="w-full sm:w-auto px-5 py-2 text-sm font-bold text-white
                       bg-[#EB5E28] rounded-xl hover:bg-[#d44e1e] active:scale-95
                       transition-all shadow-md"
>>>>>>> 7ac46ab (new file)
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
// ─── UserDropdown ─────────────────────────────────────────────────────────────

=======
>>>>>>> 7ac46ab (new file)
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
        window.location.href = '/profile?section=change-password';
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
      <div
        className="flex items-center gap-3 px-4 py-4 bg-[#FFFBF7]
                      border-b border-black/[0.06]"
      >
        <div
          className="w-10 h-10 rounded-full bg-[#EB5E28] flex items-center
<<<<<<< HEAD
                     justify-center text-white font-display font-bold text-base
                     shrink-0 select-none"
=======
                        justify-center text-white font-display font-bold text-base
                        shrink-0 select-none"
>>>>>>> 7ac46ab (new file)
        >
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

<<<<<<< HEAD
// ─── Header ───────────────────────────────────────────────────────────────────

=======
>>>>>>> 7ac46ab (new file)
interface HeaderProps {
  cartCount?: number;
}

export function Header({ cartCount: propCartCount }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
<<<<<<< HEAD

  const [showGuardModal, setShowGuardModal] = useState(false);

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

  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const updateCountFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(savedCart);
        setLocalCartCount(
          cartItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
        );
      } catch {
        setLocalCartCount(0);
      }
    } else {
      setLocalCartCount(0);
    }
  };
=======
  const [showGuardModal, setShowGuardModal] = useState(false);

  const { address } = useAddress();
  const { showToast } = useToast();

  const [localCartCount, setLocalCartCount] = useState<number>(() => {
    const items = storage.get<CartItem[]>('cart', []);
    return Array.isArray(items) ? items.length : 0;
  });

  const updateCountFromStorage = useCallback(() => {
    const items = storage.get<CartItem[]>('cart', []);
    setLocalCartCount(Array.isArray(items) ? items.length : 0);
  }, []);
>>>>>>> 7ac46ab (new file)

  useEffect(() => {
    window.addEventListener('storage', updateCountFromStorage);
    window.addEventListener('cartUpdated', updateCountFromStorage);
    return () => {
      window.removeEventListener('storage', updateCountFromStorage);
      window.removeEventListener('cartUpdated', updateCountFromStorage);
    };
<<<<<<< HEAD
  }, []);
=======
  }, [updateCountFromStorage]);
>>>>>>> 7ac46ab (new file)

  const displayCartCount =
    propCartCount !== undefined ? propCartCount : localCartCount;

<<<<<<< HEAD
  useEffect(() => {
=======
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(() => {
    return storage.get<LoggedInUser | null>('user', null);
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;

>>>>>>> 7ac46ab (new file)
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
<<<<<<< HEAD
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
=======

    document.addEventListener('mousedown', handleClickOutside);
>>>>>>> 7ac46ab (new file)
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

<<<<<<< HEAD
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      showToast(`Đang tìm kiếm: <strong>${searchValue}</strong>`);
    }
  }

  function handleLogout() {
    localStorage.removeItem('user');
=======
  function handleLogout() {
    storage.remove('user');
>>>>>>> 7ac46ab (new file)
    setCurrentUser(null);
    setDropdownOpen(false);
    showToast('Đã đăng xuất thành công.');
  }

<<<<<<< HEAD
  const handleNavLinkClick = (e: React.MouseEvent, href: string) => {
=======
  function handleNavLinkClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
>>>>>>> 7ac46ab (new file)
    if (href.includes('/orders') && !currentUser) {
      e.preventDefault();
      setShowGuardModal(true);
    }
<<<<<<< HEAD
  };
=======
  }

  function handleSearchFocus(e: React.FocusEvent<HTMLInputElement>) {
    if (!address) {
      e.preventDefault();
      e.currentTarget.blur();
      showToast(
        '📍 Vui lòng <strong>nhập địa chỉ giao hàng</strong> trước khi tìm kiếm.',
      );
    }
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!address) {
      showToast(
        '📍 Vui lòng <strong>nhập địa chỉ giao hàng</strong> trước khi tìm kiếm.',
      );
      return;
    }

    const query = searchValue.trim();
    if (!query) {
      window.location.href = '/restaurants';
      return;
    }

    const params = new URLSearchParams({ q: query });
    window.location.href = `/restaurants?${params.toString()}`;
  }

  const isSearchDisabled = !address;
>>>>>>> 7ac46ab (new file)

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-b-black/10
                   bg-[#FFFBF7]/90 backdrop-blur-md"
      >
        <div className="max-w-[1200px] mx-auto px-6 h-[68px] flex items-center gap-5">
<<<<<<< HEAD
          {/* Logo */}
=======
>>>>>>> 7ac46ab (new file)
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

<<<<<<< HEAD
          {/* Search */}
=======
>>>>>>> 7ac46ab (new file)
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-sm relative hidden sm:flex items-center"
            role="search"
<<<<<<< HEAD
          >
            <SearchIcon
              size={15}
              className="absolute left-3 text-[#7A7570] pointer-events-none"
=======
            aria-label="Tìm kiếm nhà hàng"
          >
            <Search
              size={15}
              className={`absolute left-3 pointer-events-none transition-colors
                          ${isSearchDisabled ? 'text-[#B0AAA4]' : 'text-[#7A7570]'}`}
              aria-hidden="true"
>>>>>>> 7ac46ab (new file)
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
<<<<<<< HEAD
              placeholder={HEADER_SEARCH_PLACEHOLDER}
              className="w-full pl-9 pr-4 py-[9px] rounded-full border border-black/10
                         bg-[#F5F0EB] text-sm text-[#252422] placeholder:text-[#7A7570]
                         outline-none focus:border-[#EB5E28] focus:bg-white
                         focus:ring-2 focus:ring-[#EB5E28]/15 transition-all"
              aria-label="Tìm kiếm địa chỉ giao hàng"
            />
          </form>

          {/* Nav */}
=======
              onFocus={handleSearchFocus}
              placeholder={
                isSearchDisabled
                  ? 'Nhập địa chỉ trước...'
                  : HEADER_SEARCH_PLACEHOLDER
              }
              readOnly={isSearchDisabled}
              aria-disabled={isSearchDisabled}
              aria-describedby={
                isSearchDisabled ? 'search-address-hint' : undefined
              }
              className={`w-full pl-9 pr-4 py-[9px] rounded-full border text-sm
                          placeholder:text-[#7A7570] outline-none transition-all
                          ${
                            isSearchDisabled
                              ? 'bg-[#ECEAE7] border-black/[0.06] text-[#B0AAA4] cursor-not-allowed'
                              : 'bg-[#F5F0EB] border-black/10 text-[#252422] ' +
                                'focus:border-[#EB5E28] focus:bg-white ' +
                                'focus:ring-2 focus:ring-[#EB5E28]/15'
                          }`}
            />
            {isSearchDisabled && (
              <span id="search-address-hint" className="sr-only">
                Bạn cần nhập địa chỉ giao hàng trước khi tìm kiếm nhà hàng.
              </span>
            )}
            {searchValue && !isSearchDisabled && (
              <button
                type="button"
                onClick={() => setSearchValue('')}
                className="absolute right-3 text-[#7A7570] hover:text-[#252422]
                           transition-colors"
                aria-label="Xoá tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {address && (
            <div
              className="hidden lg:flex items-center gap-1.5 text-xs text-[#7A7570]
                         max-w-[160px] truncate shrink-0"
              title={address.text}
            >
              <SearchIcon
                size={11}
                className="text-[#EB5E28] shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{address.text}</span>
            </div>
          )}

>>>>>>> 7ac46ab (new file)
          <nav
            className="hidden lg:flex items-center gap-0.5 ml-auto"
            aria-label="Menu chính"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
<<<<<<< HEAD
                onClick={(e) => handleNavLinkClick(e, link.href)} // 🎯 Thêm sự kiện kiểm tra chặn tại đây
=======
                onClick={(e) => handleNavLinkClick(e, link.href)}
>>>>>>> 7ac46ab (new file)
                className="text-sm font-medium text-[#3d3a37] px-3 py-2 rounded-lg
                           hover:bg-[#F5F0EB] hover:text-[#252422] transition-colors
                           whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

<<<<<<< HEAD
          {/* Cart */}
=======
>>>>>>> 7ac46ab (new file)
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

<<<<<<< HEAD
          {/* Logged-out */}
=======
>>>>>>> 7ac46ab (new file)
          {!currentUser && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  window.location.href = '/login';
                }}
                className="hidden sm:inline-flex text-sm font-semibold text-[#252422]
                           px-3 py-2 rounded-lg hover:bg-[#F5F0EB] transition-colors"
              >
                {BTN_LOGIN_LABEL}
              </button>
              <button
                onClick={() => {
                  window.location.href = '/register';
                }}
                className="text-sm font-bold text-white bg-[#EB5E28] px-5 py-2
                           rounded-full hover:bg-[#d44e1e] active:scale-95
                           transition-all whitespace-nowrap"
              >
                {BTN_REGISTER_LABEL}
              </button>
            </div>
          )}

<<<<<<< HEAD
          {/* Logged-in */}
=======
>>>>>>> 7ac46ab (new file)
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

      <AuthGuardModal
        isOpen={showGuardModal}
        onClose={() => setShowGuardModal(false)}
        onConfirm={() => {
          window.location.href = '/login';
        }}
      />
    </>
  );
}
