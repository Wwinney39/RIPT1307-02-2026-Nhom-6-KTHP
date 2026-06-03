import { Router } from 'express';
import { createPayment, getAllPayments, getPayment, paymentCallback, updatePayment } from '../controllers/payment.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();
// POST /api/payments/create sẽ được gọi khi khách hàng tạo đơn hàng và chọn phương thức thanh toán, cần auth
router.post('/create', authenticateToken, createPayment);
router.get('/all', authenticateToken, authorizeRoles('staff', 'admin'), getAllPayments);
// GET /api/payments/order/:orderId sẽ trả về thông tin thanh toán của đơn hàng, cần auth
router.get('/order/:orderId', authenticateToken, getPayment);
// PUT /api/payments/:orderId sẽ được gọi khi khách hàng hủy đơn hàng hoặc khi có cập nhật trạng thái thanh toán, cần auth
router.put('/:orderId', authenticateToken, updatePayment);
//POST /api/payments/callback sẽ được MoMo/VNPay gọi vào sau khi thanh toán, không cần auth
router.post('/callback', paymentCallback); // MoMo/VNPay gọi vào, không cần auth

export default router;