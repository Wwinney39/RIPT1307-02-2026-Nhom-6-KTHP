import { Router } from 'express';
import { checkVoucher, deleteVoucher, createVoucher, updateVoucher, getAllVouchers } from '../controllers/voucher.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();


router.get('/', authenticateToken, authorizeRoles('staff', 'admin'), getAllVouchers);
router.post('/check', checkVoucher);
router.post('/create', authenticateToken, authorizeRoles('merchant', 'staff', 'admin'), createVoucher);
router.put('/:id', authenticateToken, authorizeRoles('merchant', 'staff', 'admin'), updateVoucher);
router.delete('/delete/:id', authenticateToken, authorizeRoles('merchant', 'staff', 'admin'), deleteVoucher);

export default router;