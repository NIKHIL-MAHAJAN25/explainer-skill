@echo off
rem One tap: rebuild the diagram list, then open the hub in the default browser.
cd /d "%~dp0"
node build.mjs
if errorlevel 1 (
  echo.
  echo Build failed. Is Node.js installed and on PATH?
  pause
  exit /b 1
)
start "" "%~dp0index.html"
