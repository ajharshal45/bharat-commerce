import { useState, useEffect } from 'react'
import {
    FileText, Download, Calendar, TrendingUp, Package,
    DollarSign, Users, BarChart3, Printer
} from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import { getDashboardStats, getAllForecasts, getAllPricing } from '../services/api.js'
import './PageStyles.css'

const reportsList = [
    { name: "Daily Sales Summary", type: "Sales", generated: "Today, 6:00 AM", size: "24 KB", icon: TrendingUp, color: "#e8772e" },
    { name: "Inventory Health Report", type: "Inventory", generated: "Today, 6:00 AM", size: "18 KB", icon: Package, color: "#10b981" },
    { name: "AI Pricing Recommendations", type: "Pricing", generated: "Today, 6:00 AM", size: "32 KB", icon: DollarSign, color: "#3b82f6" },
    { name: "Customer Segmentation", type: "Customer", generated: "Yesterday", size: "56 KB", icon: Users, color: "#8b5cf6" },
    { name: "Demand Forecast Report", type: "Forecast", generated: "Today, 6:00 AM", size: "41 KB", icon: BarChart3, color: "#f59e0b" },
    { name: "Weekly Performance", type: "Performance", generated: "Last Monday", size: "78 KB", icon: TrendingUp, color: "#06b6d4" },
    { name: "Festival Readiness Report", type: "Festival", generated: "Today", size: "35 KB", icon: Calendar, color: "#ef4444" },
]

function Reports() {
    const [stats, setStats] = useState(null)
    const [forecasts, setForecasts] = useState([])
    const [pricingData, setPricingData] = useState([])

    useEffect(() => {
        async function load() {
            const [s, f, p] = await Promise.all([getDashboardStats(), getAllForecasts(), getAllPricing()])
            if (s) setStats(s)
            if (f) setForecasts(f)
            if (p) setPricingData(p)
        }
        load()
    }, [])

    const lowStockItems = forecasts.filter(f => f.reorder_needed)
    const priceChanges = pricingData.filter(p => Math.abs(p.price_change_pct) > 5)

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="page-main">
                <div className="page-header">
                    <div>
                        <h1><FileText size={24} /> Reports Center</h1>
                        <p className="page-subtitle">AI-generated business reports</p>
                    </div>
                    <div className="page-actions">
                        <button className="btn-secondary"><Printer size={16} /> Print</button>
                        <button className="btn-primary"><Download size={16} /> Export All</button>
                    </div>
                </div>

                {/* Live Summary Cards */}
                <div className="report-summary">
                    <div className="card report-card-highlight">
                        <h3>Quick Summary (Live)</h3>
                        <div className="report-metrics">
                            <div className="report-metric">
                                <span className="report-metric-label">Today's Revenue</span>
                                <span className="report-metric-value">₹{stats ? Math.round(stats.today_sales).toLocaleString('en-IN') : '...'}</span>
                            </div>
                            <div className="report-metric">
                                <span className="report-metric-label">Total Orders</span>
                                <span className="report-metric-value">{stats?.total_orders || '...'}</span>
                            </div>
                            <div className="report-metric">
                                <span className="report-metric-label">Low Stock Alerts</span>
                                <span className="report-metric-value warn-text">{lowStockItems.length}</span>
                            </div>
                            <div className="report-metric">
                                <span className="report-metric-label">Price Changes Needed</span>
                                <span className="report-metric-value">{priceChanges.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Forecast Summary */}
                {forecasts.length > 0 && (
                    <div className="card">
                        <div className="card-header"><h3>AI Forecast Alerts</h3></div>
                        <div className="alert-list">
                            {lowStockItems.slice(0, 5).map((item, idx) => (
                                <div key={idx} className="alert-row">
                                    <span className="alert-dot danger"></span>
                                    <span className="fw-600">{item.product_name}</span>
                                    <span className="text-muted">Stock: {item.current_stock}</span>
                                    <span className="text-muted">Predicted demand: {item.predicted_demand_7d}</span>
                                    <span className="status-badge status-danger">Reorder Needed</span>
                                </div>
                            ))}
                            {lowStockItems.length === 0 && (
                                <p className="text-muted" style={{ padding: '1rem' }}>All products are well-stocked based on AI forecasts.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Available Reports */}
                <div className="card">
                    <div className="card-header"><h3>Available Reports</h3></div>
                    <div className="reports-grid">
                        {reportsList.map((report, idx) => {
                            const Icon = report.icon
                            return (
                                <div key={idx} className="report-item">
                                    <div className="report-item-icon" style={{ background: `${report.color}15`, color: report.color }}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="report-item-info">
                                        <span className="report-item-name">{report.name}</span>
                                        <span className="report-item-meta">{report.generated} · {report.size}</span>
                                    </div>
                                    <div className="report-item-actions">
                                        <button className="btn-sm-secondary"><Download size={14} /> Download</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Reports
