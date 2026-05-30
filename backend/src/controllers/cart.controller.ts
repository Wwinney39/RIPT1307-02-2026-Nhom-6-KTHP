import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';

// Controller xử lý các yêu cầu liên quan đến giỏ hàng
export const getCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const cart = await cartService.getCart(Number(userId));
    return res.status(200).json({ data: cart });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Controller xử lý thêm món vào giỏ hàng
export const addToCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const { item_id, quantity = 1 } = req.body;

    if (!item_id) {
      return res.status(400).json({ message: 'Vui lòng nhập item_id!' });
    }

    await cartService.addToCart(Number(userId), Number(item_id), Number(quantity));
    return res.status(200).json({ message: 'Thêm vào giỏ hàng thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Controller xử lý cập nhật số lượng món trong giỏ hàng
export const updateCartItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const cartId = req.params.id;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ message: 'Vui lòng nhập số lượng!' });
    }

    await cartService.updateQuantity(Number(cartId), Number(userId), Number(quantity));
    return res.status(200).json({ message: 'Cập nhật giỏ hàng thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Controller xử lý xóa một món khỏi giỏ hàng
export const removeCartItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const cartId = req.params.id;
    await cartService.removeItem(Number(cartId), Number(userId));
    return res.status(200).json({ message: 'Xóa món khỏi giỏ hàng thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Controller xử lý xóa toàn bộ món khỏi giỏ hàng
export const clearCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    await cartService.clearCart(Number(userId));
    return res.status(200).json({ message: 'Xóa toàn bộ giỏ hàng thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};