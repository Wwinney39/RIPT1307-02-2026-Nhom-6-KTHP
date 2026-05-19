import os
import pandas as pd
import random
from faker import Faker
from datetime import datetime, timedelta
import sys                             
sys.stdout.reconfigure(encoding='utf-8')

# Khởi tạo Faker vùng Việt Nam để lấy tên và số điện thoại chuẩn
fake = Faker('vi_VN')

# CẤU HÌNH QUY MÔ DỮ LIỆU LỚN (BIGGER DATASET)
NUM_USERS = 100        # Tăng lên 100 khách hàng
NUM_RESTAURANTS = 10   # Tăng lên 10 nhà hàng
NUM_ORDERS = 5000      # Tăng vọt lên 5.000 đơn hàng để phân tích "đã" hơn

print(f"🚀 VS Code: Đang sinh tập dữ liệu lớn với {NUM_ORDERS} đơn hàng cho đủ 9 bảng...")

# =========================================================================
# 1. SINH DỮ LIỆU BẢNG: Users (100 khách hàng)
# =========================================================================
users_data = []
for i in range(1, NUM_USERS + 1):
    users_data.append({
        'user_id': i,
        'name': fake.name(),
        'phone': fake.phone_number().replace(" ", "").replace("-", "")[:10],
        'email': fake.unique.email(),
        'password_hash': 'hash_password_123',
        'role': 'CUSTOMER',
        'created_at': datetime.now() - timedelta(days=random.randint(60, 90))
    })
df_users = pd.DataFrame(users_data)

# =========================================================================
# 2. SINH DỮ LIỆU BẢNG: Restaurants (10 nhà hàng khắp Hà Nội)
# =========================================================================
restaurants_data = [
    {'restaurant_id': 1, 'name': 'Phở Thìn Bờ Hồ', 'address': '61 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội', 'latitude': 21.0285, 'longitude': 105.8522, 'status': 'OPEN'},
    {'restaurant_id': 2, 'name': 'Gà Rán KFC - Bà Triệu', 'address': '292 Bà Triệu, Hai Ba Trưng, Hà Nội', 'latitude': 21.0123, 'longitude': 105.8456, 'status': 'OPEN'},
    {'restaurant_id': 3, 'name': 'Bún Chả Hương Liên', 'address': '24 Lê Văn Hưu, Hai Ba Trưng, Hà Nội', 'latitude': 21.0194, 'longitude': 105.8547, 'status': 'OPEN'},
    {'restaurant_id': 4, 'name': 'The Pizza Company - Cầu Giấy', 'address': '302 Cầu Giấy, Cầu Giấy, Hà Nội', 'latitude': 21.0362, 'longitude': 105.7908, 'status': 'OPEN'},
    {'restaurant_id': 5, 'name': 'Trà Sữa Gong Cha - Hàng Khay', 'address': '25 Hàng Khay, Hoàn Kiếm, Hà Nội', 'latitude': 21.0264, 'longitude': 105.8515, 'status': 'OPEN'},
    {'restaurant_id': 6, 'name': 'Bánh Mì Dân Tổ', 'address': '32 Trần Nhật Duật, Hoàn Kiếm, Hà Nội', 'latitude': 21.0385, 'longitude': 105.8570, 'status': 'OPEN'},
    {'restaurant_id': 7, 'name': 'Cơm Tấm Phương Anh', 'address': '119A Đại La, Hai Bà Trưng, Hà Nội', 'latitude': 21.0012, 'longitude': 105.8490, 'status': 'OPEN'},
    {'restaurant_id': 8, 'name': 'Mì Vằn Thắn Đinh Liệt', 'address': '9 Đinh Liệt, Hoàn Kiếm, Hà Nội', 'latitude': 21.0322, 'longitude': 105.8531, 'status': 'OPEN'},
    {'restaurant_id': 9, 'name': 'Nem Nướng Nha Trang Hỷ Tước', 'address': '14 Ngõ 34 Hoàng Cầu, Đống Đa, Hà Nội', 'latitude': 21.0188, 'longitude': 105.8234, 'status': 'OPEN'},
    {'restaurant_id': 10, 'name': 'Haidalao Hotpot - Vincom Phạm Ngọc Thạch', 'address': '2 Phạm Ngọc Thạch, Đống Đa, Hà Nội', 'latitude': 21.0065, 'longitude': 105.8322, 'status': 'OPEN'}
]
df_restaurants = pd.DataFrame(restaurants_data)

