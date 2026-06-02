#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
export_to_csv.py

Export MySQL data to CSV files for Power BI.

Usage:
  python export_to_csv.py
"""

import mysql.connector
from mysql.connector import Error
import pandas as pd
import os


def connect_mysql(host, user, password, database, port=3306):
    """Connect to MySQL"""
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port
        )
        return connection
    except Error as e:
        print(f"✗ Error: {e}")
        return None


def export_tables_to_csv(connection, output_dir="."):
    """Export all tables to CSV"""
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    cursor = connection.cursor()
    
    # Get all tables
    cursor.execute("""
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
        ORDER BY TABLE_NAME
    """)
    
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f"\n📁 Exporting {len(tables)} tables to CSV...\n")
    
    for table_name in tables:
        try:
            # Read data
            query = f"SELECT * FROM {table_name}"
            df = pd.read_sql(query, connection)
            
            # Save to CSV
            filename = os.path.join(output_dir, f"{table_name}.csv")
            df.to_csv(filename, index=False, encoding='utf-8-sig')
            
            print(f"✓ {table_name:<20} ({len(df):>5} rows) → {filename}")
        
        except Exception as e:
            print(f"✗ {table_name}: {e}")
    
    cursor.close()
    print("\n✅ Export complete!")


def main():
    print("="*60)
    print("Export MySQL to CSV for Power BI")
    print("="*60)
    
    # Connect
    print("\n📡 Connecting to MySQL...")
    connection = connect_mysql(
        host="localhost",
        user="root",
        password="hieu2006",
        database="restaurant_db"
    )
    
    if not connection:
        return 1
    
    print("✓ Connected!")
    
    # Export
    output_dir = "./csv_export"
    export_tables_to_csv(connection, output_dir)
    
    connection.close()
    
    print(f"\n📊 All CSV files saved in: {os.path.abspath(output_dir)}")
    print("\nNow in Power BI:")
    print("1. Get Data → Folder")
    print(f"2. Select: {os.path.abspath(output_dir)}")
    print("3. Combine & Load")
    
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
