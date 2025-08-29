# Musk vs Trump - AI Reputation Tracker

This project tracks and analyzes the reputation of public figures through AI-powered sentiment analysis.

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
├── database/
│   └── schema.sql
└── README.md
```

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

- Python 3.x
- pip (Python package manager)

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

## Frontend Deployment

### GitHub Pages Live Site

🌐 **Live Demo**: [https://hannesmitterer.github.io/musk_vs_trump/](https://hannesmitterer.github.io/musk_vs_trump/)

The frontend dashboard is automatically deployed to GitHub Pages using GitHub Actions.

### Deployment Configuration

#### Automatic Deployment
- ✅ **Automated via GitHub Actions** (`.github/workflows/gh-pages.yml`)
- 📁 **Deploys from `docs/` directory** on main branch
- 🚀 **Live updates** within 2-3 minutes of push to main
- 🔄 **Includes all static assets** (HTML, CSS, JS, images)

#### Manual Deployment Setup
If setting up GitHub Pages manually:

1. **Repository Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` 
4. **Folder**: `/docs`
5. **Save settings**

#### Custom Domain (Optional)
To use a custom domain:

1. **Add CNAME file** to `docs/` directory:
   ```
   your-custom-domain.com
   ```
2. **Configure DNS** with your domain provider
3. **Enable HTTPS** in repository settings

### Local Development

#### Testing the Frontend Locally
```bash
# Serve the docs/ directory locally
cd docs
python3 -m http.server 8000
# Visit http://localhost:8000
```

#### File Structure
```
docs/
├── index.html      # Main HTML page
├── styles.css      # Responsive CSS styles  
├── app.js          # Main application logic
├── charts.js       # Chart.js configuration
├── data.js         # Mock data and data management
├── _config.yml     # Jekyll configuration for GitHub Pages
└── README.md       # Frontend documentation
```

### Site Features
- 📊 **Interactive Charts** using Chart.js
- 📱 **Responsive Design** for all device sizes
- ⚡ **Real-time Updates** every 30 seconds
- 🎨 **Modern UI** with glassmorphism effects
- 📈 **Sentiment Analysis** visualization
- 🚀 **Performance Optimized** static site

## Troubleshooting

- **Python not found**: Ensure Python 3.x is installed and available in your PATH
- **Permission denied**: Make sure `start_backend.sh` is executable (`chmod +x start_backend.sh`)
- **Module import errors**: Verify all dependencies are installed via `requirements.txt`
- **Database errors**: Ensure `db_manager.py` exists and has a `create_tables()` function
- **GitHub Pages not updating**: Check Actions tab for deployment status
- **Site not loading**: Verify all assets use relative paths in `docs/index.html`

## License

[Add your license information here]