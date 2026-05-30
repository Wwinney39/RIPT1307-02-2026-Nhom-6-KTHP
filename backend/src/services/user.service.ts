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
};