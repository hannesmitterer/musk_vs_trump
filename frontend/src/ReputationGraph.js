import React, { useState, useEffect } from 'react';

const ReputationGraph = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [data, setData] = useState([]);

  // Mock data for demonstration
  const generateMockData = (days) => {
    const mockData = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      mockData.push({
        date: date.toLocaleDateString(),
        musk: 7.5 + Math.random() * 2 - 1, // 6.5 to 8.5 range
        trump: 6.0 + Math.random() * 2 - 1, // 5.0 to 7.0 range
      });
    }
    
    return mockData;
  };

  useEffect(() => {
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30;
    setData(generateMockData(days));
  }, [timeframe]);

  const currentMuskScore = data.length > 0 ? data[data.length - 1].musk : 7.8;
  const currentTrumpScore = data.length > 0 ? data[data.length - 1].trump : 6.2;
  
  const muskTrend = data.length >= 2 ? 
    (data[data.length - 1].musk > data[data.length - 2].musk ? 'up' : 'down') : 'up';
  const trumpTrend = data.length >= 2 ? 
    (data[data.length - 1].trump > data[data.length - 2].trump ? 'up' : 'down') : 'down';

  return (
    <div className="reputation-graph">
      <div className="graph-header">
        <div className="current-scores">
          <div className="score-card musk">
            <div className="score-info">
              <h3>Elon Musk</h3>
              <div className="score-value">
                {currentMuskScore.toFixed(1)}
                <span className={`trend ${muskTrend}`}>
                  {muskTrend === 'up' ? '↗' : '↘'}
                </span>
              </div>
            </div>
            <div className="score-bar">
              <div 
                className="score-fill musk-fill"
                style={{ width: `${(currentMuskScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="score-card trump">
            <div className="score-info">
              <h3>Donald Trump</h3>
              <div className="score-value">
                {currentTrumpScore.toFixed(1)}
                <span className={`trend ${trumpTrend}`}>
                  {trumpTrend === 'up' ? '↗' : '↘'}
                </span>
              </div>
            </div>
            <div className="score-bar">
              <div 
                className="score-fill trump-fill"
                style={{ width: `${(currentTrumpScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="timeframe-selector">
          <button 
            className={timeframe === '24h' ? 'active' : ''}
            onClick={() => setTimeframe('24h')}
          >
            24H
          </button>
          <button 
            className={timeframe === '7d' ? 'active' : ''}
            onClick={() => setTimeframe('7d')}
          >
            7D
          </button>
          <button 
            className={timeframe === '30d' ? 'active' : ''}
            onClick={() => setTimeframe('30d')}
          >
            30D
          </button>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-placeholder">
          <div className="chart-info">
            <h4>📊 Interactive Chart Coming Soon</h4>
            <p>Real-time sentiment tracking visualization will be available here</p>
            <div className="mock-chart">
              <div className="chart-lines">
                {data.map((point, index) => (
                  <div key={index} className="data-point" style={{ left: `${(index / (data.length - 1)) * 100}%` }}>
                    <div 
                      className="musk-point" 
                      style={{ bottom: `${(point.musk / 10) * 100}%` }}
                      title={`Musk: ${point.musk.toFixed(1)} on ${point.date}`}
                    ></div>
                    <div 
                      className="trump-point" 
                      style={{ bottom: `${(point.trump / 10) * 100}%` }}
                      title={`Trump: ${point.trump.toFixed(1)} on ${point.date}`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-color musk-color"></div>
          <span>Elon Musk</span>
        </div>
        <div className="legend-item">
          <div className="legend-color trump-color"></div>
          <span>Donald Trump</span>
        </div>
      </div>

      <div className="data-insights">
        <h4>Key Insights</h4>
        <ul>
          <li>🚀 Musk's reputation is currently trending {muskTrend} with a score of {currentMuskScore.toFixed(1)}/10</li>
          <li>🏛️ Trump's reputation is currently trending {trumpTrend} with a score of {currentTrumpScore.toFixed(1)}/10</li>
          <li>📈 Data refreshes every 15 minutes from multiple social media sources</li>
          <li>🎯 Analysis includes sentiment from news articles, social media posts, and public statements</li>
        </ul>
      </div>
    </div>
  );
};

export default ReputationGraph;