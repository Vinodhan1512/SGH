#!/bin/bash
# SecureSign Pro - Demo Build Script
# This script builds the Windows .exe installer with 30-day trial license

set -e

echo "============================================"
echo "SecureSign Pro - Demo Build Script"
echo "============================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "[1/4] Installing dependencies..."
npm install

echo ""
echo "[2/4] Building TypeScript..."
npm run build

echo ""
echo "[3/4] Packaging Windows installer..."
npm run package:win

echo ""
echo "[4/4] Build complete!"
echo ""
echo "============================================"
echo "Installer location: release/SecureSignPro-Setup-1.0.0.exe"
echo ""
echo "The installer includes:"
echo "- 30-day trial license (auto-activated)"
echo "- Full feature access during trial"
echo "- Demo user credentials pre-configured"
echo "============================================"
