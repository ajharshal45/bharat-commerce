import { useNavigate } from 'react-router-dom'
import { ArrowRight, BarChart3, Brain, TrendingUp, Zap, Shield, Globe } from 'lucide-react'
import './Landing.css'

function Landing() {
    const navigate = useNavigate()

    return (
        <div className="landing">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-logo">
                    <div className="logo-icon">
                        <Zap size={24} />
                    </div>
                    <span className="logo-text">BharatCommerce <span className="logo-ai">AI</span></span>
                </div>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#tech">Technology</a>
                    <button className="nav-cta" onClick={() => navigate('/dashboard')}>
                        Try Demo <ArrowRight size={16} />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-badge">
                    <Zap size={14} /> Powered by AMD Instinct™ GPUs
                </div>
                <h1 className="hero-title">
                    AI Co-Pilot for Every<br />
                    <span className="hero-highlight">Indian Seller</span>
                </h1>
                <p className="hero-subtitle">
                    Unified Commerce Intelligence Platform that brings enterprise-grade
                    AI tools to India's 63M+ MSMEs — smart demand forecasting, dynamic
                    pricing, and personalized recommendations. All accelerated by AMD.
                </p>
                <div className="hero-cta-group">
                    <button className="hero-cta-primary" onClick={() => navigate('/dashboard')}>
                        Explore Seller Dashboard <ArrowRight size={18} />
                    </button>
                    <button className="hero-cta-secondary" onClick={() => navigate('/chat')}>
                        Try AI Co-Pilot <Brain size={18} />
                    </button>
                </div>

                {/* Flow Diagram */}
                <div className="hero-flow">
                    <div className="flow-step">
                        <div className="flow-icon flow-icon-1"><Globe size={24} /></div>
                        <span>Customer Data</span>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-icon flow-icon-2"><Brain size={24} /></div>
                        <span>AI Engine</span>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-icon flow-icon-3"><BarChart3 size={24} /></div>
                        <span>Seller Insights</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <h2 className="section-title">Three AI Engines. One Platform.</h2>
                <p className="section-subtitle">Enterprise-level intelligence, accessible to every seller</p>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <TrendingUp size={28} />
                        </div>
                        <h3>Demand Forecasting</h3>
                        <p>LSTM + Prophet models predict demand 30 days ahead. Festival-aware, region-specific, with actionable stock alerts.</p>
                        <div className="feature-tag">Prophet + PyTorch on AMD GPU</div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon feature-icon-pricing">
                            <BarChart3 size={28} />
                        </div>
                        <h3>Dynamic Pricing</h3>
                        <p>AI optimizes prices in real-time based on demand, competition, and margins. Revenue uplift of 12-18%.</p>
                        <div className="feature-tag">XGBoost + ONNX on MIGraphX</div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon feature-icon-recommend">
                            <Brain size={28} />
                        </div>
                        <h3>AI Co-Pilot</h3>
                        <p>Natural language assistant for sellers — ask anything about your business and get data-backed AI answers.</p>
                        <div className="feature-tag">Llama 3 on AMD Instinct</div>
                    </div>
                </div>
            </section>

            {/* AMD Tech Section */}
            <section className="tech-section" id="tech">
                <h2 className="section-title">AMD-Accelerated Intelligence</h2>
                <p className="section-subtitle">Built on AMD's open-source AI compute stack for maximum performance</p>
                <div className="tech-grid">
                    <div className="tech-card">
                        <Shield size={20} />
                        <span>AMD ROCm</span>
                    </div>
                    <div className="tech-card">
                        <Zap size={20} />
                        <span>Instinct MI300X</span>
                    </div>
                    <div className="tech-card">
                        <Brain size={20} />
                        <span>ONNX Runtime</span>
                    </div>
                    <div className="tech-card">
                        <TrendingUp size={20} />
                        <span>MIGraphX EP</span>
                    </div>
                    <div className="tech-card">
                        <BarChart3 size={20} />
                        <span>PyTorch + HIP</span>
                    </div>
                    <div className="tech-card">
                        <Globe size={20} />
                        <span>Ryzen AI</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>BharatCommerce AI — AMD Slingshot Hackathon 2026</p>
                <p className="footer-sub">AI in Consumer Experiences</p>
            </footer>
        </div>
    )
}

export default Landing
