import type { Restaurant } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { RestaurantCard } from './RestaurantCard';
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    restaurant_id: 1,
    name: 'Phở 10 Lý Quốc Sư',
    address: '10 Lý Quốc Sư, Hàng Trống, Hoàn Kiếm, Hà Nội',
    cuisine: ['pho'],
    status: 'open',
    rating: 4.8,
    reviewCount: 1250,
    deliveryTimeMin: 15,
    deliveryTimeMax: 25,
    deliveryFee: 15000,
    image_url:
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isFastDelivery: true,
  },
  {
    restaurant_id: 2,
    name: 'Chả Cá Thăng Long',
    address: '6B Đường Thành, Cửa Đông, Hoàn Kiếm, Hà Nội',
    cuisine: ['chaca'],
    status: 'open',
    rating: 4.7,
    reviewCount: 840,
    deliveryTimeMin: 20,
    deliveryTimeMax: 30,
    deliveryFee: 20000,
    image_url:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isFastDelivery: false,
  },
  {
    restaurant_id: 3,
    name: 'Bò Tơ Quán Mộc',
    address: '102 Thái Thịnh, Ngã Tư Sở, Đống Đa, Hà Nội',
    cuisine: ['boto'],
    status: 'open',
    rating: 4.6,
    reviewCount: 912,
    deliveryTimeMin: 25,
    deliveryTimeMax: 35,
    deliveryFee: 0,
    image_url:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isFastDelivery: false,
  },
  {
    restaurant_id: 4,
    name: 'Bún Chả Hương Liên (Bun Cha Obama)',
    address: '24 Lê Văn Hưu, Phan Chu Trinh, Hai Bà Trưng, Hà Nội',
    cuisine: ['pho'],
    status: 'open',
    rating: 4.7,
    reviewCount: 1850,
    deliveryTimeMin: 15,
    deliveryTimeMax: 25,
    deliveryFee: 18000,
    image_url:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    isFastDelivery: true,
  },
];
export function RestaurantGrid() {
  function handleRestaurantClick(restaurant: Restaurant) {
    if (restaurant.status !== 'closed') {
      window.open(`/menu?id=${restaurant.restaurant_id}`, '_self');
    }
  }

  function handleViewAll() {
    window.open('/restaurants', '_self');
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
            <div
              key={restaurant.restaurant_id}
              className={
                restaurant.status === 'closed'
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }
            >
              <RestaurantCard
                restaurant={restaurant}
                averageRating={restaurant.restaurant_id === 1 ? 4.8 : 4.7}
                deliveryTimeMin={restaurant.restaurant_id === 1 ? 15 : 20}
                deliveryTimeMax={restaurant.restaurant_id === 1 ? 25 : 35}
                minPrice={restaurant.restaurant_id === 1 ? 60000 : 65000}
                onClick={() => handleRestaurantClick(restaurant)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
