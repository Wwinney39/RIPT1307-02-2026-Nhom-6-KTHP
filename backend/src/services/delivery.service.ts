import db from '../config/db';

const VALID_STATUSES = ['Đang chuẩn bị', 'Đang giao', 'Đã giao', 'Đã hủy'];

export const deliveryService = {
  getLogs: async (orderId: number) => {
    const [rows]: any = await db.execute(
      'SELECT * FROM delivery_Logs WHERE order_id = ? ORDER BY updated_at ASC',
      [orderId]
    );
    return rows;
  },

  updateStatus: async (orderId: number, status: string) => {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error('Trạng thái không hợp lệ!');
    }

    const [existing]: any = await db.execute(
      'SELECT order_id FROM Orders WHERE order_id = ?',
      [orderId]
    );
    if (existing.length === 0) throw new Error('Không tìm thấy đơn hàng này!');

    await db.execute(
      'INSERT INTO delivery_Logs (order_id, status) VALUES (?, ?)',
      [orderId, status]
    );

    // Đồng bộ sang bảng Orders
    const orderStatusMap: { [key: string]: string } = {
    'Đang chuẩn bị': 'PREPARING',
    'Đang giao': 'SHIPPING',
    'Đã giao': 'DONE',
    'Đã hủy': 'CANCELLED',
    };

    const mappedStatus = orderStatusMap[status] as string;
    await db.execute(
      'UPDATE Orders SET status = ? WHERE order_id = ?',
      [mappedStatus, orderId]
    );
  },
};