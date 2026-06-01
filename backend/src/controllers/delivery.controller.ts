import { Request, Response } from 'express';
import { deliveryService } from '../services/delivery.service';

export const getDeliveryLogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const orderId = req.params.orderId;
    const logs = await deliveryService.getLogs(Number(orderId));
    return res.status(200).json({ data: logs });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Vui lòng nhập trạng thái!' });
    }

    await deliveryService.updateStatus(Number(orderId), status);
    // Sau khi cập nhật trạng thái
    if ((req as any).io) {
      (req as any).io.emit('delivery-update', {
        order_id: orderId,
        status: status
      }); 
    }
    return res.status(200).json({ message: 'Cập nhật trạng thái giao hàng thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};