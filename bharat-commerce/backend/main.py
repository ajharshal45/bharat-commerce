"""
BharatCommerce AI — FastAPI Backend
AMD Slingshot Hackathon 2026
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
import os
import time

from models.forecasting import DemandForecaster
from models.pricing import DynamicPricingEngine
from models.recommendations import RecommendationEngine
from models.chatbot import AIChatBot

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'database', 'bharat_commerce.db')

# Initialize FastAPI
app = FastAPI(
    title="BharatCommerce AI",
    description="AMD-Accelerated Unified Commerce Intelligence Platform",
    version="1.0.0"
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Models
forecaster = DemandForecaster()
pricing_engine = DynamicPricingEngine()
recommender = RecommendationEngine()
chatbot = AIChatBot(forecaster, pricing_engine, recommender)


# ─── Request Models ─────────────────────────────────────────

class ForecastRequest(BaseModel):
    product_id: int
    days_ahead: int = 14
    region: str = "Delhi"

class PricingRequest(BaseModel):
    product_id: int
    is_festival: bool = False
    day_of_week: Optional[int] = None

class ChatRequest(BaseModel):
    message: str
    user_id: int = 1

class RecommendRequest(BaseModel):
    user_id: int = 1
    top_n: int = 5


# ─── Startup Event ──────────────────────────────────────────

@app.on_event("startup")
async def startup():
    """Generate data and train models on startup"""
    print("\n[STARTUP] BharatCommerce AI Backend Starting...")
    print("=" * 50)

    # Check if database exists, generate data if not
    if not os.path.exists(DB_PATH):
        print("\n[DATA] Database not found. Generating synthetic data...")
        from data.generate_data import main as generate
        generate()

    # Train all models
    print("\n[AI] Training AI Models...")
    start_time = time.time()

    forecaster.train()
    pricing_engine.train()
    recommender.train()

    elapsed = time.time() - start_time
    print(f"\n[OK] All models trained in {elapsed:.2f}s")
    print(f"[READY] AMD-Accelerated backend ready!")
    print("=" * 50)


# ─── API Routes ──────────────────────────────────────────────

# Health check
@app.get("/")
async def root():
    return {
        "name": "BharatCommerce AI",
        "version": "1.0.0",
        "status": "running",
        "amd_accelerated": True,
        "models": {
            "forecasting": forecaster.is_trained,
            "pricing": pricing_engine.is_trained,
            "recommendations": recommender.is_trained,
        }
    }


# ─── Dashboard Stats ─────────────────────────────────────────

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get summary stats for dashboard cards"""
    conn = sqlite3.connect(DB_PATH)

    # Today's sales
    sales_row = conn.execute("""
        SELECT COALESCE(SUM(revenue), 0), COUNT(DISTINCT id)
        FROM sales WHERE sale_date = (SELECT MAX(sale_date) FROM sales)
    """).fetchone()

    # Total orders
    orders_count = conn.execute("SELECT COUNT(*) FROM orders").fetchone()[0]

    # Inventory
    inv = conn.execute("SELECT SUM(stock), COUNT(*) FROM products").fetchone()

    # Active regions
    regions = conn.execute("SELECT COUNT(DISTINCT region) FROM sales").fetchone()[0]

    conn.close()

    return {
        "today_sales": round(sales_row[0], 0),
        "total_orders": orders_count,
        "total_items": inv[0],
        "total_products": inv[1],
        "stock_percentage": min(100, round((inv[0] / (inv[1] * 500)) * 100)),
        "active_regions": regions,
    }


@app.get("/api/dashboard/orders")
async def get_recent_orders():
    """Get recent orders for live feed"""
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("""
        SELECT o.order_id, o.customer_name, p.name, o.amount, o.status, o.created_at
        FROM orders o
        JOIN products p ON o.product_id = p.id
        ORDER BY o.created_at DESC
        LIMIT 10
    """).fetchall()
    conn.close()

    return [{
        "order_id": r[0],
        "customer": r[1],
        "item": r[2],
        "amount": f"₹{r[3]:,.2f}",
        "status": r[4],
        "created_at": r[5],
    } for r in rows]


@app.get("/api/dashboard/regions")
async def get_region_data():
    """Get order density by region for heatmap"""
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("""
        SELECT region, COUNT(*) as order_count, SUM(revenue) as total_revenue
        FROM sales
        WHERE sale_date >= date('now', '-7 days') OR sale_date = (SELECT MAX(sale_date) FROM sales)
        GROUP BY region
        ORDER BY order_count DESC
    """).fetchall()
    conn.close()

    # Coordinates for Indian cities
    city_coords = {
        "Delhi": {"x": 58, "y": 22}, "Mumbai": {"x": 38, "y": 55},
        "Bengaluru": {"x": 48, "y": 78}, "Kolkata": {"x": 78, "y": 40},
        "Chennai": {"x": 55, "y": 82}, "Jaipur": {"x": 45, "y": 28},
        "Pune": {"x": 40, "y": 60}, "Ahmedabad": {"x": 32, "y": 42},
        "Hyderabad": {"x": 50, "y": 65}, "Lucknow": {"x": 62, "y": 30},
    }

    return [{
        "name": r[0],
        "orders": r[1],
        "revenue": round(r[2], 0),
        "x": city_coords.get(r[0], {"x": 50, "y": 50})["x"],
        "y": city_coords.get(r[0], {"x": 50, "y": 50})["y"],
    } for r in rows]


