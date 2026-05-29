import { Request, Response } from 'express';
import db from '../config/db'; 
import { calculateDistance } from '../utils/distance.util'; // Import hàm tính khoảng cách vừa tạo

export const getNearbyRestaurants = async (req: Request, res: Response): Promise<any> => {
  try {
    // Lấy tọa độ do Web gửi lên thông qua URL Query (?lat=...&lng=...)
    const userLat = Number(req.query.lat);
    const userLng = Number(req.query.lng);

    // Bắt lỗi nếu Frontend quên không truyền tọa độ
    if (!userLat || !userLng) {
      return res.status(400).json({ 
        message: "Vui lòng cung cấp tọa độ vị trí (lat, lng) để tìm kiếm nhà hàng gần nhất!" 
      });
    }

    // Truy vấn lấy toàn bộ danh sách nhà hàng hiện có trong Database
    const [restaurants]: any = await db.execute(
      'SELECT id, name, address, latitude, longitude, image_url FROM Restaurants'
    );

    // Duyệt qua từng nhà hàng và áp dụng công thức Haversine để tính khoảng cách
    const restaurantListWithDistance = restaurants.map((shop: any) => {
      const shopLat = Number(shop.latitude);
      const shopLng = Number(shop.longitude);

      let distance = 9999; // Nếu quán chưa cập nhật tọa độ, mặc định để ở rất xa

      if (shopLat && shopLng) {
        // Sử dụng file distance.util.ts để tính số km thực tế
        distance = calculateDistance(userLat, userLng, shopLat, shopLng);
      }

      return {
        ...shop,
        distance: distance // Nhét thêm trường distance vào dữ liệu trả về
      };
    });

    // Sắp xếp mảng: Quán nào có distance nhỏ hơn (gần khách hơn) sẽ đứng đầu
    restaurantListWithDistance.sort((a: any, b: any) => a.distance - b.distance);

    // Trả kết quả về cho giao diện Web hiển thị
    return res.status(200).json({
      message: "Lấy danh sách nhà hàng gần nhất thành công!",
      total: restaurantListWithDistance.length,
      data: restaurantListWithDistance
    });

  } catch (error) {
    console.error("Lỗi xử lý API lấy danh sách nhà hàng:", error);
    return res.status(500).json({ message: "Có lỗi xảy ra tại hệ thống Backend!" });
  }
};