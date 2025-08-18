#!/bin/bash

# Frontend Setup Automation Script for musk_vs_trump project
# This script automates Node.js installation and frontend setup

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR"

echo "🚀 Starting frontend setup..."
echo "Working directory: $FRONTEND_DIR"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare version numbers
version_ge() {
    # Convert versions to comparable format and check if first >= second
    local version1="$1"
    local version2="$2"
    
    # Use sort -V to compare versions properly
    if [ "$(printf '%s\n' "$version2" "$version1" | sort -V | head -n 1)" = "$version2" ]; then
        return 0  # version1 >= version2
    else
        return 1  # version1 < version2
    fi
}

# Function to install Node.js on different systems
install_nodejs() {
    echo "📦 Installing Node.js..."
    
    # Detect the operating system
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "🍎 Detected macOS"
        if command_exists brew; then
            echo "Using Homebrew to install Node.js..."
            brew install node
        else
            echo "❌ Homebrew not found. Please install Homebrew first or install Node.js manually:"
            echo "   Visit https://nodejs.org/ to download the installer"
            echo "   Or install Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "🐧 Detected Linux"
        if command_exists apt; then
            # Debian/Ubuntu
            echo "Using apt to install Node.js..."
            sudo apt update
            sudo apt install -y nodejs npm
        elif command_exists yum; then
            # CentOS/RHEL
            echo "Using yum to install Node.js..."
            sudo yum install -y nodejs npm
        elif command_exists dnf; then
            # Fedora
            echo "Using dnf to install Node.js..."
            sudo dnf install -y nodejs npm
        else
            echo "❌ Package manager not supported. Please install Node.js manually:"
            echo "   Visit https://nodejs.org/ to download the installer"
            exit 1
        fi
    else
        echo "❌ Unsupported operating system: $OSTYPE"
        echo "Please install Node.js manually from https://nodejs.org/"
        exit 1
    fi
}

# Step 1: Check if Node.js is installed and meets minimum version requirement
MIN_NODE_VERSION="18.0.0"

if command_exists node; then
    NODE_VERSION=$(node --version | sed 's/v//')
    echo "✅ Node.js found: v$NODE_VERSION"
    
    if version_ge "$NODE_VERSION" "$MIN_NODE_VERSION"; then
        echo "✅ Node.js version meets requirements (>= v$MIN_NODE_VERSION)"
    else
        echo "⚠️  Warning: Node.js version v$NODE_VERSION is below recommended v$MIN_NODE_VERSION"
        read -p "Do you want to update Node.js? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_nodejs
        else
            echo "Continuing with current Node.js version..."
        fi
    fi
else
    echo "❌ Node.js not found. Installing Node.js..."
    install_nodejs
fi

# Step 2: Check if npm is installed
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: v$NPM_VERSION"
else
    echo "❌ npm not found. This usually means Node.js installation was incomplete."
    echo "Please reinstall Node.js from https://nodejs.org/"
    exit 1
fi

# Step 3: Install dependencies if package.json exists
if [ -f "$FRONTEND_DIR/package.json" ]; then
    echo "📦 Installing Node.js dependencies from package.json..."
    cd "$FRONTEND_DIR"
    npm install
    echo "✅ Dependencies installed successfully!"
    
    # Step 4: Start the development server
    echo "🌐 Starting frontend development server..."
    echo "Server starting at: $(date)"
    echo "The application will be available at http://localhost:3000"
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    
    # Start the development server
    npm start
else
    echo "⚠️  Warning: package.json not found in $FRONTEND_DIR"
    echo "This appears to be a new frontend project. Consider running:"
    echo "  npm init -y                    # Create package.json"
    echo "  npm install react react-dom   # Install React dependencies"
    echo "  npm install --save-dev @types/react @types/react-dom  # If using TypeScript"
    echo ""
    echo "✅ Node.js setup completed successfully!"
    echo "You can now start developing your frontend application."
fi