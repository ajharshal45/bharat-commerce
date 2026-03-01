import { useState, useEffect } from 'react'
import {
    DollarSign, ArrowUpRight, ArrowDownRight, Check, X,
    TrendingUp, MoreHorizontal, Zap
} from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import Sidebar from '../components/Sidebar.jsx'
import { getAllPricing } from '../services/api.js'
import './PageStyles.css'

function Pricing() {
    const [pricing, setPricing] = useState([])
    const [loading, setLoading] = useState(true)
    const [approved, setApproved] = useState(new Set())

    useEffect(() => {
        async function load() {
            const data = await getAllPricing()
            if (data) setPricing(data)
            setLoading(false)
        }
        load()
    }, [])

    const handleApprove = (idx) => {
        setApproved(prev => new Set([...prev, idx]))
    }

    const totalImpact = pricing.reduce((s, p) => s + (p.revenue_impact || 0), 0)
    const avgChange = pricing.length ? (pricing.reduce((s, p) => s + Math.abs(p.price_change_pct || 0), 0) / pricing.length).toFixed(1) : 0

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="page-main">
                <div className="page-header">
                    <div>
                        <h1><DollarSign size={24} /> AI Dynamic Pricing</h1>
                        <p className="page-subtitle">XGBoost-powered pricing optimization</p>
                    </div>
                    <div className="page-actions">
                        <button className="btn-primary" onClick={() => pricing.forEach((_, i) => handleApprove(i))}>
                            <Zap size={16} /> Approve All
                        </button>
                    </div>
                </div>

                <div className="stats-row-sm">
                    <div className="stat-sm">
                        <span className="stat-sm-label">Products Analyzed</span>
                        <span className="stat-sm-value">{pricing.length}</span>
                    </div>
                    <div className="stat-sm success">
                        <span className="stat-sm-label">Approved</span>
                        <span className="stat-sm-value">{approved.size}</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Avg Price Change</span>
                        <span className="stat-sm-value">{avgChange}%</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Est. Revenue Impact</span>
                        <span className="stat-sm-value">₹{Math.round(totalImpact).toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Current Price</th>
                                <th>AI Suggested</th>
                                <th>Change</th>
                                <th>Margin</th>
                                <th>Confidence</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="loading-cell">Running XGBoost pricing engine...</td></tr>
                            ) : pricing.map((p, idx) => {
                                const isUp = p.price_change_pct > 0
                                const isApproved = approved.has(idx)
                                return (
                                    <tr key={idx} className={isApproved ? 'row-approved' : ''}>
                                        <td className="fw-600">{p.product_name}</td>
                                        <td><span className="category-badge">{p.category}</span></td>
                                        <td>₹{p.current_price?.toLocaleString()}</td>
                                        <td className="fw-600" style={{ color: isUp ? '#10b981' : '#3b82f6' }}>
                                            ₹{p.suggested_price?.toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={`change-badge ${isUp ? 'change-up' : 'change-down'}`}>
                                                {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                {isUp ? '+' : ''}{p.price_change_pct}%
                                            </span>
                                        </td>
                                        <td>{p.margin_pct?.toFixed(1)}%</td>
                                        <td>
                                            <div className="confidence-bar">
                                                <div className="confidence-fill" style={{ width: `${(p.confidence || 0.8) * 100}%` }}></div>
                                                <span>{((p.confidence || 0.8) * 100).toFixed(0)}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            {isApproved ? (
                                                <span className="status-badge status-ok"><Check size={12} /> Approved</span>
                                            ) : (
                                                <div className="action-btns">
                                                    <button className="btn-sm-primary" onClick={() => handleApprove(idx)}>
                                                        <Check size={14} /> Approve
                                                    </button>
                                                    <button className="icon-btn danger"><X size={14} /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="pricing-footer">
                    <p className="model-info">
                        Model: XGBoost Regressor | Training data: 3,640 sales records | Optimized with ONNX Runtime on AMD GPU
                    </p>
                </div>
            </main>
        </div>
    )
}

export default Pricing
