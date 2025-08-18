# Makefile for musk_vs_trump backend automation
# Alternative to start_backend.sh script
# Uses Poetry for dependency management

.PHONY: all install-deps init-db start-server setup clean help

# Poetry command
POETRY := poetry

# Check if Poetry is available
ifeq ($(shell command -v poetry 2> /dev/null),)
    $(error Poetry is not installed. Please install Poetry first: https://python-poetry.org/docs/#installation)
endif

all: setup start-server

help:
	@echo "🚀 Musk vs Trump Backend Automation"
	@echo ""
	@echo "Available targets:"
	@echo "  setup         - Install dependencies and initialize database"
	@echo "  install-deps  - Install Python dependencies with Poetry"
	@echo "  init-db       - Initialize database using db_manager.create_tables()"
	@echo "  start-server  - Start the backend server with Poetry"
	@echo "  clean         - Clean up temporary files"
	@echo "  help          - Show this help message"
	@echo ""
	@echo "Usage examples:"
	@echo "  make setup    # Complete setup and start server"
	@echo "  make help     # Show this help"

setup: install-deps init-db
	@echo "✅ Backend setup completed successfully!"

install-deps:
	@echo "📦 Installing Python dependencies with Poetry..."
	@if [ -f "../pyproject.toml" ]; then \
		cd .. && $(POETRY) install; \
		echo "✅ Dependencies installed successfully with Poetry!"; \
	else \
		echo "❌ Error: pyproject.toml not found in parent directory. Please run from the project root."; \
		exit 1; \
	fi

init-db:
	@echo "🗄️  Initializing database..."
	@if [ -f "db_manager.py" ]; then \
		cd .. && $(POETRY) run python -c "import sys; sys.path.append('backend'); import db_manager; db_manager.create_tables(); print('✅ Database initialized successfully!')"; \
	else \
		echo "⚠️  Warning: db_manager.py not found, skipping database initialization."; \
	fi

start-server:
	@echo "🌐 Starting backend server..."
	@if [ -f "app.py" ]; then \
		echo "Server starting at: $$(date)"; \
		echo "Press Ctrl+C to stop the server"; \
		echo "----------------------------------------"; \
		cd .. && $(POETRY) run python backend/app.py; \
	else \
		echo "❌ Error: app.py not found, cannot start the backend server."; \
		exit 1; \
	fi

clean:
	@echo "🧹 Cleaning up..."
	@find . -type f -name "*.pyc" -delete
	@find . -type d -name "__pycache__" -delete
	@echo "✅ Cleanup completed!"