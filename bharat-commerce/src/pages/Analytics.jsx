import { useState, useEffect } from 'react'
import {
    BarChart3, TrendingUp, Users, ShoppingCart, IndianRupee,
    ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react'
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts'
import Sidebar from '../components/Sidebar.jsx'
import { getDashboardStats, getRegionData, getAllForecasts } from '../services/api.js'
import './PageStyles.css'

const COLORS = ['#e8772e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899']

const monthlyRevenue = [
    { month: 'Sep', revenue: 245000 }, { month: 'Oct', revenue: 312000 },
    { month: 'Nov', revenue: 287000 }, { month: 'Dec', revenue: 340000 },
    { month: 'Jan', revenue: 298000 }, { month: 'Feb', revenue: 356000 },
    { month: 'Mar', revenue: 410000 },
]

const categoryBreakdown = [
    { name: 'Textiles', value: 35 }, { name: 'Grocery', value: 28 },
    { name: 'Beverages', value: 12 }, { name: 'Festival', value: 15 },
    { name: 'Home', value: 6 }, { name: 'Pooja', value: 4 },
]

const hourlyTraffic = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    orders: Math.round(5 + Math.random() * 25 + (i >= 10 && i <= 20 ? 15 : 0)),
    visitors: Math.round(20 + Math.random() * 80 + (i >= 9 && i <= 21 ? 50 : 0)),
}))

const weeklyComparison = [
    { day: 'Mon', thisWeek: 4200, lastWeek: 3800 },
    { day: 'Tue', thisWeek: 3800, lastWeek: 3500 },
    { day: 'Wed', thisWeek: 5100, lastWeek: 4200 },
    { day: 'Thu', thisWeek: 4600, lastWeek: 4100 },
    { day: 'Fri', thisWeek: 5800, lastWeek: 5200 },
    { day: 'Sat', thisWeek: 7200, lastWeek: 6100 },
    { day: 'Sun', thisWeek: 6500, lastWeek: 5800 },
]

function Analytics() {
    const [stats, setStats] = useState(null)
    const [regions, setRegions] = useState([])
    const [period, setPeriod] = useState('7d')

    useEffect(() => {
        async function load() {
            const [s, r] = await Promise.all([getDashboardStats(), getRegionData()])
            if (s) setStats(s)
            if (r) setRegions(r)
        }
        load()
    }, [])

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="page-main">
                <div className="page-header">
                    <div>
                        <h1><BarChart3 size={24} /> Analytics & Reports</h1>
                        <p className="page-subtitle">Business performance insights</p>
                    </div>
                    <div className="page-actions">
                        <div className="period-toggle">
                            {['24h', '7d', '30d', '90d'].map(p => (
                                <button key={p} className={`period-btn ${period === p ? 'period-active' : ''}`} onClick={() => setPeriod(p)}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="stats-row-sm">
                    <div className="stat-sm">
                        <span className="stat-sm-label">Revenue</span>
                        <span className="stat-sm-value">₹{stats ? Math.round(stats.today_sales).toLocaleString('en-IN') : '...'}</span>
                        <span className="stat-sm-change up"><ArrowUpRight size={12} /> 12.5%</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Orders</span>
                        <span className="stat-sm-value">{stats?.total_orders || '...'}</span>
                        <span className="stat-sm-change up"><ArrowUpRight size={12} /> 8.3%</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Avg Order Value</span>
                        <span className="stat-sm-value">₹487</span>
                        <span className="stat-sm-change up"><ArrowUpRight size={12} /> 3.2%</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Conversion Rate</span>
                        <span className="stat-sm-value">4.8%</span>
                        <span className="stat-sm-change down"><ArrowDownRight size={12} /> 0.5%</span>
                    </div>
                </div>

                <div className="analytics-grid">
                    {/* Revenue Trend */}
                    <div className="card chart-card">
                        <div className="card-header"><h3>Revenue Trend</h3></div>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={monthlyRevenue}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e8772e" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#e8772e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `₹${(v / 1000)}k`} />
                                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                                <Area type="monotone" dataKey="revenue" stroke="#e8772e" fillOpacity={1} fill="url(#revGrad)" strokeWidth={2.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Breakdown */}
                    <div className="card chart-card">
                        <div className="card-header"><h3>Sales by Category</h3></div>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                                    {categoryBreakdown.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Week Comparison */}
                    <div className="card chart-card">
                        <div className="card-header"><h3>This Week vs Last Week</h3></div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={weeklyComparison}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="thisWeek" fill="#e8772e" radius={[4, 4, 0, 0]} name="This Week" />
                                <Bar dataKey="lastWeek" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Last Week" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Hourly Traffic */}
                    <div className="card chart-card">
                        <div className="card-header"><h3>Hourly Traffic Today</h3></div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={hourlyTraffic}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} interval={3} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={false} name="Visitors" />
                                <Line type="monotone" dataKey="orders" stroke="#e8772e" strokeWidth={2} dot={false} name="Orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Regions */}
                    <div className="card">
                        <div className="card-header"><h3>Top Regions</h3></div>
                        <div className="region-list">
                            {regions.slice(0, 6).map((r, idx) => (
                                <div key={idx} className="region-row">
                                    <span className="region-rank">#{idx + 1}</span>
                                    <span className="region-name">{r.name}</span>
                                    <div className="region-bar-wrap">
                                        <div className="region-bar" style={{ width: `${Math.min(100, (r.orders / (regions[0]?.orders || 1)) * 100)}%` }}></div>
                                    </div>
                                    <span className="region-value">{r.orders} orders</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Analytics
