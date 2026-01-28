# Building SecureSign Pro Demo Installer

This guide explains how to build the Windows .exe installer with the 30-day trial license pre-configured for client demos.

## Prerequisites

- **Node.js 18+**: Download from https://nodejs.org
- **Windows 10/11** (for building Windows installer)
- **Internet connection** (to download Electron binaries)

## Quick Build (Windows)

1. Open Command Prompt in the `desktop-signing-app` folder
2. Run the build script:
   ```cmd
   scripts\build-demo.bat
   ```
3. Find the installer at: `release\SecureSignPro-Setup-1.0.0.exe`

## Manual Build Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

### 3. Package for Windows

```bash
npm run package:win
```

The installer will be created at `release/SecureSignPro-Setup-1.0.0.exe`

## Demo Trial Features

When clients run the installer, they will get:

- **30-day trial license** automatically activated on first launch
- **Full feature access** during trial period:
  - PDF document signing
  - RSA-2048/4096 and ECDSA key generation
  - SHA-256 cryptographic signatures
  - Encrypted keystore
  - Audit logging
  - 50 signatures included
- **Simplified setup** - only 2 steps:
  1. Create master password
  2. Generate signing key

## Building for Other Platforms

### macOS
```bash
npm run package:mac
```
Creates: `release/SecureSignPro-1.0.0.dmg`

### Linux
```bash
npm run package:linux
```
Creates: `release/SecureSignPro-1.0.0.AppImage`

## Troubleshooting

### Electron Download Fails
If you're behind a corporate proxy:
```bash
set ELECTRON_GET_USE_PROXY=true
npm install
```

Or use a mirror:
```bash
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
npm install
```

### Build Errors
Clear cache and retry:
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

## Distributing to Clients

1. Build the installer using the steps above
2. Send `SecureSignPro-Setup-1.0.0.exe` to the client
3. They run the installer and the 30-day trial starts automatically
4. No license key entry required for the demo

## Upgrading to Full License

When clients are ready to purchase:
1. Go to Settings > License in the app
2. Click "Activate License"
3. Enter the license key provided by sales

Contact: sales@securesign.pro
