#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
export_to_csv.py

Export MySQL data (Cloud/Aiven) to CSV files for Power BI.
"""

import mysql.connector
from mysql.connector import Error
import pandas as pd
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


def connect_mysql(host, user, password, database, port, ssl_mode="REQUIRED"):
    """Connect to MySQL with SSL support matching Node.js config"""
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port,
            ssl_mode=ssl_mode  # REQUIRED tương đương với rejectUnauthorized: false
        )
        return connection
    except Error as e:
        print(f"✗ Lỗi kết nối: {e}")
        return None


def export_tables_to_csv(connection, output_dir="."):
    """Export all tables to CSV"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    cursor = connection.cursor()
    cursor.execute("""
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
        ORDER BY TABLE_NAME
    """)
    
    tables = [row[0] for row in cursor.fetchall()]
    print(f"\n📁 Đang xuất {len(tables)} bảng ra file CSV...\n")
    
    for table_name in tables:
        try:
            query = f"SELECT * FROM {table_name}"
            df = pd.read_sql(query, connection)
            
            filename = os.path.join(output_dir, f"{table_name}.csv")
            df.to_csv(filename, index=False, encoding='utf-8-sig')
            print(f"✓ {table_name:<20} ({len(df):>5} dòng) → {filename}")
        except Exception as e:
            print(f"✗ {table_name}: {e}")
            
    cursor.close()
    print("\n✅ Xuất dữ liệu hoàn tất!")


def main():
    print("="*60)
    print("Export MySQL (Cloud/Aiven) to CSV for Power BI")
    print("="*60)
    
    # Lấy dữ liệu từ .env, nếu trống sẽ tự động lấy thông tin từ db.ts của bạn
    db_host = os.getenv("DB_HOST", "mysql-257790e3-restaurant-project.l.aivencloud.com")
    db_user = os.getenv("DB_USER", "avnadmin")
    db_pass = os.getenv("DB_PASSWORD", "")  # Điền mật khẩu vào đây hoặc qua file .env
    db_name = os.getenv("DB_NAME", "restaurant_db")
    db_port = int(os.getenv("DB_PORT", "22180"))
    db_ssl = os.getenv("DB_SSL_MODE", "REQUIRED")
    
    print("\n📡 Đang kết nối tới MySQL Cloud...")
    print(f"🔗 Host: {db_host}:{db_port} | Database: {db_name}")
    
    connection = connect_mysql(
        host=db_host,
        user=db_user,
        password=db_pass,
        database=db_name,
        port=db_port,
        ssl_mode=db_ssl
    )
    
    if not connection:
        print("✗ Thất bại! Vui lòng kiểm tra lại đường truyền hoặc mật khẩu.")
        return 1
    
    print("✓ Kết nối thành công!")
    
    output_dir = "./csv_export"
    export_tables_to_csv(connection, output_dir)
    connection.close()
    
    print(f"\n📊 Toàn bộ file CSV đã được lưu tại: {os.path.abspath(output_dir)}")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())