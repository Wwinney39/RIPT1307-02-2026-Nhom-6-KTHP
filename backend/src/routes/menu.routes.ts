import { Router } from 'express';
import { getMenuByRestaurant, createMenuItem } from '../controllers/menu.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();


// GET /api/menu/restaurant/:restaurantId -> GET /api/menu/restaurant/1?category=Cơm
router.get('/restaurant/:restaurantId', getMenuByRestaurant);
// POST /api/menu/restaurant/:restaurantId -> POST /api/menu/restaurant/1
router.post('/restaurant/:restaurantId', authenticateToken, authorizeRoles('merchant', 'staff', 'admin'), createMenuItem);

export default router;