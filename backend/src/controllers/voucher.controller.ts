import { Request, Response } from 'express';
import { voucherService } from '../services/voucher.service';

export const checkVoucher = async (req: Request, res: Response): Promise<any> => {
  try {
    const { code, orderAmount } = req.body;

    // Kiểm tra xem khách hàng đã nhập đầy đủ thông tin cần thiết chưa
    if (!code || orderAmount === undefined) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mã voucher và tổng tiền đơn hàng!' });
    }

    // Gọi Service để kiểm tra tính hợp lệ của voucher và lấy thông tin chi tiết
    const voucher = await voucherService.validateVoucher(code, Number(orderAmount));

    // Tính toán số tiền được giảm dựa trên % giảm giá
    let discountAmount = (Number(orderAmount) * voucher.discount_percent) / 100;
    
    // Nếu số tiền giảm vượt quá mức giảm tối đa cho phép (max_discount_amount)
    if (discountAmount > Number(voucher.max_discount_amount)) {
      discountAmount = Number(voucher.max_discount_amount);
    }

    // Trả về kết quả tính toán thành công
    return res.status(200).json({
      success: true,
      message: 'Áp dụng mã giảm giá thành công!',
      data: {
        voucher_id: voucher.voucher_id,
        code: voucher.code,
        discount_percent: voucher.discount_percent,
        discount_amount: discountAmount,
        final_amount: orderAmount - discountAmount
      }
    });

  } catch (error: any) {
    // Bắt các lỗi nghiệp vụ chủ động quăng ra từ Service (mã sai, hết hạn, thiếu tiền...)
    const businessErrors = ['không tồn tại', 'hết hạn', 'hết lượt', 'tối thiểu'];
    if (businessErrors.some(msg => error.message.includes(msg))) {
      return res.status(400).json({ message: error.message });
    }

    // Bắt lỗi hệ thống (như crash code hoặc mất kết nối DB)
    console.error('Lỗi khi kiểm tra voucher:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const createVoucher = async (req: Request, res: Response): Promise<any> => {
    try {
        const { code, discount_percent, max_discount_amount, min_order_amount, expiry_date, max_uses } = req.body;

        // Validate cơ bản đầu vào
        if (!code || !discount_percent || !max_discount_amount || !min_order_amount || !expiry_date) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ các thông tin bắt buộc của Voucher!" });
        }

        const newVoucher = await voucherService.createVoucher({
            code: String(code).toUpperCase().trim(),
            discount_percent: Number(discount_percent),
            max_discount_amount: Number(max_discount_amount),
            min_order_amount: Number(min_order_amount),
            expiry_date: String(expiry_date),
            max_uses: max_uses ? Number(max_uses) : 100 // Mặc định nếu không cung cấp max_uses sẽ là 100 lượt sử dụng
        });

        return res.status(201).json({
            message: "Tạo mã giảm giá thành công!",
            data: newVoucher
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message || "Lỗi khi tạo voucher!" });
    }
};

// 2. API XÓA VOUCHER
export const deleteVoucher = async (req: Request, res: Response): Promise<any> => {
    try {
        const voucherId = req.params.id;

        if (!voucherId) {
            return res.status(400).json({ message: "Thiếu ID của voucher cần xóa!" });
        }

        await voucherService.deleteVoucher(Number(voucherId));

        return res.status(200).json({
            message: "Xóa mã giảm giá thành công!"
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message || "Lỗi khi xóa voucher!" });
    }
};

export const getAllVouchers = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await voucherService.getAllVouchers();
    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const updateVoucher = async (req: Request, res: Response): Promise<any> => {
  try {
    await voucherService.updateVoucher(Number(req.params.id), req.body);
    return res.status(200).json({ message: 'Cập nhật voucher thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};