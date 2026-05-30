import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cart.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getCart);
router.post('/', authenticateToken, addToCart);
router.put('/:id', authenticateToken, updateCartItem);
router.delete('/:id', authenticateToken, removeCartItem);
router.delete('/', authenticateToken, clearCart);

export default router;