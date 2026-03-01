"""
Generate synthetic Indian retail data for BharatCommerce AI
Creates realistic product catalog, sales history, user profiles, and transactions
"""

import sqlite3
import random
import json
from datetime import datetime, timedelta
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'bharat_commerce.db')

# Indian product catalog
PRODUCTS = [
    {"id": 1, "name": "Cotton Saree", "category": "Textiles", "base_price": 1499, "cost": 900, "stock": 250},
    {"id": 2, "name": "Basmati Rice 5kg", "category": "Grocery", "base_price": 349, "cost": 250, "stock": 500},
    {"id": 3, "name": "Toor Dal 1kg", "category": "Grocery", "base_price": 159, "cost": 110, "stock": 400},
    {"id": 4, "name": "Green Tea 100g", "category": "Beverages", "base_price": 299, "cost": 150, "stock": 300},
    {"id": 5, "name": "Holi Colors Kit", "category": "Festival", "base_price": 199, "cost": 80, "stock": 600},
    {"id": 6, "name": "Silk Kurta Set", "category": "Textiles", "base_price": 2499, "cost": 1500, "stock": 150},
    {"id": 7, "name": "Masala Chai 250g", "category": "Beverages", "base_price": 199, "cost": 90, "stock": 450},
    {"id": 8, "name": "Coconut Oil 1L", "category": "Personal Care", "base_price": 249, "cost": 160, "stock": 350},
    {"id": 9, "name": "Pichkari Set", "category": "Festival", "base_price": 349, "cost": 150, "stock": 400},
    {"id": 10, "name": "Dry Fruits Gift Box", "category": "Grocery", "base_price": 799, "cost": 450, "stock": 200},
    {"id": 11, "name": "Turmeric Powder 500g", "category": "Grocery", "base_price": 129, "cost": 70, "stock": 500},
    {"id": 12, "name": "Handloom Dupatta", "category": "Textiles", "base_price": 699, "cost": 400, "stock": 180},
    {"id": 13, "name": "Organic Thandai Mix", "category": "Beverages", "base_price": 399, "cost": 200, "stock": 250},
    {"id": 14, "name": "Incense Sticks Pack", "category": "Pooja", "base_price": 99, "cost": 40, "stock": 700},
    {"id": 15, "name": "Steel Utensils Set", "category": "Home", "base_price": 999, "cost": 600, "stock": 120},
    {"id": 16, "name": "Jaggery 1kg", "category": "Grocery", "base_price": 149, "cost": 80, "stock": 400},
    {"id": 17, "name": "Mehendi Cone Set", "category": "Festival", "base_price": 149, "cost": 50, "stock": 500},
    {"id": 18, "name": "Ghee 1L", "category": "Grocery", "base_price": 599, "cost": 400, "stock": 300},
    {"id": 19, "name": "Kolhapuri Chappal", "category": "Footwear", "base_price": 899, "cost": 500, "stock": 100},
    {"id": 20, "name": "Brass Diya Set", "category": "Pooja", "base_price": 449, "cost": 250, "stock": 200},
]

REGIONS = ["Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Jaipur", "Pune", "Ahmedabad", "Hyderabad", "Lucknow"]

CUSTOMERS = [
    "Aisha Sharma", "Rajesh Patel", "Priya Mehta", "Vikram Singh", "Neha Gupta",
    "Arjun Reddy", "Kavya Nair", "Suresh Kumar", "Ananya Das", "Rohit Verma",
    "Meera Joshi", "Amit Chauhan", "Pooja Rao", "Deepak Mishra", "Lakshmi Iyer",
    "Karan Malhotra", "Shreya Agarwal", "Manish Tiwari", "Ritu Saxena", "Sanjay Desai",
]


