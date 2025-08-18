@echo off
REM Frontend Setup Automation Script for musk_vs_trump project
REM This script automates Node.js installation and frontend setup on Windows

setlocal enabledelayedexpansion

echo 🚀 Starting frontend setup...
echo Working directory: %~dp0

REM Get the directory where this script is located
set FRONTEND_DIR=%~dp0

REM Function to check if a command exists
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    set NODE_FOUND=false
) else (
    set NODE_FOUND=true
)

where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    set NPM_FOUND=false
) else (
    set NPM_FOUND=true
)

REM Step 1: Check if Node.js is installed
if "%NODE_FOUND%"=="true" (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js found: !NODE_VERSION!
    
    REM Extract version number (remove 'v' prefix)
    set NODE_VERSION_NUM=!NODE_VERSION:~1!
    
    REM Simple version check (comparing major version)
    for /f "tokens=1 delims=." %%a in ("!NODE_VERSION_NUM!") do set MAJOR_VERSION=%%a
    
    if !MAJOR_VERSION! GEQ 18 (
        echo ✅ Node.js version meets requirements ^(^>= v18.0.0^)
    ) else (
        echo ⚠️  Warning: Node.js version !NODE_VERSION! is below recommended v18.0.0
        set /p UPDATE_NODE="Do you want to update Node.js? (y/n): "
        if /i "!UPDATE_NODE!"=="y" (
            call :install_nodejs
        ) else (
            echo Continuing with current Node.js version...
        )
    )
) else (
    echo ❌ Node.js not found. Installing Node.js...
    call :install_nodejs
)

REM Step 2: Check if npm is installed
if "%NPM_FOUND%"=="true" (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm found: v!NPM_VERSION!
) else (
    echo ❌ npm not found. This usually means Node.js installation was incomplete.
    echo Please reinstall Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Step 3: Install dependencies if package.json exists
if exist "%FRONTEND_DIR%package.json" (
    echo 📦 Installing Node.js dependencies from package.json...
    cd /d "%FRONTEND_DIR%"
    call npm install
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Dependencies installed successfully!
        
        REM Step 4: Start the development server
        echo 🌐 Starting frontend development server...
        echo Server starting at: %date% %time%
        echo The application will be available at http://localhost:3000
        echo Press Ctrl+C to stop the server
        echo ----------------------------------------
        
        REM Start the development server
        call npm start
    ) else (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ⚠️  Warning: package.json not found in %FRONTEND_DIR%
    echo This appears to be a new frontend project. Consider running:
    echo   npm init -y                    # Create package.json
    echo   npm install react react-dom   # Install React dependencies
    echo   npm install --save-dev @types/react @types/react-dom  # If using TypeScript
    echo.
    echo ✅ Node.js setup completed successfully!
    echo You can now start developing your frontend application.
    pause
)

goto :eof

REM Function to install Node.js
:install_nodejs
echo 📦 Installing Node.js...

REM Check if Chocolatey is available
where choco >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Using Chocolatey to install Node.js...
    choco install nodejs -y
) else (
    echo ❌ Chocolatey not found. Please install Node.js manually:
    echo   1. Visit https://nodejs.org/
    echo   2. Download the Windows Installer (.msi) for the LTS version
    echo   3. Run the installer and follow the prompts
    echo.
    echo Alternatively, install Chocolatey first:
    echo   Run PowerShell as Administrator and execute:
    echo   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    echo   Then run: choco install nodejs
    echo.
    pause
    exit /b 1
)

REM Refresh environment variables
call refreshenv >nul 2>&1 || (
    echo ⚠️  Please restart your Command Prompt or PowerShell to use Node.js
    echo   Or manually add Node.js to your PATH environment variable
)

goto :eof