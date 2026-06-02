#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
setup_mysql.py

Setup MySQL database and import dummy data.

Dependencies:
  pip install mysql-connector-python

Usage:
  python setup_mysql.py --host localhost --user root --password root123
  python setup_mysql.py  # Uses defaults
"""

import argparse
import sys
import mysql.connector
from mysql.connector import Error
import os


def connect_mysql(host, user, password, port=3306):
    """Connect to MySQL server"""
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            port=port
        )
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"✓ Connected to MySQL Server version {db_info}")
            return connection
    except Error as e:
        print(f"✗ Error while connecting to MySQL: {e}")
        return None


def create_database(connection, db_name="restaurant_db"):
    """Create database"""
    try:
        cursor = connection.cursor()
        cursor.execute(f"DROP DATABASE IF EXISTS {db_name}")
        print(f"  Dropped existing {db_name} database")
        
        cursor.execute(f"""
            CREATE DATABASE {db_name} 
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci
        """)
        cursor.close()
        connection.commit()
        print(f"✓ Created database: {db_name}")
        return True
    except Error as e:
        print(f"✗ Error creating database: {e}")
        return False


def execute_sql_file(connection, sql_file, db_name="restaurant_db"):
    """Execute SQL file"""
    try:
        if not os.path.exists(sql_file):
            print(f"✗ File not found: {sql_file}")
            return False
        
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        cursor = connection.cursor()
        
        # Split by semicolon and execute each statement
        statements = sql_content.split(';')
        count = 0
        
        for statement in statements:
            statement = statement.strip()
            if not statement:
                continue
            
            # Skip "USE" statements, we'll select DB first
            if statement.upper().startswith('USE'):
                continue
            
            try:
                cursor.execute(statement)
                count += 1
            except Error as e:
                # Some errors are acceptable (like duplicate key in sample data)
                if "Duplicate entry" in str(e) or "already exists" in str(e):
                    pass
                else:
                    print(f"  Warning: {e}")
        
        cursor.close()
        connection.commit()
        print(f"✓ Executed {sql_file} ({count} statements)")
        return True
    except Error as e:
        print(f"✗ Error executing SQL file: {e}")
        return False


def verify_data(connection, db_name="restaurant_db"):
    """Verify imported data"""
    try:
        cursor = connection.cursor()
        
        # Use database
        cursor.execute(f"USE {db_name}")
        
        # Get table info
        cursor.execute("""
            SELECT TABLE_NAME, TABLE_ROWS
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = %s
            ORDER BY TABLE_NAME
        """, (db_name,))
        
        print(f"\n📊 Data Verification:")
        print(f"{'Table':<20} {'Rows':>10}")
        print("-" * 32)
        
        total_rows = 0
        for table_name, row_count in cursor.fetchall():
            row_count = row_count if row_count else 0
            print(f"{table_name:<20} {row_count:>10}")
            total_rows += row_count
        
        print("-" * 32)
        print(f"{'TOTAL':<20} {total_rows:>10}")
        
        cursor.close()
        return True
    except Error as e:
        print(f"✗ Error verifying data: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Setup MySQL database for Restaurant Manager")
    parser.add_argument("--host", type=str, default="localhost", help="MySQL host")
    parser.add_argument("--port", type=int, default=3306, help="MySQL port")
    parser.add_argument("--user", type=str, default="root", help="MySQL user")
    parser.add_argument("--password", type=str, default="root123", help="MySQL password")
    parser.add_argument("--database", type=str, default="restaurant_db", help="Database name")
    
    args = parser.parse_args()
    
    print("\n" + "="*60)
    print("MySQL Database Setup")
    print("="*60)
    print(f"Host: {args.host}:{args.port}")
    print(f"User: {args.user}")
    print(f"Database: {args.database}\n")
    
    # Connect
    print("📡 Connecting to MySQL...")
    connection = connect_mysql(args.host, args.user, args.password, args.port)
    if not connection:
        print("\n✗ Setup failed - cannot connect to MySQL")
        print("\nTroubleshoot:")
        print("1. Make sure MySQL is running: Start-Service MySQL80")
        print("2. Check credentials are correct")
        print("3. Default: host=localhost, user=root, password=root123")
        return 1
    
    # Create database
    print("\n🔨 Creating database...")
    if not create_database(connection, args.database):
        connection.close()
        return 1
    
    # Execute schema file
    print("\n📝 Creating tables...")
    schema_file = os.path.join(os.path.dirname(__file__), "database.sql")
    cursor = connection.cursor()
    cursor.execute(f"USE {args.database}")
    cursor.close()
    
    if not execute_sql_file(connection, schema_file, args.database):
        connection.close()
        return 1
    
    # Execute dummy data file
    print("\n📥 Importing dummy data...")
    dummy_file = os.path.join(os.path.dirname(__file__), "dummy_data.sql")
    if not execute_sql_file(connection, dummy_file, args.database):
        print("  (Some warnings are OK - continuing...)")
    
    # Verify
    print("\n✅ Verifying data...")
    verify_data(connection, args.database)
    
    # Close
    connection.close()
    
    print("\n" + "="*60)
    print("✓ Setup Complete!")
    print("="*60)
    print(f"\nConnection String for Power BI:")
    print(f"  Server: {args.host}")
    print(f"  Port: {args.port}")
    print(f"  Username: {args.user}")
    print(f"  Password: {args.password}")
    print(f"  Database: {args.database}")
    print("\nYou can now connect to this database from Power BI!")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
