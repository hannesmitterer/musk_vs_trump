# Frontend Setup

This directory contains the frontend application for the Musk vs Trump AI reputation tracker.

## Prerequisites

### Node.js Installation

The frontend requires **Node.js version 18 or higher** and **npm** (Node Package Manager).

#### Automated Installation (Recommended)

Use our automation scripts to install Node.js:

**Unix/macOS/Linux:**
```bash
cd frontend
./setup_frontend.sh
```

**Windows:**
```batch
cd frontend
setup_frontend.bat
```

#### Manual Installation

##### Option 1: Official Node.js Installer (Recommended)
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for your operating system
3. Run the installer and follow the prompts
4. Verify installation:
   ```bash
   node --version    # Should show v18.0.0 or higher
   npm --version     # Should show npm version
   ```

##### Option 2: Using Package Managers

**macOS (using Homebrew):**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

**Ubuntu/Debian:**
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

**CentOS/RHEL/Fedora:**
```bash
# Using dnf (Fedora)
sudo dnf install nodejs npm

# Using yum (CentOS/RHEL)
sudo yum install nodejs npm
```

**Windows (using Chocolatey):**
```powershell
# Install Chocolatey if not already installed
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js
choco install nodejs
```

##### Option 3: Using Node Version Manager (Advanced)

**Unix/macOS (nvm):**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your terminal or run:
source ~/.bashrc

# Install latest LTS Node.js
nvm install --lts
nvm use --lts
```

**Windows (nvm-windows):**
```powershell
# Download and install nvm-windows from:
# https://github.com/coreybutler/nvm-windows/releases

# Install latest LTS Node.js
nvm install lts
nvm use lts
```

## Development Setup

### Automated Setup (Recommended)

The frontend includes automation scripts for easy setup:

**Unix/macOS/Linux:**
```bash
cd frontend
./setup_frontend.sh
```

**Windows:**
```batch
cd frontend
setup_frontend.bat
```

Both automation methods will:
1. 🔍 **Verify Node.js installation** (version 18+)
2. 📦 **Install dependencies** from `package.json` (when available)
3. 🌐 **Start the development server** with `npm start`

### Manual Setup

If you prefer to set up the frontend manually:

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Verify Node.js installation:**
   ```bash
   node --version    # Should be v18.0.0 or higher
   npm --version     # Should show npm version
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The development server will start and the application will be available at `http://localhost:3000` (or another port if 3000 is already in use).

## File Structure

- `App.js` - Main application component
- `ReputationGraph.js` - Component for displaying reputation graphs
- `setup_frontend.sh` - Unix/macOS automation script
- `setup_frontend.bat` - Windows automation script
- `package.json` - Node.js dependencies and scripts

## Troubleshooting

- **Node.js not found**: Ensure Node.js is installed and available in your PATH
- **Permission denied**: Make sure `setup_frontend.sh` is executable (`chmod +x setup_frontend.sh`)
- **npm install fails**: Try clearing npm cache with `npm cache clean --force`
- **Port 3000 in use**: The development server will automatically use the next available port
- **Windows script fails**: Ensure you're running Command Prompt or PowerShell as Administrator

## Contributing

For new contributors:
1. Ensure Node.js v18+ is installed using the instructions above
2. Run the automated setup script or follow manual setup steps
3. Make sure all tests pass before submitting changes