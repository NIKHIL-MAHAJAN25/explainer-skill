@echo off
rem Installs the /explainer skill and the Diagram Hub exactly as they are on the author's machine.
setlocal
set "SRC=%~dp0"
set "HUB=%USERPROFILE%\Documents\diagram-hub"
set "SKILL=%USERPROFILE%\.claude\skills\explainer"

where node >nul 2>nul || (echo Node.js is not on PATH. Install it from https://nodejs.org first. & pause & exit /b 1)

if exist "%HUB%" (
  echo Backing up existing hub to "%HUB%.backup"
  if exist "%HUB%.backup" rmdir /s /q "%HUB%.backup"
  move "%HUB%" "%HUB%.backup" >nul
)
if exist "%SKILL%" (
  echo Backing up existing skill to "%SKILL%.backup"
  if exist "%SKILL%.backup" rmdir /s /q "%SKILL%.backup"
  move "%SKILL%" "%SKILL%.backup" >nul
)

xcopy "%SRC%diagram-hub" "%HUB%\" /e /i /q /y >nul
xcopy "%SRC%skill\explainer" "%SKILL%\" /e /i /q /y >nul

powershell -NoProfile -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop')+'\Diagram Hub.lnk'); $s.TargetPath='%HUB%\Open Diagram Hub.bat'; $s.WorkingDirectory='%HUB%'; $s.Save()"

echo.
echo Installed:
echo   Skill: %SKILL%\SKILL.md
echo   Hub:   %HUB%
echo   Desktop shortcut: Diagram Hub
echo.
echo Restart Claude Code, then try:  /explainer ^<topic^>
pause
