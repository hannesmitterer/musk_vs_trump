import React from 'react';
import MobileDeployButton from './components/MobileDeployButton';
import ReputationGraph from './components/ReputationGraph';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    }}>
      <MobileDeployButton />
      
      {/* Header */}
      <header style={{
        textAlign: 'center',
        padding: '3rem 2rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          margin: '0 0 1rem 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🤖 AI Reputation Tracker
        </h1>
        <p style={{
          fontSize: '1.2rem',
          margin: 0,
          opacity: 0.9
        }}>
          Real-time sentiment analysis and reputation tracking for public figures
        </p>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem 4rem'
      }}>
        {/* Featured Graph - This is the main focus */}
        <ReputationGraph />
        
        {/* Additional Info */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ color: '#495057', marginTop: 0 }}>
            📈 About This Tracker
          </h3>
          <p style={{ color: '#6c757d', lineHeight: 1.6, margin: 0 }}>
            This application uses AI-powered sentiment analysis to track the reputation 
            trends of prominent public figures. The graph above shows reputation scores 
            over time, calculated from social media sentiment, news coverage, and public opinion data.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        borderTop: '1px solid #dee2e6'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          🚀 Deployed automatically to GitHub Pages | 
          <a 
            href="https://github.com/hannesmitterer/musk_vs_trump" 
            style={{ color: '#007bff', textDecoration: 'none', marginLeft: '0.5rem' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source Code
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;