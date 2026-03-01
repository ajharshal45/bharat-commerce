import { useState, useEffect } from 'react'
import {
    Users, Search, ShoppingBag, TrendingUp, MapPin, Star,
    Mail, ArrowUpRight
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Sidebar from '../components/Sidebar.jsx'
import { getRegionData } from '../services/api.js'
import './PageStyles.css'

const customers = [
    { name: "Aisha Sharma", email: "aisha@gmail.com", orders: 23, spent: 34500, region: "Pune", rating: 4.8, status: "Active", joined: "Jan 2025" },
    { name: "Rajesh Patel", email: "rajesh@gmail.com", orders: 18, spent: 28200, region: "Mumbai", rating: 4.5, status: "Active", joined: "Feb 2025" },
    { name: "Priya Mehta", email: "priya@gmail.com", orders: 31, spent: 52000, region: "Delhi", rating: 4.9, status: "VIP", joined: "Nov 2024" },
    { name: "Vikram Singh", email: "vikram@gmail.com", orders: 12, spent: 18900, region: "Jaipur", rating: 4.2, status: "Active", joined: "Mar 2025" },
    { name: "Neha Gupta", email: "neha@gmail.com", orders: 45, spent: 67800, region: "Bengaluru", rating: 5.0, status: "VIP", joined: "Sep 2024" },
    { name: "Arjun Reddy", email: "arjun@gmail.com", orders: 8, spent: 12400, region: "Hyderabad", rating: 4.0, status: "Active", joined: "Apr 2025" },
    { name: "Kavya Nair", email: "kavya@gmail.com", orders: 27, spent: 41200, region: "Chennai", rating: 4.7, status: "Active", joined: "Dec 2024" },
    { name: "Suresh Kumar", email: "suresh@gmail.com", orders: 5, spent: 7600, region: "Lucknow", rating: 3.8, status: "Inactive", joined: "May 2025" },
    { name: "Ananya Das", email: "ananya@gmail.com", orders: 36, spent: 55400, region: "Kolkata", rating: 4.6, status: "VIP", joined: "Oct 2024" },
    { name: "Rohit Verma", email: "rohit@gmail.com", orders: 15, spent: 23100, region: "Ahmedabad", rating: 4.3, status: "Active", joined: "Jan 2025" },
]

const segmentData = [
    { segment: 'VIP', count: 3 }, { segment: 'Active', count: 5 },
    { segment: 'Inactive', count: 2 },
]

function Customer() {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')
    const [regions, setRegions] = useState([])

    useEffect(() => {
        async function load() {
            const data = await getRegionData()
            if (data) setRegions(data)
        }
        load()
    }, [])

    const statuses = ['All', 'VIP', 'Active', 'Inactive']

    const filtered = customers.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'All' || c.status === filter
        return matchSearch && matchFilter
    })

    const totalCustomers = customers.length
    const vipCount = customers.filter(c => c.status === 'VIP').length
    const avgSpend = Math.round(customers.reduce((s, c) => s + c.spent, 0) / customers.length)

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="page-main">
                <div className="page-header">
                    <div>
                        <h1><Users size={24} /> Customer Insights</h1>
                        <p className="page-subtitle">Customer analytics and segmentation</p>
                    </div>
                </div>

                <div className="stats-row-sm">
                    <div className="stat-sm">
                        <span className="stat-sm-label">Total Customers</span>
                        <span className="stat-sm-value">{totalCustomers}</span>
                    </div>
                    <div className="stat-sm success">
                        <span className="stat-sm-label">VIP Customers</span>
                        <span className="stat-sm-value">{vipCount}</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Avg Spend</span>
                        <span className="stat-sm-value">₹{avgSpend.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Active Regions</span>
                        <span className="stat-sm-value">{regions.length}</span>
                    </div>
                </div>

                <div className="customer-grid">
                    {/* Segmentation Chart */}
                    <div className="card">
                        <div className="card-header"><h3>Customer Segments</h3></div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={segmentData} layout="vertical">
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis dataKey="segment" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#374151' }} width={70} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#e8772e" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Regions */}
                    <div className="card">
                        <div className="card-header"><h3>Top Customer Regions</h3></div>
                        <div className="region-list compact">
                            {regions.slice(0, 5).map((r, idx) => (
                                <div key={idx} className="region-row">
                                    <MapPin size={14} className="text-muted" />
                                    <span className="region-name">{r.name}</span>
                                    <span className="region-value">{r.orders} orders</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="table-controls">
                    <div className="search-box">
                        <Search size={16} />
                        <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="filter-chips">
                        {statuses.map(s => (
                            <button key={s} className={`chip ${filter === s ? 'chip-active' : ''}`} onClick={() => setFilter(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Region</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div className="customer-cell">
                                            <div className="customer-avatar">{c.name.split(' ').map(n => n[0]).join('')}</div>
                                            <div>
                                                <span className="fw-600">{c.name}</span>
                                                <span className="customer-email">{c.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><MapPin size={12} className="text-muted" /> {c.region}</td>
                                    <td>{c.orders}</td>
                                    <td className="fw-600">₹{c.spent.toLocaleString('en-IN')}</td>
                                    <td>
                                        <div className="rating-cell">
                                            <Star size={12} fill="#f59e0b" color="#f59e0b" /> {c.rating}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${c.status === 'VIP' ? 'status-vip' : c.status === 'Active' ? 'status-active-pill' : 'status-inactive'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="text-muted">{c.joined}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

export default Customer