def create_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Products table
    c.execute('''CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        base_price REAL NOT NULL,
        cost REAL NOT NULL,
        current_price REAL NOT NULL,
        stock INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')

    # Sales history table
    c.execute('''CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        revenue REAL NOT NULL,
        region TEXT NOT NULL,
        customer_name TEXT,
        sale_date TEXT NOT NULL,
        day_of_week INTEGER,
        month INTEGER,
        is_festival_period INTEGER DEFAULT 0,
        FOREIGN KEY(product_id) REFERENCES products(id)
    )''')

    # Orders table
    c.execute('''CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL,
        region TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(product_id) REFERENCES products(id)
    )''')

    # AI predictions log
    c.execute('''CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        prediction_type TEXT NOT NULL,
        predicted_value REAL NOT NULL,
        confidence REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES products(id)
    )''')

    # User behavior for recommendations
    c.execute('''CREATE TABLE IF NOT EXISTS user_behavior (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        rating REAL,
        timestamp TEXT NOT NULL
    )''')

    conn.commit()
    return conn


def generate_sales_data(conn):
    """Generate 6 months of daily sales data with realistic Indian patterns"""
    c = conn.cursor()

    # Festival dates (approximate)
    festival_periods = [
        (datetime(2025, 10, 20), datetime(2025, 11, 5)),   # Diwali
        (datetime(2025, 12, 25), datetime(2026, 1, 2)),    # Christmas/NY
        (datetime(2026, 1, 14), datetime(2026, 1, 16)),    # Makar Sankranti
        (datetime(2026, 2, 26), datetime(2026, 3, 2)),     # Maha Shivratri
        (datetime(2026, 3, 10), datetime(2026, 3, 18)),    # Holi period
    ]

    start_date = datetime(2025, 9, 1)
    end_date = datetime(2026, 3, 1)
    current = start_date

    sales_records = []

    while current <= end_date:
        is_festival = any(start <= current <= end for start, end in festival_periods)
        is_weekend = current.weekday() >= 5
        day_of_week = current.weekday()
        month = current.month

        for product in PRODUCTS:
            # Base demand with product-specific patterns
            base_demand = random.randint(5, 25)

            # Category multipliers
            if product["category"] == "Festival" and is_festival:
                base_demand = int(base_demand * random.uniform(2.5, 4.0))
            elif product["category"] == "Grocery":
                base_demand = int(base_demand * random.uniform(1.0, 1.5))
            elif product["category"] == "Textiles" and is_festival:
                base_demand = int(base_demand * random.uniform(1.5, 2.5))

            # Weekend effect
            if is_weekend:
                base_demand = int(base_demand * random.uniform(1.2, 1.6))

            # Seasonal trends (Holi products spike in Feb-Mar)
            if product["category"] == "Festival" and month in [2, 3]:
                base_demand = int(base_demand * random.uniform(1.5, 3.0))

            # Some randomness
            quantity = max(1, base_demand + random.randint(-3, 5))

            # Price with small variations
            price = product["base_price"] * random.uniform(0.95, 1.05)
            revenue = quantity * price

            region = random.choice(REGIONS)
            customer = random.choice(CUSTOMERS)

            sales_records.append((
                product["id"], quantity, round(price, 2), round(revenue, 2),
                region, customer, current.strftime('%Y-%m-%d'),
                day_of_week, month, 1 if is_festival else 0
            ))

        current += timedelta(days=1)

    c.executemany('''INSERT INTO sales 
        (product_id, quantity, price, revenue, region, customer_name, sale_date, day_of_week, month, is_festival_period)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', sales_records)

    conn.commit()
    print(f"Generated {len(sales_records)} sales records")


def generate_orders(conn):
    """Generate recent orders for the live feed"""
    c = conn.cursor()
    statuses = ["Shipped", "Pending", "Delivered", "Processing"]

    for i in range(50):
        product = random.choice(PRODUCTS)
        customer = random.choice(CUSTOMERS)
        quantity = random.randint(1, 5)
        amount = product["base_price"] * quantity
        status = random.choice(statuses)
        region = random.choice(REGIONS)
        created_at = (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat()
        order_id = f"ORD-{7050 - i}"

        c.execute('''INSERT OR IGNORE INTO orders 
            (order_id, customer_name, product_id, quantity, amount, status, region, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
            (order_id, customer, product["id"], quantity, round(amount, 2), status, region, created_at))

    conn.commit()
    print("Generated 50 recent orders")


def generate_user_behavior(conn):
    """Generate user interaction data for recommendations"""
    c = conn.cursor()

    actions = ["view", "cart", "purchase", "wishlist"]
    records = []

    for user_id in range(1, 51):
        # Each user interacts with 5-15 products
        num_interactions = random.randint(5, 15)
        interacted_products = random.sample(range(1, 21), min(num_interactions, 20))

        for product_id in interacted_products:
            action = random.choice(actions)
            rating = round(random.uniform(1, 5), 1) if action == "purchase" else None
            timestamp = (datetime.now() - timedelta(days=random.randint(1, 60))).isoformat()

            records.append((user_id, product_id, action, rating, timestamp))

    c.executemany('''INSERT INTO user_behavior (user_id, product_id, action, rating, timestamp)
        VALUES (?, ?, ?, ?, ?)''', records)

    conn.commit()
    print(f"Generated {len(records)} user behavior records")


def seed_products(conn):
    """Insert product catalog"""
    c = conn.cursor()
    for p in PRODUCTS:
        c.execute('''INSERT OR REPLACE INTO products (id, name, category, base_price, cost, current_price, stock)
            VALUES (?, ?, ?, ?, ?, ?, ?)''',
            (p["id"], p["name"], p["category"], p["base_price"], p["cost"], p["base_price"], p["stock"]))
    conn.commit()
    print(f"Seeded {len(PRODUCTS)} products")


def main():
    print("[DATA] Generating BharatCommerce AI synthetic data...")
    print(f"Database path: {os.path.abspath(DB_PATH)}")

    conn = create_db()
    seed_products(conn)
    generate_sales_data(conn)
    generate_orders(conn)
    generate_user_behavior(conn)
    conn.close()

    print("[OK] Data generation complete!")
    print(f"   - 20 products")
    print(f"   - ~6 months of sales history")
    print(f"   - 50 recent orders")
    print(f"   - User behavior data for 50 users")


if __name__ == "__main__":
    main()
