import { Router } from 'express';
import { cancelOrder, createOrder, getAllOrders, getMyOrders, getOrderById } from '../controllers/order.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware'; 

const router = Router();

router.get('/all', authenticateToken, authorizeRoles('staff', 'admin'), getAllOrders);
router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/:id', authenticateToken, getOrderById);
router.post('/checkout', authenticateToken, createOrder);
router.patch('/:id/cancel', authenticateToken, authorizeRoles('customer', 'admin'), cancelOrder);




export default router;