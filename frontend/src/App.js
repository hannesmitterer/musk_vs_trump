import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReputationGraph from './ReputationGraph';

// Configure axios base URL - adjust for your deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Initialize demo data and fetch dashboard data
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize demo data if needed
      console.log('Initializing demo data...');
      await axios.post('/api/demo/init');

      // Fetch dashboard data
      console.log('Fetching dashboard data...');
      const response = await axios.get('/api/demo/dashboard');
      setDashboardData(response.data);
      setLastUpdated(new Date());

      console.log('Dashboard data loaded successfully');
    } catch (err) {
      console.error('Error loading data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    initializeData();
  };

  const runDataCollection = async () => {
    try {
      setLoading(true);
      await axios.post('/api/collect/run', {
        persons: ['musk', 'trump'],
        sources: ['mock']
      });
      
      // Refresh dashboard after collection
      await initializeData();
    } catch (err) {
      setError(`Data collection failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center" style={{minHeight: '100vh'}}>
          <div className="col-auto text-center">
            <div className="loading-spinner"></div>
            <h4 className="mt-3 text-white">Loading AI-Powered Reputation Tracker...</h4>
            <p className="text-white-50">Initializing deep learning models and collecting data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center" style={{minHeight: '100vh'}}>
          <div className="col-md-6">
            <div className="alert alert-danger text-center">
              <h4>Error Loading Dashboard</h4>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={refreshData}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const comparison = dashboardData?.comparison || {};
  const winner = comparison.winner || 'unknown';
  const margin = comparison.margin || 0;

  return (
    <div className="container-fluid">
      <div className="main-container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="display-4 mb-2">
              <strong>Musk vs Trump</strong>
            </h1>
            <h2 className="h4 text-muted mb-3">AI-Powered Reputation Tracker</h2>
            <p className="lead">
              Real-time reputation analysis using advanced deep learning and AI algorithms
            </p>
            
            {lastUpdated && (
              <small className="text-muted">
                Last updated: {lastUpdated.toLocaleString()}
              </small>
            )}
          </div>
        </div>

        {/* Winner Banner */}
        {winner && winner !== 'unknown' && (
          <div className="row mb-4">
            <div className="col-12 text-center">
              <div className="winner-badge">
                🏆 Current Leader: <strong>{winner.toUpperCase()}</strong> 
                {margin > 0 && (
                  <span className="ms-2">
                    (Margin: {(margin * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <button 
              className="btn btn-primary me-2" 
              onClick={refreshData}
              disabled={loading}
            >
              🔄 Refresh Data
            </button>
            <button 
              className="btn btn-success me-2" 
              onClick={runDataCollection}
              disabled={loading}
            >
              📊 Collect New Data
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-pills justify-content-center mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              Trends
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              AI Insights
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab dashboardData={dashboardData} />
        )}
        
        {activeTab === 'trends' && (
          <TrendsTab dashboardData={dashboardData} />
        )}
        
        {activeTab === 'insights' && (
          <InsightsTab dashboardData={dashboardData} />
        )}

        {/* Footer */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <hr />
            <p className="text-muted small">
              Powered by Deep Learning Integration (@kmario23/deep-learning-drizzle) • 
              AI Algorithms Loader • PyWinAssistant Interface
            </p>
            <p className="text-muted small">
              Ready for deployment on GitHub Pages and integration with @a-real-ai/pywinassistant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ dashboardData }) {
  const comparison = dashboardData?.comparison || {};
  const recentScores = dashboardData?.recent_scores || {};

  return (
    <div className="row">
      {/* Person Cards */}
      <div className="col-md-6 mb-4">
        <div className="card person-card musk-card">
          <div className="card-body text-center">
            <h3>🚀 Elon Musk</h3>
            <h2 className="display-4">
              {comparison?.entity1?.mean_score?.toFixed(3) || '0.000'}
            </h2>
            <p className="mb-1">Average Reputation Score</p>
            <small>
              Data Points: {comparison?.entity1?.data_points || 0}
            </small>
            <div className="mt-3">
              <small>Recent Activity: {recentScores?.musk?.length || 0} scores</small>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card person-card trump-card">
          <div className="card-body text-center">
            <h3>🇺🇸 Donald Trump</h3>
            <h2 className="display-4">
              {comparison?.entity2?.mean_score?.toFixed(3) || '0.000'}
            </h2>
            <p className="mb-1">Average Reputation Score</p>
            <small>
              Data Points: {comparison?.entity2?.data_points || 0}
            </small>
            <div className="mt-3">
              <small>Recent Activity: {recentScores?.trump?.length || 0} scores</small>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Stats */}
      <div className="col-12">
        <div className="chart-container">
          <h4>Comparison Statistics</h4>
          <div className="row text-center">
            <div className="col-md-3">
              <h5>Winner</h5>
              <p className="h3 text-primary">
                {comparison?.winner?.toUpperCase() || 'TIE'}
              </p>
            </div>
            <div className="col-md-3">
              <h5>Margin</h5>
              <p className="h3 text-success">
                {((comparison?.margin || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="col-md-3">
              <h5>More Consistent</h5>
              <p className="h3 text-info">
                {comparison?.more_consistent?.toUpperCase() || 'UNKNOWN'}
              </p>
            </div>
            <div className="col-md-3">
              <h5>Confidence</h5>
              <p className="h3 text-warning">
                {((comparison?.confidence || 0) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trends Tab Component  
function TrendsTab({ dashboardData }) {
  const trends = dashboardData?.trends || {};
  const recentScores = dashboardData?.recent_scores || {};

  return (
    <div className="row">
      <div className="col-12">
        <ReputationGraph 
          muskScores={recentScores?.musk || []}
          trumpScores={recentScores?.trump || []}
        />
      </div>
      
      <div className="col-md-6">
        <div className="chart-container">
          <h4>Musk Trend Analysis</h4>
          {trends?.musk?.trend_analysis ? (
            <div>
              <p><strong>Trend:</strong> {trends.musk.trend_analysis.trend}</p>
              <p><strong>Direction:</strong> {trends.musk.trend_analysis.direction?.toFixed(3)}</p>
              <p><strong>Volatility:</strong> {trends.musk.trend_analysis.volatility?.toFixed(3)}</p>
              <p><strong>Current Avg:</strong> {trends.musk.trend_analysis.current_avg?.toFixed(3)}</p>
            </div>
          ) : (
            <p className="text-muted">No trend data available</p>
          )}
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="chart-container">
          <h4>Trump Trend Analysis</h4>
          {trends?.trump?.trend_analysis ? (
            <div>
              <p><strong>Trend:</strong> {trends.trump.trend_analysis.trend}</p>
              <p><strong>Direction:</strong> {trends.trump.trend_analysis.direction?.toFixed(3)}</p>
              <p><strong>Volatility:</strong> {trends.trump.trend_analysis.volatility?.toFixed(3)}</p>
              <p><strong>Current Avg:</strong> {trends.trump.trend_analysis.current_avg?.toFixed(3)}</p>
            </div>
          ) : (
            <p className="text-muted">No trend data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Insights Tab Component
function InsightsTab({ dashboardData }) {
  const insights = dashboardData?.insights || {};

  return (
    <div className="row">
      <div className="col-12">
        <h4>AI-Powered Insights</h4>
        
        {insights?.insights?.length > 0 ? (
          <div className="row">
            {insights.insights.map((insight, index) => (
              <div key={index} className="col-md-6 mb-3">
                <div className="insight-card">
                  <h5>{insight.type?.toUpperCase() || 'INSIGHT'}</h5>
                  <p>{insight.message}</p>
                  <small className="text-muted">
                    Confidence: {((insight.confidence || 0) * 100).toFixed(0)}%
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            <h5>🤖 AI Analysis</h5>
            <p>Collecting more data to generate insights...</p>
          </div>
        )}

        {insights?.recommendations?.length > 0 && (
          <div className="mt-4">
            <h5>Recommendations</h5>
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="alert alert-secondary">
                <strong>{rec.priority?.toUpperCase()} Priority:</strong> {rec.description}
              </div>
            ))}
          </div>
        )}

        {/* AI Capabilities */}
        <div className="chart-container mt-4">
          <h5>AI Capabilities Status</h5>
          <div className="row">
            <div className="col-md-6">
              <h6>Loaded Algorithms</h6>
              <ul className="list-unstyled">
                {insights?.ai_capabilities?.loaded_algorithms?.map((algo, index) => (
                  <li key={index}>✅ {algo}</li>
                )) || [<li key="none">No algorithms loaded</li>]}
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Deep Learning Models</h6>
              <ul className="list-unstyled">
                {insights?.ai_capabilities?.deep_learning_models?.map((model, index) => (
                  <li key={index}>🧠 {model}</li>
                )) || [<li key="none">No models loaded</li>]}
              </ul>
            </div>
          </div>
          <p className="mt-2">
            <strong>Processing Ready:</strong> {
              insights?.ai_capabilities?.processing_ready ? '✅ Yes' : '❌ No'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;