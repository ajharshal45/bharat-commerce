// Sample data for the BharatCommerce AI Dashboard
// Simulates Indian MSME retail data

export const statsCards = [
    {
        label: "Today's Sales",
        value: "₹1,24,560",
        icon: "rupee",
        color: "#e8772e",
        bg: "rgba(232, 119, 46, 0.1)",
    },
    {
        label: "Total Orders",
        value: "14,890",
        change: "+8.5%",
        icon: "orders",
        color: "#3b82f6",
        bg: "rgba(59, 130, 246, 0.1)",
    },
    {
        label: "Inventory Status",
        value: "8,912",
        subtitle: "items",
        progress: 65,
        icon: "inventory",
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.1)",
    },
    {
        label: "Active Chats",
        value: "118",
        subtitle: "WhatsApp Commerce",
        icon: "chats",
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.1)",
    },
]

export const demandForecastData = [
    { day: 'Mon', actual: 4200, predicted: 4350 },
    { day: 'Tue', actual: 3800, predicted: 3950 },
    { day: 'Wed', actual: 5100, predicted: 4800 },
    { day: 'Thu', actual: 4600, predicted: 4700 },
    { day: 'Fri', actual: 5800, predicted: 5650 },
    { day: 'Sat', actual: 7200, predicted: 6900 },
    { day: 'Sun', actual: 6500, predicted: 6800 },
    { day: 'Mon', actual: null, predicted: 7100 },
    { day: 'Tue', actual: null, predicted: 6400 },
    { day: 'Wed', actual: null, predicted: 7500 },
    { day: 'Thu', actual: null, predicted: 7200 },
    { day: 'Fri', actual: null, predicted: 8100 },
    { day: 'Sat', actual: null, predicted: 9200 },
    { day: 'Sun', actual: null, predicted: 8400 },
]

export const pricingData = [
    {
        sku: "Cotton Saree",
        currentPrice: 1499,
        aiPrice: 1649,
        change: "+10%",
        demand: "High Demand",
        demandColor: "#10b981",
        trendData: [
            { d: 'Sun', v: 30 }, { d: 'Mon', v: 42 }, { d: 'Tue', v: 38 },
            { d: 'Wed', v: 55 }, { d: 'Thu', v: 48 },
        ],
    },
    {
        sku: "Basmati Rice 5kg",
        currentPrice: 349,
        aiPrice: 369,
        change: "+6%",
        demand: "Steady",
        demandColor: "#3b82f6",
        trendData: [
            { d: 'Sun', v: 60 }, { d: 'Mon', v: 55 }, { d: 'Tue', v: 65 },
            { d: 'Wed', v: 58 }, { d: 'Thu', v: 70 },
        ],
    },
    {
        sku: "Holi Colors Kit",
        currentPrice: 199,
        aiPrice: 249,
        change: "+25%",
        demand: "Spike ↑",
        demandColor: "#ef4444",
        trendData: [
            { d: 'Sun', v: 20 }, { d: 'Mon', v: 35 }, { d: 'Tue', v: 55 },
            { d: 'Wed', v: 80 }, { d: 'Thu', v: 95 },
        ],
    },
]

export const ordersData = [
    { id: "ORD-7023", customer: "Aisha Sharma", item: "Cotton Saree", amount: "₹1,649.00", status: "Shipped" },
    { id: "ORD-7022", customer: "Rajesh Patel", item: "Basmati Rice 5kg", amount: "₹369.00", status: "Pending" },
    { id: "ORD-7021", customer: "Priya Mehta", item: "Holi Colors Kit", amount: "₹249.00", status: "Delivered" },
    { id: "ORD-7020", customer: "Vikram Singh", item: "Toor Dal 1kg", amount: "₹159.00", status: "Shipped" },
    { id: "ORD-7019", customer: "Neha Gupta", item: "Green Tea 100g", amount: "₹299.00", status: "Pending" },
]

export const regionData = [
    { name: "Delhi", orders: 127, x: 58, y: 22 },
    { name: "Mumbai", orders: 34, x: 38, y: 55 },
    { name: "Bengaluru", orders: 234, x: 48, y: 78 },
    { name: "Kolkata", orders: 88, x: 78, y: 40 },
    { name: "Chennai", orders: 56, x: 52, y: 82 },
    { name: "Jaipur", orders: 36, x: 45, y: 28 },
]

export const fulfillmentData = [
    { name: 'Jan', value: 42 },
    { name: 'Feb', value: 48 },
    { name: 'Mar', value: 55 },
    { name: 'Apr', value: 52 },
    { name: 'May', value: 60 },
]

export const satisfactionData = [
    { name: 'Jan', value: 58 },
    { name: 'Feb', value: 62 },
    { name: 'Mar', value: 65 },
    { name: 'Apr', value: 60 },
    { name: 'May', value: 70 },
]

export const aiInsights = [
    { icon: "📦", text: "Stock 20% more milk products before Holi week — predicted demand surge of 45%", type: "warning" },
    { icon: "💰", text: "Reduce snack prices by ₹5 on weekdays — estimated 8% volume increase", type: "info" },
    { icon: "🔥", text: "Holi Colors Kit trending — demand spike expected. Increase inventory by 35%", type: "danger" },
    { icon: "🎯", text: "Bundle Cotton Saree + Accessories — 23% of customers buy both. ₹2,100 bundle suggested", type: "success" },
]
