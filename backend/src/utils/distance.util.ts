/**
 * Tính khoảng cách giữa 2 tọa độ (Kinh/Vĩ độ) theo đơn vị Kilomet (km)
 * Để giải quyết bài toán tìm kiếm và sắp xếp các nhà hàng theo khoảng cách từ gần đến xa đối với vị trí hiện tại của khách hàng trên giao diện Website
 * Sử dụng công thức Haversine
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Bán kính Trái Đất tính bằng km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; 

  return Math.round(distance * 100) / 100; // Làm tròn lấy 2 chữ số thập phân (Ví dụ: 2.35 km)
};