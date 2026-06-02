#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
explore_and_clean_data.py

Data exploration and cleaning script for Restaurant--Manager dummy dataset.

Features:
  - Load data from SQL file
  - Detect missing/null values
  - Find duplicates
  - Identify outliers
  - Validate referential integrity
  - Clean and normalize data
  - Generate quality report

Dependencies:
  pip install pandas numpy mysql-connector-python

Usage:
  python explore_and_clean_data.py
  python explore_and_clean_data.py --input ../../backend/database/dummy_data.sql
"""

import argparse
import re
import sys
import io
import pandas as pd
import numpy as np
from collections import defaultdict, Counter
from datetime import datetime

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


class SQLParser:
    """Parse SQL INSERT statements into pandas DataFrames"""
    
    @staticmethod
    def parse_sql_file(filepath):
        """Parse SQL INSERT statements and return dict of tables with data"""
        tables = defaultdict(list)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all INSERT statements: INSERT INTO table_name (...) VALUES (...)
        pattern = r"INSERT INTO (\w+)\s*\((.*?)\)\s*VALUES\s*\((.*?)\);"
        matches = re.finditer(pattern, content, re.IGNORECASE | re.DOTALL)
        
        for match in matches:
            table_name = match.group(1)
            columns_str = match.group(2)
            values_str = match.group(3)
            
            columns = [col.strip() for col in columns_str.split(',')]
            
            # Parse values (handle quoted strings with commas)
            values = SQLParser._parse_values(values_str)
            
            # Create row dict
            if len(values) == len(columns):
                row = dict(zip(columns, values))
                tables[table_name].append(row)
        
        # Convert to DataFrames
        dfs = {}
        for table_name, rows in tables.items():
            if rows:
                dfs[table_name] = pd.DataFrame(rows)
        
        return dfs
    
    @staticmethod
    def _parse_values(values_str):
        """Parse comma-separated values, respecting quoted strings"""
        values = []
        current = ""
        in_quotes = False
        
        for char in values_str:
            if char == "'" and (not current or current[-1] != "\\"):
                in_quotes = not in_quotes
                current += char
            elif char == "," and not in_quotes:
                values.append(current.strip())
                current = ""
            else:
                current += char
        
        if current.strip():
            values.append(current.strip())
        
        # Clean up values
        cleaned = []
        for val in values:
            val = val.strip()
            # Remove quotes if present
            if val.startswith("'") and val.endswith("'"):
                val = val[1:-1]
            # Handle NULL
            if val.upper() == "NULL":
                val = None
            cleaned.append(val)
        
        return cleaned


class DataExplorer:
    """Explore data quality and characteristics"""
    
    def __init__(self, dfs):
        self.dfs = dfs
        self.report = {}
    
    def explore_all(self):
        """Run complete exploration"""
        print("\n" + "="*80)
        print("DATA EXPLORATION REPORT")
        print("="*80 + "\n")
        
        for table_name, df in self.dfs.items():
            print(f"\n{'─'*80}")
            print(f"TABLE: {table_name}")
            print(f"{'─'*80}")
            self._explore_table(table_name, df)
    
    def _explore_table(self, table_name, df):
        """Explore single table"""
        self.report[table_name] = {}
        
        # Basic info
        print(f"\n📊 SHAPE: {df.shape[0]} rows × {df.shape[1]} columns")
        print(f"\nColumns: {', '.join(df.columns.tolist())}")
        
        # Data types
        print(f"\n📋 DATA TYPES:")
        for col in df.columns:
            print(f"  {col}: {df[col].dtype}")
        
        # Missing values
        missing = df.isnull().sum()
        if missing.sum() > 0:
            print(f"\n⚠️  MISSING VALUES:")
            for col in missing[missing > 0].index:
                pct = (missing[col] / len(df)) * 100
                print(f"  {col}: {missing[col]} ({pct:.1f}%)")
            self.report[table_name]['missing'] = missing[missing > 0].to_dict()
        else:
            print(f"\n✓ NO MISSING VALUES")
        
        # Duplicates
        dupes = df.duplicated().sum()
        if dupes > 0:
            print(f"\n⚠️  DUPLICATES: {dupes} rows")
            self.report[table_name]['duplicates'] = dupes
        else:
            print(f"\n✓ NO DUPLICATES")
        
        # Sample statistics for numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            print(f"\n📈 NUMERIC STATISTICS:")
            for col in numeric_cols:
                try:
                    vals = pd.to_numeric(df[col], errors='coerce').dropna()
                    print(f"  {col}:")
                    print(f"    min={vals.min():.2f}, max={vals.max():.2f}, "
                          f"mean={vals.mean():.2f}, median={vals.median():.2f}")
                except Exception as e:
                    print(f"  {col}: Error - {e}")
        
        # Unique values for categorical columns
        categorical_cols = df.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            print(f"\n🏷️  CATEGORICAL SUMMARY:")
            for col in categorical_cols[:5]:  # Show first 5
                unique_count = df[col].nunique()
                if unique_count <= 10:
                    print(f"  {col}: {unique_count} unique values")
                    for val, count in df[col].value_counts().items():
                        print(f"    {val}: {count}")
                else:
                    print(f"  {col}: {unique_count} unique values (showing top 5)")
                    for val, count in df[col].value_counts().head().items():
                        print(f"    {val}: {count}")


class DataValidator:
    """Validate data integrity and constraints"""
    
    def __init__(self, dfs):
        self.dfs = dfs
        self.issues = []
    
    def validate_all(self):
        """Run complete validation"""
        print("\n" + "="*80)
        print("DATA VALIDATION REPORT")
        print("="*80 + "\n")
        
        self._validate_referential_integrity()
        self._validate_constraints()
        self._validate_business_logic()
        
        if self.issues:
            print(f"\n⚠️  FOUND {len(self.issues)} ISSUES:\n")
            for i, issue in enumerate(self.issues, 1):
                print(f"{i}. {issue}")
        else:
            print("\n✓ ALL VALIDATIONS PASSED")
    
    def _validate_referential_integrity(self):
        """Check foreign key relationships"""
        print("\n🔗 REFERENTIAL INTEGRITY:")
        
        fk_rules = {
            'User_Addresses': {'user_id': 'Users.user_id'},
            'Menu_Items': {'restaurant_id': 'Restaurants.restaurant_id'},
            'Reviews': {'user_id': 'Users.user_id', 'restaurant_id': 'Restaurants.restaurant_id'},
            'cart': {'user_id': 'Users.user_id', 'item_id': 'Menu_Items.item_id'},
            'Orders': {'user_id': 'Users.user_id', 'restaurant_id': 'Restaurants.restaurant_id',
                      'address_id': 'User_Addresses.address_id', 'voucher_id': 'Vouchers.voucher_id'},
            'Order_Details': {'order_id': 'Orders.order_id', 'item_id': 'Menu_Items.item_id'},
            'Payments': {'order_id': 'Orders.order_id'},
            'delivery_logs': {'order_id': 'Orders.order_id'}
        }
        
        for table_name, fks in fk_rules.items():
            if table_name not in self.dfs:
                continue
            
            df = self.dfs[table_name]
            for fk_col, ref in fks.items():
                if fk_col not in df.columns:
                    continue
                
                ref_table, ref_col = ref.split('.')
                if ref_table not in self.dfs:
                    continue
                
                ref_df = self.dfs[ref_table]
                
                # Check non-NULL FKs
                non_null_fks = df[df[fk_col].notna()][fk_col]
                valid_refs = set(ref_df[ref_col].astype(str).unique())
                invalid = non_null_fks[~non_null_fks.astype(str).isin(valid_refs)]
                
                if len(invalid) > 0:
                    self.issues.append(
                        f"[{table_name}.{fk_col}] {len(invalid)} invalid references to {ref}"
                    )
                    print(f"  ⚠️  {table_name}.{fk_col} → {ref}: {len(invalid)} invalid")
                else:
                    print(f"  ✓ {table_name}.{fk_col} → {ref}")
    
    def _validate_constraints(self):
        """Check business constraints"""
        print("\n📏 CONSTRAINT VALIDATION:")
        
        # Reviews: rating 1-5
        if 'Reviews' in self.dfs:
            df = self.dfs['Reviews']
            if 'rating' in df.columns:
                invalid_ratings = df[~df['rating'].isin(['1', '2', '3', '4', '5'])]
                if len(invalid_ratings) > 0:
                    self.issues.append(f"[Reviews.rating] {len(invalid_ratings)} invalid ratings (must be 1-5)")
                    print(f"  ⚠️  Rating out of range: {len(invalid_ratings)}")
                else:
                    print(f"  ✓ All ratings in range [1-5]")
        
        # Users: phone unique
        if 'Users' in self.dfs:
            df = self.dfs['Users']
            if 'phone' in df.columns:
                dupes = df['phone'].duplicated().sum()
                if dupes > 0:
                    self.issues.append(f"[Users.phone] {dupes} duplicate phone numbers")
                    print(f"  ⚠️  Duplicate phones: {dupes}")
                else:
                    print(f"  ✓ All phone numbers unique")
        
        # Vouchers: discount_percent > 0
        if 'Vouchers' in self.dfs:
            df = self.dfs['Vouchers']
            if 'discount_percent' in df.columns:
                try:
                    invalid = df[pd.to_numeric(df['discount_percent'], errors='coerce') <= 0]
                    if len(invalid) > 0:
                        self.issues.append(f"[Vouchers.discount_percent] {len(invalid)} invalid discounts")
                        print(f"  ⚠️  Invalid discounts: {len(invalid)}")
                    else:
                        print(f"  ✓ All discounts > 0")
                except:
                    print(f"  ? Could not validate discounts")
    
    def _validate_business_logic(self):
        """Check business logic rules"""
        print("\n⚙️  BUSINESS LOGIC:")
        
        # Orders: total_price > 0
        if 'Orders' in self.dfs:
            df = self.dfs['Orders']
            if 'total_price' in df.columns:
                try:
                    invalid = df[pd.to_numeric(df['total_price'], errors='coerce') < 0]
                    if len(invalid) > 0:
                        self.issues.append(f"[Orders.total_price] {len(invalid)} negative prices")
                        print(f"  ⚠️  Negative prices: {len(invalid)}")
                    else:
                        print(f"  ✓ All prices >= 0")
                except:
                    pass
        
        # Cart: quantity > 0
        if 'cart' in self.dfs:
            df = self.dfs['cart']
            if 'quantity' in df.columns:
                try:
                    invalid = df[pd.to_numeric(df['quantity'], errors='coerce') <= 0]
                    if len(invalid) > 0:
                        self.issues.append(f"[cart.quantity] {len(invalid)} invalid quantities")
                        print(f"  ⚠️  Invalid quantities: {len(invalid)}")
                    else:
                        print(f"  ✓ All cart quantities > 0")
                except:
                    pass


class DataCleaner:
    """Clean and normalize data"""
    
    def __init__(self, dfs):
        self.dfs = dfs
        self.cleaned_dfs = {}
    
    def clean_all(self):
        """Run complete cleaning"""
        print("\n" + "="*80)
        print("DATA CLEANING")
        print("="*80 + "\n")
        
        for table_name, df in self.dfs.items():
            print(f"\n🧹 Cleaning {table_name}...")
            self.cleaned_dfs[table_name] = self._clean_table(table_name, df)
            print(f"  ✓ Cleaned {len(self.cleaned_dfs[table_name])} rows")
    
    def _clean_table(self, table_name, df):
        """Clean single table"""
        df = df.copy()
        
        # Remove complete duplicates
        df = df.drop_duplicates()
        
        # Standardize whitespace in string columns
        for col in df.select_dtypes(include=['object']).columns:
            df[col] = df[col].str.strip() if df[col].dtype == 'object' else df[col]
        
        # Convert numeric columns
        numeric_cols = {
            'user_id', 'restaurant_id', 'item_id', 'order_id', 'price',
            'total_price', 'amount', 'quantity', 'rating', 'discount_percent',
            'max_discount_amount', 'min_order_amount', 'latitude', 'longitude'
        }
        
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Standardize date/time formats
        date_cols = {'created_at', 'updated_at', 'expiry_date'}
        for col in date_cols:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
        
        return df
    
    def export_summary(self, output_file="../../backend/database/data_quality_report.txt"):
        """Export data quality summary"""
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("="*80 + "\n")
            f.write("DATA QUALITY SUMMARY\n")
            f.write("="*80 + "\n\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            for table_name, df in self.cleaned_dfs.items():
                f.write(f"\n{table_name}:\n")
                f.write(f"  Rows: {len(df)}\n")
                f.write(f"  Columns: {len(df.columns)}\n")
                f.write(f"  Missing values: {df.isnull().sum().sum()}\n")
                f.write(f"  Duplicates: {df.duplicated().sum()}\n")
        
        print(f"\n✓ Quality report saved to {output_file}")


def main():
    parser = argparse.ArgumentParser(description="Explore and clean restaurant data")
    parser.add_argument("--input", type=str, default="../../backend/database/dummy_data.sql",
                       help="Input SQL file path")
    args = parser.parse_args()
    
    print("🔄 Loading data...")
    dfs = SQLParser.parse_sql_file(args.input)
    print(f"✓ Loaded {len(dfs)} tables: {', '.join(dfs.keys())}")
    
    # Explore
    explorer = DataExplorer(dfs)
    explorer.explore_all()
    
    # Validate
    validator = DataValidator(dfs)
    validator.validate_all()
    
    # Clean
    cleaner = DataCleaner(dfs)
    cleaner.clean_all()
    cleaner.export_summary()
    
    print("\n" + "="*80)
    print("✓ DATA EXPLORATION & CLEANING COMPLETE")
    print("="*80 + "\n")


if __name__ == "__main__":
    main()
