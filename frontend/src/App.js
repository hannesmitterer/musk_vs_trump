import React, { useState, useEffect } from 'react';
import ReputationGraph from './ReputationGraph';
import './App.css';

const App = () => {
  const [reputationData, setReputationData] = useState({
    musk: [],
    trump: []
  });
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  // Check backend status
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/health');
        const data = await response.json();
        setBackendStatus(data);
      } catch (error) {
        setBackendStatus({ status: 'offline', message: 'Backend server not available' });
      }
    };
    
    checkBackend();
  }, []);

  // Generate sample reputation data for demonstration
  useEffect(() => {
    const generateSampleData = () => {
      const now = new Date();
      const data = [];
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.push({
          date: date.toISOString().split('T')[0],
          timestamp: date.getTime(),
          sentiment: Math.random() * 100 - 50, // -50 to +50
          mentions: Math.floor(Math.random() * 1000) + 100,
          positiveScore: Math.random() * 50 + 25,
          negativeScore: Math.random() * 50 + 25
        });
      }
      return data;
    };

    setReputationData({
      musk: generateSampleData(),
      trump: generateSampleData()
    });
  }, []);

  const handleRefreshData = async () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const generateSampleData = () => {
        const now = new Date();
        const data = [];
        
        for (let i = 30; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          data.push({
            date: date.toISOString().split('T')[0],
            timestamp: date.getTime(),
            sentiment: Math.random() * 100 - 50,
            mentions: Math.floor(Math.random() * 1000) + 100,
            positiveScore: Math.random() * 50 + 25,
            negativeScore: Math.random() * 50 + 25
          });
        }
        return data;
      };

      setReputationData({
        musk: generateSampleData(),
        trump: generateSampleData()
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Musk vs Trump - AI Reputation Tracker</h1>
        <p>Real-time sentiment analysis and reputation monitoring</p>
        
        <div className="status-bar">
          <div className={`backend-status ${backendStatus?.status}`}>
            Backend: {backendStatus?.status || 'checking...'}
          </div>
          <button 
            onClick={handleRefreshData} 
            disabled={loading}
            className="refresh-button"
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
          </button>
        </div>
      </header>

      <main className="App-main">
        <div className="summary-cards">
          <div className="summary-card musk">
            <h3>🚀 Elon Musk</h3>
            <div className="metrics">
              <div className="metric">
                <span className="value">
                  {reputationData.musk.length > 0 ? 
                    reputationData.musk[reputationData.musk.length - 1].sentiment.toFixed(1) : '--'}
                </span>
                <span className="label">Current Sentiment</span>
              </div>
              <div className="metric">
                <span className="value">
                  {reputationData.musk.length > 0 ? 
                    reputationData.musk[reputationData.musk.length - 1].mentions : '--'}
                </span>
                <span className="label">Daily Mentions</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card trump">
            <h3>🇺🇸 Donald Trump</h3>
            <div className="metrics">
              <div className="metric">
                <span className="value">
                  {reputationData.trump.length > 0 ? 
                    reputationData.trump[reputationData.trump.length - 1].sentiment.toFixed(1) : '--'}
                </span>
                <span className="label">Current Sentiment</span>
              </div>
              <div className="metric">
                <span className="value">
                  {reputationData.trump.length > 0 ? 
                    reputationData.trump[reputationData.trump.length - 1].mentions : '--'}
                </span>
                <span className="label">Daily Mentions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="graphs-container">
          <h2>📊 Reputation Trends</h2>
          <ReputationGraph 
            muskData={reputationData.musk}
            trumpData={reputationData.trump}
          />
        </div>

        <div className="features-showcase">
          <h2>🔍 Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>📈 Real-time Analytics</h4>
              <p>Live sentiment tracking across social media platforms</p>
            </div>
            <div className="feature-card">
              <h4>🤖 AI-Powered Analysis</h4>
              <p>Advanced natural language processing for accurate sentiment scoring</p>
            </div>
            <div className="feature-card">
              <h4>📊 Interactive Charts</h4>
              <p>Dynamic visualizations of reputation trends over time</p>
            </div>
            <div className="feature-card">
              <h4>⚡ Automated Updates</h4>
              <p>Continuous data collection and analysis</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>© 2024 Musk vs Trump AI Reputation Tracker | 
          <a href="https://github.com/hannesmitterer/musk_vs_trump" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;