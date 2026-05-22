import { Router } from 'express';
import { getNearbyRestaurants } from '../controllers/restaurant.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Lấy danh sách quán gần nhất (Yêu cầu đăng nhập & truyền lat, lng trên URL)
router.get('/', authenticateToken, getNearbyRestaurants);

export default router;