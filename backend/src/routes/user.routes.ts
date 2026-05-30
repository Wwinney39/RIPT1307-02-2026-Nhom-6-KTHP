import { Router } from 'express';
import { getProfile, updateProfile, getAddresses, addAddress, deleteAddress, setDefaultAddress, getAllUsers } from '../controllers/user.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/addresses', authenticateToken, getAddresses);
router.post('/addresses', authenticateToken, addAddress);
router.delete('/addresses/:id', authenticateToken, deleteAddress);
router.patch('/addresses/:id/default', authenticateToken, setDefaultAddress);
// GET /api/users/all -> Lấy tất cả người dùng, chỉ admin mới được phép
router.get('/all', authenticateToken, authorizeRoles('admin'), getAllUsers);
export default router;