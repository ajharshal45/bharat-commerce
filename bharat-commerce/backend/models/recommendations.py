"""
Product Recommendation Engine
Uses collaborative filtering and content-based approaches
"""

import sqlite3
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from collections import defaultdict
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'bharat_commerce.db')


class RecommendationEngine:
    def __init__(self):
        self.user_item_matrix = None
        self.item_similarity = None
        self.product_features = None
        self.is_trained = False

    def train(self):
        """Build recommendation matrices from user behavior data"""
        print("[RECOMMEND] Training Recommendation engine...")
        conn = sqlite3.connect(DB_PATH)

        # User-Item interaction matrix
        behavior = pd.read_sql_query("""
            SELECT user_id, product_id, action, rating FROM user_behavior
        """, conn)

        products = pd.read_sql_query("SELECT * FROM products", conn)

        # Co-purchase patterns from sales
        sales = pd.read_sql_query("""
            SELECT customer_name, product_id, sale_date FROM sales
        """, conn)

        conn.close()

        if behavior.empty:
            print("[WARN] No behavior data!")
            return

        # Create interaction scores
        action_weights = {'view': 1, 'wishlist': 2, 'cart': 3, 'purchase': 5}
        behavior['score'] = behavior['action'].map(action_weights)

        # User-Item matrix
        self.user_item_matrix = behavior.pivot_table(
            index='user_id', columns='product_id', values='score',
            aggfunc='sum', fill_value=0
        )

        # Item-Item similarity (collaborative filtering)
        self.item_similarity = pd.DataFrame(
            cosine_similarity(self.user_item_matrix.T),
            index=self.user_item_matrix.columns,
            columns=self.user_item_matrix.columns
        )

        # Content-based features
        if not products.empty:
            product_dummies = pd.get_dummies(products[['category']])
            scaler = MinMaxScaler()
            price_features = scaler.fit_transform(products[['base_price', 'cost']])
            self.product_features = np.hstack([product_dummies.values, price_features])

        # Co-purchase analysis
        self.co_purchases = defaultdict(lambda: defaultdict(int))
        for customer in sales['customer_name'].unique():
            customer_products = sales[sales['customer_name'] == customer]['product_id'].unique()
            for i in range(len(customer_products)):
                for j in range(i + 1, len(customer_products)):
                    self.co_purchases[customer_products[i]][customer_products[j]] += 1
                    self.co_purchases[customer_products[j]][customer_products[i]] += 1

        self.is_trained = True
        print("[OK] Recommendation engine trained!")

    def recommend_for_user(self, user_id: int, top_n: int = 5):
        """Get personalized recommendations for a user"""
        if not self.is_trained:
            self.train()

        conn = sqlite3.connect(DB_PATH)
        products = pd.read_sql_query("SELECT * FROM products", conn)
        conn.close()

        if user_id not in self.user_item_matrix.index:
            # Cold start — recommend popular items
            return self._popular_items(top_n)

        user_scores = self.user_item_matrix.loc[user_id]
        interacted = user_scores[user_scores > 0].index.tolist()

        # Collaborative scores
        recommendations = {}
        for product_id in self.user_item_matrix.columns:
            if product_id in interacted:
                continue
            score = 0
            for interacted_id in interacted:
                if product_id in self.item_similarity.columns and interacted_id in self.item_similarity.index:
                    score += self.item_similarity.loc[interacted_id, product_id] * user_scores[interacted_id]
            recommendations[product_id] = score

        # Sort and get top N
        sorted_recs = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:top_n]

        results = []
        for product_id, score in sorted_recs:
            prod = products[products['id'] == product_id]
            if not prod.empty:
                p = prod.iloc[0]
                results.append({
                    "product_id": int(product_id),
                    "product_name": p['name'],
                    "category": p['category'],
                    "price": p['base_price'],
                    "relevance_score": round(float(score), 3),
                    "reason": "Based on your purchase history"
                })

        return results

    def get_similar_products(self, product_id: int, top_n: int = 5):
        """Get products similar to a given product"""
        if not self.is_trained:
            self.train()

        conn = sqlite3.connect(DB_PATH)
        products = pd.read_sql_query("SELECT * FROM products", conn)
        conn.close()

        if product_id not in self.item_similarity.index:
            return []

        similarities = self.item_similarity[product_id].drop(product_id).sort_values(ascending=False)
        top_similar = similarities.head(top_n)

        results = []
        for pid, sim_score in top_similar.items():
            prod = products[products['id'] == pid]
            if not prod.empty:
                p = prod.iloc[0]
                results.append({
                    "product_id": int(pid),
                    "product_name": p['name'],
                    "category": p['category'],
                    "price": p['base_price'],
                    "similarity_score": round(float(sim_score), 3),
                })

        return results

    def get_frequently_bought_together(self, product_id: int, top_n: int = 3):
        """Get products frequently purchased together"""
        if not self.is_trained:
            self.train()

        conn = sqlite3.connect(DB_PATH)
        products = pd.read_sql_query("SELECT * FROM products", conn)
        conn.close()

        if product_id not in self.co_purchases:
            return []

        co_products = sorted(self.co_purchases[product_id].items(), key=lambda x: x[1], reverse=True)[:top_n]

        results = []
        for pid, count in co_products:
            prod = products[products['id'] == pid]
            if not prod.empty:
                p = prod.iloc[0]
                results.append({
                    "product_id": int(pid),
                    "product_name": p['name'],
                    "category": p['category'],
                    "price": p['base_price'],
                    "co_purchase_count": int(count),
                    "bundle_price": round((p['base_price'] + products[products['id'] == product_id].iloc[0]['base_price']) * 0.9, 0),
                })

        return results

    def _popular_items(self, top_n: int = 5):
        """Return most popular items (cold start fallback)"""
        conn = sqlite3.connect(DB_PATH)
        query = """
            SELECT p.id, p.name, p.category, p.base_price, SUM(s.quantity) as total_sold
            FROM products p
            JOIN sales s ON p.id = s.product_id
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT ?
        """
        results = pd.read_sql_query(query, conn, params=(top_n,))
        conn.close()

        return [{
            "product_id": int(r['id']),
            "product_name": r['name'],
            "category": r['category'],
            "price": r['base_price'],
            "relevance_score": 1.0,
            "reason": f"Popular item — {r['total_sold']} sold"
        } for _, r in results.iterrows()]
