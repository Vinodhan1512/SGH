# SecureSign Pro

Enterprise-grade desktop document signing application with cryptographic security.

## Features

- **PDF Signing**: Open, view, and digitally sign PDF documents
- **Cryptographic Security**: RSA-2048/4096 and ECDSA-256/384 signatures
- **SHA-256 Hashing**: Tamper-evident document integrity
- **Encrypted Keystore**: AES-256-GCM protected key storage
- **Audit Logging**: Hash-chained, tamper-evident audit trail
- **Offline Signing**: Full functionality without internet
- **License Management**: Machine-bound licensing with usage tracking

## Security Standards

- AES-256-GCM encryption for key storage
- PBKDF2 with 310,000 iterations for key derivation
- SHA-256 document hashing
- RSA-SHA256 / ECDSA-SHA256 digital signatures
- Immutable audit logs with hash chains

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Package for distribution
npm run package
```

### Build Commands

```bash
# Windows installer
npm run package:win

# macOS installer
npm run package:mac

# Linux installer
npm run package:linux
```

## Architecture

```
├── src/
│   ├── main/              # Electron main process
│   ├── preload/           # Secure IPC bridge
│   ├── renderer/          # React UI application
│   ├── services/          # Business logic
│   │   ├── crypto/        # Cryptographic operations
│   │   ├── pdf/           # PDF handling
│   │   ├── keystore/      # Key management
│   │   ├── signing/       # Document signing
│   │   ├── audit/         # Audit logging
│   │   ├── license/       # License management
│   │   └── auth/          # PIN/OTP authentication
│   ├── database/          # SQLite data layer
│   └── shared/            # Shared types and utilities
├── assets/                # Application assets
└── tests/                 # Test suites
```

## Usage

### First-Time Setup

1. Launch the application
2. Create a master password (minimum 8 characters)
3. Activate your license or start a trial
4. Generate your first signing key

### Signing a Document

1. Click "Open PDF" and select your document
2. Click "Place Signature" and click where you want the signature
3. Fill in signer information
4. Optionally upload a signature image
5. Select your signing certificate
6. Click "Sign Document"

### Verifying a Signature

1. Open the signed document
2. View the signature details panel
3. Check the verification status

## Configuration

### Settings

- **Theme**: Light/Dark/System
- **Language**: English, Arabic (RTL)
- **Security**: PIN requirement, auto-lock timeout
- **Signing**: Default reason, timestamp service

### License Types

| Type | Features |
|------|----------|
| Trial | 30 days, 50 signatures |
| Standard | 1 year, 500 signatures |
| Professional | 1 year, unlimited, batch signing |
| Enterprise | 1 year, unlimited, all features |

## API Reference

### IPC Channels

```typescript
// Document operations
window.electron.openDocument(filePath)
window.electron.signDocument(request)
window.electron.verifyDocument(filePath)

// Keystore operations
window.electron.getKeystoreStatus()
window.electron.unlockKeystore(password)
window.electron.lockKeystore()

// Certificate operations
window.electron.listCertificates()
window.electron.generateCertificate(options)
window.electron.deleteCertificate(keyId)

// License operations
window.electron.getLicenseInfo()
window.electron.activateLicense(request)
window.electron.validateLicense()

// Audit operations
window.electron.getAuditLogs(options)
window.electron.verifyAuditIntegrity()
window.electron.exportAuditLogs(options)
```

## Security Considerations

1. **Master Password**: Never stored, only derived hash
2. **Private Keys**: Always encrypted with AES-256-GCM
3. **Audit Logs**: Hash-chained to detect tampering
4. **License**: Machine-bound to prevent sharing
5. **IPC**: Context isolation and input validation

## Development

### Tech Stack

- **Framework**: Electron 28+
- **Language**: TypeScript 5
- **UI**: React 18
- **Styling**: CSS / Tailwind
- **PDF**: pdf-lib, pdfjs-dist
- **Database**: better-sqlite3
- **Crypto**: Node.js crypto

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## License

This software is proprietary. All rights reserved.

## Support

- Email: support@securesign.pro
- Website: https://securesign.pro
- Documentation: https://securesign.pro/docs
