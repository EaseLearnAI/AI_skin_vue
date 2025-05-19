@echo off
echo AI Skin Project Deployment Script for Windows

REM Check if Git Bash is installed
where bash >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git Bash is not installed or not in PATH.
    echo Please install Git for Windows from https://git-scm.com/download/win
    echo or make sure Git Bash is in your PATH.
    pause
    exit /b 1
)

echo Running deployment script using Git Bash...
bash -c "./deploy.sh"

if %ERRORLEVEL% NEQ 0 (
    echo Deployment script encountered an error.
    echo Please check the error messages above.
) else (
    echo Deployment completed successfully.
    echo Frontend: http://101.42.4.184
    echo Backend API: http://101.42.4.184:5000
)

pause 