import { Router } from 'express';
import { checkVoucher, deleteVoucher, createVoucher } from '../controllers/voucher.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();


// Endpoint kiểm tra mã giảm giá
router.post('/check', checkVoucher);
router.post('/create', authenticateToken, authorizeRoles('staff', 'admin'), createVoucher);
router.delete('/delete/:id', authenticateToken, authorizeRoles('staff', 'admin'), deleteVoucher);

export default router;