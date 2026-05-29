import { Router } from 'express';
import { checkVoucher, deleteVoucher, createVoucher } from '../controllers/voucher.controller';

const router = Router();


// Endpoint kiểm tra mã giảm giá
router.post('/check', checkVoucher);
router.post('/create', createVoucher);
router.delete('/delete/:id', deleteVoucher);

export default router;