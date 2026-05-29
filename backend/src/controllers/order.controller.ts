 import { Request, Response } from 'express';
import { orderService } from '../services/order.service';

export const createOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        // Lấy thông tin user từ middleware xác thực token (được đính vào req.user)
        const userId = (req as any).user?.user_id || req.body.user_id; 
        const { restaurant_id, address_id, voucher_code } = req.body;

        if (!restaurant_id || !address_id) {
            return res.status(400).json({ message: "Vui lòng chọn nhà hàng và địa chỉ giao hàng!" });
        }

        const orderData = await orderService.createOrderTransaction(
            Number(userId), 
            Number(restaurant_id), 
            Number(address_id), 
            voucher_code
        );

        // [MẢNG REALTIME TASK 37]: Sau khi lưu DB thành công, phát tín hiệu socket báo đơn mới
        if ((req as any).io) {
            (req as any).io.emit('new-order', {
                message: "Ting Ting! Có đơn hàng mới chờ duyệt!",
                order_id: orderData.order_id,
                total_price: orderData.final_total_price
            });
        }

        return res.status(201).json({
            message: "Đặt đơn hàng thành công!",
            data: orderData
        });

    } catch (error: any) {
        return res.status(400).json({ message: error.message || "Có lỗi xảy ra khi xử lý đơn hàng!" });
    }
};