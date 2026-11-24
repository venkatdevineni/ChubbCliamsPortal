$ErrorActionPreference = "Stop"
$project = Join-Path $PSScriptRoot "backend\Claims.Api"
Set-Location $project
Write-Host "Starting Claims API at http://localhost:5000" -ForegroundColor Cyan
dotnet run --no-launch-profile --urls "http://localhost:5000"
