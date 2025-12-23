# Start Django Backend with AI Chatbot
# This script loads environment variables from .env file and starts the server

Write-Host "🚀 Starting E-Commerce Backend with AI Chatbot" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Gray

# Navigate to backend directory
Set-Location -Path $PSScriptRoot

# Load environment variables from .env file
if (Test-Path ".env") {
    Write-Host "✅ Loading environment variables from .env file" -ForegroundColor Green
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
} else {
    Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "   Create a .env file or copy from .env.example" -ForegroundColor Yellow
}

# Activate virtual environment and run server
Write-Host "🔧 Starting Django server..." -ForegroundColor Cyan
Write-Host ""

& .\venv\Scripts\python.exe manage.py runserver
