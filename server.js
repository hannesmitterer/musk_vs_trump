const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"]
    }
  }
}));

app.use(compression());
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // Cache static assets for 1 day
  etag: true
}));

// API endpoints for health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API endpoint for mock reputation data
app.get('/api/reputation', (req, res) => {
  // Mock data - in production this would connect to backend services
  const mockData = {
    timestamp: Date.now(),
    data: {
      musk: {
        name: "Elon Musk",
        score: Math.round((70 + Math.random() * 20) * 10) / 10,
        trend: Math.random() > 0.5 ? "up" : "down",
        change: Math.round((Math.random() * 5 - 2.5) * 10) / 10,
        color: "#1DA1F2",
        sentiment: {
          positive: Math.round(30 + Math.random() * 40),
          neutral: Math.round(20 + Math.random() * 30),
          negative: Math.round(10 + Math.random() * 30)
        }
      },
      trump: {
        name: "Donald Trump",
        score: Math.round((60 + Math.random() * 25) * 10) / 10,
        trend: Math.random() > 0.5 ? "up" : "down", 
        change: Math.round((Math.random() * 5 - 2.5) * 10) / 10,
        color: "#FF4444",
        sentiment: {
          positive: Math.round(25 + Math.random() * 35),
          neutral: Math.round(15 + Math.random() * 35),
          negative: Math.round(15 + Math.random() * 35)
        }
      }
    },
    status: "success",
    message: "Live data retrieved successfully"
  };

  res.json(mockData);
});

// Serve index.html for all non-API routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Musk vs Trump AI Tracker server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/reputation`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});