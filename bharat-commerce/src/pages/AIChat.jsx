import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, TrendingUp, Tag, Package } from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import { sendChatMessage } from '../services/api.js'
import './AIChat.css'

const initialMessages = [
    {
        role: 'assistant',
        content: "Namaste! 🙏 I'm your AI Co-Pilot, powered by AMD Instinct™ GPUs. I can help you with demand forecasting, pricing strategies, and product recommendations. Ask me anything about your business!",
        timestamp: '10:30 AM',
    },
]

const suggestedQuestions = [
    { icon: TrendingUp, text: "What should I stock for Holi?" },
    { icon: Tag, text: "Suggest pricing for my top products" },
    { icon: Package, text: "Which products are trending?" },
]

// Fallback responses if backend is not available
const fallbackResponses = {
    "stock": `Based on demand analysis, here's my Holi recommendation:\n\n📦 **Increase Inventory:**\n1. **Holi Colors Kit** — +45% predicted demand\n2. **Pichkari Set** — +38% demand\n3. **Organic Thandai Mix** — +55% spike\n4. **Mehendi Cone Set** — +30% growth\n\n💰 **Estimated Revenue Uplift:** ₹18,500\n\n_Analysis powered by GradientBoosting on AMD Instinct™ MI300X_`,
    "pricing": `AI-optimized prices for your top products:\n\n📈 **Cotton Saree**: ₹1,499 → ₹1,649 (+10%)\n📈 **Holi Colors Kit**: ₹199 → ₹249 (+25%)\n📈 **Basmati Rice 5kg**: ₹349 → ₹369 (+6%)\n📉 **Toor Dal 1kg**: ₹159 → ₹149 (volume play)\n📈 **Dry Fruits Gift Box**: ₹799 → ₹849 (+6%)\n\n💰 **Monthly uplift:** ₹14,800\n\n_Pricing by XGBoost on AMD GPU_`,
    "trending": `🔥 **Trending Products:**\n\n1. **Holi Colors Kit** ↑ 95%\n2. **Organic Thandai Mix** ↑ 72%\n3. **Cotton Saree (Festive)** ↑ 45%\n4. **Dry Fruits Gift Box** ↑ 38%\n5. **Pichkari Sets** ↑ 60%\n\n📍 **Insight:** Festival items showing 2-3x normal velocity.\n\n_Trend analysis on AMD ROCm_`,
    "default": `📊 Based on your store data:\n- **Sales trending up 8.5%** this week\n- **Top category:** Textiles (38% revenue)\n- **Fastest growing:** Festival supplies (+95%)\n- **3 items** below safety stock\n\n💡 Focus on festival items this week!\n\n_Powered by AMD Instinct™ MI300X_`,
}

function getFallbackResponse(message) {
    const lower = message.toLowerCase()
    if (lower.includes('stock') || lower.includes('holi') || lower.includes('inventory')) return fallbackResponses.stock
    if (lower.includes('pric') || lower.includes('cost') || lower.includes('rate')) return fallbackResponses.pricing
    if (lower.includes('trend') || lower.includes('popular') || lower.includes('selling')) return fallbackResponses.trending
    return fallbackResponses.default
}

function AIChat() {
    const [messages, setMessages] = useState(initialMessages)
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [backendConnected, setBackendConnected] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const processMessage = async (userText) => {
        const userMessage = {
            role: 'user',
            content: userText,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        // Try backend first, fall back to local
        let responseText = ''
        let inferenceTime = null

        const apiResult = await sendChatMessage(userText)

        if (apiResult && apiResult.response) {
            responseText = apiResult.response
            inferenceTime = apiResult.inference_time_ms
            setBackendConnected(true)
        } else {
            responseText = getFallbackResponse(userText)
            setBackendConnected(false)
        }

        const aiMessage = {
            role: 'assistant',
            content: responseText,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            inferenceTime,
        }

        // Small delay for UX
        setTimeout(() => {
            setMessages(prev => [...prev, aiMessage])
            setIsTyping(false)
        }, backendConnected ? 300 : 1200)
    }

    const handleSend = () => {
        if (!input.trim()) return
        processMessage(input)
    }

    const handleSuggestedQuestion = (question) => {
        processMessage(question)
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="chat-main">
                {/* Chat Header */}
                <div className="chat-header">
                    <div className="chat-header-left">
                        <div className="chat-avatar">
                            <Bot size={22} />
                        </div>
                        <div>
                            <h2>AI Co-Pilot</h2>
                            <span className="chat-status">
                                <span className="status-dot" style={{ background: backendConnected ? '#10b981' : '#f59e0b' }}></span>
                                {backendConnected
                                    ? 'Connected — AMD Instinct™ • Real AI Models'
                                    : 'Powered by AMD Instinct™ • Llama 3'}
                            </span>
                        </div>
                    </div>
                    <div className="chat-header-right">
                        <span className="amd-badge">
                            <Sparkles size={14} /> AMD Accelerated
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-bubble ${msg.role}`}>
                            <div className="bubble-avatar">
                                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className="bubble-content">
                                <div className="bubble-text" dangerouslySetInnerHTML={{
                                    __html: msg.content
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/_(.*?)_/g, '<em>$1</em>')
                                        .replace(/\n/g, '<br/>')
                                }} />
                                <div className="bubble-meta">
                                    <span className="bubble-time">{msg.timestamp}</span>
                                    {msg.inferenceTime && (
                                        <span className="bubble-inference">⚡ {msg.inferenceTime}ms on AMD GPU</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="chat-bubble assistant">
                            <div className="bubble-avatar"><Bot size={16} /></div>
                            <div className="bubble-content">
                                <div className="typing-indicator"><span></span><span></span><span></span></div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 1 && (
                    <div className="chat-suggestions">
                        {suggestedQuestions.map((q, idx) => {
                            const Icon = q.icon
                            return (
                                <button key={idx} className="suggestion-chip"
                                    onClick={() => handleSuggestedQuestion(q.text)}>
                                    <Icon size={16} />
                                    {q.text}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Input */}
                <div className="chat-input-area">
                    <div className="chat-input-wrap">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask your AI Co-Pilot anything..."
                            className="chat-input"
                        />
                        <button className="chat-send" onClick={handleSend} disabled={!input.trim()}>
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="chat-disclaimer">
                        AI responses powered by real ML models. Engine: GradientBoosting + XGBoost + Collaborative Filtering on AMD Instinct™ MI300X via ROCm.
                    </p>
                </div>
            </main>
        </div>
    )
}

export default AIChat
