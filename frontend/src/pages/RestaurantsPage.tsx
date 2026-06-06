import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Star,
  Bike,
  SlidersHorizontal,
  X,
  ChevronRight,
} from 'lucide-react';
import { MOCK_RESTAURANTS } from '../data/mockData';
import type { RestaurantListing } from '../types';

type CuisineTab = {
  id: string;
  label: string;
  emoji: string;
};

type QuickFilter = 'open_now' | 'top_rated' | 'fast_delivery';

const CUISINE_TABS: CuisineTab[] = [
  { id: 'all', label: 'Tất cả', emoji: '🍽️' },
  { id: 'pho', label: 'Phở & Bún', emoji: '🍜' },
  { id: 'chaca', label: 'Chả cá', emoji: '🐟' },
  { id: 'boto', label: 'Bò tơ', emoji: '🥩' },
  { id: 'pizza', label: 'Pizza & Âu', emoji: '🍕' },
  { id: 'drinks', label: 'Cà phê & Trà', emoji: '🧋' },
];

const QUICK_FILTERS: { id: QuickFilter; label: string }[] = [
  { id: 'open_now', label: '🟢 Đang mở cửa' },
  { id: 'top_rated', label: '⭐ 4.5 trở lên' },
  { id: 'fast_delivery', label: '⚡ Giao nhanh' },
];

function formatFee(fee: number): string {
  return fee === 0 ? 'Miễn phí' : `${fee.toLocaleString('vi-VN')} đ`;
}

function getParam(key: string): string | null {
  const value = new URLSearchParams(window.location.search).get(key);
  return value && value.trim() !== '' ? value.trim() : null;
}

interface RestaurantCardProps {
  restaurant: RestaurantListing;
}

