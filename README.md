# AI Reputation Tracker

An AI-powered system to track and analyze the reputation of public figures based on social media sentiment and news coverage.

## Project Structure

```
ai-reputation-tracker/
├── backend/
│   ├── app.py                 # Flask web server
│   ├── models.py              # Database models
│   ├── data_collector.py      # Data collection logic
│   ├── sentiment_analyzer.py  # Sentiment analysis
│   ├── db_manager.py          # Database management
│   ├── requirements.txt       # Python dependencies
│   ├── start_backend.sh       # Automated setup script
│   └── Makefile              # Build automation
├── frontend/
│   ├── App.js                # React main component
│   └── ReputationGraph.js    # Data visualization
├── database/
│   └── reputation.db         # SQLite database (created automatically)
└── README.md
```

## Automated Backend Setup

The backend provides two automated setup methods: a shell script and a Makefile. Both methods handle dependency installation, database initialization, and server startup.

### Method 1: Shell Script (start_backend.sh)

The shell script provides a comprehensive setup solution with detailed logging and error handling.

#### Basic Usage

```bash
cd backend
./start_backend.sh              # Full setup and start server
```

#### Advanced Usage

```bash
./start_backend.sh --help       # Show help message
./start_backend.sh --setup      # Install deps and init database only
./start_backend.sh --install-deps   # Install dependencies only
./start_backend.sh --init-db    # Initialize database only
./start_backend.sh --start-server   # Start server only
```

#### Features

- **Automatic dependency management**: Creates virtual environment and installs requirements
- **Database initialization**: Runs `db_manager.create_tables()` automatically
- **Error handling**: Comprehensive error checking and informative messages
- **Process management**: Detects and handles port conflicts
- **Colored logging**: Clear status messages with timestamps

### Method 2: Makefile

The Makefile provides granular control over the setup process with specific targets.

#### Available Targets

```bash
make help           # Show available targets
make install-deps   # Install dependencies from requirements.txt
make init-db        # Initialize database by running db_manager.create_tables()
make start-server   # Start the backend server (python app.py)
make setup          # Complete setup (install deps + init db)
make clean          # Clean up temporary files and processes
make status         # Show current project status
make check-system   # Check system requirements
make test-deps      # Test if dependencies are properly installed
```

#### Usage Examples

```bash
cd backend

# Complete setup
make setup

# Start the server
make start-server

# Check current status
make status

# Clean up everything
make clean
```

## Manual Setup (Alternative)

If you prefer manual setup:

1. **Install Python dependencies**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Initialize the database**:
   ```bash
   python3 db_manager.py
   ```

3. **Start the backend server**:
   ```bash
   python3 app.py
   ```

## API Endpoints

Once the server is running, the following endpoints are available:

- `GET /` - Health check
- `GET /api/reputation/<person>` - Get reputation data for a person
- `GET /api/summary/<person>` - Get summary statistics for a person

Example:
```bash
curl http://localhost:5000/api/reputation/elon-musk
```

## System Requirements

- Python 3.7 or higher
- pip3 (Python package installer)
- SQLite3 (usually included with Python)

## Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   - The scripts automatically detect and stop conflicting processes
   - Manually stop with: `pkill -f "python.*app.py"`

2. **Python/pip not found**
   - Install Python 3.7+ from [python.org](https://python.org)
   - Ensure pip is installed: `python3 -m ensurepip --upgrade`

3. **Permission denied on start_backend.sh**
   - Make the script executable: `chmod +x start_backend.sh`

4. **Virtual environment issues**
   - Clean up with: `make clean` or `rm -rf venv`
   - Recreate with: `make setup`

5. **Database initialization fails**
   - Check write permissions in the database directory
   - Ensure SQLite is available: `python3 -c "import sqlite3; print('OK')"`

### Logs and Debugging

- The shell script provides detailed logging with timestamps
- Use `make status` to check the current state of all components
- Database file is created at `../database/reputation.db`
- Server logs are displayed in the terminal when running

### Getting Help

- Run `./start_backend.sh --help` for shell script options
- Run `make help` for available Makefile targets
- Check `make status` to diagnose issues

## Development

For development work:

1. Use `make dev-setup` (alias for `make setup`)
2. The server runs in debug mode with auto-reload
3. Use `make clean` to reset the environment
4. Use `make test-deps` to verify all dependencies are working

## Architecture

- **Flask Backend**: REST API server with SQLite database
- **Database**: SQLite with tables for reputation data and summary statistics
- **Data Collection**: Modular system for gathering data from various sources
- **Sentiment Analysis**: Keyword-based sentiment scoring system
- **Automation**: Complete setup automation with both shell script and Makefile options