# =========================================================================
# 3. SINH DỮ LIỆU BẢNG: Menu_Items (30 món, mỗi nhà hàng có đúng 3 món cố định)
# =========================================================================
menu_items_data = [
    {'item_id': 1, 'restaurant_id': 1, 'name': 'Phở Tái Lăn', 'price': 65000, 'image_url': 'pho_tai.jpg', 'is_available': True},
    {'item_id': 2, 'restaurant_id': 1, 'name': 'Phở Chín Trứng', 'price': 70000, 'image_url': 'pho_chin.jpg', 'is_available': True},
    {'item_id': 3, 'restaurant_id': 1, 'name': 'Quẩy Giòn (Cái)', 'price': 5000, 'image_url': 'quay.jpg', 'is_available': True},
    
    {'item_id': 4, 'restaurant_id': 2, 'name': 'Combo Gà Rán A', 'price': 89000, 'image_url': 'kfc_a.jpg', 'is_available': True},
    {'item_id': 5, 'restaurant_id': 2, 'name': 'Khoai Tây Chiên M', 'price': 29000, 'image_url': 'kfc_fries.jpg', 'is_available': True},
    {'item_id': 6, 'restaurant_id': 2, 'name': 'Pepsi Lon', 'price': 19000, 'image_url': 'pepsi.jpg', 'is_available': True},
    
    {'item_id': 7, 'restaurant_id': 3, 'name': 'Suất Bún Chả Đầy Đủ', 'price': 60000, 'image_url': 'buncha.jpg', 'is_available': True},
    {'item_id': 8, 'restaurant_id': 3, 'name': 'Nem Hải Sản (Cái)', 'price': 20000, 'image_url': 'nem.jpg', 'is_available': True},
    {'item_id': 9, 'restaurant_id': 3, 'name': 'Trà Đá', 'price': 5000, 'image_url': 'trada.jpg', 'is_available': True},
    
    {'item_id': 10, 'restaurant_id': 4, 'name': 'Pizza Hải Sản Đào M', 'price': 219000, 'image_url': 'pizza.jpg', 'is_available': True},
    {'item_id': 11, 'restaurant_id': 4, 'name': 'Mỳ Ý Sốt Bò Bằm', 'price': 99000, 'image_url': 'spaghetti.jpg', 'is_available': True},
    {'item_id': 12, 'restaurant_id': 4, 'name': 'Bánh Tỏi', 'price': 49000, 'image_url': 'garlic_bread.jpg', 'is_available': True},
    
    {'item_id': 13, 'restaurant_id': 5, 'name': 'Trà Sữa Trân Châu Đen', 'price': 55000, 'image_url': 'milktea.jpg', 'is_available': True},
    {'item_id': 14, 'restaurant_id': 5, 'name': 'Trà Xanh Đào Alisan', 'price': 52000, 'image_url': 'peach_tea.jpg', 'is_available': True},
    {'item_id': 15, 'restaurant_id': 5, 'name': 'Kem Béo Oolong', 'price': 60000, 'image_url': 'oolong_ice.jpg', 'is_available': True},

    {'item_id': 16, 'restaurant_id': 6, 'name': 'Bánh Mì Thập Cẩm Dân Tổ', 'price': 35000, 'image_url': 'bm_danto.jpg', 'is_available': True},
    {'item_id': 17, 'restaurant_id': 6, 'name': 'Sữa Đậu Nành', 'price': 12000, 'image_url': 'suadau.jpg', 'is_available': True},
    {'item_id': 18, 'restaurant_id': 6, 'name': 'Bánh Mì Thêm Sốt', 'price': 5000, 'image_url': 'bmsot.jpg', 'is_available': True},

    {'item_id': 19, 'restaurant_id': 7, 'name': 'Cơm Tấm Sườn Bì Chả', 'price': 55000, 'image_url': 'comtam.jpg', 'is_available': True},
    {'item_id': 20, 'restaurant_id': 7, 'name': 'Canh Khổ Qua Nhồi Thịt', 'price': 15000, 'image_url': 'canhkhoqua.jpg', 'is_available': True},
    {'item_id': 21, 'restaurant_id': 7, 'name': 'Trứng Ốp La Thêm', 'price': 7000, 'image_url': 'opla.jpg', 'is_available': True},

    {'item_id': 22, 'restaurant_id': 8, 'name': 'Mì Vằn Thắn Sủi Cảo Chín', 'price': 50000, 'image_url': 'mivanthan.jpg', 'is_available': True},
    {'item_id': 23, 'restaurant_id': 8, 'name': 'Sủi Cảo Chiên Khay', 'price': 40000, 'image_url': 'suicaochien.jpg', 'is_available': True},
    {'item_id': 24, 'restaurant_id': 8, 'name': 'Nước Sâm Sữa', 'price': 15000, 'image_url': 'nuocsam.jpg', 'is_available': True},

    {'item_id': 25, 'restaurant_id': 9, 'name': 'Suất Nem Nướng Đặc Biệt', 'price': 65000, 'image_url': 'nemnuong.jpg', 'is_available': True},
    {'item_id': 26, 'restaurant_id': 9, 'name': 'Chả Ram Chiên Thêm', 'price': 25000, 'image_url': 'charam.jpg', 'is_available': True},
    {'item_id': 27, 'restaurant_id': 9, 'name': 'Nước Ngô Ủ Lạnh', 'price': 15000, 'image_url': 'nuocngo.jpg', 'is_available': True},

    {'item_id': 28, 'restaurant_id': 10, 'name': 'Set Thịt Bò Haidilao M', 'price': 189000, 'image_url': 'hdl_bo.jpg', 'is_available': True},
    {'item_id': 29, 'restaurant_id': 10, 'name': 'Múa Mì Tươi Biểu Diễn', 'price': 40000, 'image_url': 'muami.jpg', 'is_available': True},
    {'item_id': 30, 'restaurant_id': 10, 'name': 'Nước Lẩu Uyên Ương Song Vị', 'price': 90000, 'image_url': 'nuoclau.jpg', 'is_available': True}
]
df_menu_items = pd.DataFrame(menu_items_data)

