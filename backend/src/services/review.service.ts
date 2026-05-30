import db from '../config/db';

export const reviewService = {
  getByRestaurant: async (restaurantId: number) => {
    const [rows]: any = await db.execute(
      `SELECT r.review_id, r.rating, r.comment, r.created_at, u.name AS user_name
       FROM Reviews r
       JOIN Users u ON r.user_id = u.user_id
       WHERE r.restaurant_id = ?
       ORDER BY r.created_at DESC`,
      [restaurantId]
    );
    return rows;
  },

  create: async (userId: number, restaurantId: number, rating: number, comment: string) => {
    if (rating < 1 || rating > 5) throw new Error('Rating phải từ 1 đến 5!');

    const [existing]: any = await db.execute(
      'SELECT review_id FROM Reviews WHERE user_id = ? AND restaurant_id = ?',
      [userId, restaurantId]
    );
    if (existing.length > 0) throw new Error('Bạn đã đánh giá nhà hàng này rồi!');

    const [result]: any = await db.execute(
      'INSERT INTO Reviews (user_id, restaurant_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, restaurantId, rating, comment]
    );
    return result.insertId;
  },

  delete: async (reviewId: number, userId: number) => {
    const [existing]: any = await db.execute(
      'SELECT review_id FROM Reviews WHERE review_id = ? AND user_id = ?',
      [reviewId, userId]
    );
    if (existing.length === 0) throw new Error('Không tìm thấy đánh giá này!');

    await db.execute(
      'DELETE FROM Reviews WHERE review_id = ? AND user_id = ?',
      [reviewId, userId]
    );
  },
};