# SecureSign Pro - Desktop Document Signing Application

## Architecture Documentation

### Executive Summary

SecureSign Pro is an enterprise-grade desktop application for digitally signing PDF documents
with cryptographic signatures. Built for the Middle East market, it provides offline-capable,
secure document signing with comprehensive audit trails and license management.

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SECURESIGN PRO DESKTOP                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         PRESENTATION LAYER (UI)                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │  PDF Viewer  │  │  Signature   │  │   Settings   │  │   License   │  │   │
│  │  │  Component   │  │    Panel     │  │    Panel     │  │   Manager   │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │  Audit Log   │  │  Key Mgmt    │  │  Signature   │  │   About &   │  │   │
│  │  │   Viewer     │  │    Panel     │  │  Verification│  │    Help     │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         APPLICATION LAYER (IPC)                          │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │   │
│  │  │              Electron IPC Bridge (Secure Channel)                 │   │   │
│  │  │         Main Process <──────────────────> Renderer Process        │   │   │
│  │  └──────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          SERVICE LAYER (Core)                            │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐   │   │
│  │  │   PDF       │ │  Signing    │ │   Crypto    │ │     License      │   │   │
│  │  │  Engine     │ │   Engine    │ │   Module    │ │     Service      │   │   │
│  │  │             │ │             │ │             │ │                  │   │   │
│  │  │ • Load PDF  │ │ • Sign Doc  │ │ • RSA-2048  │ │ • Validate       │   │   │
│  │  │ • Render    │ │ • Verify    │ │ • ECDSA     │ │ • Machine-bound  │   │   │
│  │  │ • Embed Sig │ │ • Timestamp │ │ • SHA-256   │ │ • Expiry check   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────────┘   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐   │   │
│  │  │  Keystore   │ │   Audit     │ │    OTP/     │ │     Backup       │   │   │
│  │  │  Manager    │ │   Logger    │ │    PIN      │ │     Service      │   │   │
│  │  │             │ │             │ │   Service   │ │                  │   │   │
│  │  │ • Encrypted │ │ • Immutable │ │             │ │ • Export keys    │   │   │
│  │  │ • Import/   │ │ • Tamper-   │ │ • TOTP      │ │ • Sync (opt)     │   │   │
│  │  │   Export    │ │   evident   │ │ • PIN hash  │ │ • Cloud backup   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          DATA LAYER (Storage)                            │   │
│  │  ┌───────────────────────┐     ┌───────────────────────────────────┐    │   │
│  │  │      SQLite DB        │     │        Secure File Storage        │    │   │
│  │  │  ┌─────────────────┐  │     │  ┌─────────────────────────────┐  │    │   │
│  │  │  │  audit_logs     │  │     │  │  keystore.enc (AES-256)     │  │    │   │
│  │  │  │  signatures     │  │     │  │  license.enc                │  │    │   │
│  │  │  │  certificates   │  │     │  │  settings.json              │  │    │   │
│  │  │  │  documents      │  │     │  │  signature_images/          │  │    │   │
│  │  │  └─────────────────┘  │     │  └─────────────────────────────┘  │    │   │
│  │  └───────────────────────┘     └───────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
              ┌───────────────────────────────────────────────────┐
              │            EXTERNAL SERVICES (Optional)           │
              │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
              │  │  Timestamp  │  │   License   │  │   Cloud   │ │
              │  │  Authority  │  │   Server    │  │   Sync    │ │
              │  │   (TSA)     │  │   (REST)    │  │   API     │ │
              │  └─────────────┘  └─────────────┘  └───────────┘ │
              └───────────────────────────────────────────────────┘