function RestaurantCard({ restaurant: r }: RestaurantCardProps) {
  const isClosed = r.status === 'closed' || r.status === 'suspended';

  function handleClick() {
    if (!isClosed) {
      window.location.href = `/menu?id=${r.restaurant_id}`;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <article
      role="button"
      tabIndex={isClosed ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${r.name} – ${isClosed ? 'Đóng cửa' : 'Đang mở'}`}
      aria-disabled={isClosed}
      className={`group bg-white rounded-2xl overflow-hidden border border-black/[0.07]
                  shadow-sm transition-all duration-200
                  ${
                    isClosed
                      ? 'opacity-60 cursor-not-allowed'
                      : 'cursor-pointer hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5E28]'
                  }`}
    >
      <div className="relative h-44 overflow-hidden bg-[#F5F0EB]">
        {r.image_url ? (
          <img
            src={r.image_url}
            alt={`Ảnh nhà hàng ${r.name}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300
                       group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🍽️
          </div>
        )}

        {isClosed && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span
              className="bg-black/70 text-white text-xs font-bold px-3 py-1.5
                             rounded-full uppercase tracking-widest"
            >
              Đóng cửa
            </span>
          </div>
        )}

        {!isClosed && (
          <span
            className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px]
                           font-bold px-2.5 py-1 rounded-full shadow-md"
          >
            ● Đang mở
          </span>
        )}

        {r.isPopular && (
          <span
            className="absolute top-3 right-3 bg-[#EB5E28] text-white text-[11px]
                           font-bold px-2.5 py-1 rounded-full shadow-md"
          >
            🔥 Phổ biến
          </span>
        )}

        {r.deliveryFee === 0 && !isClosed && (
          <span
            className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm
                           text-emerald-600 text-[11px] font-bold px-2.5 py-1
                           rounded-full shadow"
          >
            🎁 Miễn phí vận chuyển
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          {/* restaurants.name */}
          <h3
            className="font-display font-bold text-[#252422] text-base leading-tight
                         group-hover:text-[#EB5E28] transition-colors line-clamp-1"
          >
            {r.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star
              size={13}
              className="text-amber-400 fill-amber-400"
              aria-hidden="true"
            />
            <span className="text-sm font-bold text-[#252422]">
              {r.rating.toFixed(1)}
            </span>
            <span className="text-xs text-[#7A7570]">
              ({r.reviewCount.toLocaleString('vi-VN')})
            </span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 mb-3">
          <MapPin
            size={12}
            className="text-[#7A7570] mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <p className="text-xs text-[#7A7570] line-clamp-1">{r.address}</p>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-black/[0.06]">
          <div className="flex items-center gap-1 text-xs text-[#7A7570]">
            <Clock size={12} aria-hidden="true" />
            <span>
              {r.deliveryTimeMin}–{r.deliveryTimeMax} phút
            </span>
          </div>

          <span className="w-px h-3 bg-black/10" aria-hidden="true" />

          <div className="flex items-center gap-1 text-xs text-[#7A7570]">
            <Bike size={12} aria-hidden="true" />
            <span
              className={
                r.deliveryFee === 0 ? 'text-emerald-600 font-semibold' : ''
              }
            >
              {formatFee(r.deliveryFee)}
            </span>
          </div>

          {r.isFastDelivery && (
            <>
              <span className="w-px h-3 bg-black/10" aria-hidden="true" />
              <span className="text-[11px] font-bold text-[#EB5E28]">
                ⚡ Nhanh
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function RestaurantsPage() {
  const filterParam = getParam('filter');
  const initialQuery = getParam('q') ?? '';
  const isPopularView = filterParam === 'popular';

  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [activeCuisine, setActiveCuisine] = useState<string>('all');
  const [quickFilters, setQuickFilters] = useState<Set<QuickFilter>>(
    () => new Set(isPopularView ? (['top_rated'] as QuickFilter[]) : []),
  );

  const pageTitle = isPopularView
    ? 'Nhà hàng phổ biến HN'
    : 'Tất cả nhà hàng Hà Nội';

  const pageSubtitle = isPopularView
    ? 'Những tọa độ ẩm thực Thủ đô được săn đón nhất trên ZestyDash'
    : 'Khám phá hàng trăm quán ăn chuẩn vị Hà Thành quanh bạn';

  function toggleQuickFilter(id: QuickFilter) {
    setQuickFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const activeFilterCount =
    quickFilters.size + (activeCuisine !== 'all' ? 1 : 0);

  const filteredRestaurants = useMemo<RestaurantListing[]>(() => {
    let list: RestaurantListing[] = MOCK_RESTAURANTS as RestaurantListing[];
    if (isPopularView) {
      list = list.filter((r) => r.isPopular);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.address?.toLowerCase().includes(q) ||
          r.cuisine?.some((c) => c.toLowerCase().includes(q)),
      );
    }

    if (activeCuisine !== 'all') {
      list = list.filter((r) => r.cuisine?.includes(activeCuisine));
    }

    if (quickFilters.has('open_now')) {
      list = list.filter((r) => r.status === 'open');
    }

    if (quickFilters.has('top_rated')) {
      list = list.filter((r) => r.rating >= 4.5);
    }

    if (quickFilters.has('fast_delivery')) {
      list = list.filter((r) => r.isFastDelivery === true);
    }

    return list;
  }, [searchQuery, activeCuisine, quickFilters, isPopularView]);

  function handleReset() {
    setSearchQuery('');
    setActiveCuisine('all');
    setQuickFilters(new Set());
    window.history.replaceState(
      {},
      '',
      isPopularView ? '/restaurants?filter=popular' : '/restaurants',
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <div className="bg-[#252422] px-6 pt-10 pb-12 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-64 h-64
                     rounded-full bg-[#EB5E28]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48
                     rounded-full bg-[#EB5E28]/08 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <nav
            className="flex items-center gap-1.5 text-xs text-white/40 mb-4"
            aria-label="Breadcrumb"
          >
            <a href="/" className="hover:text-white/70 transition-colors">
              Trang chủ
            </a>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-white/70">{pageTitle}</span>
          </nav>

          <h1
            className="font-display font-extrabold text-white text-3xl sm:text-4xl
                       tracking-tight mb-2"
          >
            {pageTitle}
          </h1>
          <p className="text-white/50 text-sm mb-8">{pageSubtitle}</p>

          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7570]
                         pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm phở, chả cá, bò tơ, cafe trứng..."
              aria-label="Tìm kiếm nhà hàng trên trang này"
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white text-sm
                         text-[#252422] placeholder:text-[#7A7570] outline-none
                         focus:ring-2 focus:ring-[#EB5E28]/30 transition-all shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7570]
                           hover:text-[#252422] transition-colors"
                aria-label="Xoá tìm kiếm"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {initialQuery && searchQuery === initialQuery && (
            <p className="mt-3 text-xs text-white/45">
              Kết quả tìm kiếm từ Header cho:{' '}
              <span className="text-white/70 font-semibold">
                "{initialQuery}"
              </span>
            </p>
          )}
        </div>
      </div>

      <div
        className="sticky top-0 z-20 bg-[#FFFBF7]/95 backdrop-blur-md
                   border-b border-black/[0.06] shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4">
          <div
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide
                       py-3 -mx-1 px-1"
            role="tablist"
            aria-label="Lọc theo loại ẩm thực"
          >
            {CUISINE_TABS.map((tab) => {
              const isActive = activeCuisine === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCuisine(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
                              font-semibold whitespace-nowrap shrink-0 transition-all border
                              ${
                                isActive
                                  ? 'bg-[#EB5E28] text-white border-[#EB5E28] shadow-md'
                                  : 'bg-white text-[#252422] border-black/10 hover:border-[#EB5E28]/40 hover:bg-orange-50'
                              }`}
                >
                  <span aria-hidden="true">{tab.emoji}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 pb-3 flex-wrap">
            {QUICK_FILTERS.map((qf) => {
              const isActive = quickFilters.has(qf.id);
              return (
                <button
                  key={qf.id}
                  onClick={() => toggleQuickFilter(qf.id)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                              text-xs font-bold border transition-all
                              ${
                                isActive
                                  ? 'bg-[#252422] text-white border-[#252422]'
                                  : 'bg-white text-[#252422] border-black/10 hover:border-[#252422]/30'
                              }`}
                >
                  {qf.label}
                  {isActive && (
                    <X size={11} className="ml-0.5" aria-hidden="true" />
                  )}
                </button>
              );
            })}

            {activeFilterCount > 0 && (
              <button
                onClick={handleReset}
                className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                           text-xs font-bold text-[#EB5E28] border border-[#EB5E28]/30
                           bg-white hover:bg-orange-50 transition-all"
                aria-label={`Xoá ${activeFilterCount} bộ lọc đang hoạt động`}
              >
                <SlidersHorizontal size={12} aria-hidden="true" />
                Xoá bộ lọc ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[#7A7570]">
            Hiển thị{' '}
            <span className="font-bold text-[#252422]">
              {filteredRestaurants.length}
            </span>{' '}
            nhà hàng
            {searchQuery.trim() !== '' && (
              <>
                {' '}
                cho{' '}
                <span className="font-bold text-[#252422]">
                  "{searchQuery}"
                </span>
              </>
            )}
          </p>
          {isPopularView && (
            <a
              href="/restaurants"
              className="flex items-center gap-1 text-xs font-semibold text-[#EB5E28]
                         hover:underline"
            >
              Xem tất cả nhà hàng
              <ChevronRight size={13} aria-hidden="true" />
            </a>
          )}
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.restaurant_id}
                restaurant={restaurant}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4" aria-hidden="true">
              🍽️
            </div>
            <h3 className="font-display font-bold text-xl text-[#252422] mb-2">
              Không tìm thấy nhà hàng
            </h3>
            <p className="text-sm text-[#7A7570] max-w-xs mb-6">
              Thử thay đổi từ khoá tìm kiếm hoặc xoá bộ lọc để xem thêm kết quả.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-full bg-[#EB5E28] text-white font-bold
                         text-sm hover:bg-[#d44e1e] active:scale-95 transition-all"
            >
              Xoá tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
