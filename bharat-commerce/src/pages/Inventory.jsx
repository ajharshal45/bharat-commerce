import { useState, useEffect } from 'react'
import {
    Package, Search, Plus, AlertTriangle, CheckCircle,
    ArrowUpDown, MoreHorizontal, Edit, Trash2, Filter, Download
} from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import { getProducts } from '../services/api.js'
import './PageStyles.css'

function Inventory() {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const data = await getProducts()
            if (data) setProducts(data)
            setLoading(false)
        }
        load()
    }, [])

    const categories = ['All', ...new Set(products.map(p => p.category))]

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchCat = filter === 'All' || p.category === filter
        return matchSearch && matchCat
    })

    const lowStock = products.filter(p => p.stock < 150).length
    const totalValue = products.reduce((s, p) => s + (p.current_price * p.stock), 0)

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="page-main">
                <div className="page-header">
                    <div>
                        <h1><Package size={24} /> Inventory Management</h1>
                        <p className="page-subtitle">{products.length} products in catalog</p>
                    </div>
                    <div className="page-actions">
                        <button className="btn-secondary"><Download size={16} /> Export</button>
                        <button className="btn-primary"><Plus size={16} /> Add Product</button>
                    </div>
                </div>

                <div className="stats-row-sm">
                    <div className="stat-sm">
                        <span className="stat-sm-label">Total Products</span>
                        <span className="stat-sm-value">{products.length}</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Total Stock</span>
                        <span className="stat-sm-value">{products.reduce((s, p) => s + p.stock, 0).toLocaleString()}</span>
                    </div>
                    <div className="stat-sm warn">
                        <span className="stat-sm-label">Low Stock</span>
                        <span className="stat-sm-value">{lowStock}</span>
                    </div>
                    <div className="stat-sm">
                        <span className="stat-sm-label">Inventory Value</span>
                        <span className="stat-sm-value">₹{Math.round(totalValue).toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="table-controls">
                    <div className="search-box">
                        <Search size={16} />
                        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="filter-chips">
                        {categories.map(cat => (
                            <button key={cat} className={`chip ${filter === cat ? 'chip-active' : ''}`} onClick={() => setFilter(cat)}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Base Price</th>
                                <th>Current Price</th>
                                <th>Cost</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="loading-cell">Loading from backend...</td></tr>
                            ) : filtered.map(p => (
                                <tr key={p.id}>
                                    <td className="product-name-cell">
                                        <div className="product-icon" style={{ background: `hsl(${p.id * 30}, 60%, 90%)` }}>
                                            {p.name.charAt(0)}
                                        </div>
                                        <span>{p.name}</span>
                                    </td>
                                    <td><span className="category-badge">{p.category}</span></td>
                                    <td>₹{p.base_price.toLocaleString()}</td>
                                    <td className="fw-600">₹{p.current_price.toLocaleString()}</td>
                                    <td className="text-muted">₹{p.cost.toLocaleString()}</td>
                                    <td>
                                        <div className="stock-bar-wrap">
                                            <div className="stock-bar">
                                                <div className="stock-fill" style={{
                                                    width: `${Math.min(100, (p.stock / 500) * 100)}%`,
                                                    background: p.stock < 150 ? '#ef4444' : p.stock < 300 ? '#f59e0b' : '#10b981'
                                                }}></div>
                                            </div>
                                            <span>{p.stock}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {p.stock < 150 ? (
                                            <span className="status-badge status-danger"><AlertTriangle size={12} /> Low</span>
                                        ) : (
                                            <span className="status-badge status-ok"><CheckCircle size={12} /> In Stock</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="icon-btn"><Edit size={14} /></button>
                                            <button className="icon-btn danger"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

export default Inventory
