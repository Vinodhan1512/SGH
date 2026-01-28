@echo off
REM SecureSign Pro - Demo Build Script for Windows
REM This script builds the Windows .exe installer with 30-day trial license

echo ============================================
echo SecureSign Pro - Demo Build Script
echo ============================================
echo.

REM Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org
    exit /b 1
)

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)

echo.
echo [2/4] Building TypeScript...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    exit /b 1
)

echo.
echo [3/4] Packaging Windows installer...
call npm run package:win
if errorlevel 1 (
    echo ERROR: Packaging failed
    exit /b 1
)

echo.
echo [4/4] Build complete!
echo.
echo ============================================
echo Installer location: release\SecureSignPro-Setup-1.0.0.exe
echo.
echo The installer includes:
echo - 30-day trial license (auto-activated)
echo - Full feature access during trial
echo - Demo user credentials pre-configured
echo ============================================
echo.
pause