# =========================================================================
# 4. SINH DỮ LIỆU BẢNG: Vouchers
# =========================================================================
vouchers_data = [
    {'voucher_id': 1, 'code': 'ANTRUA10', 'discount_percent': 10, 'max_discount_amount': 20000, 'min_order_amount': 50000, 'expiry_date': '2026-12-31 23:59:59'},
    {'voucher_id': 2, 'code': 'GIAM20K', 'discount_percent': 20, 'max_discount_amount': 50000, 'min_order_amount': 100000, 'expiry_date': '2026-12-31 23:59:59'},
    {'voucher_id': 3, 'code': 'FREESHIP', 'discount_percent': 100, 'max_discount_amount': 15000, 'min_order_amount': 30000, 'expiry_date': '2026-12-31 23:59:59'},
]
df_vouchers = pd.DataFrame(vouchers_data)

# =========================================================================
# 5, 6, 7, 9. VÒNG LẶP SINH LOGIC MASSIVE: Orders, Order_Details, Reviews, Logs
# =========================================================================
orders_data = []
order_details_data = []
reviews_data = []
delivery_logs_data = []

detail_id_counter = 1
review_id_counter = 1
log_id_counter = 1

item_price_dict = {item['item_id']: item['price'] for item in menu_items_data}
start_date = datetime.now() - timedelta(days=30)

