import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { RegisterBody, LoginBody } from '../interfaces/auth.interface';

// ==================== 1. API ĐĂNG KÝ ====================
export const register = async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<any> => {
  const { name, phone, email, password, role } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ họ tên, số điện thoại và mật khẩu!" });
  }

  try {
    // Kiểm tra trùng số điện thoại
    const [existingUser]: any = await db.execute('SELECT * FROM users WHERE phone = ?', [phone]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Số điện thoại này đã được sử dụng!" });
    }

    // Băm mật khẩu bằng Bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRole = role || 'customer'; // Mặc định role là 'customer' nếu không được cung cấp

    // Lưu vào database
    const query = `INSERT INTO users (name, phone, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())`;
    await db.execute(query, [name, phone, email || null, passwordHash, userRole]);

    return res.status(201).json({ message: "Đăng ký tài khoản thành công!" });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau!" });
  }
};

// ==================== 2. API ĐĂNG NHẬP ====================
export const login = async (req: Request<{}, {}, LoginBody>, res: Response): Promise<any> => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Vui lòng nhập số điện thoại và mật khẩu!" });
  }

  try {
    // Tìm user theo số điện thoại
    const [users]: any = await db.execute('SELECT * FROM users WHERE phone = ?', [phone]);
    if (users.length === 0) {
      return res.status(400).json({ message: "Số điện thoại hoặc mật khẩu không đúng!" });
    }

    const user = users[0];

    // Kiểm tra mật khẩu
    //const isMatch = await bcrypt.compare(password, user.password_hash);
    const isMatch = (password === user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Số điện thoại hoặc mật khẩu không đúng!" });
    }

    // Sinh Token JWT
    const secretKey = process.env.JWT_SECRET || 'secret_fallback_key';
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      secretKey,
      { expiresIn: '3d' }
    );

    return res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
      user: {
        user_id: user.user_id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau!" });
  }
};

// ==================== 3. API CẤP LẠI MẬT KHẨU ====================
export const resetPassword = async (req: Request, res: Response) => {
    // Lấy số điện thoại và mật khẩu mới do Admin nhập
    const { phone, newPassword } = req.body; 

    try {
        // Băm mật khẩu mới
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(newPassword, saltRounds);

        // Chạy lệnh cập nhật vào MySQL
        await db.execute(
            'UPDATE Users SET password_hash = ? WHERE phone = ?',
            [password_hash, phone] 
        );
        
        return res.status(200).json({ message: "Đã cấp lại mật khẩu mới cho user!" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi đổi mật khẩu" });
    }
};