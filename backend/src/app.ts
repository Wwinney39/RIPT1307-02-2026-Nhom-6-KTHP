import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes';
import restaurantRoutes from './routes/restaurant.routes';
import menuRoutes from './routes/menu.routes';
import orderRoutes from './routes/order.routes';
import voucherRoutes from './routes/voucher.routes';
import cartRoutes from './routes/cart.routes';
import userRoutes from './routes/user.routes';
import paymentRoutes from './routes/payment.routes';
import deliveryRoutes from './routes/delivery.routes';
import reviewRoutes from './routes/review.routes';

// Nạp biến môi trường từ file .env
dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: 'https://restaurant-manager-frontend-g6vo.onrender.com', // Điền chính xác link Frontend Render của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

export const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(express.json());

// Gắn io vào request để dùng trong controller
app.use((req: any, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('Client kết nối:', socket.id);

  socket.on('join', (userId: number) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} đã join room`);
  });

  socket.on('disconnect', () => {
    console.log('Client ngắt kết nối:', socket.id);
  });
});


// Khai báo Base URL cho cụm API Auth
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/reviews', reviewRoutes); 

// Cấu hình Port chạy Server
httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`Server đang chạy ngon lành tại port: ${process.env.PORT || 3000}`);
});

export default app;