# Open two PowerShell terminals from the project folder.
# Terminal 1:
Set-Location backend\Claims.Api
dotnet run --urls http://localhost:5000
# Terminal 2:
Set-Location frontend
npm install
npm start
