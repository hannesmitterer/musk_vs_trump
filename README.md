# Musk vs Trump - AI Reputation Tracker

This project tracks and analyzes the reputation of public figures through AI-powered sentiment analysis.

## 🚀 Live Demo

**View the live application:** [https://hannesmitterer.github.io/musk_vs_trump](https://hannesmitterer.github.io/musk_vs_trump)

The reputation graph is automatically displayed on the homepage, showing real-time sentiment analysis and reputation trends for public figures. The site is automatically deployed to GitHub Pages whenever changes are pushed to the main branch.

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

## Frontend Development

The frontend is a React application that displays an interactive reputation graph showing sentiment analysis trends.

### Quick Start

1. **View the live site:** [https://hannesmitterer.github.io/musk_vs_trump](https://hannesmitterer.github.io/musk_vs_trump)
2. The graph loads instantly on the homepage - no setup required!

### Local Development

```bash
# Install frontend dependencies
npm install

# Start development server
npm start
# App runs at http://localhost:3000/musk_vs_trump

# Build for production
npm run build
```

### Deployment

- **Automated:** Every push to `main` branch automatically deploys to GitHub Pages via GitHub Actions
- **Manual:** Run `npm run deploy` to manually deploy to GitHub Pages
- The site is publicly accessible at the GitHub Pages URL above

### Frontend Features

- 📊 Interactive reputation graph using Recharts
- 📱 Mobile-responsive design with deployment button
- ⚡ Fast loading with optimized React build
- 🚀 Automatic deployment pipeline

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