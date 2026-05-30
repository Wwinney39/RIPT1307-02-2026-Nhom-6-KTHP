import { Router } from 'express';
import { createOrder } from '../controllers/order.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware'; // Nhớ kiểm tra lại đường dẫn file middleware của bạn nhé

const router = Router();

// Endpoint: POST /api/orders/checkout
// Bọc qua authenticateToken để bảo mật và định danh người dùng
router.post('/checkout', authenticateToken,authorizeRoles('customer','admin'), createOrder);

export default router;