for order_id in range(1, NUM_ORDERS + 1):
    user_id = random.randint(1, NUM_USERS)
    restaurant_id = random.randint(1, NUM_RESTAURANTS)
    
    # Giữ nguyên tỷ lệ thực tế: DELIVERED (82%), CANCELLED (14%), PENDING (4%)
    status_pool = ['DELIVERED'] * 82 + ['CANCELLED'] * 14 + ['PENDING'] * 4
    status = random.choice(status_pool)
    
    # Rải đơn hàng ngẫu nhiên trong 30 ngày qua
    created_at = start_date + timedelta(
        days=random.randint(0, 29), hours=random.randint(0, 23), minutes=random.randint(0, 59)
    )
    
    # Logic khóa ngoại: lấy đúng 3 món thuộc nhà hàng được chọn
    # Ví dụ: restaurant_id = 1 -> món 1,2,3; restaurant_id = 10 -> món 28,29,30
    available_item_ids = [((restaurant_id - 1) * 3) + 1, ((restaurant_id - 1) * 3) + 2, ((restaurant_id - 1) * 3) + 3]
    
    num_items_bought = random.randint(1, 3) # Có thể mua từ 1 đến 3 món
    chosen_items = random.sample(available_item_ids, num_items_bought)
    
    subtotal = 0
    for item_id in chosen_items:
        quantity = random.randint(1, 3)
        subtotal += item_price_dict[item_id] * quantity
        
        order_details_data.append({
            'detail_id': detail_id_counter, 'order_id': order_id, 'item_id': item_id, 'quantity': quantity,
            'note': random.choice(['Ít cay', 'Nhiều hành', 'Đóng gói kỹ', None, None, None, None])
        })
        detail_id_counter += 1
        
    voucher_id = None
    if random.random() < 0.35:  # 35% đơn dùng voucher
        possible_vouchers = df_vouchers[df_vouchers['min_order_amount'] <= subtotal]
        if not possible_vouchers.empty:
            voucher_row = possible_vouchers.sample(1).iloc[0]
            voucher_id = int(voucher_row['voucher_id'])
            discount = (subtotal * voucher_row['discount_percent']) / 100
            discount = min(discount, voucher_row['max_discount_amount'])
            total_price = subtotal - discount
        else:
            total_price = subtotal
    else:
        total_price = subtotal

    total_price = max(total_price, 0)
    
    orders_data.append({
        'order_id': order_id, 'user_id': user_id, 'restaurant_id': restaurant_id,
        'voucher_id': int(voucher_id) if voucher_id else None, 'total_price': round(total_price, 2),
        'status': status, 'created_at': created_at
    })
    
    # 40% đơn hàng giao thành công sẽ viết review ngẫu nhiên
    if status == 'DELIVERED' and random.random() < 0.4:
        reviews_data.append({
            'review_id': review_id_counter, 'user_id': user_id, 'restaurant_id': restaurant_id,
            'rating': random.choice([5, 5, 4, 4, 4, 3]), # Tỷ lệ điểm thực tế (nhiều 4, 5 sao)
            'comment': random.choice(['Đồ ăn nóng hổi ngon miệng', 'Giao siêu nhanh, shipper dễ thương', 'Đóng gói cẩn thận sạch sẽ', 'Ăn vừa vị, giá cả hợp lý', 'Hơi ít so với hình nhưng ngon']),
            'created_at': created_at + timedelta(minutes=random.randint(20, 90))
        })
        review_id_counter += 1
        
    # Tạo logs vận hành giao nhận
    if status == 'DELIVERED':
        delivery_logs_data.append({'log_id': log_id_counter, 'order_id': order_id, 'status': 'DELIVERING', 'updated_at': created_at + timedelta(minutes=random.randint(5, 12))})
        log_id_counter += 1
        delivery_logs_data.append({'log_id': log_id_counter, 'order_id': order_id, 'status': 'DELIVERED', 'updated_at': created_at + timedelta(minutes=random.randint(25, 45))})
        log_id_counter += 1
    elif status == 'CANCELLED':
        delivery_logs_data.append({'log_id': log_id_counter, 'order_id': order_id, 'status': 'CANCELLED', 'updated_at': created_at + timedelta(minutes=random.randint(5, 20))})
        log_id_counter += 1

# =========================================================================
# 8. SINH DỮ LIỆU BẢNG: cart (Giỏ hàng hiện tại của 100 người dùng)
# =========================================================================
cart_data = []
cart_id_counter = 1
for user_id in range(1, NUM_USERS + 1):
    num_items_in_cart = random.randint(0, 3) # Mỗi người có từ 0 đến 3 món ngâm trong giỏ
    if num_items_in_cart > 0:
        chosen_items = random.sample(range(1, 31), num_items_in_cart) # Chọn bừa trong 30 món hệ thống
        for item_id in chosen_items:
            cart_data.append({
                'cart_id': cart_id_counter, 'user_id': user_id, 'item_id': item_id, 'quantity': random.randint(1, 2)
            })
            cart_id_counter += 1

# Ép dữ liệu ra DataFrame
df_orders = pd.DataFrame(orders_data)
df_order_details = pd.DataFrame(order_details_data)
df_reviews = pd.DataFrame(reviews_data)
df_delivery_logs = pd.DataFrame(delivery_logs_data)
df_cart = pd.DataFrame(cart_data)

# Ghi đè file CSV sạch ngay tại thư mục làm việc của VS Code
current_dir = os.path.dirname(os.path.abspath(__file__))

df_users.to_csv(os.path.join(current_dir, 'users.csv'), index=False)
df_restaurants.to_csv(os.path.join(current_dir, 'restaurants.csv'), index=False)
df_menu_items.to_csv(os.path.join(current_dir, 'menu_items.csv'), index=False)
df_vouchers.to_csv(os.path.join(current_dir, 'vouchers.csv'), index=False)
df_orders.to_csv(os.path.join(current_dir, 'orders.csv'), index=False)
df_order_details.to_csv(os.path.join(current_dir, 'order_details.csv'), index=False)
df_reviews.to_csv(os.path.join(current_dir, 'reviews.csv'), index=False)
df_delivery_logs.to_csv(os.path.join(current_dir, 'delivery_logs.csv'), index=False)
df_cart.to_csv(os.path.join(current_dir, 'cart.csv'), index=False)

print(f"✨ Xong xuôi! Đã gieo mầm thành công 9 bảng dữ liệu với {NUM_ORDERS} đơn hàng quy mô lớn.")