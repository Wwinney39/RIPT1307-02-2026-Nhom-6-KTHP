import db from '../config/db';

export const userService = {
  getProfile: async (userId: number) => {
    const [rows]: any = await db.execute(
      'SELECT user_id, name, phone, email, role, created_at FROM Users WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) throw new Error('Không tìm thấy người dùng!');
    return rows[0];
  },

  updateProfile: async (userId: number, name: string, email: string) => {
    await db.execute(
      'UPDATE Users SET name = ?, email = ? WHERE user_id = ?',
      [name, email, userId]
    );
  },

  getAddresses: async (userId: number) => {
    const [rows]: any = await db.execute(
      'SELECT * FROM User_Addresses WHERE user_id = ? ORDER BY is_default DESC',
      [userId]
    );
    return rows;
  },

  addAddress: async (userId: number, addressText: string, isDefault: boolean) => {
    if (isDefault) {
      await db.execute(
        'UPDATE User_Addresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      );
    }
    const [result]: any = await db.execute(
      'INSERT INTO User_Addresses (user_id, address_text, is_default) VALUES (?, ?, ?)',
      [userId, addressText, isDefault]
    );
    return result.insertId;
  },

  deleteAddress: async (addressId: number, userId: number) => {
    const [existing]: any = await db.execute(
      'SELECT address_id FROM User_Addresses WHERE address_id = ? AND user_id = ?',
      [addressId, userId]
    );
    if (existing.length === 0) throw new Error('Không tìm thấy địa chỉ này!');
    await db.execute(
      'DELETE FROM User_Addresses WHERE address_id = ? AND user_id = ?',
      [addressId, userId]
    );
  },

  setDefaultAddress: async (addressId: number, userId: number) => {
    const [existing]: any = await db.execute(
      'SELECT address_id FROM User_Addresses WHERE address_id = ? AND user_id = ?',
      [addressId, userId]
    );
    if (existing.length === 0) throw new Error('Không tìm thấy địa chỉ này!');

    await db.execute(
      'UPDATE User_Addresses SET is_default = FALSE WHERE user_id = ?',
      [userId]
    );
    await db.execute(
      'UPDATE User_Addresses SET is_default = TRUE WHERE address_id = ? AND user_id = ?',
      [addressId, userId]
    );
  },

  updateUser: async (userId: number, name: string, email: string, role: string) => {
    const [existing]: any = await db.execute(
      'SELECT user_id FROM Users WHERE user_id = ?', [userId]
    );
    if (existing.length === 0) throw new Error('Không tìm thấy người dùng!');
    await db.execute(
      'UPDATE Users SET name = ?, email = ?, role = ? WHERE user_id = ?',
      [name, email, role, userId]
    );
  },

  deleteUser: async (userId: number) => {
    const [existing]: any = await db.execute(
      'SELECT user_id FROM Users WHERE user_id = ?', [userId]
    );
    if (existing.length === 0) throw new Error('Không tìm thấy người dùng!');
    await db.execute('DELETE FROM Users WHERE user_id = ?', [userId]);
  },

  getAllUsers: async () => {
    const [rows]: any = await db.execute(
      'SELECT user_id, name, phone, email, role, created_at FROM Users'
    );
    return rows;
  },


// Controller xử lý lấy thông tin dashboard tổng quan cho admin
  getDashboard: async () => {
  const [summary]: any = await db.execute(`
    SELECT
      (SELECT COUNT(*) FROM Users WHERE role = 'customer') AS total_customers,
      (SELECT COUNT(*) FROM Orders) AS total_orders,
      (SELECT COUNT(*) FROM Restaurants) AS total_restaurants,
      (SELECT COALESCE(SUM(amount), 0) FROM Payments WHERE status = 'COMPLETED') AS total_revenue
  `);

  const [revenueByDay]: any = await db.execute(`
    SELECT 
      DATE(o.created_at) AS date,
      COUNT(o.order_id) AS total_orders,
      SUM(p.amount) AS revenue
    FROM Orders o
    JOIN Payments p ON o.order_id = p.order_id
    WHERE p.status = 'COMPLETED'
      AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(o.created_at)
    ORDER BY date DESC
  `);

  const [topItems]: any = await db.execute(`
    SELECT 
      m.name AS item_name,
      r.name AS restaurant_name,
      SUM(od.quantity) AS total_sold,
      SUM(od.quantity * m.price) AS total_revenue
    FROM Order_Details od
    JOIN Menu_Items m ON od.item_id = m.item_id
    JOIN Orders o ON od.order_id = o.order_id
    JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
    WHERE o.status = 'DONE'
    GROUP BY m.item_id, m.name, r.name
    ORDER BY total_sold DESC
    LIMIT 10
  `);

  const [topRestaurants]: any = await db.execute(`
    SELECT 
      r.name AS restaurant_name,
      COUNT(o.order_id) AS total_orders,
      SUM(p.amount) AS total_revenue
    FROM Restaurants r
    JOIN Orders o ON r.restaurant_id = o.restaurant_id
    JOIN Payments p ON o.order_id = p.order_id
    WHERE p.status = 'COMPLETED'
    GROUP BY r.restaurant_id, r.name
    ORDER BY total_revenue DESC
    LIMIT 5
  `);

  return { summary: summary[0], revenue_by_day: revenueByDay, top_items: topItems, top_restaurants: topRestaurants };
},
};

