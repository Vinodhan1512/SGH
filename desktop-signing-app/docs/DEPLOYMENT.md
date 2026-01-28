# SecureSign Pro - Deployment Guide

## Building for Production

### Prerequisites

- Node.js 18+ LTS
- npm 9+ or yarn 1.22+
- Windows: Visual Studio Build Tools
- macOS: Xcode Command Line Tools
- Linux: build-essential, libsecret-1-dev

### Build Steps

```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build application
npm run build

# Package for distribution
npm run package
```

### Platform-Specific Packaging

```bash
# Windows (NSIS installer + MSI)
npm run package:win

# macOS (DMG)
npm run package:mac

# Linux (AppImage, DEB, RPM)
npm run package:linux
```

## Code Signing

### Windows Code Signing

1. Obtain an EV code signing certificate
2. Configure in `package.json`:

```json
{
  "build": {
    "win": {
      "certificateFile": "certs/code-signing.pfx",
      "certificatePassword": "${env.WIN_CSC_KEY_PASSWORD}"
    }
  }
}
```

3. Set environment variable:
```bash
export WIN_CSC_KEY_PASSWORD="your-certificate-password"
```

### macOS Code Signing & Notarization

1. Enroll in Apple Developer Program
2. Create signing certificate
3. Configure notarization:

```json
{
  "build": {
    "mac": {
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "assets/entitlements.mac.plist",
      "notarize": {
        "teamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

4. Set environment variables:
```bash
export APPLE_ID="your@email.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="YOUR_TEAM_ID"
```

## Enterprise Deployment

### MSI Deployment (Windows)

Generate MSI package for Group Policy deployment:

```bash
npm run package:win -- --win msi
```

MSI supports:
- Silent installation: `msiexec /i SecureSign-Pro.msi /qn`
- Custom install path: `INSTALLDIR="C:\Program Files\SecureSign"`
- Pre-configured settings via MSI properties

### Configuration Management

#### Pre-configured Settings

Create `config.json` in the installation directory:

```json
{
  "license": {
    "serverUrl": "https://license.company.com/api",
    "autoActivate": true
  },
  "security": {
    "requirePin": true,
    "autoLockMinutes": 5,
    "minimumPinLength": 6
  },
  "signing": {
    "defaultAlgorithm": "RSA-SHA256",
    "useTimestamp": true,
    "timestampServer": "http://timestamp.digicert.com"
  }
}
```

#### Registry Settings (Windows)

```reg
[HKEY_LOCAL_MACHINE\SOFTWARE\SecureSign Pro]
"LicenseServer"="https://license.company.com"
"RequirePin"=dword:00000001
"AutoLockTimeout"=dword:00000005
```

### Volume Licensing

#### License Server Setup

For enterprise deployments with 50+ seats:

1. Deploy the License Server (separate package)
2. Configure client applications to connect:

```json
{
  "license": {
    "mode": "server",
    "serverUrl": "https://license.internal.company.com:8443",
    "offlineGraceDays": 7
  }
}
```

#### Floating Licenses

Configure floating licenses for shared workstations:

```json
{
  "license": {
    "mode": "floating",
    "serverUrl": "https://license.company.com",
    "maxConcurrent": 100
  }
}
```

### Active Directory Integration

#### Group Policy Template

1. Copy `SecureSign.admx` to `%SystemRoot%\PolicyDefinitions`
2. Copy `SecureSign.adml` to `%SystemRoot%\PolicyDefinitions\en-US`
3. Configure policies in Group Policy Editor

Available policies:
- Enforce minimum key size
- Require timestamp for all signatures
- Configure trusted timestamp servers
- Set audit log retention period
- Enable/disable features by license tier

### Network Requirements

#### Outbound Connections (Optional)

| Service | URL | Port | Purpose |
|---------|-----|------|---------|
| License Server | license.securesign.pro | 443 | License validation |
| Timestamp | timestamp.digicert.com | 80 | RFC 3161 timestamp |
| Updates | updates.securesign.pro | 443 | Auto-updates |

For air-gapped environments, all features work offline after initial activation.

### Backup Strategy

#### User Data Locations

| OS | Path |
|----|------|
| Windows | `%APPDATA%\SecureSignPro\` |
| macOS | `~/Library/Application Support/SecureSignPro/` |
| Linux | `~/.config/SecureSignPro/` |

#### Critical Files

- `keystore/keystore.enc` - Encrypted signing keys
- `audit/audit.db` - Audit log database
- `license.enc` - License activation data
- `settings.json` - User preferences

#### Backup Commands

```bash
# Create backup
SecureSign.exe --backup --output backup.ssbackup

# Restore backup
SecureSign.exe --restore --input backup.ssbackup
```

### Security Hardening

#### Recommended Settings

```json
{
  "security": {
    "requirePasswordOnStart": true,
    "autoLockTimeout": 5,
    "minimumPinLength": 6,
    "maxLoginAttempts": 5,
    "lockoutDuration": 15,
    "clearClipboardOnLock": true
  }
}
```

#### File System Permissions

```powershell
# Windows - Restrict keystore access
icacls "%APPDATA%\SecureSignPro\keystore" /inheritance:r /grant:r "%USERNAME%:(OI)(CI)F"
```

### Monitoring & Logging

#### Windows Event Log

SecureSign Pro writes to Application log:
- Event ID 1000: Application started
- Event ID 1001: Document signed
- Event ID 1002: Signature verified
- Event ID 2000: Security event (failed login, etc.)

#### SIEM Integration

Export audit logs in syslog format:

```bash
SecureSign.exe --export-audit --format syslog --output /var/log/securesign.log
```

### Uninstallation

#### Silent Uninstall

```bash
# Windows
msiexec /x {PRODUCT-GUID} /qn

# Or via control panel entry
"C:\Program Files\SecureSign Pro\Uninstall.exe" /S
```

#### Data Retention

By default, user data is preserved during uninstall. To remove all data:

```bash
# Windows
rmdir /s /q "%APPDATA%\SecureSignPro"

# macOS/Linux
rm -rf ~/.config/SecureSignPro
```

## Troubleshooting

### Installation Issues

**Windows SmartScreen Warning**
- The installer is signed but may show warning on first run
- Click "More info" → "Run anyway"
- Enterprise deployments: Add to SmartScreen whitelist

**macOS Gatekeeper**
- Right-click app → Open → Open (first time only)
- Enterprise: Use MDM to whitelist bundle ID

### Runtime Issues

**Database Locked**
- Only one instance can run at a time
- Check for background processes
- Delete lock file: `<data>/audit/audit.db-wal`

**License Activation Failed**
- Verify network connectivity to license server
- Check system clock is accurate
- Ensure machine ID hasn't changed (hardware replacement)

### Performance

**Slow PDF Loading**
- Large PDFs (>50MB) may take time
- Ensure adequate RAM (8GB recommended)
- Disable antivirus real-time scanning for app data folder

**High Memory Usage**
- Close unused documents
- Reduce number of recent files
- Clear audit log archive periodically

## Support

- Enterprise Support: enterprise@securesign.pro
- Technical Documentation: https://securesign.pro/docs
- API Reference: https://securesign.pro/api
