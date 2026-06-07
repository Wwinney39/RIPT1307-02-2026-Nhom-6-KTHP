import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Chưa xác thực người dùng!' });
    }

    //Chuyển cả role của user và role cho phép thành CHỮ HOA để so sánh chuẩn tuyệt đối
    const userRole = user.role ? user.role.toUpperCase() : '';
    const upperAllowedRoles = allowedRoles.map(r => r.toUpperCase());

    if (!upperAllowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này!' });
    }

    next();
  };
};