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
    const [existingUser]: any = await db.execute('SELECT * FROM Users WHERE phone = ?', [phone]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Số điện thoại này đã được sử dụng!" });
    }

    // Băm mật khẩu bằng Bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRole = role || 'customer'; // Mặc định role là 'customer' nếu không được cung cấp

    // Lưu vào database
    const query = `INSERT INTO Users (name, phone, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())`;
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
    const [users]: any = await db.execute('SELECT * FROM Users WHERE phone = ?', [phone]);
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
//Nhập SĐT → sinh OTP → lưu DB
export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Vui lòng nhập số điện thoại!' });
    }

    const [users]: any = await db.execute(
      'SELECT user_id FROM Users WHERE phone = ?',
      [phone]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'Số điện thoại không tồn tại trong hệ thống!' });
    }

    // Sinh OTP 6 số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hết hạn sau 5 phút
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await db.execute(
      'UPDATE Users SET otp_code = ?, otp_expires = ? WHERE phone = ?',
      [otp, otpExpires, phone]
    );

    // Thực tế gửi SMS, ở đây giả lập trả về console
    console.log(`OTP cho ${phone}: ${otp}`);

    return res.status(200).json({ message: 'Đã gửi OTP về số điện thoại!' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

//Nhập OTP → trả về reset token
export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    const [users]: any = await db.execute(
      'SELECT user_id, otp_code, otp_expires FROM Users WHERE phone = ?',
      [phone]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: 'Số điện thoại không tồn tại!' });
    }

    const user = users[0];

    if (user.otp_code !== otp) {
      return res.status(400).json({ message: 'OTP không chính xác!' });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ message: 'OTP đã hết hạn!' });
    }

    // Xóa OTP sau khi xác minh xong
    await db.execute(
      'UPDATE Users SET otp_code = NULL, otp_expires = NULL WHERE user_id = ?',
      [user.user_id]
    );

    const secretKey = process.env.JWT_SECRET || 'secret_fallback_key';
    const resetToken = jwt.sign(
      { user_id: user.user_id, type: 'reset_password' },
      secretKey,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      message: 'Xác minh OTP thành công!',
      reset_token: resetToken
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};

//Dùng reset token → đổi mật khẩu mới
export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { reset_token, new_password } = req.body;
    if (!reset_token || !new_password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    const secretKey = process.env.JWT_SECRET || 'secret_fallback_key';

    let decoded: any;
    try {
      decoded = jwt.verify(reset_token, secretKey) as { user_id: number; type: string };
    } catch {
      return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }

    if (decoded.type !== 'reset_password') {
      return res.status(403).json({ message: 'Token không hợp lệ!' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await db.execute(
      'UPDATE Users SET password_hash = ? WHERE user_id = ?',
      [hashedPassword, decoded.user_id]
    );

    return res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Có lỗi xảy ra tại hệ thống Backend!' });
  }
};