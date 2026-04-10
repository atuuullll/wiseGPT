#!/usr/bin/env pwsh
# Quick setup script for Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎨 LLM Content Generator Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
Write-Host "Checking for npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "✅ npm found: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Make sure your Flask backend is running:"
    Write-Host "   python server.py"
    Write-Host ""
    Write-Host "2. Start the development server:"
    Write-Host "   npm run dev"
    Write-Host ""
    Write-Host "3. Open your browser and visit:"
    Write-Host "   http://localhost:3000"
    Write-Host ""
} else {
    Write-Host "❌ Setup failed!" -ForegroundColor Red
    exit 1
}