```

---

## Technology Stack Recommendation

### Primary Stack: Electron + TypeScript

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Framework** | Electron 28+ | Cross-platform, mature, large ecosystem |
| **Language** | TypeScript 5.x | Type safety, maintainability |
| **UI Framework** | React 18 | Component-based, rich ecosystem |
| **PDF Handling** | pdf-lib + pdfjs-dist | Pure JS, no native deps, offline |
| **Cryptography** | Node.js crypto | Native, FIPS-compliant, no browser deps |
| **Database** | better-sqlite3 | Fast, synchronous, embedded |
| **Styling** | Tailwind CSS | Rapid development, RTL support |
| **Build** | electron-builder | Installers for all platforms |
| **Keystore** | AES-256-GCM encrypted files | Secure local storage |

### Why Electron Over Alternatives?

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Electron** | Large ecosystem, web skills transfer, PDF.js works natively | Larger bundle size | ✅ **Selected** |
| **Tauri** | Smaller size, Rust security | Less mature, fewer PDF options | ❌ PDF support limited |
| **.NET MAUI** | Windows-native, good crypto | Cross-platform issues, smaller talent pool | ❌ Regional talent |
| **JavaFX** | Good crypto, cross-platform | JRE dependency, dated UX | ❌ User experience |

---

## Module Breakdown

### 1. Core Modules

```
src/
├── main/                          # Electron Main Process
│   ├── index.ts                   # Application entry point
│   ├── window-manager.ts          # Window lifecycle management
│   ├── ipc-handlers.ts            # IPC message handlers
│   ├── menu.ts                    # Application menu
│   └── auto-updater.ts            # Auto-update logic
│
├── services/                      # Business Logic Layer
│   ├── crypto/
│   │   ├── crypto-engine.ts       # Core cryptography operations
│   │   ├── key-generator.ts       # RSA/ECDSA key generation
│   │   ├── signature-provider.ts  # Signing operations
│   │   └── hash-utils.ts          # SHA-256/SHA-512 hashing
│   │
│   ├── pdf/
│   │   ├── pdf-engine.ts          # PDF loading and manipulation
│   │   ├── signature-embedder.ts  # Visual signature embedding
│   │   ├── pdf-renderer.ts        # PDF to image rendering
│   │   └── metadata-handler.ts    # PDF metadata management
│   │
│   ├── keystore/
│   │   ├── keystore-manager.ts    # Encrypted keystore operations
│   │   ├── key-import-export.ts   # PKCS#12, PEM support
│   │   └── key-derivation.ts      # PBKDF2 key derivation
│   │
│   ├── signing/
│   │   ├── signing-engine.ts      # Document signing orchestration
│   │   ├── signature-validator.ts # Signature verification
│   │   └── timestamp-service.ts   # RFC 3161 timestamp support
│   │
│   ├── audit/
│   │   ├── audit-logger.ts        # Immutable audit logging
│   │   ├── log-integrity.ts       # Hash chain verification
│   │   └── audit-exporter.ts      # Log export functionality
│   │
│   ├── license/
│   │   ├── license-manager.ts     # License validation
│   │   ├── machine-id.ts          # Hardware fingerprinting
│   │   └── license-crypto.ts      # License encryption
│   │
│   └── auth/
│       ├── pin-service.ts         # PIN management
│       └── otp-service.ts         # TOTP implementation
│
├── database/
│   ├── connection.ts              # SQLite connection manager
│   ├── migrations/                # Database migrations
│   └── repositories/              # Data access layer
│       ├── audit-repository.ts
│       ├── signature-repository.ts
│       └── certificate-repository.ts
│
├── renderer/                      # Electron Renderer Process (UI)
│   ├── App.tsx                    # Main React component
│   ├── components/
│   │   ├── pdf-viewer/
│   │   ├── signature-panel/
│   │   ├── settings/
│   │   ├── audit-viewer/
│   │   └── common/
│   ├── hooks/
│   ├── store/                     # State management
│   └── styles/
│
├── shared/                        # Shared types and utilities
│   ├── types/
│   ├── constants/
│   └── utils/
│
└── preload/
    └── index.ts                   # Secure IPC bridge
```

---

## Data Models

### Core Database Schema

```sql
-- Audit Log Table (Immutable, Hash-Chained)
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,                    -- ISO 8601
    event_type TEXT NOT NULL,                   -- SIGN, VERIFY, KEY_GEN, etc.
    user_id TEXT,
    document_hash TEXT,
    document_name TEXT,
    action_details TEXT,                        -- JSON blob
    ip_address TEXT,
    machine_id TEXT,
    previous_hash TEXT,                         -- Hash chain link
    entry_hash TEXT NOT NULL,                   -- This entry's hash
    signature TEXT NOT NULL                     -- Signed by app key
);

-- Signatures Table
CREATE TABLE signatures (
    id TEXT PRIMARY KEY,
    document_hash TEXT NOT NULL,
    document_name TEXT NOT NULL,
    signer_name TEXT NOT NULL,
    signer_email TEXT,
    signer_id TEXT,
    signature_reason TEXT,
    signature_location TEXT,
    timestamp TEXT NOT NULL,
    timezone TEXT NOT NULL,
    verification_id TEXT UNIQUE NOT NULL,
    signature_image_path TEXT,
    certificate_id TEXT,
    signature_value TEXT NOT NULL,             -- Base64 encoded
    algorithm TEXT NOT NULL,                   -- RSA-SHA256, ECDSA-SHA256
    is_timestamped INTEGER DEFAULT 0,
    timestamp_token TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (certificate_id) REFERENCES certificates(id)
);

