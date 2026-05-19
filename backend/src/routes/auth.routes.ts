import { Router } from 'express';
// Import chính xác các hàm xử lý từ auth.controller
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

export default router;