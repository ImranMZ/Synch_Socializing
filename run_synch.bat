@echo off
setlocal EnableDelayedExpansion
title Synch App Launcher

set "SYNCH_DIR=%~dp0"
set "NODE_PATH=C:\Program Files\nodejs"

echo [1/4] Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1
timeout /t 1 /nobreak >nul

echo [2/4] Starting Synch Backend...
start "Synch Backend" /min cmd /k "cd /d "%SYNCH_DIR%backend" && "%SYNCH_DIR%venv\Scripts\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo [3/4] Starting Synch Frontend...
start "Synch Frontend" /min cmd /k "cd /d "%SYNCH_DIR%frontend" && set PATH=%NODE_PATH%;%PATH% && npm run dev"

echo [4/4] Waiting for servers to initialize...
timeout /t 4 /nobreak >nul

where chrome >nul 2>&1
if !errorlevel! equ 0 (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000
) else (
    start http://localhost:3000
)

echo.
echo Synch is running! Backend: http://127.0.0.1:8000, Frontend: http://localhost:3000
echo Press any key to exit this window (servers will keep running)...
pause >nul
exit
