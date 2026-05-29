import db from '../config/db';

export const voucherService = {
  validateVoucher: async (code: string, orderAmount: number) => {
    // Truy vấn database để tìm voucher theo code
    const [rows]: any = await db.execute('SELECT * FROM Vouchers WHERE code = ?', [code]);
    
    if (rows.length === 0) {
      throw new Error('Mã giảm giá không tồn tại!');
    }

    const voucher = rows[0];

    // Kiểm tra ngày hết hạn
    const now = new Date();
    if (new Date(voucher.expiry_date) < now) {
      throw new Error('Mã giảm giá này đã hết hạn sử dụng!');
    }

    // Kiểm tra số lượt đã sử dụng
    if (voucher.used_count >= voucher.max_uses) {
      throw new Error('Mã giảm giá đã hết lượt sử dụng!');
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (orderAmount < Number(voucher.min_order_amount)) {
      throw new Error(`Đơn hàng chưa đạt giá trị tối thiểu ${Number(voucher.min_order_amount).toLocaleString()}đ để áp dụng mã này!`);
    }

    return voucher;
  },

  createVoucher: async (voucherData: {
        code: string,
        discount_percent: number,
        max_discount_amount: number,
        min_order_amount: number,
        expiry_date: string,
        max_uses?: number
    }) => {
        // Kiểm tra xem code đã tồn tại trong DB chưa (vì cột code là UNIQUE)
        const [existing]: any = await db.execute('SELECT voucher_id FROM Vouchers WHERE code = ?', [voucherData.code]);
        if (existing.length > 0) {
            throw new Error("Mã giảm giá này đã tồn tại trên hệ thống!");
        }

        const maxUses = voucherData.max_uses !== undefined ? voucherData.max_uses : 100;

        const [result]: any = await db.execute(
            `INSERT INTO Vouchers (code, discount_percent, max_discount_amount, min_order_amount, expiry_date, max_uses, used_count) 
             VALUES (?, ?, ?, ?, ?, ?, 0)`,
            [
                voucherData.code.toUpperCase().trim(),
                voucherData.discount_percent,
                voucherData.max_discount_amount,
                voucherData.min_order_amount,
                voucherData.expiry_date,
                maxUses
            ]
        );

        return { voucher_id: result.insertId, ...voucherData };
    },

    // 2. TÍNH NĂNG XÓA VOUCHER (DÀNH CHO ADMIN)
    deleteVoucher: async (voucherId: number) => {
        // Kiểm tra xem voucher có tồn tại không trước khi xóa
        const [existing]: any = await db.execute('SELECT voucher_id FROM Vouchers WHERE voucher_id = ?', [voucherId]);
        if (existing.length === 0) {
            throw new Error("Không tìm thấy mã giảm giá để xóa!");
        }

        // Thực hiện xóa (Vì bảng Orders dùng ON DELETE SET NULL nên xóa voucher thoải mái không sợ gãy đơn cũ)
        await db.execute('DELETE FROM Vouchers WHERE voucher_id = ?', [voucherId]);
        return true;
    }
};