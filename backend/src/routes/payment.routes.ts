import { Router } from 'express';
import { getPayment, paymentCallback } from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
// GET /api/payments/order/:orderId sẽ trả về thông tin thanh toán của đơn hàng, cần auth
router.get('/order/:orderId', authenticateToken, getPayment);
//POST /api/payments/callback sẽ được MoMo/VNPay gọi vào sau khi thanh toán, không cần auth
router.post('/callback', paymentCallback); // MoMo/VNPay gọi vào, không cần auth

export default router;