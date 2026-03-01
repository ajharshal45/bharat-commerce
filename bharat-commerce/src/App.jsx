import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AIChat from './pages/AIChat.jsx'
import Inventory from './pages/Inventory.jsx'
import Orders from './pages/Orders.jsx'
import Analytics from './pages/Analytics.jsx'
import Pricing from './pages/Pricing.jsx'
import Customer from './pages/Customer.jsx'
import Reports from './pages/Reports.jsx'
import './index.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/chat" element={<AIChat />} />
        </Routes>
    )
}

export default App
