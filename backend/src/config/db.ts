import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cấu hình để đọc được các biến môi trường từ file .env
dotenv.config();

// Tạo một Connection Pool để quản lý các kết nối đến MySQL hiệu quả hơn
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-257790e3-restaurant-project.l.aivencloud.com',
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'defaultdb',
  port: Number(process.env.DB_PORT) || 22180,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;