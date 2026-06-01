import db from '../config/db';

export const paymentService = {
  createPayment: async (orderId: number, amount: number, method: string) => {
    const [result]: any = await db.execute(
      'INSERT INTO Payments (order_id, amount, method, status) VALUES (?, ?, ?, "PENDING")',
      [orderId, amount, method]
    );
    return result.insertId;
  },

  getByOrderId: async (orderId: number) => {
    const [rows]: any = await db.execute(
      'SELECT * FROM Payments WHERE order_id = ?',
      [orderId]
    );
    if (rows.length === 0) throw new Error('Không tìm thấy thông tin thanh toán!');
    return rows[0];
  },

  updateStatus: async (orderId: number, status: 'COMPLETED' | 'FAILED') => {
    const [existing]: any = await db.execute(
      'SELECT payment_id FROM Payments WHERE order_id = ?',
      [orderId]
    );
    if (existing.length === 0) throw new Error('Không tìm thấy đơn hàng này!');

    await db.execute(
      'UPDATE Payments SET status = ? WHERE order_id = ?',
      [status, orderId]
    );

    // Đồng bộ trạng thái đơn hàng
    if (status === 'COMPLETED') {
      await db.execute(
        'UPDATE Orders SET status = "PREPARING" WHERE order_id = ?',
        [orderId]
      );
    } else if (status === 'FAILED') {
      await db.execute(
        'UPDATE Orders SET status = "CANCELLED" WHERE order_id = ?',
        [orderId]
      );
    }
  },

  getAllPayments: async () => {
    const [rows]: any = await db.execute(
      `SELECT p.*, o.user_id, o.restaurant_id, o.total_price
      FROM Payments p
      JOIN Orders o ON p.order_id = o.order_id
      ORDER BY p.payment_id DESC`
    );
    return rows;
  },
};