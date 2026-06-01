import { Request, Response } from 'express';
import db from '../config/db';

export const getMenuByRestaurant = async (req: Request, res: Response): Promise<any> => {
  try {
    // Lấy ID của nhà hàng từ URL Params
    // Ví dụ: /api/menu/restaurant/5 -> restaurantId = 5
    const restaurantId = Number(req.params.restaurantId);
    
    // Lấy bộ lọc danh mục (category) từ Query String nếu có 
    // Ví dụ: ?category=Cơm -> category = "Cơm"
    const category = req.query.category as string;

    if (!restaurantId) {
      return res.status(400).json({ message: "Không tìm thấy ID của nhà hàng!" });
    }

    // Mặc định lấy tất cả món ăn thuộc về nhà hàng này và nhà hàng phải đang hoạt động và những món ăn còn bán
    let sql = 'SELECT * FROM Menu_Items WHERE restaurant_id = ? AND is_available = 1' ;
    const queryParams: any[] = [restaurantId];

    // Nếu khách hàng có bấm chọn lọc theo danh mục (Cơm, Trà sữa...) 
    if (category) {
      sql += ' AND category = ?';
      queryParams.push(category);
    }

    // Chạy lệnh truy vấn xuống MySQL
    const [menuItems]: any = await db.execute(sql, queryParams);

    // Trả kết quả về cho Frontend hiển thị lên Web
    return res.status(200).json({
      message: "Lấy danh sách menu món ăn thành công!",
      restaurant_id: restaurantId,
      category_filter: category || "Tất cả",
      total: menuItems.length,
      data: menuItems
    });

  } catch (error) {
    console.error("Lỗi lấy danh sách menu:", error);
    return res.status(500).json({ message: "Có lỗi xảy ra tại hệ thống Backend!" });
  }
};

// API thêm món ăn mới vào menu của nhà hàng (Dành cho Merchant/Admin)
export const createMenuItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const restaurantId = Number(req.params.restaurantId);
        const { name, price } = req.body;

        if (!restaurantId || !name || !price) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin món ăn!" });
        }

        
        const [result] = await db.execute(
            'INSERT INTO Menu_items (restaurant_id, name, price, is_available) VALUES (?, ?, ?, 1)',
            [restaurantId, name, price]
        );

        return res.status(201).json({
            message: "Thêm món ăn mới thành công!",
            data: { restaurant_id: restaurantId, name, price }
        });

    } catch (error) {
        console.error("Lỗi khi thêm món ăn:", error);
        return res.status(500).json({ message: "Có lỗi xảy ra tại hệ thống Backend!" });
    }
};


// API cập nhật thông tin món ăn (Dành cho Merchant/Admin)
export const updateMenuItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, price, is_available } = req.body;
    const [existing]: any = await db.execute(
      'SELECT item_id FROM Menu_Items WHERE item_id = ?', Number(id)
    );
    if (existing.length === 0) return res.status(404).json({ message: 'Không tìm thấy món ăn!' });
    
    await db.execute(
      'UPDATE Menu_Items SET name = ?, price = ?, is_available = ? WHERE item_id = ?',
      [name, price, is_available, id]
    );
    return res.status(200).json({ message: 'Cập nhật món ăn thành công!' });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const [existing]: any = await db.execute(
      'SELECT item_id FROM Menu_Items WHERE item_id = ?', Number(id)
    );
    if (existing.length === 0) return res.status(404).json({ message: 'Không tìm thấy món ăn!' });
    await db.execute('DELETE FROM Menu_Items WHERE item_id = ?', Number(id));
    return res.status(200).json({ message: 'Xóa món ăn thành công!' });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const getAllMenuItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const [rows]: any = await db.execute(
      `SELECT m.*, r.name AS restaurant_name 
       FROM Menu_Items m
       JOIN Restaurants r ON m.restaurant_id = r.restaurant_id`
    );
    return res.status(200).json({ data: rows });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};