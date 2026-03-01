import { useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Package, ShoppingCart, BarChart3,
    DollarSign, Users, MessageSquare, FileText, Zap, Bot
} from 'lucide-react'
import './Sidebar.css'

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: DollarSign, label: 'Pricing', path: '/pricing' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: MessageSquare, label: 'Chats', path: '/chat' },
    { icon: FileText, label: 'Reports', path: '/reports' },
]

function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <aside className="sidebar">
            <div className="sidebar-logo" onClick={() => navigate('/')}>
                <div className="sidebar-logo-icon">
                    <Zap size={20} />
                </div>
                <span className="sidebar-logo-text">Bharat<span className="sidebar-logo-highlight">-tech</span></span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                        <button
                            key={item.label}
                            className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            <div className="sidebar-copilot">
                <button className="copilot-btn" onClick={() => navigate('/chat')}>
                    <Bot size={18} />
                    <span>AI Co-Pilot</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
