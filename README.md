# Musk vs Trump - AI Reputation Tracker

This project tracks and analyzes the reputation of public figures through AI-powered sentiment analysis.

🌐 **Live Demo**: [View on GitHub Pages](https://hannesmitterer.github.io/musk_vs_trump/)
📊 **Render Deployment**: Ready for live deployment on Render

## Project Structure

```
/ai-reputation-tracker
├── backend/
│   ├── app.py                 # Main Flask/Django application
│   ├── models.py              # Database models
│   ├── data_collector.py      # Data collection logic
│   ├── sentiment_analyzer.py  # AI sentiment analysis
│   ├── db_manager.py          # Database management utilities
│   ├── requirements.txt       # Python dependencies
│   └── start_backend.sh       # Backend automation script
├── frontend/
│   ├── App.js
│   └── ReputationGraph.js
├── public/                     # Render deployment files
│   ├── index.html             # Main dashboard page
│   ├── App.js                 # Frontend application logic
│   ├── ReputationGraph.js     # Chart and visualization components
│   └── style.css              # Responsive CSS styles
├── docs/                       # GitHub Pages deployment
│   ├── index.html             # GitHub Pages dashboard
│   ├── app.js                 # Dashboard logic
│   ├── charts.js              # Chart.js configurations
│   ├── data.js                # Mock data
│   ├── ReputationGraph.js     # Additional chart components
│   └── styles.css             # Styling
├── database/
│   └── schema.sql
├── package.json               # Node.js dependencies (Render)
├── server.js                  # Express server (Render)
└── README.md
```

## Live Deployments

### GitHub Pages Deployment 🌐

**Automatic Deployment** (Recommended)
The site is automatically deployed from the `docs/` directory to GitHub Pages.

1. **Already configured**: The repository is set up for automatic deployment
2. **Live URL**: https://hannesmitterer.github.io/musk_vs_trump/
3. **Auto-updates**: Any push to main branch updates the live site within 2-3 minutes
4. **Source**: All files in `docs/` directory are served statically

**Manual Setup** (if needed)
1. Go to repository **Settings → Pages**
2. Set source to "Deploy from a branch"
3. Select branch: `main` and folder: `/docs`
4. Save settings and wait 2-3 minutes for deployment

### Render Deployment 🚀

**One-Click Deploy**
Deploy the full application with backend API on Render:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**Manual Render Setup**
1. **Create new Web Service** on [Render](https://render.com)
2. **Connect your GitHub repo**: `hannesmitterer/musk_vs_trump`
3. **Configure deployment**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
   - **Auto-Deploy**: `Yes`
4. **Set environment variables** (optional):
   ```
   NODE_ENV=production
   PORT=10000
   ```
5. **Deploy**: Render will automatically build and deploy

**Render Features**:
- ✅ Full-stack Node.js/Express server
- ✅ API endpoints for live data
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Environment variables
- ✅ Zero-downtime deploys

### Local Development 💻

**Quick Start**:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# OR
npm start

# Visit http://localhost:3000
```

**API Endpoints** (Render deployment):
- `GET /` - Main dashboard
- `GET /api/health` - Health check
- `GET /api/reputation` - Live reputation data

## Backend Setup (Python/Flask)

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

### Manual Setup

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

## Prerequisites

**For Render deployment:**
- Node.js 16+ and npm (for full-stack deployment)
- Git (for repository access)

**For backend development:**
- Python 3.x
- pip (Python package manager)

**For GitHub Pages:**
- No additional prerequisites (static deployment)

## Development

### Backend Development

The backend includes two automation options:

#### Shell Script (`start_backend.sh`)
- ✅ Error handling and validation
- ⚠️ Informative warnings for missing files
- 🚀 Automatic dependency management
- 🔄 Database initialization
- 📝 Clear logging and status messages

#### Makefile
- 🎯 Granular control with individual targets
- 🧹 Cleanup utilities (`make clean`)
- 📋 Help documentation (`make help`)
- 🔧 Flexible build automation

### Adding New Dependencies

1. Add your package to `backend/requirements.txt`
2. Run `./start_backend.sh` to automatically install new dependencies

## Troubleshooting

- **Python not found**: Ensure Python 3.x is installed and available in your PATH
- **Permission denied**: Make sure `start_backend.sh` is executable (`chmod +x start_backend.sh`)
- **Module import errors**: Verify all dependencies are installed via `requirements.txt`
- **Database errors**: Ensure `db_manager.py` exists and has a `create_tables()` function

## License

[Add your license information here]