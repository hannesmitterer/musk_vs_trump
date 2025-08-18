#!/bin/bash

# Backend Server Automation Script for musk_vs_trump project
# This script automates the setup and startup of the backend server
# Uses Poetry for dependency management

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR"
PROJECT_ROOT="$(dirname "$BACKEND_DIR")"

echo "🚀 Starting backend server setup..."
echo "Working directory: $BACKEND_DIR"
echo "Project root: $PROJECT_ROOT"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Poetry is installed
if ! command_exists poetry; then
    echo "❌ Error: Poetry is not installed."
    echo "   Please install Poetry first: https://python-poetry.org/docs/#installation"
    exit 1
fi

echo "✅ Using Poetry: $(poetry --version)"

# Step 1: Install Python dependencies using Poetry
if [ -f "$PROJECT_ROOT/pyproject.toml" ]; then
    echo "📦 Installing Python dependencies with Poetry..."
    
    cd "$PROJECT_ROOT"
    poetry install
    echo "✅ Dependencies installed successfully!"
else
    echo "⚠️  Warning: pyproject.toml not found in $PROJECT_ROOT"
    echo "   Skipping dependency installation."
fi

# Step 2: Initialize the database using db_manager.create_tables()
if [ -f "$BACKEND_DIR/db_manager.py" ]; then
    echo "🗄️  Initializing database..."
    cd "$PROJECT_ROOT"
    
    # Run database initialization with Poetry
    poetry run python -c "
import sys
sys.path.append('backend')
try:
    import db_manager
    if hasattr(db_manager, 'create_tables'):
        db_manager.create_tables()
        print('✅ Database initialized successfully!')
    else:
        print('⚠️  Warning: create_tables function not found in db_manager.py')
except ImportError:
    print('❌ Error: Could not import db_manager module')
    sys.exit(1)
except Exception as e:
    print(f'❌ Error initializing database: {e}')
    sys.exit(1)
"
else
    echo "⚠️  Warning: db_manager.py not found in $BACKEND_DIR"
    echo "   Skipping database initialization."
fi

# Step 3: Start the backend server using Poetry
if [ -f "$BACKEND_DIR/app.py" ]; then
    echo "🌐 Starting backend server..."
    cd "$PROJECT_ROOT"
    
    echo "Server starting at: $(date)"
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    
    # Start the server with Poetry
    poetry run python backend/app.py
else
    echo "❌ Error: app.py not found in $BACKEND_DIR"
    echo "   Cannot start the backend server."
    exit 1
fi