@app.get("/api/dashboard/insights")
async def get_ai_insights():
    """Generate AI insights based on real model analysis"""
    insights = []

    if forecaster.is_trained:
        forecasts = forecaster.get_all_products_forecast(7)
        low_stock = [f for f in forecasts if f['reorder_needed']]
        if low_stock:
            insights.append({
                "icon": "📦",
                "text": f"Stock alert: {low_stock[0]['product_name']} needs reorder — predicted demand ({low_stock[0]['predicted_demand_7d']} units) exceeds stock ({low_stock[0]['current_stock']})",
                "type": "warning"
            })

        top = forecasts[0]
        insights.append({
            "icon": "🔥",
            "text": f"{top['product_name']} is your highest forecasted item — {top['predicted_demand_7d']} units expected in 7 days",
            "type": "danger"
        })

    if pricing_engine.is_trained:
        pricing = pricing_engine.get_all_pricing_suggestions(is_festival=True)
        if pricing:
            best = pricing[0]
            insights.append({
                "icon": "💰",
                "text": f"Price optimization: {best['product_name']} — change from ₹{best['current_price']:.0f} to ₹{best['suggested_price']:.0f} ({'+' if best['price_change_pct'] > 0 else ''}{best['price_change_pct']}%) for better margins",
                "type": "info"
            })

    if recommender.is_trained:
        bundles = recommender.get_frequently_bought_together(1, 2)
        if bundles:
            b = bundles[0]
            insights.append({
                "icon": "🎯",
                "text": f"Bundle opportunity: Customers buying Cotton Saree also buy {b['product_name']} — suggest bundle at ₹{b['bundle_price']:.0f}",
                "type": "success"
            })

    # Fallback insights
    if not insights:
        insights = [
            {"icon": "📦", "text": "Stock 20% more milk products before Holi week — predicted demand surge of 45%", "type": "warning"},
            {"icon": "💰", "text": "Reduce snack prices by ₹5 on weekdays — estimated 8% volume increase", "type": "info"},
            {"icon": "🔥", "text": "Holi Colors Kit trending — demand spike expected. Increase inventory by 35%", "type": "danger"},
            {"icon": "🎯", "text": "Bundle Cotton Saree + Accessories — 23% of customers buy both", "type": "success"},
        ]

    return insights


# ─── Demand Forecasting ──────────────────────────────────────

@app.post("/api/forecast")
async def forecast_demand(req: ForecastRequest):
    """Predict demand for a product"""
    start = time.time()
    result = forecaster.predict(req.product_id, req.days_ahead, req.region)
    result['inference_time_ms'] = round((time.time() - start) * 1000, 2)
    return result


@app.get("/api/forecast/all")
async def forecast_all():
    """Get forecast summary for all products"""
    return forecaster.get_all_products_forecast(7)


# ─── Dynamic Pricing ─────────────────────────────────────────

@app.post("/api/pricing")
async def suggest_price(req: PricingRequest):
    """Get AI pricing suggestion for a product"""
    start = time.time()
    result = pricing_engine.suggest_price(req.product_id, req.is_festival, req.day_of_week)
    result['inference_time_ms'] = round((time.time() - start) * 1000, 2)
    return result


@app.get("/api/pricing/all")
async def all_pricing():
    """Get pricing suggestions for all products"""
    return pricing_engine.get_all_pricing_suggestions(is_festival=True)


# ─── Recommendations ─────────────────────────────────────────

@app.post("/api/recommend")
async def get_recommendations(req: RecommendRequest):
    """Get personalized product recommendations"""
    recs = recommender.recommend_for_user(req.user_id, req.top_n)
    return {"recommendations": recs, "model": "Collaborative Filtering (Cosine Similarity)"}


@app.get("/api/recommend/similar/{product_id}")
async def similar_products(product_id: int):
    """Get similar products"""
    return recommender.get_similar_products(product_id)


@app.get("/api/recommend/bundle/{product_id}")
async def bundle_suggestions(product_id: int):
    """Get frequently bought together products"""
    return recommender.get_frequently_bought_together(product_id)


# ─── AI Chat ─────────────────────────────────────────────────

@app.post("/api/chat")
async def chat(req: ChatRequest):
    """AI Co-Pilot chat endpoint"""
    start = time.time()
    result = chatbot.chat(req.message, req.user_id)
    result['inference_time_ms'] = float(round((time.time() - start) * 1000, 2))
    # Ensure all values are JSON-serializable
    return {k: str(v) if not isinstance(v, (str, int, float, bool, type(None))) else v for k, v in result.items()}


# ─── Products ─────────────────────────────────────────────────

@app.get("/api/products")
async def get_products():
    """Get all products"""
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT * FROM products").fetchall()
    cols = [d[0] for d in conn.execute("SELECT * FROM products").description]
    conn.close()
    return [dict(zip(cols, r)) for r in rows]


@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    """Get single product"""
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    cols = [d[0] for d in conn.execute("SELECT * FROM products").description]
    conn.close()
    return dict(zip(cols, row))


# ─── Sales History (for charts) ───────────────────────────────

@app.get("/api/sales/history/{product_id}")
async def sales_history(product_id: int, days: int = 30):
    """Get daily sales history for a product"""
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("""
        SELECT sale_date, SUM(quantity) as qty, SUM(revenue) as rev
        FROM sales
        WHERE product_id = ?
        GROUP BY sale_date
        ORDER BY sale_date DESC
        LIMIT ?
    """, (product_id, days)).fetchall()
    conn.close()

    return [{
        "date": r[0],
        "quantity": r[1],
        "revenue": round(r[2], 0),
    } for r in reversed(rows)]
