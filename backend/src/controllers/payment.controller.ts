import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service';

export const getPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const orderId = req.params.orderId;
    const payment = await paymentService.getByOrderId(Number(orderId));
    return res.status(200).json({ data: payment });
  } catch (error: any) {
    if (['Không tìm thấy thông tin thanh toán!'].includes(error.message)) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const paymentCallback = async (req: Request, res: Response): Promise<any> => {
  try {
    const { order_id, status } = req.body;
    if (!order_id || !status) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    await paymentService.updateStatus(Number(order_id), status);
    return res.status(200).json({ message: 'Cập nhật thanh toán thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};