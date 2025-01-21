@echo off
echo Iniciando todos os serviços...

start cmd /k "cd backend && node app.js"
start cmd /k "cd dashboard && npm start -- --port 8501"
start cmd /k "cd auth && npm start -- --port 8500"
start cmd /k "cd notfound && npm start -- --port 8502"
start cmd /k "cd orchestrator && npm start"

echo Todos os serviços foram iniciados!
pause
