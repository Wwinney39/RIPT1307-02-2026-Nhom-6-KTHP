import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import restaurantRoutes from './routes/restaurant.routes';
import menuRoutes from './routes/menu.routes';
import orderRoutes from './routes/order.routes';
import voucherRoutes from './routes/voucher.routes';
import cartRoutes from './routes/cart.routes';
import userRoutes from './routes/user.routes';

// Nạp biến môi trường từ file .env
dotenv.config();

const app = express();

// Middleware để parse JSON body từ các request gửi lên
app.use(express.json());

// Khai báo Base URL cho cụm API Auth
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);

// Cấu hình Port chạy Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server đang chạy ngon lành tại port: ${PORT}`);
});