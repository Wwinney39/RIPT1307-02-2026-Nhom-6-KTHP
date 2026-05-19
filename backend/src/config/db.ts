import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cấu hình để đọc được các biến môi trường từ file .env
dotenv.config();

// Tạo một Connection Pool để quản lý các kết nối đến MySQL hiệu quả hơn
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'restaurant_manager',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;