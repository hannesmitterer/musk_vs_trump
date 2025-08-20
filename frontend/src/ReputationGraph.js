import React, { useState, useEffect, useCallback, useRef } from 'react';
import Plot from 'react-plotly.js';
import './ReputationGraph.css';

const ReputationGraph = () => {
  const [data, setData] = useState({ reputation: [], logs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('both');
  const [timeRange, setTimeRange] = useState('1h');
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef(null);

  // Mock data generator for demonstration
  const generateMockData = useCallback(() => {
    const now = Date.now();
    const points = 50;
    const timeInterval = timeRange === '1h' ? 60000 : timeRange === '6h' ? 360000 : 3600000; // ms
    
    const muskData = [];
    const trumpData = [];
    const logs = [];

    for (let i = 0; i < points; i++) {
      const timestamp = new Date(now - (points - i) * timeInterval);
      
      // Generate realistic sentiment scores (-1 to 1)
      const muskSentiment = Math.sin(i * 0.3) * 0.4 + Math.random() * 0.3 - 0.15;
      const trumpSentiment = Math.cos(i * 0.25) * 0.5 + Math.random() * 0.4 - 0.2;
      
      // Generate engagement scores (0 to 100)
      const muskEngagement = Math.abs(Math.sin(i * 0.2)) * 80 + Math.random() * 20;
      const trumpEngagement = Math.abs(Math.cos(i * 0.15)) * 90 + Math.random() * 10;
      
      muskData.push({
        x: timestamp.toISOString(),
        y: muskSentiment,
        z: muskEngagement,
        person: 'Elon Musk'
      });
      
      trumpData.push({
        x: timestamp.toISOString(),
        y: trumpSentiment,
        z: trumpEngagement,
        person: 'Donald Trump'
      });
      
      // Add some log entries
      if (i % 10 === 0) {
        logs.push({
          timestamp: timestamp.toISOString(),
          message: `Data point analyzed for ${Math.random() > 0.5 ? 'Musk' : 'Trump'}`,
          type: 'info',
          sentiment: Math.random() > 0.5 ? muskSentiment : trumpSentiment
        });
      }
    }

    return {
      reputation: [...muskData, ...trumpData],
      logs: logs.slice(-20) // Keep last 20 logs
    };
  }, [timeRange]);

  // Fetch data from backend or use mock data
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Try to fetch from backend first
      const reputationResponse = await fetch('http://localhost:5000/api/reputation');
      const logsResponse = await fetch('http://localhost:5000/api/logs');
      
      if (reputationResponse.ok && logsResponse.ok) {
        const reputationData = await reputationResponse.json();
        const logsData = await logsResponse.json();
        
        setData({ reputation: reputationData, logs: logsData });
        setIsConnected(true);
      } else {
        throw new Error('Backend endpoints not available');
      }
    } catch (err) {
      console.warn('Using mock data:', err.message);
      // Use mock data when backend is not available
      setData(generateMockData());
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [generateMockData]);

  // Auto-refresh data
  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh
    intervalRef.current = setInterval(() => {
      fetchData();
      setUpdateCount(prev => prev + 1);
    }, 5000); // Update every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  // Filter data based on selected person
  const getFilteredData = () => {
    if (!data.reputation) return [];
    
    if (selectedPerson === 'both') {
      return data.reputation;
    }
    
    const personName = selectedPerson === 'musk' ? 'Elon Musk' : 'Donald Trump';
    return data.reputation.filter(point => point.person === personName);
  };

  // Prepare 3D plot data
  const getPlotData = () => {
    const filteredData = getFilteredData();
    
    const muskPoints = filteredData.filter(point => point.person === 'Elon Musk');
    const trumpPoints = filteredData.filter(point => point.person === 'Donald Trump');
    
    const traces = [];
    
    if (selectedPerson === 'both' || selectedPerson === 'musk') {
      traces.push({
        x: muskPoints.map(point => point.x),
        y: muskPoints.map(point => point.y),
        z: muskPoints.map(point => point.z),
        mode: 'markers+lines',
        type: 'scatter3d',
        name: 'Elon Musk',
        marker: {
          color: muskPoints.map(point => point.y),
          colorscale: 'Viridis',
          size: 8,
          colorbar: {
            title: 'Sentiment Score',
            titleside: 'right'
          }
        },
        line: {
          color: '#1DA1F2',
          width: 4
        }
      });
    }
    
    if (selectedPerson === 'both' || selectedPerson === 'trump') {
      traces.push({
        x: trumpPoints.map(point => point.x),
        y: trumpPoints.map(point => point.y),
        z: trumpPoints.map(point => point.z),
        mode: 'markers+lines',
        type: 'scatter3d',
        name: 'Donald Trump',
        marker: {
          color: trumpPoints.map(point => point.y),
          colorscale: 'RdYlBu',
          size: 8,
          showscale: selectedPerson !== 'both'
        },
        line: {
          color: '#FF6B35',
          width: 4
        }
      });
    }
    
    return traces;
  };

  const plotLayout = {
    title: {
      text: 'Real-Time Reputation Analysis - 3D Visualization',
      font: { size: 20, color: '#2d3748' }
    },
    scene: {
      xaxis: { 
        title: 'Time',
        titlefont: { color: '#4a5568' },
        tickfont: { color: '#718096' }
      },
      yaxis: { 
        title: 'Sentiment Score',
        titlefont: { color: '#4a5568' },
        tickfont: { color: '#718096' },
        range: [-1, 1]
      },
      zaxis: { 
        title: 'Engagement Level',
        titlefont: { color: '#4a5568' },
        tickfont: { color: '#718096' },
        range: [0, 100]
      },
      bgcolor: 'rgba(0,0,0,0)',
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }
      }
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 60, b: 50, l: 50, r: 50 },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      bordercolor: '#e2e8f0',
      borderwidth: 1
    }
  };

  const plotConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d'],
    displaylogo: false,
    responsive: true
  };

  if (isLoading) {
    return (
      <div className="reputation-graph-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h3>Loading 3D Visualization...</h3>
          <p>Analyzing reputation data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reputation-graph-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Data</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reputation-graph-container">
      {/* Controls Panel */}
      <div className="controls-panel">
        <div className="control-group">
          <label className="control-label">View:</label>
          <div className="control-buttons">
            <button 
              className={`control-button ${selectedPerson === 'both' ? 'active' : ''}`}
              onClick={() => setSelectedPerson('both')}
            >
              Both
            </button>
            <button 
              className={`control-button ${selectedPerson === 'musk' ? 'active' : ''}`}
              onClick={() => setSelectedPerson('musk')}
            >
              Elon Musk
            </button>
            <button 
              className={`control-button ${selectedPerson === 'trump' ? 'active' : ''}`}
              onClick={() => setSelectedPerson('trump')}
            >
              Donald Trump
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <label className="control-label">Time Range:</label>
          <div className="control-buttons">
            <button 
              className={`control-button ${timeRange === '1h' ? 'active' : ''}`}
              onClick={() => setTimeRange('1h')}
            >
              1H
            </button>
            <button 
              className={`control-button ${timeRange === '6h' ? 'active' : ''}`}
              onClick={() => setTimeRange('6h')}
            >
              6H
            </button>
            <button 
              className={`control-button ${timeRange === '24h' ? 'active' : ''}`}
              onClick={() => setTimeRange('24h')}
            >
              24H
            </button>
          </div>
        </div>
        
        <div className="status-info">
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Live Data' : 'Demo Mode'}
          </div>
          <div className="update-info">
            Updates: {updateCount}
          </div>
        </div>
      </div>

      {/* 3D Graph */}
      <div className="graph-container">
        <Plot
          data={getPlotData()}
          layout={plotLayout}
          config={plotConfig}
          style={{ width: '100%', height: '600px' }}
        />
      </div>

      {/* Live Logs */}
      <div className="logs-panel">
        <div className="logs-header">
          <h3>Live Analysis Logs</h3>
          <div className="logs-controls">
            <button className="refresh-button" onClick={fetchData} disabled={isLoading}>
              🔄 Refresh
            </button>
          </div>
        </div>
        
        <div className="logs-container">
          {data.logs && data.logs.length > 0 ? (
            <div className="logs-list">
              {data.logs.map((log, index) => (
                <div key={index} className={`log-entry ${log.type}`}>
                  <div className="log-timestamp">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="log-message">{log.message}</div>
                  {log.sentiment && (
                    <div className={`log-sentiment ${log.sentiment > 0 ? 'positive' : 'negative'}`}>
                      {log.sentiment > 0 ? '📈' : '📉'} {log.sentiment.toFixed(3)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-logs">
              <p>No logs available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReputationGraph;