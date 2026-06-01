import { Router } from 'express';
import { getMenuByRestaurant, createMenuItem, getAllMenuItems, deleteMenuItem, updateMenuItem } from '../controllers/menu.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.get('/all', authenticateToken, authorizeRoles('staff', 'admin'), getAllMenuItems);
// GET /api/menu/restaurant/:restaurantId -> GET /api/menu/restaurant/1?category=Cơm
router.get('/restaurant/:restaurantId', getMenuByRestaurant);
// POST /api/menu/restaurant/:restaurantId -> POST /api/menu/restaurant/1
router.post('/restaurant/:restaurantId', authenticateToken, authorizeRoles('merchant', 'staff', 'admin'), createMenuItem);
router.put('/:id', authenticateToken, authorizeRoles('merchant', 'staff', 'admin'), updateMenuItem);
router.delete('/:id', authenticateToken, authorizeRoles('merchant', 'staff', 'admin'), deleteMenuItem);

export default router;