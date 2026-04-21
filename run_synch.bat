@echo off
setlocal
title Synch App Launcher

echo [1/4] Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1

echo [2/4] Starting Synch Backend...
cd /d c:\Synch\backend
start "Synch Backend" /min cmd /c "..\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo [3/4] Starting Synch Frontend...
cd /d c:\Synch\frontend
start "Synch Frontend" /min cmd /c "npm.cmd run dev"

echo [4/4] Finalizing...
timeout /t 8 /nobreak >nul

echo Launching Synch Web App...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000

echo Done! You can close this window.
timeout /t 3 >nul
exit
