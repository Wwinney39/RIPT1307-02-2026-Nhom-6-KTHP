import { Request, Response } from 'express';
import db from '../config/db'; 
import { calculateDistance } from '../utils/distance.util'; // Import hàm tính khoảng cách vừa tạo


// Lấy tất cả nhà hàng (không lọc khoảng cách)
export const getAllRestaurants = async (req: Request, res: Response): Promise<any> => {
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM Restaurants WHERE status = 'OPEN'"
    );
    return res.status(200).json({ data: rows });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Lấy chi tiết 1 nhà hàng
export const getRestaurantById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const [rows]: any = await db.execute(
      'SELECT * FROM Restaurants WHERE restaurant_id = ?', [Number(id)]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy nhà hàng!' });
    return res.status(200).json({ data: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

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
      'SELECT * FROM Restaurants'
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

export const createRestaurant = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address) return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    const [result]: any = await db.execute(
      'INSERT INTO Restaurants (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    return res.status(201).json({ message: 'Tạo nhà hàng thành công!', restaurant_id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const updateRestaurant = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude, status } = req.body;
    const [existing]: any = await db.execute(
      'SELECT restaurant_id FROM Restaurants WHERE restaurant_id = ?', [Number(id)]
    );
    if (existing.length === 0) return res.status(404).json({ message: 'Không tìm thấy nhà hàng!' });

    await db.execute(
      'UPDATE Restaurants SET name = ?, address = ?, latitude = ?, longitude = ?, status = ? WHERE restaurant_id = ?',
      [name, address, latitude, longitude, status, id]
    );
    return res.status(200).json({ message: 'Cập nhật nhà hàng thành công!' });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const deleteRestaurant = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const [existing]: any = await db.execute(
      'SELECT restaurant_id FROM Restaurants WHERE restaurant_id = ?', [Number(id)]
    );
    if (existing.length === 0) return res.status(404).json({ message: 'Không tìm thấy nhà hàng!' });
    await db.execute('DELETE FROM Restaurants WHERE restaurant_id = ?', [Number(id)]);
    return res.status(200).json({ message: 'Xóa nhà hàng thành công!' });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};
