import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ReputationGraph = ({ muskData, trumpData }) => {
  const [viewMode, setViewMode] = useState('sentiment'); // 'sentiment', 'mentions', 'detailed'

  // Combine data for comparison view
  const combinedData = muskData.map((item, index) => ({
    date: item.date,
    muskSentiment: item.sentiment,
    trumpSentiment: trumpData[index]?.sentiment || 0,
    muskMentions: item.mentions,
    trumpMentions: trumpData[index]?.mentions || 0,
    muskPositive: item.positiveScore,
    trumpPositive: trumpData[index]?.positiveScore || 0,
    muskNegative: item.negativeScore,
    trumpNegative: trumpData[index]?.negativeScore || 0
  }));

  const formatTooltipValue = (value, name) => {
    if (name.includes('Sentiment')) {
      return [`${value.toFixed(1)}`, name];
    }
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toFixed(1)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderSentimentChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          domain={[-60, 60]}
          tick={{ fontSize: 12 }}
          label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="muskSentiment"
          stroke="#1DA1F2"
          strokeWidth={3}
          dot={{ fill: '#1DA1F2', strokeWidth: 2, r: 4 }}
          name="Musk Sentiment"
        />
        <Line
          type="monotone"
          dataKey="trumpSentiment"
          stroke="#FF6B35"
          strokeWidth={3}
          dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
          name="Trump Sentiment"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderMentionsChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          label={{ value: 'Daily Mentions', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="muskMentions"
          stackId="1"
          stroke="#1DA1F2"
          fill="#1DA1F2"
          fillOpacity={0.6}
          name="Musk Mentions"
        />
        <Area
          type="monotone"
          dataKey="trumpMentions"
          stackId="2"
          stroke="#FF6B35"
          fill="#FF6B35"
          fillOpacity={0.6}
          name="Trump Mentions"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderDetailedChart = () => (
    <div className="detailed-charts">
      <div className="chart-section">
        <h4>📈 Positive Sentiment Trends</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="muskPositive"
              stroke="#10B981"
              strokeWidth={2}
              name="Musk Positive"
            />
            <Line
              type="monotone"
              dataKey="trumpPositive"
              stroke="#34D399"
              strokeWidth={2}
              name="Trump Positive"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-section">
        <h4>📉 Negative Sentiment Trends</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="muskNegative"
              stroke="#EF4444"
              strokeWidth={2}
              name="Musk Negative"
            />
            <Line
              type="monotone"
              dataKey="trumpNegative"
              stroke="#F87171"
              strokeWidth={2}
              name="Trump Negative"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="reputation-graph">
      <div className="graph-controls">
        <button 
          className={`control-button ${viewMode === 'sentiment' ? 'active' : ''}`}
          onClick={() => setViewMode('sentiment')}
        >
          📊 Sentiment Comparison
        </button>
        <button 
          className={`control-button ${viewMode === 'mentions' ? 'active' : ''}`}
          onClick={() => setViewMode('mentions')}
        >
          📈 Mentions Volume
        </button>
        <button 
          className={`control-button ${viewMode === 'detailed' ? 'active' : ''}`}
          onClick={() => setViewMode('detailed')}
        >
          🔍 Detailed Analysis
        </button>
      </div>

      <div className="graph-content">
        {viewMode === 'sentiment' && (
          <div className="chart-container">
            <h3>Overall Sentiment Comparison</h3>
            {renderSentimentChart()}
          </div>
        )}
        
        {viewMode === 'mentions' && (
          <div className="chart-container">
            <h3>Daily Mentions Volume</h3>
            {renderMentionsChart()}
          </div>
        )}
        
        {viewMode === 'detailed' && (
          <div className="chart-container">
            <h3>Detailed Sentiment Breakdown</h3>
            {renderDetailedChart()}
          </div>
        )}
      </div>

      <div className="graph-legend">
        <div className="legend-item">
          <span className="legend-color musk"></span>
          <span>Elon Musk</span>
        </div>
        <div className="legend-item">
          <span className="legend-color trump"></span>
          <span>Donald Trump</span>
        </div>
      </div>
    </div>
  );
};

export default ReputationGraph;