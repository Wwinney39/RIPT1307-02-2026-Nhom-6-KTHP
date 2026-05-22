import { Router } from 'express';
import { getMenuByRestaurant, createMenuItem } from '../controllers/menu.controller';

const router = Router();

// Đường dẫn API lấy menu của 1 nhà hàng cụ thể:
// GET /api/menu/restaurant/:restaurantId -> GET /api/menu/restaurant/1?category=Cơm
router.get('/restaurant/:restaurantId', getMenuByRestaurant);

router.post('/restaurant/:restaurantId', createMenuItem);

export default router;