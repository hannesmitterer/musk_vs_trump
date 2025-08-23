import React from 'react';
import MobileDeployButton from './components/MobileDeployButton';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      <MobileDeployButton />
      
      {/* Main landing page content */}
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
          🥊 Musk vs Trump
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '2rem' }}>
          AI Reputation Tracker
        </h2>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>
            Track and analyze the reputation of public figures through AI-powered sentiment analysis.
          </p>
          
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', minWidth: '250px' }}>
              <h3 style={{ color: '#333' }}>📊 Real-time Analysis</h3>
              <p>Monitor reputation trends in real-time using advanced AI algorithms.</p>
            </div>
            
            <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', minWidth: '250px' }}>
              <h3 style={{ color: '#333' }}>📈 Historical Data</h3>
              <p>Compare reputation changes over time with comprehensive historical tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;