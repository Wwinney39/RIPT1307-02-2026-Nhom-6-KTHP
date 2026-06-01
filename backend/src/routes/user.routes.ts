import { Router } from 'express';
import { getProfile, updateProfile, getAddresses, addAddress, deleteAddress, setDefaultAddress, getAllUsers, deleteUser, updateUser, getDashboard } from '../controllers/user.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/addresses', authenticateToken, getAddresses);
router.post('/addresses', authenticateToken, addAddress);
router.delete('/addresses/:id', authenticateToken, deleteAddress);
router.patch('/addresses/:id/default', authenticateToken, setDefaultAddress);
router.get('/admin/dashboard', authenticateToken, authorizeRoles('admin'), getDashboard);
router.get('/admin/all', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.put('/admin/:id', authenticateToken, authorizeRoles('admin'), updateUser);
router.delete('/admin/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

export default router;