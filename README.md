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
│   ├── requirements.txt       # Python dependencies (legacy - now using pyproject.toml)
│   └── start_backend.sh       # Backend automation script
├── frontend/
│   ├── App.js
│   └── ReputationGraph.js
├── database/
│   └── schema.sql
├── pyproject.toml             # Poetry configuration and dependencies
├── poetry.lock                # Poetry lock file (exact dependency versions)
├── .poetry-version            # Poetry version specification for deployment
├── render.yaml                # Render.com deployment configuration
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
1. 🐍 **Install Python dependencies** using Poetry from `pyproject.toml`
2. 🗄️ **Initialize the database** using `db_manager.create_tables()`
3. 🌐 **Start the backend server** with `poetry run python backend/app.py`

### Manual Setup

If you prefer to set up the backend manually:

1. **Install dependencies:**
   ```bash
   poetry install
   ```

2. **Initialize the database:**
   ```bash
   poetry run python -c "import sys; sys.path.append('backend'); import db_manager; db_manager.create_tables()"
   ```

3. **Start the server:**
   ```bash
   poetry run python backend/app.py
   ```

## Prerequisites

- Python 3.12+
- Poetry (Python dependency manager) - [Installation guide](https://python-poetry.org/docs/#installation)

## Development

### Backend Development

The backend includes two automation options:

#### Shell Script (`start_backend.sh`)
- ✅ Error handling and validation
- ⚠️ Informative warnings for missing files
- 🚀 Automatic dependency management with Poetry
- 🔄 Database initialization
- 📝 Clear logging and status messages

#### Makefile
- 🎯 Granular control with individual targets
- 🧹 Cleanup utilities (`make clean`)
- 📋 Help documentation (`make help`)
- 🔧 Flexible build automation with Poetry

### Adding New Dependencies

1. Add your package to `pyproject.toml` using Poetry:
   ```bash
   poetry add package-name
   ```
2. Run `./start_backend.sh` to automatically install new dependencies

## Deployment

### Render.com Deployment

This project includes configuration for easy deployment to [Render.com](https://render.com):

1. **Poetry Configuration**: The project uses Poetry for dependency management, with version specified in `.poetry-version`
2. **Render Configuration**: `render.yaml` provides the deployment configuration
3. **Build Process**: `poetry install --only=main` installs production dependencies
4. **Start Command**: `poetry run python backend/app.py` starts the server

For manual deployment to Render.com:
- Set the build command to: `poetry install --only=main`
- Set the start command to: `poetry run python backend/app.py`
- Ensure Python version 3.12+ is selected

**Note**: If you need a `requirements.txt` file for other deployment platforms, you can generate one from Poetry:
```bash
pip install poetry-plugin-export
poetry export --format=requirements.txt --output=requirements.txt --without-hashes
```

References:
- [Render.com Poetry Documentation](https://render.com/docs/poetry-version)
- [Poetry Documentation](https://python-poetry.org/docs/)

## Troubleshooting

- **Poetry not found**: Install Poetry first using the [official installer](https://python-poetry.org/docs/#installation)
- **Permission denied**: Make sure `start_backend.sh` is executable (`chmod +x start_backend.sh`)
- **Module import errors**: Verify all dependencies are installed via `poetry install`
- **Database errors**: Ensure `db_manager.py` exists and has a `create_tables()` function
- **Render.com deployment issues**: Check that `.poetry-version` file exists and contains a valid Poetry version

## License

[Add your license information here]