import db from '../config/db';

export const cartService = {
  getCart: async (userId: number) => {
    const [rows]: any = await db.execute(
      `SELECT c.cart_id, c.quantity, m.item_id, m.name, m.price, m.image_url,
              (c.quantity * m.price) AS subtotal
       FROM cart c
       JOIN Menu_Items m ON c.item_id = m.item_id
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows;
  },

  addToCart: async (userId: number, itemId: number, quantity: number) => {
    const [existing]: any = await db.execute(
      'SELECT cart_id, quantity FROM cart WHERE user_id = ? AND item_id = ?',
      [userId, itemId]
    );

    if (existing.length > 0) {
      await db.execute(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?',
        [quantity, userId, itemId]
      );
    } else {
      await db.execute(
        'INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)',
        [userId, itemId, quantity]
      );
    }
  },

  updateQuantity: async (cartId: number, userId: number, quantity: number) => {
    if (quantity <= 0) {
      await db.execute(
        'DELETE FROM cart WHERE cart_id = ? AND user_id = ?',
        [cartId, userId]
      );
    } else {
      await db.execute(
        'UPDATE cart SET quantity = ? WHERE cart_id = ? AND user_id = ?',
        [quantity, cartId, userId]
      );
    }
  },

  removeItem: async (cartId: number, userId: number) => {
    await db.execute(
      'DELETE FROM cart WHERE cart_id = ? AND user_id = ?',
      [cartId, userId]
    );
  },

  clearCart: async (userId: number) => {
    await db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
  },
};