Write-Host "Testing AI Integration..." -ForegroundColor Green
Write-Host "Make sure the Spring Boot application is running on http://localhost:8080`n" -ForegroundColor Yellow

$testCases = @(
    @{eventType="Wedding"; count=3},
    @{eventType="Birthday Party"; count=5},
    @{eventType="Corporate Event"; count=4}
)

foreach ($test in $testCases) {
    Write-Host "`nTesting: $($test.eventType) - Count: $($test.count)" -ForegroundColor Cyan
    
    $body = @{
        eventType = $test.eventType
        count = $test.count
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/suggest-names" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body
        
        Write-Host "✓ Success! Suggestions:" -ForegroundColor Green
        $response | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Seconds 2
}

Write-Host "`nTest completed!" -ForegroundColor Green




