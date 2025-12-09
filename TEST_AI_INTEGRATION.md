# How to Run and Test AI Integration

## Prerequisites
1. Java 17 installed
2. Maven installed (or use Maven wrapper)
3. MySQL database running on localhost:3306
4. OpenAI API key configured in `application.properties`

## Step 1: Start MySQL Database
Make sure MySQL is running and the database `event_db` exists:
```sql
CREATE DATABASE IF NOT EXISTS event_db;
```

## Step 2: Run the Spring Boot Application

### Option A: Using Maven Wrapper (Recommended)
```bash
cd demo
./mvnw spring-boot:run
```
Or on Windows:
```bash
cd demo
mvnw.cmd spring-boot:run
```

### Option B: Using Maven (if installed)
```bash
cd demo
mvn spring-boot:run
```

### Option C: Run from IDE
- Open `DemoApplication.java` in your IDE
- Right-click → Run As → Java Application

The application will start on **http://localhost:8080**

## Step 3: Test the AI Integration

### Method 1: Using cURL (Command Line)

Open a new terminal and run:

```bash
curl -X POST http://localhost:8080/api/ai/suggest-names ^
  -H "Content-Type: application/json" ^
  -d "{\"eventType\": \"Music Concert\", \"count\": 5}"
```

On Linux/Mac:
```bash
curl -X POST http://localhost:8080/api/ai/suggest-names \
  -H "Content-Type: application/json" \
  -d '{"eventType": "Music Concert", "count": 5}'
```

### Method 2: Using PowerShell (Windows)

```powershell
$body = @{
    eventType = "Wedding"
    count = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/ai/suggest-names" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### Method 3: Using Postman

1. Open Postman
2. Create a new POST request
3. URL: `http://localhost:8080/api/ai/suggest-names`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "eventType": "Birthday Party",
  "count": 5
}
```
6. Click Send

### Method 4: Using Frontend (React)

1. Start the frontend:
```bash
cd event-frontend
npm start
```

2. Navigate to the EventNameAI component in your React app
3. Enter an event type (e.g., "Corporate Event")
4. Enter count (e.g., 5)
5. Click "Generate with AI"

### Method 5: Using Browser Console (JavaScript)

Open browser console (F12) and run:
```javascript
fetch('http://localhost:8080/api/ai/suggest-names', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    eventType: 'Music Festival',
    count: 5
  })
})
.then(response => response.json())
.then(data => console.log('AI Suggestions:', data))
.catch(error => console.error('Error:', error));
```

## Expected Response

Success response (200 OK):
```json
[
  "Event Name 1",
  "Event Name 2",
  "Event Name 3",
  "Event Name 4",
  "Event Name 5"
]
```

Error responses:
- 400: Invalid request (missing eventType)
- 429: Rate limit/quota exceeded
- 500: Server error (check logs)

## Check Application Logs

Watch the console output for:
- `Generating X event names for event type: ...`
- `Successfully generated event names for event type: ...`
- Any error messages

## Troubleshooting

1. **Port 8080 already in use:**
   - Change port in `application.properties`: `server.port=8081`

2. **Database connection error:**
   - Check MySQL is running
   - Verify credentials in `application.properties`

3. **OpenAI API error:**
   - Check API key is valid in `application.properties`
   - Verify you have quota/credits
   - Check internet connection

4. **Model not found error:**
   - Ensure model is set to `gpt-3.5-turbo` in `application.properties`

## Quick Test Script

Save this as `test-ai.ps1` (PowerShell) or `test-ai.sh` (Bash):

**PowerShell (test-ai.ps1):**
```powershell
Write-Host "Testing AI Integration..." -ForegroundColor Green

$testCases = @(
    @{eventType="Wedding"; count=3},
    @{eventType="Birthday Party"; count=5},
    @{eventType="Corporate Event"; count=4}
)

foreach ($test in $testCases) {
    Write-Host "`nTesting: $($test.eventType) - Count: $($test.count)" -ForegroundColor Yellow
    
    $body = @{
        eventType = $test.eventType
        count = $test.count
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/suggest-names" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body
        
        Write-Host "Success! Suggestions:" -ForegroundColor Green
        $response | ForEach-Object { Write-Host "  - $_" }
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 2
}
```

Run it:
```powershell
.\test-ai.ps1
```




