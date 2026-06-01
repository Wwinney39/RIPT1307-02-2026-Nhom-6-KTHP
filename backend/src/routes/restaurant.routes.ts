import { Router } from 'express';
import { createRestaurant, deleteRestaurant, getAllRestaurants, getNearbyRestaurants, getRestaurantById, updateRestaurant } from '../controllers/restaurant.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/restaurants -> Lấy tất cả nhà hàng  
router.get('/', getAllRestaurants);
// GET /api/restaurants/nearby?lat=10.762622&lng=106.660172 -> Lấy nhà hàng gần vị trí này
router.get('/nearby', getNearbyRestaurants);
// GET /api/restaurants/:id -> Lấy thông tin chi tiết của nhà hàng theo ID
router.get('/:id', getRestaurantById);
// POST /api/restaurants -> Tạo nhà hàng mới, cần auth và chỉ admin mới được tạo
router.post('/', authenticateToken, authorizeRoles('admin'), createRestaurant);
// PUT /api/restaurants/:id -> Cập nhật thông tin nhà hàng, cần auth và chỉ admin mới được cập nhật
router.put('/:id', authenticateToken, authorizeRoles('merchant', 'staff', 'admin'), updateRestaurant);
// DELETE /api/restaurants/:id -> Xóa nhà hàng, cần auth và chỉ admin mới được xóa
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteRestaurant);


export default router;