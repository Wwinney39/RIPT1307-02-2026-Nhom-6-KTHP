
"""
generate_dummy_data.py

Generates deterministic SQL INSERT statements for the Restaurant--Manager schema
and writes them to `backend/database/dummy_data.sql`.

Dependencies:
  pip install faker

Usage:
  python generate_dummy_data.py         # default: 500 users
  python generate_dummy_data.py --users 300 --restaurants 40

This script is deterministic (seeded). Adjust counts via CLI options.
"""

import argparse
import random
import hashlib
from datetime import datetime, timedelta
from faker import Faker
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP

fake = Faker("vi_VN")
SEED = 42
random.seed(SEED)
fake.seed_instance(SEED)


def sql_escape(s: str) -> str:
    if s is None:
        return "NULL"
    return "'{}'".format(str(s).replace("'", "''"))


def money(v: float) -> str:
    d = Decimal(v).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return f"{d:.2f}"


def hash_password(plain: str) -> str:
    return hashlib.sha256(plain.encode("utf-8")).hexdigest()


def gen_unique_phones(count, prefix_choices=("09", "08", "01", "03")):
    phones = set()
    while len(phones) < count:
        prefix = random.choice(prefix_choices)
        number = prefix + "".join(str(random.randint(0, 9)) for _ in range(8))
        phones.add(number)
    return list(phones)


