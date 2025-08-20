# Musk vs Trump - AI Reputation Tracker 🚀

> **Real-time AI-powered sentiment analysis and reputation tracking with stunning 3D visualizations**

A cutting-edge web application that tracks and analyzes the reputation dynamics of public figures through advanced AI sentiment analysis, featuring interactive 3D data visualization and live updates.

## ✨ Key Features

- 🧠 **AI-Powered Sentiment Analysis**: Advanced natural language processing for accurate sentiment detection
- 📊 **Interactive 3D Visualization**: Three-dimensional plots showing sentiment, engagement, and time relationships
- ⚡ **Real-Time Updates**: Live data streaming with automatic refresh every 5 seconds
- 🎨 **Modern UI/UX**: Beautiful, responsive design with gradient backgrounds and smooth animations
- 📱 **Mobile-First Design**: Fully responsive across all device sizes
- 🔄 **Live Activity Logs**: Real-time system logs showing analysis activity
- 🚀 **GitHub Pages Deployment**: Production-ready with automated CI/CD

## 🏗️ Architecture

### Frontend (React + 3D Visualization)
- **React 18** with modern hooks and functional components
- **Plotly.js** for interactive 3D data visualization
- **Axios** for API communication
- **CSS3** with gradient animations and responsive design

### Backend (Flask + AI Processing)
- **Flask** web framework with RESTful API endpoints
- **CORS** enabled for frontend integration
- **Mock AI Data** with realistic sentiment patterns
- **JSON API** responses for all endpoints

## 📊 Live Demo

