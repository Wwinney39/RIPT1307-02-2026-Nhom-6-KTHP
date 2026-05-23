import { Router } from 'express';
import { getNearbyRestaurants } from '../controllers/restaurant.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// API lấy danh sách nhà hàng gần vị trí người dùng (có thể thêm tham số lọc nếu muốn)
router.get('/', authenticateToken, getNearbyRestaurants);

export default router;