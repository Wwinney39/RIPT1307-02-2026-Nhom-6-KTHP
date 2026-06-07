export interface RegisterBody {
  name: string;
  phone: string;
  password?: string;
  // Cập nhật lại chính xác 4 role viết thường cho khớp với Database và Middleware
  role?: 'admin' | 'merchant' | 'staff' | 'customer'; 
}

export interface LoginBody {
  phone: string;
  password?: string;
}