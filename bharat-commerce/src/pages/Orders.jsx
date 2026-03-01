import { useState, useEffect } from 'react'
import {
    ShoppingCart, Search, Filter, Download, Eye,
    Clock, Truck, CheckCircle, XCircle, Loader2, MoreHorizontal
} from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import { getRecentOrders } from '../services/api.js'
import './PageStyles.css'

const statusConfig = {
    Shipped: { icon: Truck, color: '#2563eb', bg: '#dbeafe' },
    Pending: { icon: Clock, color: '#d97706', bg: '#fef3c7' },
    Delivered: { icon: CheckCircle, color: '#059669', bg: '#d1fae5' },
    Processing: { icon: Loader2, color: '#7c3aed', bg: '#ede9fe' },
    Cancelled: { icon: XCircle, color: '#ef4444', bg: '#fee2e2' },
}

function Orders() {
    const [orders, setOrders] = useState([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const data = await getRecentOrders()
            if (data) setOrders(data)
            setLoading(false)
        }
        load()
    }, [])

    const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered']

    const filtered = orders.filter(o => {
        const matchSearch = o.customer?.toLowerCase().includes(search.toLowerCase()) ||
            o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
            o.item?.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === 'All' || o.status === statusFilter
        return matchSearch && matchStatus
    })

    const pendingCount = orders.filter(o => o.status === 'Pending').length
    const shippedCount = orders.filter(o => o.status === 'Shipped').length
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="page-main">
                <div className="page-header">
                    <div>
                        <h1><ShoppingCart size={24} /> Order Management</h1>
                        <p className="page-subtitle">{orders.length} total orders</p>
                    </div>
                    <div className="page-actions">
                        <button className="btn-secondary"><Download size={16} /> Export CSV</button>
                    </div>
                </div>

                <div className="stats-row-sm">
                    <div className="stat-sm">
                        <span className="stat-sm-label">Total Orders</span>
                        <span className="stat-sm-value">{orders.length}</span>
                    </div>
                    <div className="stat-sm warn">
                        <span className="stat-sm-label">Pending</span>
                        <span className="stat-sm-value">{pendingCount}</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Shipped</span>
                        <span className="stat-sm-value">{shippedCount}</span>
                    </div>
                    <div className="stat-sm success">
                        <span className="stat-sm-label">Delivered</span>
                        <span className="stat-sm-value">{deliveredCount}</span>
                    </div>
                </div>

                <div className="table-controls">
                    <div className="search-box">
                        <Search size={16} />
                        <input type="text" placeholder="Search orders, customers..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="filter-chips">
                        {statuses.map(s => (
                            <button key={s} className={`chip ${statusFilter === s ? 'chip-active' : ''}`} onClick={() => setStatusFilter(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="loading-cell">Loading orders...</td></tr>
                            ) : filtered.map((o, idx) => {
                                const config = statusConfig[o.status] || statusConfig.Pending
                                const StatusIcon = config.icon
                                return (
                                    <tr key={idx}>
                                        <td className="fw-600">{o.order_id}</td>
                                        <td>{o.customer}</td>
                                        <td>{o.item}</td>
                                        <td className="fw-600">{o.amount}</td>
                                        <td>
                                            <span className="status-pill" style={{ background: config.bg, color: config.color }}>
                                                <StatusIcon size={12} /> {o.status}
                                            </span>
                                        </td>
                                        <td className="text-muted">{o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today'}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="icon-btn"><Eye size={14} /></button>
                                                <button className="icon-btn"><MoreHorizontal size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

export default Orders
