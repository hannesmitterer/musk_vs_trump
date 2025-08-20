# Frontend - Musk vs Trump AI Reputation Tracker

This directory contains the React frontend application with modern design and 3D visualization capabilities.

## ✨ Features

- **Modern React Application** with hooks and functional components
- **3D Interactive Visualization** using Plotly.js for reputation data
- **Real-time Data Updates** with live API integration
- **Responsive Design** optimized for all devices
- **Professional UI/UX** with gradient backgrounds and animations
- **Live Logs Display** showing analysis activity
- **GitHub Pages Deployment** ready for production

## 🚀 Development Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Backend server running on `http://localhost:5000`

### Quick Start

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000` with hot reloading enabled.

## 📊 Components

### App.js - Main Application
- **Landing Page** with hero section and feature cards
- **Navigation System** with smooth section switching
- **Backend Status Monitoring** with visual indicators
- **Responsive Layout** adapting to screen sizes

### ReputationGraph.js - 3D Visualization
- **Interactive 3D Plot** showing sentiment vs engagement vs time
- **Real-time Data Updates** every 5 seconds
- **Filtering Controls** for person and time range selection
- **Live Logs Panel** displaying analysis activity
- **Mock Data Fallback** when backend is unavailable

## 🎨 Design System

- **Color Scheme**: Purple gradient primary with accent colors
- **Typography**: Inter font family for modern look
- **Animations**: Fade-in effects and hover transitions
- **Icons**: Emoji-based for universal compatibility

## 🔧 API Integration

The frontend connects to these backend endpoints:
- `GET /api/reputation` - Reputation data for visualization
- `GET /api/logs` - System activity logs
- `GET /health` - Backend health check

## 📱 Responsive Design

- **Desktop**: Full layout with side-by-side content
- **Tablet**: Stacked layout with adjusted spacing
- **Mobile**: Single-column layout with touch-optimized controls

## 🚀 Deployment

### GitHub Pages (Automated)

The project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: Push to `main` branch triggers deployment
2. **Production Build**: `npm run build` creates optimized build
3. **Static Hosting**: Deployed to `https://hannesmitterer.github.io/musk_vs_trump/`

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🛠️ Development Scripts

```bash
# Development server
npm start

# Production build
npm run build

# Run tests (when available)
npm test

# Deploy to GitHub Pages
npm run deploy

# Analyze bundle size
npm run build && npx serve -s build
```

## 📦 Dependencies

### Core Dependencies
- **react**: UI library for component-based development
- **react-dom**: React DOM rendering
- **react-scripts**: Build tool and development server

### Visualization
- **plotly.js-dist**: 3D plotting and data visualization
- **react-plotly.js**: React wrapper for Plotly.js

### HTTP Client
- **axios**: API requests and data fetching

## 🎯 Key Features in Detail

### 1. Modern Landing Page
- Hero section with animated elements
- Feature cards showcasing capabilities
- Call-to-action buttons with hover effects
- Backend connectivity status indicator

### 2. 3D Reputation Visualization
- Three-dimensional scatter plot showing:
  - X-axis: Time progression
  - Y-axis: Sentiment score (-1 to 1)
  - Z-axis: Engagement level (0 to 100)
- Interactive controls for data filtering
- Real-time updates with visual feedback

### 3. Live Activity Logs
- Scrollable log panel with timestamped entries
- Color-coded log levels (info, success, warning, error)
- Sentiment indicators for analysis logs
- Auto-refresh functionality

### 4. Production-Ready Features
- Environment-specific configuration
- Error boundaries and loading states
- Performance optimizations
- SEO-friendly structure

## 🔍 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port 3000 already in use**
   ```bash
   lsof -ti:3000 | xargs kill
   npm start
   ```

3. **Build failures**
   ```bash
   npm run build --verbose
   ```

4. **Backend connection issues**
   - Ensure backend server is running on port 5000
   - Check CORS configuration in backend
   - Verify API endpoints are responding

## 🎨 Customization

### Theme Colors
Edit `src/App.css` to modify the color scheme:
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Accent colors */
--primary: #667eea;
--secondary: #764ba2;
--accent: #fbbf24;
```

### Layout Modifications
Modify component structure in `src/App.js` and adjust styles in corresponding CSS files.

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic splitting by React
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive renders
- **Bundle Optimization**: Tree shaking and minification

## 📈 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Advanced filtering and search capabilities
- [ ] Export functionality for data and visualizations
- [ ] User authentication and personalization
- [ ] Progressive Web App (PWA) features
- [ ] Advanced analytics dashboard