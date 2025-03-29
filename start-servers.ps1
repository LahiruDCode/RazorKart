Write-Host "Starting RazorKart Frontend and Backend servers..." -ForegroundColor Green

$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\test\Desktop\RazorKart\backend"
    npm run dev
}

$frontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\test\Desktop\RazorKart\frontend"
    npm start
}

Write-Host "Starting servers... Please wait" -ForegroundColor Yellow

# Wait a moment for the servers to start
Start-Sleep -Seconds 5

# Show the output from both jobs
Write-Host "`nBackend Server Output:" -ForegroundColor Cyan
Receive-Job -Job $backendJob -Keep

Write-Host "`nFrontend Server Output:" -ForegroundColor Cyan
Receive-Job -Job $frontendJob -Keep

Write-Host "`nBoth servers are running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Red

# Keep the script running and showing output
while ($true) {
    Receive-Job -Job $backendJob -Keep
    Receive-Job -Job $frontendJob -Keep
    Start-Sleep -Seconds 1
} 