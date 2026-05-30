import { Router } from 'express';
import { getProfile, updateProfile, getAddresses, addAddress, deleteAddress, setDefaultAddress } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/addresses', authenticateToken, getAddresses);
router.post('/addresses', authenticateToken, addAddress);
router.delete('/addresses/:id', authenticateToken, deleteAddress);
router.patch('/addresses/:id/default', authenticateToken, setDefaultAddress);

export default router;