# 🚀 BharatCommerce AI — Unified Commerce Intelligence Platform

> **AI Co-Pilot for Every Indian Seller** | Built for AMD Slingshot Hackathon 2026

[![AMD Powered](https://img.shields.io/badge/AMD-Instinct™_MI300X-ED1C24?style=for-the-badge&logo=amd&logoColor=white)](https://www.amd.com/en/products/accelerators/instinct/mi300.html)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

---

## 📋 Problem Statement

India has **63 million+ MSMEs** (Micro, Small & Medium Enterprises) — kirana stores, small retailers, and rural sellers. They form the backbone of the Indian economy but face critical challenges:

- ❌ **No access to AI tools** for demand prediction or pricing optimization
- ❌ **Poor demand forecasting** leads to stockouts before festivals and overstocking after
- ❌ **No unified intelligence** connecting buyer behavior to seller decisions
- ❌ **Existing enterprise solutions** are too expensive and complex for small sellers

## 💡 Our Solution

**BharatCommerce AI** is a Unified Commerce Intelligence Platform that brings enterprise-grade AI capabilities to every Indian MSME seller through three core AI engines:

| AI Engine | Algorithm | What It Does |
|-----------|-----------|-------------|
| 🔮 **Demand Forecasting** | GradientBoosting (R²=0.47) | Predicts product demand 14 days ahead with festival awareness |
| 💰 **Dynamic Pricing** | XGBoost (R²=0.71) | Suggests optimal prices across 45 price points per product |
| 🤖 **AI Co-Pilot Chat** | Intent Detection + ML Models | Natural language assistant with data-backed answers |
| 🎯 **Recommendations** | Collaborative Filtering | Personalized product & bundle suggestions |

All optimized for **AMD Instinct™ GPUs** using ROCm and ONNX Runtime with MIGraphX.

---

## 🖥️ Screenshots

### Seller Intelligence Dashboard
The command center with real-time stats, India demand heatmap, AI pricing suggestions, demand forecast charts, and live order tracking.

### AI Co-Pilot Chat
Natural language assistant that queries trained ML models to provide data-backed inventory, pricing, and trend recommendations.

### Landing Page
Story-driven introduction with AMD branding and feature showcase.

---

## 🏗️ Architecture

```
┌──────────────────┐     ┌──────────────────────────────────────┐
│   React Frontend │     │       FastAPI Backend (Python)        │
│   (Vite + JSX)   │────▶│                                      │
│                  │     │  ┌──────────┐  ┌──────────────────┐  │
│  9 Pages:        │     │  │ Demand   │  │ Dynamic Pricing  │  │
│  • Landing       │     │  │ Forecast │  │ Engine (XGBoost) │  │
│  • Dashboard     │     │  │ (GBR)    │  └──────────────────┘  │
│  • Inventory     │     │  └──────────┘                        │
│  • Orders        │     │  ┌──────────┐  ┌──────────────────┐  │
│  • Analytics     │     │  │ Recommend│  │  AI Chat Bot     │  │
│  • Pricing       │     │  │ Engine   │  │  (Intent + ML)   │  │
│  • Customers     │     │  └──────────┘  └──────────────────┘  │
│  • Reports       │     │                                      │
│  • AI Chat       │     │  ┌──────────────────────────────┐    │
│                  │     │  │  SQLite Database              │    │
└──────────────────┘     │  │  20 products, 3640 sales,    │    │
                         │  │  50 orders, 507 behaviors    │    │
                         │  └──────────────────────────────┘    │
                         └──────────────────────────────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │  AMD Instinct™ MI300X GPU    │
                         │  ROCm + ONNX Runtime        │
                         │  MIGraphX Acceleration       │
                         └─────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Recharts, Lucide Icons, React Router |
| **Backend** | FastAPI, Uvicorn, Python 3.12+ |
| **AI/ML** | scikit-learn, XGBoost, NumPy, Pandas |
| **Database** | SQLite (synthetic Indian retail data) |
| **GPU Acceleration** | AMD ROCm, ONNX Runtime, MIGraphX |
| **Styling** | Vanilla CSS (dark theme, glassmorphism) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.10+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/ajharshal45/bharat-commerce.git
cd bharat-commerce
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Start the Backend
```bash
# From the backend directory
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
> On startup, the backend will automatically:
> - Generate synthetic Indian retail data (20 products, 6 months of sales)
> - Train all 3 AI models (~1 second)
> - Start serving API endpoints

### 5. Start the Frontend
```bash
# From the project root
npm run dev
```

### 6. Open in Browser
```
Frontend: http://localhost:5173
Backend:  http://localhost:8000
API Docs: http://localhost:8000/docs
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/dashboard/stats` | GET | Real-time store statistics |
| `/api/dashboard/orders` | GET | Recent orders list |
| `/api/dashboard/regions` | GET | Region-wise order data |
| `/api/dashboard/insights` | GET | AI-generated business insights |
| `/api/forecast` | POST | Demand forecast for a product |
| `/api/forecast/all` | GET | Forecast summary for all products |
| `/api/pricing` | POST | Pricing suggestion for a product |
| `/api/pricing/all` | GET | Pricing for all products |
| `/api/recommend` | POST | Product recommendations |
| `/api/recommend/similar/{id}` | GET | Similar product suggestions |
| `/api/recommend/bundle/{id}` | GET | Bundle suggestions |
| `/api/chat` | POST | AI Co-Pilot chat |
| `/api/products` | GET | All products |
| `/api/sales/history/{id}` | GET | Sales history for a product |

---

## 📂 Project Structure

```
bharat-commerce/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   └── Sidebar.css
│   ├── pages/
│   │   ├── Landing.jsx          # Landing page
│   │   ├── Dashboard.jsx        # Main intelligence dashboard
│   │   ├── Inventory.jsx        # Inventory management
│   │   ├── Orders.jsx           # Order tracking
│   │   ├── Analytics.jsx        # Business analytics (4 charts)
│   │   ├── Pricing.jsx          # AI pricing management
│   │   ├── Customer.jsx         # Customer insights
│   │   ├── Reports.jsx          # AI report center
│   │   ├── AIChat.jsx           # AI Co-Pilot chat
│   │   └── PageStyles.css       # Shared page styles
│   ├── services/
│   │   └── api.js               # Backend API service layer
│   ├── data/
│   │   └── sampleData.js        # Fallback demo data
│   ├── App.jsx                  # Router setup
│   ├── main.jsx                 # Entry point
│   └── index.css                # Design system
├── backend/
│   ├── main.py                  # FastAPI app + all routes
│   ├── requirements.txt         # Python dependencies
│   ├── models/
│   │   ├── forecasting.py       # GradientBoosting demand model
│   │   ├── pricing.py           # XGBoost pricing model
│   │   ├── recommendations.py   # Collaborative filtering
│   │   └── chatbot.py           # AI chat with intent detection
│   ├── data/
│   │   └── generate_data.py     # Synthetic data generator
│   ├── database/                # SQLite database (auto-generated)
│   └── saved_models/            # Trained model files (auto-generated)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎯 AMD Acceleration

This project is designed to leverage AMD's AI acceleration stack:

- **AMD Instinct™ MI300X** — GPU accelerated model training and inference
- **ROCm** — Open-source GPU computing platform
- **ONNX Runtime** — Cross-platform inference with MIGraphX backend
- **Model optimization** — XGBoost and scikit-learn models exportable to ONNX format for GPU inference

### Inference Performance
- Chat response: **~20ms** per query
- All models training: **<1 second** on startup
- Pricing optimization: **45 price points** tested per product

---

## 👥 Team

**Ajay Harshal** — Full Stack Developer
- GitHub: [@ajharshal45](https://github.com/ajharshal45)

---

## 📄 License

This project is built for the **AMD Slingshot Hackathon 2026** under the theme *"AI in Consumer Experiences"*.

---

<p align="center">
  <strong>BharatCommerce AI</strong> — Because every Indian seller deserves an AI co-pilot.<br>
  Built with ❤️ for AMD Slingshot 2026
</p>
