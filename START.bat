@echo off
title SwasthyaSetu+ Launcher
color 0B
echo.
echo  =============================================
echo    SwasthyaSetu+ - National Health Records
echo  =============================================
echo.

cd /d "%~dp0backend"

echo  [1/3] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo  ERROR: Node.js not found!
  echo  Please install from: https://nodejs.org
  pause
  exit
)
echo  Node.js found OK

echo.
echo  [2/3] Installing packages (first time only)...
if not exist "node_modules" (
  npm install
  echo  Packages installed!
) else (
  echo  Packages already installed. Skipping.
)

echo.
echo  [3/3] Starting server...
echo.
echo  =============================================
echo   Server is starting...
echo   Open your browser and go to:
echo   >>> http://localhost:5000 <<<
echo  =============================================
echo.
echo  IMPORTANT: Keep this window open while using the app!
echo  To stop the server: press Ctrl+C
echo.
node server.js

pause
