$ErrorActionPreference = "Stop"
$frontend = Join-Path $PSScriptRoot "frontend"
Set-Location $frontend
if (!(Test-Path "node_modules")) { npm install }
Write-Host "Starting Angular at http://localhost:4200" -ForegroundColor Cyan
npm start
