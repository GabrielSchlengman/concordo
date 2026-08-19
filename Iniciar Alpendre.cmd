@echo off
title Alpendre
where node >nul 2>nul
if errorlevel 1 (
  echo O Node.js nao foi encontrado. Instale o Node.js 18 ou mais recente.
  pause
  exit /b 1
)
start "" "http://localhost:4173"
node server.js
pause
