# Musk vs Trump - AI Reputation Tracker

This project tracks and analyzes the reputation of public figures through AI-powered sentiment analysis with a modern React frontend and Flask backend.

## ✨ Features

- 🚀 **Real-time Reputation Tracking** - Live sentiment analysis and monitoring
- 📊 **Interactive Charts** - Dynamic visualizations with multiple view modes
- 🤖 **AI-Powered Analysis** - Advanced sentiment scoring and trend analysis
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- ⚡ **Automated Deployment** - CI/CD pipeline with GitHub Pages deployment
- 🔄 **Live Backend Integration** - RESTful API with health monitoring

## Project Structure

```
/musk-vs-trump
├── backend/                    # Flask API server
│   ├── app.py                 # Main Flask application
│   ├── db_manager.py          # Database management utilities  
│   ├── requirements.txt       # Python dependencies
│   ├── start_backend.sh       # Backend automation script
│   └── Makefile              # Build automation
├── frontend/                  # React application
│   ├── src/
│   │   ├── App.js            # Main application component
│   │   ├── ReputationGraph.js # Interactive chart components
│   │   ├── App.css           # Styling and responsive design
│   │   └── index.js          # React DOM entry point
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── package.json          # Node.js dependencies and scripts
│   └── README.md             # Frontend setup instructions
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml # GitHub Actions CI/CD
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.x** for backend
- **Node.js 14+** for frontend  
- **npm** (comes with Node.js)

### Full Stack Setup

1. **Start the backend:**
   ```bash
   cd backend
   ./start_backend.sh
   ```
   Backend will be available at `http://localhost:5000`

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend will open at `http://localhost:3000`

3. **View the application:**
   Open `http://localhost:3000` to see the full application with:
   - Real-time reputation tracking dashboard
   - Interactive sentiment comparison charts
   - Mentions volume analysis
   - Detailed positive/negative sentiment breakdowns

## Backend Setup

### Automated Setup (Recommended)

The backend includes two automation options for easy setup:

#### Option 1: Shell Script
```bash
cd backend
./start_backend.sh
```

#### Option 2: Makefile
```bash
cd backend
make setup  # Complete setup and start server
# OR run individual steps:
make install-deps  # Install dependencies only
make init-db       # Initialize database only
make start-server  # Start server only
make help          # Show available commands
```

Both automation methods will:
1. 🐍 **Install Python dependencies** from `requirements.txt`
2. 🗄️ **Initialize the database** using `db_manager.create_tables()`
3. 🌐 **Start the backend server** with `python app.py`

The server will be available at `http://localhost:5000` with endpoints:
- `GET /` - Basic status check
- `GET /health` - Health check with JSON response

### Manual Backend Setup

If you prefer to set up the backend manually:

1. **Install dependencies:**
   ```bash
   cd backend
   pip3 install -r requirements.txt
   ```

2. **Initialize the database:**
   ```bash
   python3 -c "import db_manager; db_manager.create_tables()"
   ```

3. **Start the server:**
   ```bash
   python3 app.py
   ```

## Frontend Setup

### Development Setup

1. **Navigate to frontend directory:**
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
   
   The application will open automatically at `http://localhost:3000`

### Production Build

```bash
cd frontend
npm run build
```

Creates optimized production build in `frontend/build/` directory.

### Deployment

The frontend is automatically deployed to GitHub Pages via GitHub Actions:
- **Live Site**: `https://hannesmitterer.github.io/musk_vs_trump`
- **Auto-deploy**: Triggers on pushes to `main` branch
- **Manual deploy**: `npm run deploy` (after build)

## 🔧 Development

### Architecture Overview
- **Frontend**: React 18 single-page application with Recharts for visualization
- **Backend**: Flask REST API with automated setup and health monitoring  
- **Deployment**: GitHub Actions CI/CD pipeline for automatic deployment
- **Data**: Sample sentiment data generation with backend integration ready

### Development Workflow

1. **Start both servers:**
   ```bash
   # Terminal 1: Backend
   cd backend && ./start_backend.sh
   
   # Terminal 2: Frontend  
   cd frontend && npm start
   ```

2. **Development features:**
   - Hot-reload on file changes (both frontend and backend)
   - Automatic browser opening for frontend
   - Backend health check integration
   - Sample data generation for development

### Adding New Features

#### Backend Features
1. Add Python packages to `backend/requirements.txt`
2. Create new API endpoints in `backend/app.py`
3. Update database schema in `backend/db_manager.py`
4. Use automation: `./start_backend.sh` installs new dependencies

#### Frontend Features  
1. Add npm packages: `npm install package-name`
2. Create new components in `frontend/src/`
3. Update routing and state management in `App.js`
4. Test with: `npm start` for development, `npm run build` for production

### GitHub Actions CI/CD

The project includes automated deployment:
- **Triggers**: Push to `main` branch or manual workflow dispatch
- **Process**: Build → Test → Deploy to GitHub Pages
- **Artifacts**: Optimized production build uploaded
- **URL**: `https://hannesmitterer.github.io/musk_vs_trump`

## 🚀 Live Application Features

The deployed application includes:

### 📊 Dashboard Overview
- Real-time status indicators for backend connectivity
- Summary cards showing current sentiment scores and daily mentions
- Refresh functionality for updated data

### 📈 Interactive Charts
- **Sentiment Comparison**: Line chart comparing Musk vs Trump sentiment over time
- **Mentions Volume**: Area chart showing daily mention counts
- **Detailed Analysis**: Separate positive/negative sentiment breakdowns

### 📱 Responsive Design
- Mobile-optimized interface
- Touch-friendly controls and navigation
- Adaptive layouts for all screen sizes

### 🔗 Integration Ready
- Backend health monitoring with status indicators  
- API endpoint integration prepared
- Sample data fallback when backend offline

## 🛠️ Troubleshooting

### Backend Issues
- **Python not found**: Ensure Python 3.x is installed (`python3 --version`)
- **Permission denied**: Make script executable (`chmod +x backend/start_backend.sh`)
- **Port 5000 in use**: Stop other services or change port in `app.py`
- **Module import errors**: Run `pip3 install -r requirements.txt`

### Frontend Issues  
- **npm install fails**: Try `rm -rf node_modules package-lock.json && npm install`
- **Port 3000 in use**: React will prompt for alternative port
- **Build failures**: Ensure Node.js 14+ (`node --version`)
- **Deployment issues**: Check GitHub Pages settings and Actions logs

### Integration Issues
- **CORS errors**: Backend runs on all interfaces (0.0.0.0) for development
- **API connection fails**: Verify backend is running on `http://localhost:5000`
- **Sample data not showing**: Check browser console for JavaScript errors

## 📈 Performance

- **Frontend build size**: ~150kb gzipped JavaScript, ~1kb CSS
- **Backend startup**: < 5 seconds with automation
- **Development setup**: < 2 minutes total (both servers)
- **Build time**: < 30 seconds for production optimization

## 🤝 Contributing

1. Fork the repository
2. Follow setup instructions above  
3. Create feature branch: `git checkout -b feature-name`
4. Test both frontend and backend changes
5. Submit pull request with clear description

## 📄 License

This project is open source. Add your license information here.