@echo off
setlocal
title Synch App Launcher

echo ==========================================
echo           SYNCH APP LAUNCHER
echo ==========================================

echo [1/4] Cleaning up existing processes...
:: Kill processes on port 3000 (Frontend) and 8001 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do taskkill /f /pid %%a >nul 2>&1

echo [2/4] Starting Synch Backend (Port 8001)...
cd /d %~dp0backend
start "Synch Backend" /min cmd /c "..\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001"

echo [3/4] Starting Synch Frontend (Port 3000)...
cd /d %~dp0frontend
start "Synch Frontend" /min cmd /c "npm.cmd run dev"

echo [4/4] Finalizing...
echo Waiting for services to initialize...
timeout /t 5 /nobreak >nul

echo Launching Synch Web App...
start http://localhost:3000

echo.
echo ==========================================
echo    SYNCH IS NOW RUNNING LOCALLY!
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8001
echo ==========================================
echo.
echo You can close this window. The app will stay running in the background.
echo To stop it, run this script again or use Task Manager to kill Python/Node.

timeout /t 5 >nul
exit
