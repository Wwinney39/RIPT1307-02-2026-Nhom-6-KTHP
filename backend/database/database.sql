-- 1. Tạo bảng Người dùng
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tạo bảng Nhà hàng
CREATE TABLE Restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'OPEN'
);

-- 3. Tạo bảng Món ăn
CREATE TABLE Menu_Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- 4. Tạo bảng Mã giảm giá
CREATE TABLE Vouchers (
    voucher_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percent INT NOT NULL,
    max_discount_amount DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) NOT NULL,
    expiry_date DATETIME NOT NULL,
    max_uses INT DEFAULT 100,
    used_count INT DEFAULT 0
);

-- 5. Tạo bảng Đơn hàng
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    restaurant_id INT,
    voucher_id INT,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (voucher_id) REFERENCES Vouchers(voucher_id) ON DELETE SET NULL
);

-- 6. Tạo bảng Chi tiết đơn hàng
CREATE TABLE Order_Details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    item_id INT,
    quantity INT NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id) ON DELETE CASCADE
);

-- 7. Tạo bảng Đánh giá
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    restaurant_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);


-- 8. Tạo bảng Giỏ hàng (Cart)
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id) ON DELETE CASCADE
);

-- 9. Tạo bảng Nhật ký giao hàng (Delivery Logs)
CREATE TABLE delivery_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);





USE restaurant_db;

-- Thêm 3 nhà hàng mẫu ở các vị trí khác nhau tại Hà Nội để test khoảng cách
INSERT INTO Restaurants (name, address, latitude, longitude) VALUES
('Quán Cơm Tấm PTIT', 'Gần Học viện Công nghệ Bưu chính Viễn thông, Hà Đông', 20.9808, 105.7874),
('Bún Chả Cầu Giấy', 'Dịch Vọng Hậu, Cầu Giấy, Hà Nội', 21.0362, 105.7823),
('Phở Thìn Bờ Hồ', 'Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội', 21.0285, 105.8542);

-- Thêm mã giảm giá mẫu để test logic
INSERT INTO Vouchers (code, discount_percent, max_discount_amount, min_order_amount, expiry_date, max_uses, used_count) VALUES 
('SVPTIT', 10, 20000.00, 50000.00, '2026-12-31 23:59:59', 100, 0),		-- Giảm 10% tối đa 20k cho đơn từ 50k
('FREEFOOD', 20, 50000.00, 100000.00, '2026-12-31 23:59:59', 50, 0), 	-- Giảm 20% tối đa 50k cho đơn từ 100k
('HETLUOT', 15, 30000.00, 30000.00, '2026-12-31 23:59:59', 10, 10);		-- Mã hết lượt (10/10)


INSERT INTO Menu_Items (restaurant_id, name, price, is_available) 
VALUES (1, 'Trà sữa trân châu', 30000, 1);