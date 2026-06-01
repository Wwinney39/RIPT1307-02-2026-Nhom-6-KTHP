import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import db from '../config/db';

// Controller xử lý các yêu cầu liên quan đến người dùng
export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const profile = await userService.getProfile(Number(userId));
    return res.status(200).json({ data: profile });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Controller xử lý cập nhật thông tin người dùng
export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    await userService.updateProfile(Number(userId), name, email);
    return res.status(200).json({ message: 'Cập nhật thông tin thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Controller xử lý lấy danh sách địa chỉ của người dùng
export const getAddresses = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const addresses = await userService.getAddresses(Number(userId));
    return res.status(200).json({ data: addresses });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Controller xử lý thêm địa chỉ mới cho người dùng
export const addAddress = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const { address_text, is_default = false } = req.body;
    if (!address_text) {
      return res.status(400).json({ message: 'Vui lòng nhập địa chỉ!' });
    }
    const addressId = await userService.addAddress(Number(userId), address_text, is_default);
    return res.status(201).json({ message: 'Thêm địa chỉ thành công!', address_id: addressId });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Controller xử lý xóa địa chỉ của người dùng
export const deleteAddress = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const addressId = req.params.id;
    await userService.deleteAddress(Number(addressId), Number(userId));
    return res.status(200).json({ message: 'Xóa địa chỉ thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

// Controller xử lý đặt địa chỉ mặc định cho người dùng
export const setDefaultAddress = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.user_id;
    const addressId = req.params.id;
    await userService.setDefaultAddress(Number(addressId), Number(userId));
    return res.status(200).json({ message: 'Đặt địa chỉ mặc định thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const [rows]: any = await db.execute(
      'SELECT user_id, name, phone, email, role, created_at FROM Users'
    );
    return res.status(200).json({ data: rows });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, role } = req.body;
    await userService.updateUser(Number(req.params.id), name, email, role);
    return res.status(200).json({ message: 'Cập nhật người dùng thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    await userService.deleteUser(Number(req.params.id));
    return res.status(200).json({ message: 'Xóa người dùng thành công!' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

export const getDashboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await userService.getDashboard();
    return res.status(200).json({ data });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};