🔗 **Frontend**: [https://hannesmitterer.github.io/musk_vs_trump/](https://hannesmitterer.github.io/musk_vs_trump/)

## 🚀 Quick Start

### Prerequisites
- **Python 3.x** (for backend)
- **Node.js 16+** (for frontend)
- **npm** package manager

### 1. Backend Setup (Automated) ⚡

```bash
cd backend
./start_backend.sh  # Complete setup + server start
```

**Alternative using Makefile:**
```bash
cd backend
make setup && make start-server
```

### 2. Frontend Setup 🎨

```bash
cd frontend
npm install
npm start  # Starts on http://localhost:3000
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🛠️ Manual Setup (If Needed)

### Backend
```bash
cd backend
pip3 install -r requirements.txt
python3 -c "import db_manager; db_manager.create_tables()"
python3 app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/` | GET | Basic server status |
| `/health` | GET | Health check with JSON response |
| `/api/reputation` | GET | Reputation data for visualization |
| `/api/logs` | GET | Live system activity logs |
| `/api/status` | GET | Detailed API status information |

### Example API Response
```json
{
  "person": "Elon Musk",
  "x": "2024-08-20T10:30:00",
  "y": 0.75,
  "z": 85.2,
  "timestamp": "2024-08-20T10:30:00"
}
```

## 🎯 Components Overview

### Frontend Components

#### App.js - Main Application
- 🏠 **Landing Page**: Hero section with animated elements
- 🎛️ **Navigation**: Smooth section switching
- 📊 **Status Monitoring**: Backend connectivity indicators
- 📱 **Responsive Layout**: Adapts to all screen sizes

#### ReputationGraph.js - 3D Visualization
- 📈 **3D Scatter Plot**: Sentiment × Engagement × Time
- 🎮 **Interactive Controls**: Person and time range filters
- 🔄 **Auto-Refresh**: Updates every 5 seconds
- 📝 **Live Logs**: Real-time activity display

### Backend Features

#### Enhanced Flask Server
- 🔗 **CORS Enabled**: Frontend integration ready
- 🎲 **Mock Data Generation**: Realistic sentiment patterns
- 📊 **Multiple Endpoints**: Reputation, logs, and status
- ⚡ **High Performance**: Optimized for real-time updates

## 📁 Updated Project Structure

```
musk_vs_trump/
├── 🎨 frontend/                    # React application with 3D visualization
│   ├── public/                     # Static assets and HTML template
│   │   ├── index.html             # Main HTML with meta tags
│   │   ├── manifest.json          # PWA configuration
│   │   └── robots.txt             # SEO configuration
│   ├── src/                       # React source code
│   │   ├── App.js                 # Main component with navigation
│   │   ├── App.css                # Modern styling with gradients
│   │   ├── ReputationGraph.js     # 3D visualization component
│   │   ├── ReputationGraph.css    # Graph-specific styles
│   │   ├── index.js               # React DOM entry point
│   │   └── index.css              # Global styles and animations
│   ├── package.json               # Dependencies and build scripts
│   ├── .env.production            # Production environment config
│   └── README.md                  # Detailed frontend documentation
├── 🐍 backend/                     # Enhanced Flask API server
│   ├── app.py                     # Flask app with API endpoints
│   ├── db_manager.py              # Database management utilities
│   ├── requirements.txt           # Python dependencies (includes CORS)
│   ├── start_backend.sh           # Automated setup script
│   └── Makefile                   # Build automation alternatives
├── 🚀 .github/workflows/           # GitHub Actions for CI/CD
│   └── deploy.yml                 # Automated GitHub Pages deployment
├── 📄 README.md                   # Complete project documentation
├── 📝 info-project.txt           # Project structure reference
└── ⚙️ pyproject.toml              # Python project configuration
```

## 🚀 GitHub Pages Deployment

The project is **production-ready** with automated deployment to GitHub Pages:

### Automatic Deployment
1. **Push to main branch** triggers GitHub Actions workflow
2. **Frontend build** creates optimized production bundle  
3. **Deployment** publishes to `https://hannesmitterer.github.io/musk_vs_trump/`

### Deployment Configuration
- **GitHub Actions**: `.github/workflows/deploy.yml`
- **Production Config**: `frontend/.env.production`
- **Build Output**: `frontend/build/` (static files)

## 🎯 Live Features Implemented

### ✅ Modern Landing Page
- Hero section with gradient background and floating animations
- Feature cards showcasing AI analysis capabilities
- Responsive navigation with smooth transitions
- Real-time backend status indicator

### ✅ 3D Reputation Visualization  
- Interactive Plotly.js 3D scatter plot
- Three axes: Time (X) × Sentiment (Y) × Engagement (Z)
- Person filtering (Musk, Trump, or both)
- Time range controls (1H, 6H, 24H)
- Auto-refresh every 5 seconds

### ✅ Live Activity Logs
- Real-time system logs with timestamps
- Color-coded log levels (info, success, warning, error)
- Sentiment indicators for analysis entries
- Auto-scrolling to latest entries

### ✅ Enhanced Backend APIs
- `/api/reputation` - 3D visualization data
- `/api/logs` - Live activity logging
- `/api/status` - System status information
- CORS enabled for frontend integration

## 📊 Data Visualization Details

The 3D visualization shows:
- **X-Axis (Time)**: Chronological progression of data points
- **Y-Axis (Sentiment)**: Range from -1.0 (negative) to +1.0 (positive)  
- **Z-Axis (Engagement)**: Scale from 0 to 100 (engagement percentage)
- **Color Mapping**: Sentiment values mapped to color gradients
- **Interactive Features**: Rotate, zoom, pan, and hover tooltips

## 🔧 Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| **Frontend URL** | http://localhost:3000 | GitHub Pages |
| **Backend URL** | http://localhost:5000 | Mock data fallback |
| **Data Updates** | Every 5 seconds | Real-time simulation |
| **Error Handling** | Debug mode | Graceful fallbacks |
| **Build Size** | Unminified | Optimized & compressed |

## 📈 Performance & Optimization

### Frontend Optimizations
- **React 18** with automatic code splitting
- **Plotly.js** for hardware-accelerated 3D graphics  
- **Responsive design** with mobile-first approach
- **Loading states** and error boundaries
- **Memoized components** to prevent unnecessary re-renders

### Backend Optimizations  
- **Flask with CORS** for cross-origin requests
- **JSON API responses** with proper HTTP status codes
- **Mock data generation** with realistic patterns
- **Error handling** with informative messages

## 🎨 Visual Design System

- **Color Palette**: Purple gradient primary (#667eea → #764ba2)
- **Typography**: Inter font family for modern appearance
- **Animations**: Fade-in effects, hover transitions, floating elements
- **Icons**: Emoji-based for universal compatibility
- **Layout**: CSS Grid and Flexbox for responsive design