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
│   ├── App.js                   # Main application component
│   ├── ReputationGraph.js       # Component for displaying reputation graphs
│   ├── setup_frontend.sh        # Frontend automation script (Unix/macOS)
│   ├── setup_frontend.bat       # Frontend automation script (Windows)
│   └── README.md               # Frontend setup instructions
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

## Frontend Setup

### Automated Setup (Recommended)

The frontend includes automation scripts for easy setup:

#### Unix/macOS/Linux
```bash
cd frontend
./setup_frontend.sh
```

#### Windows
```batch
cd frontend
setup_frontend.bat
```

Both automation methods will:
1. 🔍 **Verify Node.js installation** (version 18+)
2. 📦 **Install Node.js dependencies** from `package.json` (when available)
3. 🌐 **Start the development server** with `npm start`

### Manual Setup

If you prefer to set up the frontend manually:

1. **Install Node.js:**
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download and install the LTS version for your operating system
   - Verify installation: `node --version` (should be v18.0.0 or higher)

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

For detailed Node.js installation instructions, see [`frontend/README.md`](frontend/README.md).

## Prerequisites

### Backend Prerequisites
- Python 3.x
- pip (Python package manager)

### Frontend Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)

## Development

### Backend Development

The backend includes two automation options:

#### Shell Script (`start_backend.sh`)
- ✅ Error handling and validation
- ⚠️ Informative warnings for missing files
- 🚀 Automatic dependency management
- 🔄 Database initialization
- 📝 Clear logging and status messages

### Frontend Development

The frontend includes automation scripts for cross-platform setup:

#### Setup Scripts (`setup_frontend.sh` and `setup_frontend.bat`)
- ✅ Cross-platform support (Unix/macOS and Windows)
- 🔍 Node.js version validation (18+ required)
- 🚀 Automatic Node.js installation (when possible)
- 📦 Dependency management with npm
- 🌐 Development server startup
- 📝 Clear logging and troubleshooting guidance

### Adding New Dependencies

**Backend:**
1. Add your package to `backend/requirements.txt`
2. Run `./start_backend.sh` to automatically install new dependencies

**Frontend:**
1. Add your package using `npm install <package-name>` in the `frontend/` directory
2. Run `./setup_frontend.sh` (Unix/macOS) or `setup_frontend.bat` (Windows) to verify setup

## Troubleshooting

### Backend Issues
- **Python not found**: Ensure Python 3.x is installed and available in your PATH
- **Permission denied**: Make sure `start_backend.sh` is executable (`chmod +x start_backend.sh`)
- **Module import errors**: Verify all dependencies are installed via `requirements.txt`
- **Database errors**: Ensure `db_manager.py` exists and has a `create_tables()` function

### Frontend Issues
- **Node.js not found**: Ensure Node.js v18+ is installed and available in your PATH
- **Permission denied**: Make sure `setup_frontend.sh` is executable (`chmod +x setup_frontend.sh`)
- **npm install fails**: Try clearing npm cache with `npm cache clean --force`
- **Port 3000 in use**: The development server will automatically use the next available port
- **Windows script fails**: Ensure you're running Command Prompt or PowerShell as Administrator

## License

[Add your license information here]