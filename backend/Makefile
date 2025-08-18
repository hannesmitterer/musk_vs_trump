# AI Reputation Tracker Backend Makefile
# Provides granular targets for backend automation

.PHONY: help install-deps init-db start-server setup clean

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m

# Python and pip commands
PYTHON := python3
PIP := pip3

# Virtual environment directory
VENV_DIR := venv
VENV_ACTIVATE := $(VENV_DIR)/bin/activate

help: ## Show this help message
	@echo -e "$(BLUE)AI Reputation Tracker Backend - Available Targets:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo -e "$(YELLOW)Usage Examples:$(NC)"
	@echo "  make setup        # Complete setup (install deps + init db)"
	@echo "  make start-server # Start the backend server"
	@echo "  make clean        # Clean up temporary files"

install-deps: ## Install dependencies from requirements.txt
	@echo -e "$(BLUE)Installing dependencies...$(NC)"
	@if [ ! -f "requirements.txt" ]; then \
		echo -e "$(RED)Error: requirements.txt not found$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo -e "$(BLUE)Creating virtual environment...$(NC)"; \
		$(PYTHON) -m venv $(VENV_DIR); \
	fi
	@echo -e "$(BLUE)Activating virtual environment and installing packages...$(NC)"
	@. $(VENV_ACTIVATE) && \
		pip install --upgrade pip && \
		pip install -r requirements.txt
	@echo -e "$(GREEN)✓ Dependencies installed successfully$(NC)"

init-db: ## Initialize the database by running db_manager.create_tables()
	@echo -e "$(BLUE)Initializing database...$(NC)"
	@if [ ! -f "db_manager.py" ]; then \
		echo -e "$(RED)Error: db_manager.py not found$(NC)"; \
		exit 1; \
	fi
	@if [ -d "$(VENV_DIR)" ]; then \
		. $(VENV_ACTIVATE) && $(PYTHON) db_manager.py; \
	else \
		$(PYTHON) db_manager.py; \
	fi
	@echo -e "$(GREEN)✓ Database initialized successfully$(NC)"

start-server: ## Start the backend server (python app.py)
	@echo -e "$(BLUE)Starting backend server...$(NC)"
	@if [ ! -f "app.py" ]; then \
		echo -e "$(RED)Error: app.py not found$(NC)"; \
		exit 1; \
	fi
	@echo -e "$(BLUE)Checking for existing server on port 5000...$(NC)"
	@if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo -e "$(YELLOW)Warning: Port 5000 is already in use$(NC)"; \
		echo -e "$(YELLOW)Stopping existing process...$(NC)"; \
		pkill -f "python.*app.py" || true; \
		sleep 2; \
	fi
	@echo -e "$(GREEN)Starting Flask application on http://localhost:5000$(NC)"
	@echo -e "$(YELLOW)Press Ctrl+C to stop the server$(NC)"
	@if [ -d "$(VENV_DIR)" ]; then \
		. $(VENV_ACTIVATE) && $(PYTHON) app.py; \
	else \
		$(PYTHON) app.py; \
	fi

setup: install-deps init-db ## Complete setup (install dependencies and initialize database)
	@echo -e "$(GREEN)✓ Complete setup finished successfully$(NC)"
	@echo -e "$(BLUE)Ready to start server with: make start-server$(NC)"

clean: ## Clean up temporary files and processes
	@echo -e "$(BLUE)Cleaning up...$(NC)"
	@echo -e "$(BLUE)Stopping any running servers...$(NC)"
	@pkill -f "python.*app.py" 2>/dev/null || true
	@echo -e "$(BLUE)Removing Python cache files...$(NC)"
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo -e "$(BLUE)Removing virtual environment...$(NC)"
	@rm -rf $(VENV_DIR)
	@echo -e "$(BLUE)Removing log files...$(NC)"
	@rm -f *.log
	@echo -e "$(GREEN)✓ Cleanup completed$(NC)"

# Target to check system requirements
check-system: ## Check system requirements (Python, pip)
	@echo -e "$(BLUE)Checking system requirements...$(NC)"
	@if ! command -v $(PYTHON) >/dev/null 2>&1; then \
		echo -e "$(RED)Error: Python 3 is not installed$(NC)"; \
		exit 1; \
	else \
		echo -e "$(GREEN)✓ Python 3 found: $$($(PYTHON) --version)$(NC)"; \
	fi
	@if ! command -v $(PIP) >/dev/null 2>&1; then \
		echo -e "$(RED)Error: pip3 is not installed$(NC)"; \
		exit 1; \
	else \
		echo -e "$(GREEN)✓ pip3 found$(NC)"; \
	fi

# Target to show project status
status: ## Show current project status
	@echo -e "$(BLUE)AI Reputation Tracker Backend Status:$(NC)"
	@echo ""
	@if [ -d "$(VENV_DIR)" ]; then \
		echo -e "$(GREEN)✓ Virtual environment: Present$(NC)"; \
	else \
		echo -e "$(RED)✗ Virtual environment: Missing$(NC)"; \
	fi
	@if [ -f "../database/reputation.db" ]; then \
		echo -e "$(GREEN)✓ Database: Initialized$(NC)"; \
	else \
		echo -e "$(YELLOW)⚠ Database: Not initialized$(NC)"; \
	fi
	@if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo -e "$(GREEN)✓ Server: Running on port 5000$(NC)"; \
	else \
		echo -e "$(YELLOW)⚠ Server: Not running$(NC)"; \
	fi

# Development targets
dev-setup: setup ## Setup for development (same as setup but with explicit name)
	@echo -e "$(GREEN)✓ Development environment ready$(NC)"

test-deps: ## Test if all dependencies are properly installed
	@echo -e "$(BLUE)Testing dependencies...$(NC)"
	@if [ -d "$(VENV_DIR)" ]; then \
		. $(VENV_ACTIVATE) && $(PYTHON) -c "import flask, sqlite3, requests; print('All dependencies available')"; \
	else \
		$(PYTHON) -c "import flask, sqlite3, requests; print('All dependencies available')"; \
	fi
	@echo -e "$(GREEN)✓ All dependencies are properly installed$(NC)"