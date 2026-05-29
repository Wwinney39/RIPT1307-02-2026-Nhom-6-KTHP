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

-- 3. Tạo bảng Mã giảm giá
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

-- 4. Tạo bảng Địa chỉ người dùng
CREATE TABLE User_Addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_text VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 5. Tạo bảng Món ăn
CREATE TABLE Menu_Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- 6. Tạo bảng Đánh giá
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

-- 7. Tạo bảng Giỏ hàng (Cart)
CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id) ON DELETE CASCADE
);

-- 8. Tạo bảng Đơn hàng
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    address_id INT NOT NULL,
    voucher_id INT,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES User_Addresses(address_id) ON DELETE CASCADE,
    FOREIGN KEY (voucher_id) REFERENCES Vouchers(voucher_id) ON DELETE SET NULL
);

-- 9. Tạo bảng Chi tiết đơn hàng
CREATE TABLE Order_Details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id) ON DELETE CASCADE
);

-- 10. Tạo bảng Thanh toán (Payments)
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

-- 11. Tạo bảng Nhật ký giao hàng (Delivery Logs)
CREATE TABLE delivery_Logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);



USE restaurant_db;

-- Thêm người dùng mẫu để test logic
INSERT INTO Users (name, phone, email, password_hash, role) VALUES
('Nguyen Van A', '0123456789', 'nguyenvana@example.com', 'password_a', 'customer'),
('Tran Thi B', '0987654321', 'tranthib@example.com', 'password_b', 'customer'),
('Le Van C', '0122456789', 'levanc@example.com', 'password_c', 'customer'),
('Admin User', '0111222333', 'admin@example.com', 'admin_password', 'admin'),
('Staff User', '0222333444', 'staff@example.com', 'staff_password', 'staff'),
('Merchant User', '0333444555', 'merchant@example.com', 'merchant_password', 'merchant');

-- Thêm địa chỉ mẫu cho người dùng để test logic
INSERT INTO User_Addresses (user_id, address_text, is_default) VALUES
(1, '123 Đường Láng, Đống Đa, Hà Nội', TRUE),
(1, '456 Nguyễn Trãi, Thanh Xuân, Hà Nội', FALSE),
(2, '789 Hoàng Hoa Thám, Ba Đình, Hà Nội', TRUE),
(3, '321 Trần Duy Hưng, Cầu Giấy, Hà Nội', TRUE),
(4, '654 Phạm Văn Đồng, Bắc Từ Liêm, Hà Nội', TRUE),
(5, '987 Lê Đức Thọ, Mỹ Đình, Hà Nội', TRUE),
(6, '159 Nguyễn Văn Cừ, Long Biên, Hà Nội', TRUE);

-- Thêm nhà hàng mẫu ở các vị trí khác nhau tại Hà Nội để test khoảng cách
INSERT INTO Restaurants (name, address, latitude, longitude) VALUES

('Quán Caffe Muội', 'Hoàng Cầu, Đống Đa, Hà Nội', 21.0280, 105.8350),
('Quán Cơm Tấm PTIT', 'Gần Học viện Công nghệ Bưu chính Viễn thông, Hà Đông', 20.9808, 105.7874),
('Phở Thìn Bờ Hồ', 'Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội', 21.0285, 105.8542),
('Bún Chả Cầu Giấy', 'Dịch Vọng Hậu, Cầu Giấy, Hà Nội', 21.0362, 105.7823),
('Nhà hàng Hải Sản Biển Đông', 'Lê Đức Thọ, Mỹ Đình, Hà Nội', 21.0288, 105.7800),
('Quán Bánh Mì Phố Cổ', 'Hàng Bông, Hoàn Kiếm, Hà Nội', 21.0300, 105.8500);

-- Thêm món ăn mẫu cho mỗi nhà hàng để test logic
INSERT INTO Menu_Items (restaurant_id, name, price, is_available) VALUES
(1, 'Trà sữa trân châu', 30000, 1),
(2, 'Cơm tấm sườn bì chả', 50000, 1),
(3, 'Phở bò tái', 45000, 1),
(4, 'Bún chả Hà Nội', 40000, 1),
(5, 'Hải sản hấp', 150000, 1),
(6, 'Bánh mì thịt nướng', 25000, 1);


-- Thêm mã giảm giá mẫu để test logic
INSERT INTO Vouchers (code, discount_percent, max_discount_amount, min_order_amount, expiry_date, max_uses, used_count) VALUES 
('HETLUOT', 15, 30000.00, 30000.00, '2026-12-31 23:59:59', 10, 10),		    -- Mã hết lượt (10/10)
('SVPTIT', 10, 20000.00, 50000.00, '2026-12-31 23:59:59', 100, 0),		    -- Giảm 10% tối đa 20k cho đơn từ 50k
('FREEFOOD', 20, 50000.00, 100000.00, '2026-12-31 23:59:59', 50, 0), 	    -- Giảm 20% tối đa 50k cho đơn từ 100k
('EXPIRED', 25, 50000.00, 50000.00, '2024-01-01 00:00:00', 100, 0),	        -- Mã đã hết hạn
('BIGSALE', 20, 450000.00, 2000000.00, '2026-12-31 23:59:59', 20, 5),	    -- Giảm 20% tối đa 450k cho đơn từ 2000k, đã dùng 5/20
('SMALLDISCOUNT', 5, 10000.00, 20000.00, '2026-12-31 23:59:59', 100, 0);	-- Giảm 5% tối đa 10k cho đơn từ 20k

