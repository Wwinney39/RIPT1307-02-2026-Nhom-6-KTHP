import { Router } from 'express';
import { register, login, resetPassword } from '../controllers/auth.controller';


const router = Router();

// POST /api/auth/register
router.post('/register', register);

// PUT /api/auth/reset-password
router.post('/login', login);   
router.put('/admin/reset-password', resetPassword);

// POST /api/auth/login
router.post('/login', login);

export default router;