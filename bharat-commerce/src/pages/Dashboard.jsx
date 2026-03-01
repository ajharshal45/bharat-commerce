import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
    Search, Bell, IndianRupee, ShoppingCart, Package,
    MessageSquare, TrendingUp, MoreHorizontal, CheckCircle,
    Clock, Truck, Star, ArrowUpRight, Lightbulb, Loader2
} from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import {
    getDashboardStats, getRecentOrders, getRegionData,
    getAIInsights, getAllPricing, getForecast
} from '../services/api.js'
import {
    statsCards as fallbackStats, demandForecastData as fallbackForecast,
    pricingData as fallbackPricing, ordersData as fallbackOrders,
    regionData as fallbackRegions, fulfillmentData, satisfactionData,
    aiInsights as fallbackInsights
} from '../data/sampleData.js'
import './Dashboard.css'

const statusColors = {
    Shipped: { bg: '#dbeafe', color: '#2563eb', icon: Truck },
    Pending: { bg: '#fef3c7', color: '#d97706', icon: Clock },
    Delivered: { bg: '#d1fae5', color: '#059669', icon: CheckCircle },
    Processing: { bg: '#ede9fe', color: '#7c3aed', icon: Loader2 },
}

const statIcons = {
    rupee: IndianRupee,
    orders: ShoppingCart,
    inventory: Package,
    chats: MessageSquare,
}

function Dashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [orders, setOrders] = useState(null)
    const [regions, setRegions] = useState(null)
    const [pricing, setPricing] = useState(null)
    const [insights, setInsights] = useState(null)
    const [forecast, setForecast] = useState(null)
    const [loading, setLoading] = useState(true)
    const [backendConnected, setBackendConnected] = useState(false)

    useEffect(() => {
        async function fetchAll() {
            setLoading(true)

            // Try fetching from backend
            const [statsData, ordersData, regionsData, insightsData, pricingData, forecastData] =
                await Promise.all([
                    getDashboardStats(),
                    getRecentOrders(),
                    getRegionData(),
                    getAIInsights(),
                    getAllPricing(),
                    getForecast(1, 14),
                ])

            if (statsData) {
                setBackendConnected(true)
                setStats({
                    cards: [
                        { label: "Today's Sales", value: `₹${Number(statsData.today_sales).toLocaleString('en-IN')}`, icon: "rupee", color: "#e8772e", bg: "rgba(232, 119, 46, 0.1)" },
                        { label: "Total Orders", value: Number(statsData.total_orders).toLocaleString(), change: "+8.5%", icon: "orders", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
                        { label: "Inventory Status", value: statsData.total_items?.toLocaleString() || "8,912", subtitle: "items", progress: statsData.stock_percentage || 65, icon: "inventory", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
                        { label: "Active Chats", value: "118", subtitle: "WhatsApp Commerce", icon: "chats", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
                    ]
                })
            }

            if (ordersData) setOrders(ordersData)
            if (regionsData) setRegions(regionsData)
            if (insightsData) setInsights(insightsData)

            if (pricingData && pricingData.length) {
                setPricing(pricingData.slice(0, 3).map(p => ({
                    sku: p.product_name,
                    currentPrice: p.current_price,
                    aiPrice: p.suggested_price,
                    change: `${p.price_change_pct > 0 ? '+' : ''}${p.price_change_pct}%`,
                    demand: p.margin_pct > 40 ? "High Demand" : "Steady",
                    demandColor: p.price_change_pct > 10 ? "#ef4444" : p.price_change_pct > 0 ? "#10b981" : "#3b82f6",
                    trendData: [
                        { d: 'Sun', v: 30 + Math.random() * 30 },
                        { d: 'Mon', v: 40 + Math.random() * 30 },
                        { d: 'Tue', v: 35 + Math.random() * 30 },
                        { d: 'Wed', v: 50 + Math.random() * 30 },
                        { d: 'Thu', v: 45 + Math.random() * 30 },
                    ],
                })))
            }

            if (forecastData && forecastData.predictions) {
                setForecast(forecastData.predictions.map(p => ({
                    day: p.day,
                    predicted: p.predicted_demand,
                    actual: p.is_festival ? null : Math.round(p.predicted_demand * (0.85 + Math.random() * 0.3)),
                })))
            }

            setLoading(false)
        }

        fetchAll()
    }, [])

    // Use real data or fallbacks
    const displayStats = stats?.cards || fallbackStats
    const displayOrders = orders || fallbackOrders
    const displayRegions = regions || fallbackRegions
    const displayPricing = pricing || fallbackPricing
    const displayInsights = insights || fallbackInsights
    const displayForecast = forecast || fallbackForecast

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1>Welcome back, <span className="header-name">Aisha!</span></h1>
                        <p className="header-sub">
                            Seller Intelligence Dashboard
                            {backendConnected && <span className="backend-badge">● AI Backend Connected</span>}
                            {!backendConnected && !loading && <span className="backend-badge offline">● Demo Mode</span>}
                        </p>
                    </div>
                    <div className="header-right">
                        <div className="header-search">
                            <Search size={16} />
                            <input type="text" placeholder="Search..." />
                        </div>
                        <button className="header-notif">
                            <Bell size={18} />
                            <span className="notif-badge">5</span>
                        </button>
                        <div className="header-profile">
                            <div className="profile-avatar">AS</div>
                            <div className="profile-info">
                                <span className="profile-name">Aisha Sharma</span>
                                <span className="profile-role">Manager</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-row">
                    {displayStats.map((card, idx) => {
                        const Icon = statIcons[card.icon]
                        return (
                            <div className="stat-card" key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="stat-card-header">
                                    <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                                        <Icon size={18} />
                                    </div>
                                    <span className="stat-label">{card.label}</span>
                                </div>
                                <div className="stat-value">{card.value}
                                    {card.subtitle && <span className="stat-unit"> {card.subtitle}</span>}
                                </div>
                                {card.change && (
                                    <div className="stat-change">
                                        <ArrowUpRight size={14} /> {card.change}
                                    </div>
                                )}
                                {card.progress !== undefined && (
                                    <div className="stat-progress-wrap">
                                        <div className="stat-progress-bar">
                                            <div className="stat-progress-fill" style={{ width: `${card.progress}%` }}></div>
                                        </div>
                                        <span className="stat-progress-text">{card.progress}% stocked</span>
                                    </div>
                                )}
                                {card.icon === 'chats' && (
                                    <div className="stat-whatsapp">
                                        <span className="whatsapp-dot"></span> WhatsApp Commerce
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </section>

                {/* Main Grid: Heatmap + Dynamic Pricing */}
                <section className="dashboard-grid-main">
                    {/* India Demand Heatmap */}
                    <div className="card card-map">
                        <div className="card-header">
                            <h3>India Demand Heatmap</h3>
                            <span className="card-subtitle">Regional Demand Heatmap (Today)</span>
                            <button className="card-more"><MoreHorizontal size={18} /></button>
                        </div>
                        <div className="map-container">
                            <div className="india-map">
                                <svg viewBox="0 0 100 100" className="map-svg">
                                    <path d="M45,8 L55,8 L62,15 L68,12 L75,18 L80,22 L82,30 L78,35 L82,42 L78,48 L75,55 L70,60 L65,65 L60,72 L55,78 L52,85 L50,90 L48,88 L45,82 L42,75 L38,68 L35,62 L30,55 L28,48 L25,42 L28,35 L25,30 L30,22 L35,15 L40,10 Z"
                                        fill="rgba(232, 119, 46, 0.08)" stroke="rgba(232, 119, 46, 0.3)" strokeWidth="0.5"
                                    />
                                </svg>
                                {displayRegions.map((city, idx) => {
                                    const intensity = city.orders > 100 ? 'high' : city.orders > 50 ? 'medium' : 'low'
                                    return (
                                        <div key={idx} className={`map-marker map-marker-${intensity}`}
                                            style={{ left: `${city.x}%`, top: `${city.y}%` }}>
                                            <div className="marker-dot"></div>
                                            <div className="marker-label">
                                                <strong>{city.name}</strong>
                                                <span>{city.orders} orders</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="map-legend">
                                <span className="legend-title">Order Density</span>
                                <div className="legend-item"><span className="legend-dot legend-high"></span> High</div>
                                <div className="legend-item"><span className="legend-dot legend-medium"></span> Medium</div>
                                <div className="legend-item"><span className="legend-dot legend-low"></span> Low</div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Pricing AI */}
                    <div className="card card-pricing">
                        <div className="card-header">
                            <h3>Dynamic Pricing AI</h3>
                            {backendConnected && <span className="live-tag">LIVE</span>}
                            <button className="card-more"><MoreHorizontal size={18} /></button>
                        </div>
                        <div className="pricing-list">
                            {displayPricing.map((item, idx) => (
                                <div className="pricing-item" key={idx}>
                                    <div className="pricing-info">
                                        <div className="pricing-sku">SKU: {item.sku}</div>
                                        <div className="pricing-prices">
                                            <span className="pricing-current">Current: ₹{Number(item.currentPrice).toLocaleString()}</span>
                                            <span className="pricing-ai">AI Rec: ₹{Number(item.aiPrice).toLocaleString()}</span>
                                            <span className="pricing-change" style={{ color: item.demandColor }}>
                                                {item.change}
                                            </span>
                                        </div>
                                        <div className="pricing-demand" style={{ color: item.demandColor }}>
                                            {item.demand}
                                        </div>
                                        <button className="pricing-approve">Approve</button>
                                    </div>
                                    <div className="pricing-chart">
                                        <div className="pricing-chart-label">Pricing Trends</div>
                                        <ResponsiveContainer width="100%" height={50}>
                                            <LineChart data={item.trendData}>
                                                <Line type="monotone" dataKey="v" stroke={item.demandColor}
                                                    strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Demand Forecast Chart */}
                <section className="dashboard-grid-secondary">
                    <div className="card card-forecast">
                        <div className="card-header">
                            <h3>Demand Forecast — 14 Day View</h3>
                            <div className="card-header-legend">
                                <span className="legend-chip"><span className="chip-dot chip-actual"></span> Actual</span>
                                <span className="legend-chip"><span className="chip-dot chip-predicted"></span> Predicted</span>
                            </div>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={displayForecast}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#e8772e" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#e8772e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false}
                                        tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false}
                                        tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }} />
                                    <Area type="monotone" dataKey="actual" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} connectNulls={false} />
                                    <Area type="monotone" dataKey="predicted" stroke="#e8772e" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#e8772e' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div className="card card-insights">
                        <div className="card-header">
                            <h3><Lightbulb size={18} /> AI Insights</h3>
                            {backendConnected && <span className="live-tag">LIVE AI</span>}
                        </div>
                        <div className="insights-list">
                            {displayInsights.map((insight, idx) => (
                                <div className={`insight-item insight-${insight.type}`} key={idx}
                                    style={{ animationDelay: `${idx * 0.15}s` }}>
                                    <span className="insight-icon">{insight.icon}</span>
                                    <p>{insight.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom Row: Live Orders + Seller Performance */}
                <section className="dashboard-grid-bottom">
                    <div className="card card-orders">
                        <div className="card-header">
                            <h3>Live Order Feed</h3>
                            <button className="card-more"><MoreHorizontal size={18} /></button>
                        </div>
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Item</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayOrders.slice(0, 5).map((order, idx) => {
                                    const orderIdDisplay = order.order_id || order.id
                                    const status = statusColors[order.status] || statusColors.Pending
                                    const StatusIcon = status.icon
                                    return (
                                        <tr key={idx}>
                                            <td className="order-id">{orderIdDisplay}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.item}</td>
                                            <td className="order-amount">{order.amount}</td>
                                            <td>
                                                <span className="order-status" style={{ background: status.bg, color: status.color }}>
                                                    <StatusIcon size={12} /> {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="card card-performance">
                        <div className="card-header">
                            <h3>Seller Performance</h3>
                            <div className="perf-rating">
                                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                <span>4.6 Rating</span>
                            </div>
                        </div>
                        <div className="perf-charts">
                            <div className="perf-chart-item">
                                <span className="perf-chart-label">Fulfillment</span>
                                <ResponsiveContainer width="100%" height={80}>
                                    <BarChart data={fulfillmentData}>
                                        <Bar dataKey="value" fill="rgba(59, 130, 246, 0.6)" radius={[3, 3, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="perf-chart-item">
                                <span className="perf-chart-label">Satisfaction</span>
                                <ResponsiveContainer width="100%" height={80}>
                                    <AreaChart data={satisfactionData}>
                                        <defs>
                                            <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorSatisfaction)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Dashboard
