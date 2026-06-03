import type { Restaurant } from '../../types';
import { StarIcon, ClockIcon } from '../common/Icons';
import {
  DELIVERY_TIME_LABEL,
  MIN_PRICE_PREFIX,
  MIN_PRICE_SUFFIX,
} from '../../constants';

interface RestaurantCardProps {
  restaurant: Restaurant;
  averageRating?: number; // computed from reviews table
  deliveryTimeMin?: number; // UI-only estimate, not in restaurants table
  deliveryTimeMax?: number;
  minPrice?: number; // computed from MIN(menu_items.price)
  onClick: (restaurant: Restaurant) => void;
}

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

// restaurants.status → badge colour
const STATUS_STYLES: Record<string, string> = {
  open: 'bg-emerald-500/90 text-white',
  closed: 'bg-red-500/90 text-white',
  suspended: 'bg-gray-400/90 text-white',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Đang mở',
  closed: 'Đóng cửa',
  suspended: 'Tạm ngưng',
};

export function RestaurantCard({
  restaurant,
  averageRating,
  deliveryTimeMin,
  deliveryTimeMax,
  minPrice,
  onClick,
}: RestaurantCardProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(restaurant);
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Nhà hàng ${restaurant.name}`}
      onClick={() => onClick(restaurant)}
      onKeyDown={handleKeyDown}
      className="bg-white rounded-2xl overflow-hidden border border-black/[0.07]
                 cursor-pointer transition-all duration-200
                 hover:shadow-[0_10px_36px_rgba(0,0,0,0.08)] hover:-translate-y-0.5
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5E28]"
    >
      {/* Thumbnail placeholder */}
      <div
        className="relative h-[150px] bg-[#F5F0EB] flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-5xl select-none">🍽️</span>

        {/* restaurants.status badge — from ERD */}
        <span
          className={`absolute top-2.5 left-2.5 text-[11px] font-bold px-2.5 py-0.5
                      rounded-full tracking-wide ${STATUS_STYLES[restaurant.status]}`}
        >
          {STATUS_LABELS[restaurant.status]}
        </span>
      </div>

      <div className="px-4 py-3.5">
        {/* restaurants.name */}
        <h3 className="font-display font-bold text-[15px] text-[#252422] mb-1">
          {restaurant.name}
        </h3>

        {/* restaurants.address */}
        <p className="text-xs text-[#7A7570] mb-2 truncate">
          {restaurant.address}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Computed from reviews.rating */}
          {averageRating !== undefined && (
            <div className="flex items-center gap-1 text-[13px] text-[#7A7570]">
              <StarIcon
                size={12}
                className="text-amber-400"
                aria-hidden="true"
              />
              <span>{averageRating.toFixed(1)}</span>
            </div>
          )}

          {/* UI-only delivery estimate */}
          {deliveryTimeMin !== undefined && deliveryTimeMax !== undefined && (
            <div className="flex items-center gap-1 text-[13px] text-[#7A7570]">
              <ClockIcon size={12} aria-hidden="true" />
              <span>
                {deliveryTimeMin}–{deliveryTimeMax} {DELIVERY_TIME_LABEL}
              </span>
            </div>
          )}
          {minPrice !== undefined && (
            <div className="text-[13px] text-[#7A7570]">
              {MIN_PRICE_PREFIX} {formatVND(minPrice)} {MIN_PRICE_SUFFIX}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
