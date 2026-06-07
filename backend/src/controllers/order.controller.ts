 import { Request, Response } from 'express';
import { orderService } from '../services/order.service';

export const createOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        // Lấy thông tin user từ middleware xác thực token (được đính vào req.user)
        const userId = (req as any).user?.user_id || (req as any).user?.id || req.body.user_id;

          console.log("CREATE ORDER USER:", (req as any).user);
          console.log("CREATE ORDER USER ID:", userId);

          if (!userId) {
            return res.status(401).json({
              message: "Bạn chưa đăng nhập, không thể đặt hàng!",
            });
        }
        const { restaurant_id, address_id, voucher_code, items } = req.body;

        if (!restaurant_id || !address_id) {
            return res.status(400).json({ message: "Vui lòng chọn nhà hàng và địa chỉ giao hàng!" });
        }

        const orderData = await orderService.createOrderTransaction(
            Number(userId), 
            Number(restaurant_id), 
            Number(address_id), 
            voucher_code, 
            items
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

export const getMyOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id || (req as any).user?.id;

    console.log("REQ USER:", (req as any).user);
    console.log("MY ORDER USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập hoặc token không hợp lệ!",
      });
    }

    const data = await orderService.getMyOrders(Number(userId));
    return res.status(200).json({ data });
  } catch (error: any) {
    console.error("GET MY ORDERS ERROR:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra tại hệ thống Backend!",
    });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id || (req as any).user?.id;
    const data = await orderService.getOrderById(Number(req.params.id), Number(userId));
    return res.status(200).json({ data });
  } catch (error: any) {
    console.error("GET ORDER BY ID ERROR:", error);
    return res.status(404).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await orderService.getAllOrders();
    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const cancelOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id || (req as any).user?.id;
    await orderService.cancelOrder(Number(req.params.id), Number(userId));
    return res.status(200).json({ message: 'Hủy đơn hàng thành công!' });
  } catch (error: any) {
    console.error("CANCEL ORDER ERROR:", error);
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};