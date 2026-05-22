import { Router } from 'express';
import { getMenuByRestaurant, createMenuItem } from '../controllers/menu.controller';

const router = Router();

// API lấy danh sách món ăn theo nhà hàng (Có thể lọc theo danh mục nếu muốn)
// GET /api/menu/restaurant/:restaurantId -> GET /api/menu/restaurant/1?category=Cơm
router.get('/restaurant/:restaurantId', getMenuByRestaurant);

router.post('/restaurant/:restaurantId', createMenuItem);

export default router;