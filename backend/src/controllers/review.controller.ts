import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const getReviews = async (req: Request, res: Response): Promise<any> => {
  try {
    const restaurantId = req.params.restaurantId;
    const reviews = await reviewService.getByRestaurant(Number(restaurantId));
    return res.status(200).json({ data: reviews });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const createReview = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const { restaurant_id, rating, comment } = req.body;

    if (!restaurant_id || !rating) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin đánh giá!' });
    }

    const reviewId = await reviewService.create(Number(userId), Number(restaurant_id), Number(rating), comment);
    return res.status(201).json({ message: 'Đánh giá thành công!', review_id: reviewId });
  } catch (error: any) {
    const businessErrors = ['Rating phải từ 1 đến 5!', 'Bạn đã đánh giá nhà hàng này rồi!'];
    if (businessErrors.includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const reviewId = req.params.id;
    await reviewService.delete(Number(reviewId), Number(userId));
    return res.status(200).json({ message: 'Xóa đánh giá thành công!' });
  } catch (error: any) {
    if (error.message === 'Không tìm thấy đánh giá này!') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};