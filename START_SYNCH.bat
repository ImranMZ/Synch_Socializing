@echo off
setlocal enabledelayedexpansion
title Synch - Unified Launcher

echo.
echo ============================================================
echo   Synch - Automated Setup ^& Launcher
echo ============================================================
echo.

:: --- PATH CONFIGURATION ---
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%"

:: Check if we are in the right folder. If not, try fallback path.
if not exist "!PROJECT_ROOT!backend" (
    if exist "D:\VibeCoder\Synch\backend" (
        set "PROJECT_ROOT=D:\VibeCoder\Synch\"
        echo [INFO] Script not in project root. Using fallback: !PROJECT_ROOT!
    ) else (
        echo [ERROR] Could not find Synch project folders!
        echo Please ensure this .bat file is in the Synch folder or at D:\VibeCoder\Synch
        pause
        exit /b 1
    )
)

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

:: Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js and try again.
    pause
    exit /b 1
)

:: Setup Backend
echo [1/4] Checking Backend...
cd /d "!PROJECT_ROOT!backend" || (echo [ERROR] Failed to enter backend directory! && pause && exit /b 1)

if not exist "venv" (
    echo [INFO] Creating virtual environment...
    python -m venv venv
)

echo [2/4] Installing Backend Dependencies...
call venv\Scripts\activate
pip install -r requirements.txt

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env
        echo [WARNING] Created .env from .env.example. Please check it!
    )
)

:: Setup Frontend
echo [3/4] Checking Frontend...
cd /d "!PROJECT_ROOT!frontend" || (echo [ERROR] Failed to enter frontend directory! && pause && exit /b 1)

if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies - this may take a minute...
    call npm install
)

:: Run Everything
echo [4/4] Starting Synch Services...
echo.
echo [INFO] Cleaning up existing processes on ports 3000 and 8001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do taskkill /f /pid %%a >nul 2>&1

echo Starting Backend...
start "Synch Backend" /min cmd /c "cd /d "!PROJECT_ROOT!backend" && venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001"

echo Starting Frontend...
start "Synch Frontend" /min cmd /c "cd /d "!PROJECT_ROOT!frontend" && npm run dev"

echo.
echo Waiting for services to initialize...
timeout /t 5 /nobreak >nul

echo Launching Synch Web App...
start http://localhost:3000

echo.
echo ============================================================
echo   Synch is now running! 
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:8001
echo ============================================================
echo.
echo You can close this window.
timeout /t 5 >nul
exit
