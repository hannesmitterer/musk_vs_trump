import React, { useState, useEffect } from 'react';
import ReputationGraph from './ReputationGraph';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    // Check backend connectivity
    checkBackendHealth();
    
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      console.warn('Backend not available:', error);
      setBackendStatus('offline');
    }
  };

  const renderHeader = () => (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="logo-title">
            <span className="logo-icon">⚡</span>
            Musk vs Trump
            <span className="logo-subtitle">AI Reputation Tracker</span>
          </h1>
        </div>
        
        <nav className="main-nav">
          <button 
            className={`nav-button ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => setActiveSection('home')}
          >
            Home
          </button>
          <button 
            className={`nav-button ${activeSection === 'visualization' ? 'active' : ''}`}
            onClick={() => setActiveSection('visualization')}
          >
            Live Data
          </button>
          <button 
            className={`nav-button ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => setActiveSection('about')}
          >
            About
          </button>
        </nav>
        
        <div className="status-indicator">
          <div className={`status-dot ${backendStatus}`}></div>
          <span className="status-text">
            {backendStatus === 'connected' ? 'Live' : 
             backendStatus === 'offline' ? 'Offline' : 
             'Checking...'}
          </span>
        </div>
      </div>
    </header>
  );

  const renderHeroSection = () => (
    <section className="hero-section fade-in-up">
      <div className="hero-container">
        <div className="hero-content">
          <h2 className="hero-title">
            Real-Time AI-Powered
            <span className="hero-highlight"> Reputation Analysis</span>
          </h2>
          <p className="hero-description">
            Track and visualize the reputation dynamics of public figures through 
            advanced sentiment analysis and interactive 3D data visualization.
          </p>
          
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Live Monitoring</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">AI</div>
              <div className="stat-label">Sentiment Analysis</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3D</div>
              <div className="stat-label">Visualization</div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button 
              className="cta-button primary pulse"
              onClick={() => setActiveSection('visualization')}
            >
              View Live Data
              <span className="cta-icon">🚀</span>
            </button>
            <button 
              className="cta-button secondary"
              onClick={() => setActiveSection('about')}
            >
              Learn More
              <span className="cta-icon">📊</span>
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-placeholder">
            <div className="floating-elements">
              <div className="element element-1">📈</div>
              <div className="element element-2">🎯</div>
              <div className="element element-3">⚡</div>
              <div className="element element-4">🔬</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderFeaturesSection = () => (
    <section className="features-section">
      <div className="features-container">
        <h3 className="section-title">Powerful Features</h3>
        <div className="features-grid">
          <div className="feature-card fade-in-up">
            <div className="feature-icon">🧠</div>
            <h4 className="feature-title">AI Sentiment Analysis</h4>
            <p className="feature-description">
              Advanced natural language processing to analyze sentiment from multiple sources
            </p>
          </div>
          
          <div className="feature-card fade-in-up">
            <div className="feature-icon">📊</div>
            <h4 className="feature-title">3D Data Visualization</h4>
            <p className="feature-description">
              Interactive three-dimensional graphs showing reputation trends over time
            </p>
          </div>
          
          <div className="feature-card fade-in-up">
            <div className="feature-icon">⚡</div>
            <h4 className="feature-title">Real-Time Updates</h4>
            <p className="feature-description">
              Live data streaming with automatic updates and notification system
            </p>
          </div>
          
          <div className="feature-card fade-in-up">
            <div className="feature-icon">🔍</div>
            <h4 className="feature-title">Deep Analytics</h4>
            <p className="feature-description">
              Comprehensive analysis with historical trends and predictive insights
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderAboutSection = () => (
    <section className="about-section">
      <div className="about-container">
        <div className="about-content">
          <h3 className="section-title">About This Project</h3>
          <p className="about-text">
            This AI-powered reputation tracker uses advanced machine learning algorithms 
            to analyze public sentiment and reputation dynamics. Built with modern web 
            technologies including React, Three.js, and Flask, it provides real-time 
            insights through interactive 3D visualizations.
          </p>
          
          <div className="tech-stack">
            <h4>Technology Stack</h4>
            <div className="tech-badges">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Three.js</span>
              <span className="tech-badge">Flask</span>
              <span className="tech-badge">Python</span>
              <span className="tech-badge">AI/ML</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading AI Reputation Tracker...</h2>
          <p>Initializing visualization engine</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {renderHeader()}
      
      <main className="main-content">
        {activeSection === 'home' && (
          <>
            {renderHeroSection()}
            {renderFeaturesSection()}
          </>
        )}
        
        {activeSection === 'visualization' && (
          <section className="visualization-section">
            <div className="visualization-container">
              <h2 className="section-title">Live Reputation Data</h2>
              <ReputationGraph />
            </div>
          </section>
        )}
        
        {activeSection === 'about' && renderAboutSection()}
      </main>
      
      <footer className="app-footer">
        <div className="footer-container">
          <p>&copy; 2024 Musk vs Trump AI Reputation Tracker. Built with React & AI.</p>
          <div className="footer-links">
            <a href="https://github.com/hannesmitterer/musk_vs_trump" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;