-- Certificates/Keys Table
CREATE TABLE certificates (
    id TEXT PRIMARY KEY,
    alias TEXT NOT NULL UNIQUE,
    subject_name TEXT NOT NULL,
    subject_email TEXT,
    issuer TEXT,
    serial_number TEXT,
    valid_from TEXT NOT NULL,
    valid_to TEXT NOT NULL,
    public_key TEXT NOT NULL,                  -- PEM encoded
    key_type TEXT NOT NULL,                    -- RSA, ECDSA
    key_size INTEGER NOT NULL,
    fingerprint_sha256 TEXT NOT NULL,
    is_default INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
);

-- Documents Table
CREATE TABLE documents (
    id TEXT PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_path TEXT,
    file_hash TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    page_count INTEGER,
    is_signed INTEGER DEFAULT 0,
    signature_count INTEGER DEFAULT 0,
    first_opened TEXT NOT NULL,
    last_accessed TEXT NOT NULL
);

-- License Table
CREATE TABLE license (
    id TEXT PRIMARY KEY,
    license_key TEXT NOT NULL,
    license_type TEXT NOT NULL,               -- TRIAL, STANDARD, ENTERPRISE
    issued_to TEXT NOT NULL,
    issued_email TEXT,
    machine_id TEXT NOT NULL,
    activation_date TEXT NOT NULL,
    expiry_date TEXT,
    max_signatures INTEGER,                    -- NULL = unlimited
    signatures_used INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    license_signature TEXT NOT NULL           -- Verification signature
);

-- Settings Table
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

### TypeScript Interfaces

```typescript
// Core signing types
interface SignatureRequest {
  documentPath: string;
  signerInfo: SignerInfo;
  signatureImage?: string;          // Base64 or file path
  signaturePosition: SignaturePosition;
  reason: string;
  location?: string;
  pinOrOtp?: string;
  useTimestamp?: boolean;
  certificateId: string;
}

interface SignerInfo {
  name: string;
  email?: string;
  id?: string;
  organization?: string;
}

interface SignaturePosition {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SignatureResult {
  success: boolean;
  verificationId: string;
  signedDocumentPath: string;
  timestamp: string;
  signatureDetails: SignatureDetails;
  auditLogId: string;
}

interface SignatureDetails {
  signerName: string;
  signerEmail?: string;
  signerId?: string;
  reason: string;
  timestamp: string;
  timezone: string;
  verificationId: string;
  algorithm: 'RSA-SHA256' | 'ECDSA-SHA256';
  certificateFingerprint: string;
  isTimestamped: boolean;
}

interface Certificate {
  id: string;
  alias: string;
  subjectName: string;
  subjectEmail?: string;
  issuer?: string;
  serialNumber?: string;
  validFrom: Date;
  validTo: Date;
  publicKey: string;
  keyType: 'RSA' | 'ECDSA';
  keySize: number;
  fingerprintSha256: string;
  isDefault: boolean;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  userId?: string;
  documentHash?: string;
  documentName?: string;
  actionDetails: Record<string, any>;
  ipAddress?: string;
  machineId: string;
  previousHash?: string;
  entryHash: string;
  signature: string;
}

type AuditEventType =
  | 'DOCUMENT_OPENED'
  | 'DOCUMENT_SIGNED'
  | 'SIGNATURE_VERIFIED'
  | 'KEY_GENERATED'
  | 'KEY_IMPORTED'
  | 'KEY_EXPORTED'
  | 'LICENSE_ACTIVATED'
  | 'LICENSE_VALIDATED'
  | 'SETTINGS_CHANGED'
  | 'APPLICATION_STARTED'
  | 'APPLICATION_CLOSED';

interface License {
  id: string;
  licenseKey: string;
  licenseType: 'TRIAL' | 'STANDARD' | 'ENTERPRISE';
  issuedTo: string;
  issuedEmail?: string;
  machineId: string;
  activationDate: Date;
  expiryDate?: Date;
  maxSignatures?: number;
  signaturesUsed: number;
  isActive: boolean;
}

interface VerificationResult {
  isValid: boolean;
  signatureDetails?: SignatureDetails;
  certificateInfo?: CertificateInfo;
  tamperDetected: boolean;
  timestampValid?: boolean;
  errors: string[];
  warnings: string[];
}
```

---

