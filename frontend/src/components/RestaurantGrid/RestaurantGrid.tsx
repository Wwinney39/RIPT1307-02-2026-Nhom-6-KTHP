import type { Restaurant } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { RestaurantCard } from './RestaurantCard';
import useToast from '../../hooks/useToast';

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    restaurant_id: 1,
    name: 'Pizza Saigon',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    latitude: 10.7769,
    longitude: 106.7009,
    status: 'open',
  },
  {
    restaurant_id: 2,
    name: 'Burger House',
    address: '45 Lê Lợi, Q.1, TP.HCM',
    latitude: 10.7745,
    longitude: 106.6983,
    status: 'open',
  },
  {
    restaurant_id: 3,
    name: 'Tokyo Sushi Bar',
    address: '88 Hai Bà Trưng, Q.3, TP.HCM',
    latitude: 10.7831,
    longitude: 106.6942,
    status: 'open',
  },
  {
    restaurant_id: 4,
    name: 'Phở 24',
    address: '200 Nguyễn Trãi, Q.5, TP.HCM',
    latitude: 10.7527,
    longitude: 106.6665,
    status: 'closed',
  },
];

export function RestaurantGrid() {
  const { showToast } = useToast();

  function handleRestaurantClick(restaurant: Restaurant) {
    showToast(`Đang mở nhà hàng: <strong>${restaurant.name}</strong>`);
  }

  function handleViewAll() {
    showToast('Đang xem <strong>tất cả nhà hàng</strong>...');
  }

  return (
    <section className="bg-[#F5F0EB] py-14 px-6" aria-label="Nhà hàng nổi bật">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          title="Nhà hàng phổ biến"
          viewAllLabel="Xem tất cả"
          onViewAll={handleViewAll}
        />
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          }}
        >
          {MOCK_RESTAURANTS.map((restaurant) => (
            <RestaurantCard
              key={restaurant.restaurant_id}
              restaurant={restaurant}
              averageRating={4.8}
              deliveryTimeMin={20}
              deliveryTimeMax={35}
              minPrice={65000}
              onClick={handleRestaurantClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
