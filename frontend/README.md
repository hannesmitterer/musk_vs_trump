# Frontend Setup

This directory contains the React-based frontend application for the Musk vs Trump AI reputation tracker.

## ✨ Features

- 📊 **Real-time Reputation Tracking** - Live sentiment analysis and reputation monitoring
- 📈 **Interactive Charts** - Dynamic visualizations using Recharts library
- 🚀 **Modern React App** - Built with React 18 and modern JavaScript
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔄 **Live Backend Integration** - Connects to Flask backend API
- 🎯 **Multiple Chart Views** - Sentiment comparison, mentions volume, and detailed analysis

## Development Setup

### Prerequisites

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Backend server** running on `http://localhost:5000` (optional for full functionality)

### Quick Start

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   This will install React, Recharts, Axios, and other required packages.

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   The application will automatically open at `http://localhost:3000`
   
   If port 3000 is in use, Create React App will prompt you to use a different port.

### Available Scripts

- `npm start` - Starts the development server with hot-reload
- `npm run build` - Creates an optimized production build
- `npm test` - Launches the test runner (when tests are added)
- `npm run deploy` - Deploys to GitHub Pages (requires build first)

## 🏗️ File Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main application component
│   ├── App.css             # Application styles
│   ├── ReputationGraph.js  # Chart components for reputation data
│   └── index.js            # React DOM entry point
├── package.json            # Project dependencies and scripts
└── README.md              # This file
```

## 🔧 Development Workflow

1. **Start the backend server** (recommended for full functionality):
   ```bash
   cd ../backend
   ./start_backend.sh
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Development features:**
   - Hot-reload: Changes automatically refresh the browser
   - Backend integration: Connects to `http://localhost:5000`
   - Sample data: Works without backend for development

## 🚀 Deployment

The app is configured for deployment to GitHub Pages:

1. **Automatic deployment** via GitHub Actions (see `.github/workflows/`)
2. **Manual deployment:**
   ```bash
   npm run build
   npm run deploy
   ```

The live application will be available at: `https://hannesmitterer.github.io/musk_vs_trump`

## 🎨 Key Components

### App.js
- Main application container
- Backend health checking
- Sample data generation
- Summary cards with current metrics
- Features showcase

### ReputationGraph.js  
- Interactive chart component using Recharts
- Multiple view modes:
  - 📊 Sentiment Comparison - Line chart comparing both figures
  - 📈 Mentions Volume - Area chart showing daily mentions
  - 🔍 Detailed Analysis - Separate positive/negative trend charts
- Responsive design with custom tooltips

## 🔗 Integration

### Backend Connection
- Health check endpoint: `GET /health`
- Future API endpoints for real data
- Graceful fallback to sample data

### Sample Data
The app generates realistic sample data for demonstration:
- 30-day sentiment trends (-50 to +50 scale)
- Daily mention counts (100-1100 range)
- Positive/negative sentiment breakdowns

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## 📝 Contributing

1. Follow the setup instructions above
2. Make changes to components in `src/`
3. Test with `npm start`
4. Submit pull requests for review

## ⚡ Troubleshooting

- **Port 3000 in use**: React will offer an alternative port
- **Backend offline**: App still works with sample data
- **Install failures**: Try `rm -rf node_modules package-lock.json && npm install`
- **Build errors**: Ensure Node.js version 14+