## Signing Workflow Sequence

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DOCUMENT SIGNING WORKFLOW                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────┐     ┌──────────┐     ┌─────────┐     ┌────────┐     ┌──────────┐
│ User │     │    UI    │     │ Signing │     │ Crypto │     │ Keystore │
└──┬───┘     └────┬─────┘     │ Engine  │     │ Module │     └────┬─────┘
   │              │           └────┬────┘     └───┬────┘          │
   │              │                │              │               │
   │ 1. Open PDF  │                │              │               │
   │─────────────>│                │              │               │
   │              │                │              │               │
   │              │ 2. Load & Render PDF          │               │
   │              │───────────────>│              │               │
   │              │                │              │               │
   │<─────────────│ 3. Display PDF │              │               │
   │              │                │              │               │
   │ 4. Select    │                │              │               │
   │ signature    │                │              │               │
   │ position     │                │              │               │
   │─────────────>│                │              │               │
   │              │                │              │               │
   │ 5. Enter     │                │              │               │
   │ signer info  │                │              │               │
   │ & reason     │                │              │               │
   │─────────────>│                │              │               │
   │              │                │              │               │
   │ 6. Upload    │                │              │               │
   │ signature    │                │              │               │
   │ image (opt)  │                │              │               │
   │─────────────>│                │              │               │
   │              │                │              │               │
   │ 7. Enter PIN │                │              │               │
   │ or OTP       │                │              │               │
   │─────────────>│                │              │               │
   │              │                │              │               │
   │              │ 8. Validate PIN/OTP           │               │
   │              │───────────────────────────────────────────────>│
   │              │                │              │               │
   │              │<──────────────────────────────────────────────│
   │              │                │ 9. PIN Valid │               │
   │              │                │              │               │
   │              │ 10. Sign Document Request     │               │
   │              │───────────────>│              │               │
   │              │                │              │               │
   │              │                │ 11. Check License            │
   │              │                │─────────────────────────────>│
   │              │                │              │               │
   │              │                │<────────────────────────────│
   │              │                │   License OK │               │
   │              │                │              │               │
   │              │                │ 12. Hash PDF │               │
   │              │                │ (SHA-256)    │               │
   │              │                │─────────────>│               │
   │              │                │              │               │
   │              │                │<────────────│               │
   │              │                │   Doc Hash   │               │
   │              │                │              │               │
   │              │                │ 13. Get Private Key          │
   │              │                │───────────────────────────────>│
   │              │                │              │               │
   │              │                │<──────────────────────────────│
   │              │                │              │   Decrypted Key
   │              │                │              │               │
   │              │                │ 14. Create   │               │
   │              │                │ Signature    │               │
   │              │                │─────────────>│               │
   │              │                │              │               │
   │              │                │<────────────│               │
   │              │                │ Digital Sig  │               │
   │              │                │              │               │
   │              │                │ 15. Optional: Request Timestamp
   │              │                │─────────────────────────────────────> [TSA]
   │              │                │<─────────────────────────────────────
   │              │                │              │               │
   │              │                │ 16. Embed Signature in PDF   │
   │              │                │ (visible + metadata)         │
   │              │                │              │               │
   │              │                │ 17. Save Signed PDF          │
   │              │                │              │               │
   │              │                │ 18. Create Audit Log Entry   │
   │              │                │              │               │
   │              │                │ 19. Increment License Counter│
   │              │                │              │               │
   │              │<───────────────│              │               │
   │              │  20. Signing Complete         │               │
   │              │  Return verification ID       │               │
   │              │                │              │               │
   │<─────────────│                │              │               │
   │ 21. Show success              │              │               │
   │ & verification ID             │              │               │
   │              │                │              │               │
