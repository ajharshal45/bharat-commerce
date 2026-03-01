// API service for connecting React frontend to FastAPI backend
const API_BASE = 'http://localhost:8000'

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        })
        if (!response.ok) throw new Error(`API Error: ${response.status}`)
        return await response.json()
    } catch (error) {
        console.error(`API call failed: ${endpoint}`, error)
        return null
    }
}

// Dashboard APIs
export const getDashboardStats = () => fetchAPI('/api/dashboard/stats')
export const getRecentOrders = () => fetchAPI('/api/dashboard/orders')
export const getRegionData = () => fetchAPI('/api/dashboard/regions')
export const getAIInsights = () => fetchAPI('/api/dashboard/insights')

// Forecast APIs
export const getForecast = (productId, daysAhead = 14, region = 'Delhi') =>
    fetchAPI('/api/forecast', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, days_ahead: daysAhead, region }),
    })

export const getAllForecasts = () => fetchAPI('/api/forecast/all')

// Pricing APIs
export const getPricingSuggestion = (productId, isFestival = true) =>
    fetchAPI('/api/pricing', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, is_festival: isFestival }),
    })

export const getAllPricing = () => fetchAPI('/api/pricing/all')

// Recommendation APIs
export const getRecommendations = (userId = 1, topN = 5) =>
    fetchAPI('/api/recommend', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, top_n: topN }),
    })

export const getSimilarProducts = (productId) =>
    fetchAPI(`/api/recommend/similar/${productId}`)

export const getBundleSuggestions = (productId) =>
    fetchAPI(`/api/recommend/bundle/${productId}`)

// Chat API
export const sendChatMessage = (message, userId = 1) =>
    fetchAPI('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message, user_id: userId }),
    })

// Products & Sales
export const getProducts = () => fetchAPI('/api/products')
export const getSalesHistory = (productId, days = 30) =>
    fetchAPI(`/api/sales/history/${productId}?days=${days}`)
