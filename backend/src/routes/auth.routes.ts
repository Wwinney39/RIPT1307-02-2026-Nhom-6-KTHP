import { Router } from 'express';
import { register, login, resetPassword, verifyOtp, forgotPassword } from '../controllers/auth.controller';


const router = Router();

// POST /api/auth/register
router.post('/register', register);
// POST /api/auth/login
router.post('/login', login);
// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);
// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);
// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;