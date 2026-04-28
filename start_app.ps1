# Start Synch App - Backend + Frontend
Write-Host "Starting Synch App..." -ForegroundColor Cyan

# Start backend
$backendJob = Start-Job -ScriptBlock {
    Set-Location "D:\VibeCode\Synch\Synch_Socializing\backend"
    $env:FRONTEND_URL = "http://localhost:3000"
    python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
}

Start-Sleep -Seconds 3

# Start frontend  
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "D:\VibeCode\Synch\Synch_Socializing\frontend"
    npm run dev
}

Start-Sleep -Seconds 5

Write-Host "Backend: http://127.0.0.1:8001" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Jobs started. Use 'Get-Job' to check status." -ForegroundColor Yellow

# Keep script running
while ($true) {
    Start-Sleep -Seconds 10
}
