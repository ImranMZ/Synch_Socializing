@echo off
setlocal

echo.
echo ============================================================
echo   Synch - Automated Setup ^& Launcher
echo ============================================================
echo.

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
echo [1/4] Setting up Backend Virtual Environment...
if not exist "venv" (
    python -m venv venv
    echo [INFO] Created new virtual environment.
)

echo [2/4] Installing Backend Dependencies...
call venv\Scripts\activate
pip install -r backend/requirements.txt
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy backend\.env.example backend\.env
    ) else (
        echo GROQ_API_KEY= > backend\.env
    )
    echo [WARNING] Please update backend/.env with your actual Groq API Key!
)

:: Setup Frontend
echo [3/4] Installing Frontend Dependencies (this may take a minute)...
cd frontend
if not exist "node_modules" (
    call npm install
) else (
    echo [INFO] node_modules already exists, skipping install.
)
cd ..

:: Run Everything
echo [4/4] Starting Synch Services...
echo.
echo [INFO] Backend starting on http://localhost:8001
echo [INFO] Frontend starting on http://localhost:3000
echo.

start cmd /k "venv\Scripts\activate && cd backend && uvicorn main:app --reload --port 8001"
start cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo   Synch is now running! 
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:8001
echo ============================================================
echo.
pause
