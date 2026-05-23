import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mở rộng đối tượng Request của Express để lưu thông tin user sau khi giải mã Token
export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: number;
    role: 'admin' | 'merchant' | 'staff' | 'customer'; // Định nghĩa chặt chẽ 4 role hệ thống
  };
}

// ==================== 1. Middleware XÁC THỰC (ĐÃ ĐĂNG NHẬP CHƯA?) ====================
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
  // Lấy token từ header "Authorization: Bearer <TOKEN>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập! Không tìm thấy mã xác thực." });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'secret_fallback_key';
    
    // Giải mã và ép kiểu dữ liệu trả về theo đúng cấu trúc của hệ thống
    const decoded = jwt.verify(token, secretKey) as { user_id: number; role: 'admin' | 'merchant' | 'staff' | 'customer' };
    
    // Gắn thông tin user vào request để các Controller phía sau lôi ra dùng
    req.user = decoded;
    
    next(); // Token hợp lệ, cho đi qua cửa thứ nhất
  } catch (error) {
    return res.status(403).json({ message: "Mã xác thực không hợp lệ hoặc đã hết hạn!" });
  }
};

// ==================== 2. Middleware PHÂN QUYỀN (CÓ ĐỦ QUYỀN VÀO KHÔNG?) ====================
export const authorizeRoles = (...allowedRoles: ('admin' | 'merchant' | 'staff' | 'customer')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
    if (!req.user) {
      return res.status(401).json({ message: "Yêu cầu xác thực tài khoản trước!" });
    }

    // Kiểm tra xem role của user hiện tại có nằm trong danh sách các role được phép không
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập vào tính năng này!" });
    }

    next(); // Quyền hợp lệ, cho phép thực hiện API!
  };
};