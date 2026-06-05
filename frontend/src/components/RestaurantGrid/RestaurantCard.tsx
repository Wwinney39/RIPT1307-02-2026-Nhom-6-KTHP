import type { Restaurant } from '../../types';
import { StarIcon, ClockIcon } from '../common/Icons';
import {
  DELIVERY_TIME_LABEL,
  MIN_PRICE_PREFIX,
  MIN_PRICE_SUFFIX,
} from '../../constants';

interface RestaurantCardProps {
  restaurant: Restaurant & {
    image_url?: string;
    imageUrl?: string;
    image?: string;
  };
  averageRating?: number;
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  minPrice?: number;
  onClick: (restaurant: Restaurant) => void;
}

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

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

  const displayImage =
    restaurant.image_url || restaurant.imageUrl || restaurant.image;

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
      <div
        className="relative h-[150px] bg-[#F5F0EB] flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="text-5xl select-none">🍽️</span>
        )}

        {restaurant.status === 'closed' && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        )}

        <span
          className={`absolute top-2.5 left-2.5 text-[11px] font-bold px-2.5 py-0.5
                      rounded-full tracking-wide shadow-sm ${STATUS_STYLES[restaurant.status]}`}
        >
          {STATUS_LABELS[restaurant.status]}
        </span>
      </div>

      <div className="px-4 py-3.5">
        <h3 className="font-display font-bold text-[15px] text-[#252422] mb-1 group-hover:text-[#EB5E28] transition-colors">
          {restaurant.name}
        </h3>

        <p className="text-xs text-[#7A7570] mb-2 truncate">
          {restaurant.address}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {averageRating !== undefined && (
            <div className="flex items-center gap-1 text-[13px] text-[#7A7570]">
              <StarIcon
                size={12}
                className="text-amber-400 fill-amber-400"
                aria-hidden="true"
              />
              <span className="font-bold text-[#252422]">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}

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
              {MIN_PRICE_PREFIX}{' '}
              <span className="font-semibold text-[#252422]">
                {formatVND(minPrice)}
              </span>{' '}
              {MIN_PRICE_SUFFIX}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
