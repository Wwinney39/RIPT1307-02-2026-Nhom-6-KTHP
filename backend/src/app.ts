import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

// Nạp biến môi trường từ file .env
dotenv.config();

const app = express();

// Middleware để Express đọc được dữ liệu JSON từ Body Request gửi lên
app.use(express.json());

// Khai báo Base URL cho cụm API Auth
app.use('/api/auth', authRoutes);

// Cấu hình Port chạy Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server đang chạy ngon lành tại port: ${PORT}`);
});