```

---

## Security Best Practices

### 1. Cryptographic Security

```
┌────────────────────────────────────────────────────────────────┐
│                    CRYPTOGRAPHIC STANDARDS                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Key Generation:                                               │
│  ├─ RSA: Minimum 2048-bit, recommended 4096-bit               │
│  ├─ ECDSA: P-256 (secp256r1) or P-384                         │
│  └─ Use crypto.generateKeyPairSync() with secure params       │
│                                                                │
│  Hashing:                                                      │
│  ├─ Document hash: SHA-256 or SHA-384                         │
│  ├─ Password/PIN: Argon2id or PBKDF2-SHA256 (100k+ iterations)│
│  └─ Audit chain: SHA-256                                      │
│                                                                │
│  Encryption:                                                   │
│  ├─ Keystore: AES-256-GCM with random 96-bit IV               │
│  ├─ License file: AES-256-GCM                                 │
│  └─ Key derivation: PBKDF2 with 256-bit salt, 310k iterations │
│                                                                │
│  Signatures:                                                   │
│  ├─ RSA-SHA256 (PKCS#1 v1.5 or PSS)                           │
│  ├─ ECDSA-SHA256                                              │
│  └─ Include signing time in signed attributes                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 2. Key Storage Security

- Private keys NEVER stored in plaintext
- Master password required to unlock keystore
- Keys encrypted with AES-256-GCM
- Key derivation uses PBKDF2 with high iteration count
- Memory cleared after use (best effort in JS)
- Optional HSM/smart card support for enterprise

### 3. Application Security

- Context isolation enabled in Electron
- Node integration disabled in renderer
- Content Security Policy enforced
- No remote code execution
- All IPC channels validated
- Input sanitization on all user inputs
- No eval() or Function() constructors

### 4. Audit Log Integrity

- Hash chain links each entry to previous
- Each entry signed with application key
- Tamper detection on application start
- Immutable append-only storage
- Regular integrity verification

---

## Deployment & Packaging

### Build Targets

```yaml
# electron-builder configuration
build:
  appId: com.securesign.pro
  productName: SecureSign Pro

  win:
    target:
      - nsis
      - msi
    icon: assets/icon.ico
    certificateFile: certs/code-signing.pfx

  mac:
    target:
      - dmg
      - pkg
    icon: assets/icon.icns
    hardenedRuntime: true
    notarize: true

  linux:
    target:
      - AppImage
      - deb
      - rpm
    icon: assets/icon.png

  nsis:
    oneClick: false
    allowToChangeInstallationDirectory: true
    createDesktopShortcut: true
    installerLanguages:
      - en_US
      - ar_SA    # Arabic support
```

### Installation Requirements

| Platform | Minimum | Recommended |
|----------|---------|-------------|
| Windows | 10 (1809+) | 11 |
| macOS | 10.15 | 12+ |
| Linux | Ubuntu 20.04 | Ubuntu 22.04 |
| RAM | 4 GB | 8 GB |
| Disk | 500 MB | 1 GB |

---

## License Enforcement Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    LICENSE VALIDATION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │ App Start   │                                                │
│  └──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐     No      ┌─────────────────┐               │
│  │ License     │─────────────│ Show Activation │               │
│  │ Exists?     │             │ Dialog          │               │
│  └──────┬──────┘             └────────┬────────┘               │
│         │ Yes                         │                         │
│         ▼                             ▼                         │
│  ┌─────────────┐             ┌─────────────────┐               │
│  │ Decrypt &   │             │ Enter License   │               │
│  │ Verify Sig  │             │ Key             │               │
│  └──────┬──────┘             └────────┬────────┘               │
│         │                             │                         │
│         ▼                             ▼                         │
│  ┌─────────────┐             ┌─────────────────┐               │
│  │ Check       │             │ Validate Online │───┐           │
│  │ Machine ID  │             │ (if available)  │   │ Offline   │
│  └──────┬──────┘             └────────┬────────┘   │           │
│         │                             │            │           │
│         ▼                             ▼            ▼           │
│  ┌─────────────┐             ┌─────────────────────────────┐   │
│  │ Check       │             │ Verify License Signature    │   │
│  │ Expiry Date │             │ (Embedded public key)       │   │
│  └──────┬──────┘             └─────────────┬───────────────┘   │
│         │                                   │                   │
│         ▼                                   ▼                   │
│  ┌─────────────┐             ┌─────────────────┐               │
│  │ Check Usage │             │ Bind to         │               │
│  │ Limits      │             │ Machine ID      │               │
│  └──────┬──────┘             └────────┬────────┘               │
│         │                             │                         │
│         ▼                             ▼                         │
│  ┌─────────────────────────────────────────────┐               │
│  │              License Valid                   │               │
│  │         Enable Full Functionality            │               │
│  └─────────────────────────────────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### License Key Format

```
XXXX-XXXX-XXXX-XXXX-XXXX

Where encoded data includes:
- License type (2 bits)
- Expiry date (32 bits)
- Max signatures (16 bits)
- Customer ID (32 bits)
- Checksum (16 bits)
- RSA signature (256 bytes, stored separately)
```

---

## API Design (Optional Backend Sync)

### REST Endpoints

```
POST   /api/v1/license/activate
POST   /api/v1/license/validate
POST   /api/v1/license/deactivate

POST   /api/v1/audit/sync
GET    /api/v1/audit/logs?from=<timestamp>

POST   /api/v1/timestamp/sign
POST   /api/v1/timestamp/verify

GET    /api/v1/certificates/trusted
POST   /api/v1/certificates/verify

POST   /api/v1/documents/register
GET    /api/v1/documents/:verificationId/status
```

---

## Localization Support

The application includes RTL (Right-to-Left) support for Arabic markets:

- Arabic (ar-SA) - Primary Middle East market
- English (en-US) - Default
- Extensible to other languages

UI automatically adjusts layout direction based on selected language.
