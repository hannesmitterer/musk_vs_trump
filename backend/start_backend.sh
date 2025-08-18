#!/bin/bash

# AI Reputation Tracker Backend Setup Script
# This script automates the backend setup process including:
# - Installing dependencies from requirements.txt
# - Initializing the database
# - Starting the backend server

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✓ $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ✗ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠ $1${NC}"
}

# Function to check if Python is installed
check_python() {
    log "Checking Python installation..."
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is not installed. Please install Python 3 and try again."
        exit 1
    fi
    
    python_version=$(python3 --version 2>&1 | cut -d' ' -f2)
    log_success "Python 3 found: version $python_version"
}

# Function to check if pip is installed
check_pip() {
    log "Checking pip installation..."
    if ! command -v pip3 &> /dev/null; then
        log_error "pip3 is not installed. Please install pip and try again."
        exit 1
    fi
    log_success "pip3 found"
}

# Function to install dependencies
install_dependencies() {
    log "Installing Python dependencies from requirements.txt..."
    
    if [ ! -f "requirements.txt" ]; then
        log_error "requirements.txt not found in current directory"
        exit 1
    fi
    
    # Check if virtual environment should be created
    if [ ! -d "venv" ]; then
        log "Creating virtual environment..."
        python3 -m venv venv
        log_success "Virtual environment created"
    fi
    
    # Activate virtual environment
    log "Activating virtual environment..."
    source venv/bin/activate
    
    # Upgrade pip
    log "Upgrading pip..."
    pip install --upgrade pip
    
    # Install dependencies
    log "Installing dependencies..."
    pip install -r requirements.txt
    
    if [ $? -eq 0 ]; then
        log_success "Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        exit 1
    fi
}

# Function to initialize database
initialize_database() {
    log "Initializing database..."
    
    if [ ! -f "db_manager.py" ]; then
        log_error "db_manager.py not found"
        exit 1
    fi
    
    # Run database initialization (activate virtual environment if it exists)
    if [ -d "venv" ]; then
        source venv/bin/activate
        python3 db_manager.py
    else
        python3 db_manager.py
    fi
    
    if [ $? -eq 0 ]; then
        log_success "Database initialized successfully"
    else
        log_error "Failed to initialize database"
        exit 1
    fi
}

# Function to start the backend server
start_server() {
    log "Starting backend server..."
    
    if [ ! -f "app.py" ]; then
        log_error "app.py not found"
        exit 1
    fi
    
    # Check if port 5000 is already in use
    if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
        log_warning "Port 5000 is already in use. Stopping existing process..."
        pkill -f "python3 app.py" || true
        sleep 2
    fi
    
    log_success "Starting Flask application on http://localhost:5000"
    log "Press Ctrl+C to stop the server"
    
    # Start the server (activate virtual environment if it exists)
    if [ -d "venv" ]; then
        source venv/bin/activate
        python3 app.py
    else
        python3 app.py
    fi
}

# Function to display help
show_help() {
    echo -e "${BLUE}AI Reputation Tracker Backend Setup Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --install-deps    Install dependencies only"
    echo "  --init-db        Initialize database only"
    echo "  --start-server   Start server only"
    echo "  --setup          Full setup (install deps + init db)"
    echo "  --help           Show this help message"
    echo ""
    echo "Without any options, the script will run full setup and start the server."
}

# Main script logic
main() {
    log "Starting AI Reputation Tracker Backend Setup"
    
    # Change to script directory
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
    cd "$SCRIPT_DIR"
    
    # Parse command line arguments
    case "${1:-}" in
        --install-deps)
            check_python
            check_pip
            install_dependencies
            log_success "Dependencies installation completed"
            ;;
        --init-db)
            initialize_database
            log_success "Database initialization completed"
            ;;
        --start-server)
            start_server
            ;;
        --setup)
            check_python
            check_pip
            install_dependencies
            initialize_database
            log_success "Setup completed successfully"
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        "")
            # Default: full setup and start server
            check_python
            check_pip
            install_dependencies
            initialize_database
            log_success "Setup completed successfully. Starting server..."
            start_server
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Trap Ctrl+C and cleanup
cleanup() {
    log ""
    log_warning "Shutting down..."
    pkill -f "python3 app.py" 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Run main function
main "$@"