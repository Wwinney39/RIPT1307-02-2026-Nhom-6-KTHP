#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Export MySQL to CSV for Power BI"""

import mysql.connector
import pandas as pd
import os
import sys
from dotenv import load_dotenv  # Thêm thư viện đọc file .env để xử lý Tiêu chí 1

# Tải các biến môi trường từ file .env
load_dotenv()

def main():
    print("="*60)
    print("Export MySQL to CSV for Power BI")
    print("="*60)
    
    try:
        # 1. Đọc cấu hình từ file .env (Giải quyết Tiêu chí 1 & 3)
        db_host = os.getenv("DB_HOST", "localhost")
        db_port = int(os.getenv("DB_PORT", 3306))
        db_user = os.getenv("DB_USER", "root")
        db_password = os.getenv("DB_PASSWORD", "")
        db_name = os.getenv("DB_NAME", "restaurant_db")
        db_ssl_enabled = os.getenv("DB_SSL", "false").lower() == "true"
        
        # 2. Xử lý cấu hình SSL động dựa trên môi trường (Giải quyết Tiêu chí 2)
        ssl_config = {}
        if db_ssl_enabled:
            # Nếu chạy Cloud Aiven (port 22180) -> Bật SSL và bỏ qua check chứng chỉ tự ký giống db.ts
            ssl_config = {"ssl_disabled": False} 
            print(f"\n📡 Connecting to MySQL CLOUD via port {db_port} (SSL Enabled)...")
        else:
            # Nếu chạy Localhost (port 3306) -> Tắt hoàn toàn SSL cho đỡ lỗi
            print(f"\n📡 Connecting to MySQL LOCALHOST via port {db_port}...")

        # Tiến hành kết nối với bộ tham số động an toàn
        connection = mysql.connector.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name,
            **ssl_config
        )
        print("✓ Connected!")
        
        # Create output directory
        output_dir = "csv_export"
        os.makedirs(output_dir, exist_ok=True)
        
        # Get all tables
        cursor = connection.cursor()
        cursor.execute("""
            SELECT TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = DATABASE()
            ORDER BY TABLE_NAME
        """)
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"\n📁 Exporting {len(tables)} tables to CSV...\n")
        
        # Export each table
        for table_name in tables:
            df = pd.read_sql(f"SELECT * FROM {table_name}", connection)
            filename = os.path.join(output_dir, f"{table_name}.csv")
            df.to_csv(filename, index=False, encoding='utf-8-sig')
            print(f"✓ {table_name:<20} ({len(df):>5} rows)")
        
        cursor.close()
        connection.close()
        
        print("\n✅ Export complete!")
        print(f"\n📊 CSV files saved to: {os.path.abspath(output_dir)}")
        return 0
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())