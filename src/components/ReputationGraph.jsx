import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Demo data for initial display
const demoData = [
  { date: '2024-01-01', musk: 65, trump: 58 },
  { date: '2024-01-02', musk: 68, trump: 55 },
  { date: '2024-01-03', musk: 70, trump: 60 },
  { date: '2024-01-04', musk: 67, trump: 62 },
  { date: '2024-01-05', musk: 72, trump: 59 },
  { date: '2024-01-06', musk: 69, trump: 61 },
  { date: '2024-01-07', musk: 71, trump: 57 },
  { date: '2024-01-08', musk: 74, trump: 63 },
  { date: '2024-01-09', musk: 73, trump: 65 },
  { date: '2024-01-10', musk: 75, trump: 64 },
];

export default function ReputationGraph() {
  return (
    <div style={{ 
      width: '100%', 
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      marginTop: '2rem'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        color: '#333',
        fontSize: '1.8rem'
      }}>
        🏆 Reputation Tracker: Musk vs Trump
      </h2>
      
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={demoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              domain={[40, 80]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Reputation Score', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [value + '%', name === 'musk' ? 'Elon Musk' : 'Donald Trump']}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            />
            <Legend 
              formatter={(value) => value === 'musk' ? '🚀 Elon Musk' : '🇺🇸 Donald Trump'}
            />
            <Line 
              type="monotone" 
              dataKey="musk" 
              stroke="#1DA1F2" 
              strokeWidth={3}
              dot={{ fill: '#1DA1F2', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#1DA1F2', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="trump" 
              stroke="#FF6B35" 
              strokeWidth={3}
              dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#FF6B35', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #dee2e6'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#6c757d',
            textAlign: 'center'
          }}>
            📊 This is a demo visualization showing reputation trends over time. 
            Real data would be populated from AI sentiment analysis of social media and news sources.
          </p>
        </div>
      </div>
    </div>
  );
}