def generate(args):
    users_n = args.users
    restaurants_n = args.restaurants
    vouchers_n = args.vouchers

    out_path = args.output
    lines = []

    # Header: select DB
    lines.append("USE restaurant_db;\n")

    # 1) Users
    users = []
    phones = gen_unique_phones(users_n + 10)
    for i in range(1, users_n + 1):
        name = fake.name()
        phone = phones[i - 1]
        email = (fake.email() if random.random() > 0.05 else None)
        password_hash = hash_password(f"user{i}_pass")
        p = random.random()
        if p < 0.01:
            role = "admin"
        elif p < 0.03:
            role = "staff"
        elif p < 0.06:
            role = "merchant"
        else:
            role = "customer"
        users.append({
            "user_id": i,
            "name": name,
            "phone": phone,
            "email": email,
            "password_hash": password_hash,
            "role": role
        })

    lines.append("-- Users\n")
    for u in users:
        lines.append(
            f"INSERT INTO Users (user_id, name, phone, email, password_hash, role, created_at) VALUES "
            f"({u['user_id']}, {sql_escape(u['name'])}, {sql_escape(u['phone'])}, "
            f"{sql_escape(u['email'])}, {sql_escape(u['password_hash'])}, {sql_escape(u['role'])}, "
            f"{sql_escape(datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'))});"
        )
    lines.append("\n")

    # 2) Restaurants
    restaurants = []
    lat_min, lat_max = 20.90, 21.08
    lon_min, lon_max = 105.75, 105.86
    for i in range(1, restaurants_n + 1):
        name = fake.company() + " " + random.choice(["Quán", "Nhà hàng", "Caffe", "Quán ăn"])
        address = fake.address().replace("\n", ", ")
        latitude = round(random.uniform(lat_min, lat_max), 6)
        longitude = round(random.uniform(lon_min, lon_max), 6)
        status = random.choices(["OPEN", "CLOSED"], weights=[0.9, 0.1])[0]
        restaurants.append({
            "restaurant_id": i,
            "name": name,
            "address": address,
            "latitude": latitude,
            "longitude": longitude,
            "status": status
        })

    lines.append("-- Restaurants\n")
    for r in restaurants:
        lines.append(
            f"INSERT INTO Restaurants (restaurant_id, name, address, latitude, longitude, status) VALUES "
            f"({r['restaurant_id']}, {sql_escape(r['name'])}, {sql_escape(r['address'])}, "
            f"{r['latitude']}, {r['longitude']}, {sql_escape(r['status'])});"
        )
    lines.append("\n")

    # 3) Vouchers
    vouchers = []
    now = datetime.utcnow()
    for i in range(1, vouchers_n + 1):
        code = fake.lexify(text="VCHR????") + str(i)
        discount_percent = random.choice([5, 10, 15, 20, 25])
        max_discount_amount = random.choice([10000, 20000, 30000, 50000, 100000, 200000])
        min_order_amount = random.choice([0, 20000, 30000, 50000, 100000, 200000])
        expiry_date = now + timedelta(days=random.randint(30, 365))
        max_uses = random.choice([10, 50, 100, 500])
        used_count = random.randint(0, max_uses // 2)
        vouchers.append({
            "voucher_id": i,
            "code": code.upper(),
            "discount_percent": discount_percent,
            "max_discount_amount": max_discount_amount,
            "min_order_amount": min_order_amount,
            "expiry_date": expiry_date,
            "max_uses": max_uses,
            "used_count": used_count
        })

    vouchers.append({
        "voucher_id": vouchers_n + 1,
        "code": "EXPIRED",
        "discount_percent": 25,
        "max_discount_amount": 50000,
        "min_order_amount": 50000,
        "expiry_date": now - timedelta(days=400),
        "max_uses": 100,
        "used_count": 0
    })
    vouchers.append({
        "voucher_id": vouchers_n + 2,
        "code": "EXHAUSTED",
        "discount_percent": 15,
        "max_discount_amount": 30000,
        "min_order_amount": 30000,
        "expiry_date": now + timedelta(days=365),
        "max_uses": 10,
        "used_count": 10
    })

    lines.append("-- Vouchers\n")
    for v in vouchers:
        lines.append(
            "INSERT INTO Vouchers (voucher_id, code, discount_percent, max_discount_amount, min_order_amount, expiry_date, max_uses, used_count) VALUES "
            f"({v['voucher_id']}, {sql_escape(v['code'])}, {v['discount_percent']}, "
            f"{money(v['max_discount_amount'])}, {money(v['min_order_amount'])}, "
            f"{sql_escape(v['expiry_date'].strftime('%Y-%m-%d %H:%M:%S'))}, {v['max_uses']}, {v['used_count']});"
        )
    lines.append("\n")

    # 4) User_Addresses
    addresses = []
    addr_id = 1
    user_addresses_map = defaultdict(list)
    for u in users:
        n_addr = random.choices([1, 1, 2, 3], weights=[0.5, 0.2, 0.2, 0.1])[0]
        for j in range(n_addr):
            text = fake.address().replace("\n", ", ")
            is_default = (j == 0)
            addresses.append({
                "address_id": addr_id,
                "user_id": u["user_id"],
                "address_text": text,
                "is_default": is_default
            })
            user_addresses_map[u["user_id"]].append(addr_id)
            addr_id += 1

    lines.append("-- User_Addresses\n")
    for a in addresses:
        lines.append(
            f"INSERT INTO User_Addresses (address_id, user_id, address_text, is_default) VALUES "
            f"({a['address_id']}, {a['user_id']}, {sql_escape(a['address_text'])}, {1 if a['is_default'] else 0});"
        )
    lines.append("\n")

    # 5) Menu_Items
    menu_items = []
    item_id = 1
    restaurant_items_map = defaultdict(list)
    for r in restaurants:
        count = random.randint(5, 12)
        for _ in range(count):
            name = random.choice([
                "Phở bò tái", "Bún chả Hà Nội", "Cơm gà xối mỡ", "Trà sữa trân châu",
                "Bánh mì thịt nướng", "Hải sản hấp", "Cơm tấm sườn bì chả", "Bún riêu",
                "Mì Quảng", "Xôi mặn", "Gỏi cuốn"
            ]) + " " + fake.word()
            price = random.randrange(15000, 200000, 5000)
            image_url = None
            is_available = random.choices([1, 1, 1, 0], weights=[0.7, 0.1, 0.1, 0.1])[0]
            menu_items.append({
                "item_id": item_id,
                "restaurant_id": r["restaurant_id"],
                "name": name,
                "price": price,
                "image_url": image_url,
                "is_available": is_available
            })
            restaurant_items_map[r["restaurant_id"]].append(item_id)
            item_id += 1

    lines.append("-- Menu_Items\n")
    for it in menu_items:
        lines.append(
            f"INSERT INTO Menu_Items (item_id, restaurant_id, name, price, image_url, is_available) VALUES "
            f"({it['item_id']}, {it['restaurant_id']}, {sql_escape(it['name'])}, {money(it['price'])}, "
            f"{sql_escape(it['image_url'])}, {1 if it['is_available'] else 0});"
        )
    lines.append("\n")

    # 6) Reviews
    reviews = []
    review_id = 1
    for u in users:
        for _ in range(random.choices([0, 0, 1, 2, 3], weights=[0.4, 0.2, 0.2, 0.1, 0.1])[0]):
            r_pick = random.choice(restaurants)["restaurant_id"]
            rating = random.randint(1, 5)
            comment = fake.sentence(nb_words=8)
            created_at = now - timedelta(days=random.randint(0, 365))
            reviews.append({
                "review_id": review_id,
                "user_id": u["user_id"],
                "restaurant_id": r_pick,
                "rating": rating,
                "comment": comment,
                "created_at": created_at
            })
            review_id += 1

    lines.append("-- Reviews\n")
    for rv in reviews:
        lines.append(
            f"INSERT INTO Reviews (review_id, user_id, restaurant_id, rating, comment, created_at) VALUES "
            f"({rv['review_id']}, {rv['user_id']}, {rv['restaurant_id']}, {rv['rating']}, "
            f"{sql_escape(rv['comment'])}, {sql_escape(rv['created_at'].strftime('%Y-%m-%d %H:%M:%S'))});"
        )
    lines.append("\n")

    # 7) Cart
    carts = []
    cart_id = 1
    for u in users:
        for _ in range(random.choices([0, 1, 2], weights=[0.6, 0.3, 0.1])[0]):
            it = random.choice(menu_items)
            if not it["is_available"]:
                continue
            qty = random.randint(1, 3)
            carts.append({
                "cart_id": cart_id,
                "user_id": u["user_id"],
                "item_id": it["item_id"],
                "quantity": qty
            })
            cart_id += 1

    lines.append("-- cart\n")
    for c in carts:
        lines.append(
            f"INSERT INTO cart (cart_id, user_id, item_id, quantity) VALUES "
            f"({c['cart_id']}, {c['user_id']}, {c['item_id']}, {c['quantity']});"
        )
    lines.append("\n")

    # 8) Orders + 9) Order_Details + 10) Payments + 11) delivery_logs
    orders = []
    order_details = []
    payments = []
    delivery_logs = []
    order_id = 1
    detail_id = 1
    payment_id = 1
    delivery_log_id = 1

    order_status_choices = ["PENDING", "CONFIRMED", "PREPARING", "DELIVERING", "COMPLETED", "CANCELLED"]
    payment_methods = ["COD", "MOMO", "VNPAY"]

    for u in users:
        n_orders = random.choices([0, 0, 1, 1, 2], weights=[0.4, 0.1, 0.3, 0.15, 0.05])[0]
        for _ in range(n_orders):
            r = random.choice(restaurants)["restaurant_id"]
            addr_list = user_addresses_map[u["user_id"]]
            if not addr_list:
                continue
            addr = random.choice(addr_list)
            use_voucher = random.random() < 0.15 and len(vouchers) > 0
            voucher_id = None
            if use_voucher:
                v = random.choice(vouchers)
                voucher_id = v["voucher_id"]
            items_ids = restaurant_items_map[r]
            if not items_ids:
                continue
            n_items = random.randint(1, 4)
            chosen = random.sample(items_ids, min(n_items, len(items_ids)))
            total_price = 0.0
            for iid in chosen:
                item = next((x for x in menu_items if x["item_id"] == iid), None)
                if item is None or not item["is_available"]:
                    continue
                qty = random.randint(1, 3)
                note = random.choice([None, "Không hành", "Thêm đồ ăn phụ", "Nhiều nước"])
                order_details.append({
                    "detail_id": detail_id,
                    "order_id": order_id,
                    "item_id": iid,
                    "quantity": qty,
                    "note": note
                })
                detail_id += 1
                total_price += item["price"] * qty
            if total_price == 0:
                continue
            total_price_after = total_price
            if voucher_id is not None:
                v = next((x for x in vouchers if x["voucher_id"] == voucher_id), None)
                if v and total_price >= v["min_order_amount"] and v["used_count"] < v["max_uses"] and v["expiry_date"] > now:
                    discount = total_price * (v["discount_percent"] / 100.0)
                    discount = min(discount, v["max_discount_amount"])
                    total_price_after = max(0.0, total_price - discount)
                    v["used_count"] += 1
                else:
                    voucher_id = None

            status = random.choices(order_status_choices, weights=[0.4,0.1,0.15,0.15,0.15,0.05])[0]
            created_at = now - timedelta(days=random.randint(0, 90), hours=random.randint(0,23), minutes=random.randint(0,59))
            orders.append({
                "order_id": order_id,
                "user_id": u["user_id"],
                "restaurant_id": r,
                "address_id": addr,
                "voucher_id": voucher_id,
                "total_price": total_price_after,
                "status": status,
                "created_at": created_at
            })
            payment_method = random.choice(payment_methods)
            if status == "COMPLETED":
                pay_status = "COMPLETED"
            elif payment_method == "COD":
                pay_status = random.choices(["PENDING", "COMPLETED"], weights=[0.7, 0.3])[0]
            else:
                pay_status = random.choices(["PENDING", "COMPLETED"], weights=[0.5, 0.5])[0]
            payments.append({
                "payment_id": payment_id,
                "order_id": order_id,
                "amount": total_price_after,
                "method": payment_method,
                "status": pay_status
            })
            payment_id += 1

            delivery_logs.append({
                "log_id": delivery_log_id,
                "order_id": order_id,
                "status": {
                    "PENDING": "Đang xử lý",
                    "CONFIRMED": "Xác nhận",
                    "PREPARING": "Đang chuẩn bị",
                    "DELIVERING": "Đang giao",
                    "COMPLETED": "Đã giao",
                    "CANCELLED": "Đã hủy"
                }.get(status, "Đang xử lý"),
                "updated_at": created_at + timedelta(minutes=random.randint(10, 120))
            })
            delivery_log_id += 1

            order_id += 1

    # Write Orders
    lines.append("-- Orders\n")
    for o in orders:
        lines.append(
            f"INSERT INTO Orders (order_id, user_id, restaurant_id, address_id, voucher_id, total_price, status, created_at) VALUES "
            f"({o['order_id']}, {o['user_id']}, {o['restaurant_id']}, {o['address_id']}, "
            f"{o['voucher_id'] if o['voucher_id'] is not None else 'NULL'}, {money(o['total_price'])}, {sql_escape(o['status'])}, "
            f"{sql_escape(o['created_at'].strftime('%Y-%m-%d %H:%M:%S'))});"
        )
    lines.append("\n")

    # Order_Details
    lines.append("-- Order_Details\n")
    for d in order_details:
        lines.append(
            f"INSERT INTO Order_Details (detail_id, order_id, item_id, quantity, note) VALUES "
            f"({d['detail_id']}, {d['order_id']}, {d['item_id']}, {d['quantity']}, {sql_escape(d['note'])});"
        )
    lines.append("\n")

    # Payments
    lines.append("-- Payments\n")
    for p in payments:
        lines.append(
            f"INSERT INTO Payments (payment_id, order_id, amount, method, status) VALUES "
            f"({p['payment_id']}, {p['order_id']}, {money(p['amount'])}, {sql_escape(p['method'])}, {sql_escape(p['status'])});"
        )
    lines.append("\n")

    # Delivery logs
    lines.append("-- delivery_logs\n")
    for lg in delivery_logs:
        lines.append(
            f"INSERT INTO delivery_logs (log_id, order_id, status, updated_at) VALUES "
            f"({lg['log_id']}, {lg['order_id']}, {sql_escape(lg['status'])}, {sql_escape(lg['updated_at'].strftime('%Y-%m-%d %H:%M:%S'))});"
        )
    lines.append("\n")

    # Write all lines to file
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("-- Dummy data generated by generate_dummy_data.py\n")
        f.write("-- deterministic seed: {}\n\n".format(SEED))
        f.write("\n".join(lines))

    print(f"✓ Wrote dummy SQL with: users={len(users)}, restaurants={len(restaurants)}, vouchers={len(vouchers)}, "
          f"menu_items={len(menu_items)}, orders={len(orders)}, order_details={len(order_details)}, "
          f"payments={len(payments)}, delivery_logs={len(delivery_logs)} to {out_path}")


def parse_args():
    p = argparse.ArgumentParser(description="Generate dummy SQL for Restaurant--Manager")
    p.add_argument("--users", type=int, default=500, help="Number of users to generate (default 500)")
    p.add_argument("--restaurants", type=int, default=50, help="Number of restaurants (default 50)")
    p.add_argument("--vouchers", type=int, default=20, help="Number of random vouchers (default 20)")
    p.add_argument("--output", type=str, default="../../backend/database/dummy_data.sql", help="Output SQL file path")
    return p.parse_args()


if __name__ == "__main__":
    args = parse_args()
    generate(args)