-- Thêm đơn hàng mẫu để test logic
INSERT INTO Orders (user_id, restaurant_id, address_id, voucher_id, total_price, status) VALUES 
(1, 1, 1, NULL, 60000, 'PENDING'),	-- Đơn hàng 1: 2 ly trà sữa trân châu (60k), không dùng voucher
(2, 2, 2, 2, 50000, 'PENDING'),	    -- Đơn hàng 2: 1 phần cơm tấm sườn bì chả (50k), dùng voucher SVPTIT (giảm 10% tối đa 20k)
(3, 3, 3, 3, 45000, 'PENDING'),	    -- Đơn hàng 3: 1 tô phở bò tái (45k), dùng voucher FREEFOOD (giảm 20% tối đa 50k)
(1, 4, 1, 1, 40000, 'PENDING'),	    -- Đơn hàng 4: 1 phần bún chả Hà Nội (40k), dùng voucher HETLUOT (đã hết lượt)
(4, 5, 4, 5, 150000, 'PENDING'),	-- Đơn hàng 5: 1 phần hải sản hấp (150k), dùng voucher BIGSALE (giảm 20% tối đa 450k cho đơn từ 2000k)
(5, 6, 5, 6, 25000, 'PENDING');	    -- Đơn hàng 6: 1 phần bánh mì thịt nướng (25k),  dùng voucher SMALLDISCOUNT (giảm 5% tối đa 10k cho đơn từ 20k)

-- Thêm chi tiết đơn hàng mẫu để test logic
INSERT INTO Order_Details (order_id, item_id, quantity, note) VALUES
(1, 1, 2, 'Không đường'),	    -- 2 ly trà sữa trân châu
(2, 2, 1, 'Thêm nước mắm'),	    -- 1 phần cơm tấm sườn bì chả
(3, 3, 1, 'Bớt hành'),		    -- 1 tô phở bò tái
(4, 4, 1, 'Thêm nước chấm'),	-- 1 phần bún chả Hà Nội
(5, 5, 1, 'Không ăn cay'),	    -- 1 phần hải sản hấp
(6, 6, 1, 'Thêm rau');		    -- 1 phần bánh mì thịt nướng

-- Thêm thanh toán mẫu để test logic
INSERT INTO Payments (order_id, amount, method, status) VALUES
(1, 60000, 'COD', 'PENDING'),	    -- Đơn hàng 1 thanh toán COD
(2, 45000, 'MOMO', 'COMPLETED'),	-- Đơn hàng 2 thanh toán qua MoMo (đã hoàn thành)
(3, 36000, 'VNPAY', 'COMPLETED'),	-- Đơn hàng 3 thanh toán qua VNPAY (đã hoàn thành)
(4, 40000, 'COD', 'PENDING'),	    -- Đơn hàng 4 thanh toán COD
(5, 150000, 'MOMO', 'PENDING'),	    -- Đơn hàng 5 thanh toán qua MoMo
(6, 25000, 'VNPAY', 'PENDING');	    -- Đơn hàng 6 thanh toán qua VNPAY

-- Thêm đánh giá mẫu để test logic
INSERT INTO Reviews (user_id, restaurant_id, rating, comment) VALUES
(1, 1, 5, 'Trà sữa rất ngon, sẽ quay lại!'),
(2, 2, 4, 'Cơm tấm ngon nhưng nước mắm hơi nhạt.'),
(3, 3, 5, 'Phở bò tái tuyệt vời, nước dùng đậm đà!'),
(1, 4, 3, 'Bún chả bình thường, không có gì đặc sắc.'),
(4, 5, 4, 'Hải sản tươi ngon, phục vụ tốt.'),
(5, 6, 5, 'Bánh mì thịt nướng ngon tuyệt vời!');


-- Thêm giỏ hàng mẫu để test logic
INSERT INTO cart (user_id, item_id, quantity) VALUES
(1, 1, 2),	-- User 1 thêm 2 ly trà sữa trân châu vào giỏ
(2, 2, 1),	-- User 2 thêm 1 phần cơm tấm sườn bì chả vào giỏ
(3, 3, 1),	-- User 3 thêm 1 tô phở bò tái vào giỏ
(1, 4, 1),	-- User 1 thêm 1 phần bún chả Hà Nội vào giỏ
(4, 5, 1),	-- User 4 thêm 1 phần hải sản hấp vào giỏ
(5, 6, 1);	-- User 5 thêm 1 phần bánh mì thịt nướng vào giỏ

-- Thêm nhật ký giao hàng mẫu để test logic
INSERT INTO delivery_Logs (order_id, status) VALUES
(1, 'Đang chuẩn bị'),	-- Đơn hàng 1 đang chuẩn bị
(2, 'Đang giao'),		-- Đơn hàng 2 đang giao
(3, 'Đã giao'),		    -- Đơn hàng 3 đã giao
(4, 'Đang chuẩn bị'),	-- Đơn hàng 4 đang chuẩn bị
(5, 'Đang giao'),		-- Đơn hàng 5 đang giao
(6, 'Đã giao');		    -- Đơn hàng 6 đã giao
