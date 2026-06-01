import { Router } from 'express';
import { getReviews, createReview, deleteReview, updateReview } from '../controllers/review.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

//GET /api/reviews/restaurant/:restaurantId -> GET /api/reviews/restaurant/1?rating=5 (Có thể lọc theo rating nếu muốn)
router.get('/restaurant/:restaurantId', getReviews);
// POST /api/reviews -> Tạo đánh giá mới, cần auth
router.post('/', authenticateToken, authorizeRoles('customer', 'admin'), createReview);
// PUT /api/reviews/:id -> Cập nhật đánh giá, cần auth và chỉ cho phép cập nhật nếu là người tạo hoặc admin
router.put('/:id', authenticateToken, authorizeRoles('customer', 'admin'), updateReview);
// DELETE /api/reviews/:id -> Xóa đánh giá, cần auth và chỉ cho phép xóa nếu là người tạo hoặc admin
router.delete('/:id', authenticateToken, authorizeRoles('customer', 'admin'), deleteReview);

export default router;