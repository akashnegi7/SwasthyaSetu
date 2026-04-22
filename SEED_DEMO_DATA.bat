@echo off
title SwasthyaSetu+ - Seed Demo Data
color 0A
echo.
echo  =============================================
echo    Loading Demo Data into MongoDB...
echo  =============================================
echo.
cd /d "%~dp0backend"
node seed.js
echo.
echo  =============================================
echo   Done! Now run START.bat to launch the app.
echo  =============================================
echo.
pause
