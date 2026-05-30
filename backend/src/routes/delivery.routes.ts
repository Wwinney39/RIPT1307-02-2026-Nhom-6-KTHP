import { Router } from 'express';
import { getDeliveryLogs, updateDeliveryStatus } from '../controllers/delivery.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';


const router = Router();

// GET /api/delivery/:orderId -> Lấy lịch sử giao hàng của đơn hàng
router.get('/:orderId', getDeliveryLogs);
router.post('/:orderId', authenticateToken, authorizeRoles('merchant', 'staff', 'admin'), updateDeliveryStatus);

export default router;