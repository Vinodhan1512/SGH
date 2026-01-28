# SecureSign Pro - User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [First-Time Setup](#first-time-setup)
3. [Signing Documents](#signing-documents)
4. [Managing Keys](#managing-keys)
5. [Verifying Signatures](#verifying-signatures)
6. [Audit Logs](#audit-logs)
7. [License Management](#license-management)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Operating System | Windows 10 (1809+) | Windows 11 |
| RAM | 4 GB | 8 GB |
| Disk Space | 500 MB | 1 GB |
| Display | 1024x768 | 1280x900 |

### Installation

1. Download the installer from your organization's software portal
2. Run the installer and follow the prompts
3. Choose installation directory (default recommended)
4. Launch SecureSign Pro from the Start menu

---

## First-Time Setup

### Step 1: Create Master Password

Your master password protects all your signing keys. Choose a strong password:

- Minimum 8 characters
- Include uppercase and lowercase letters
- Include at least one number
- Avoid common words or patterns

**Important**: This password cannot be recovered if lost. Store it securely.

### Step 2: Activate License

You can either:
- **Enter a license key** provided by your organization
- **Start a 30-day trial** to evaluate the software

Enter your name and email for the license registration.

### Step 3: Generate Your First Key

Create a signing key to start signing documents:

- **Key Alias**: A name to identify this key (e.g., "My Work Key")
- **Key Type**: RSA (recommended) or ECDSA
- **Key Size**: 2048-bit (standard) or 4096-bit (high security)
- **Validity**: How long the key remains valid

---

## Signing Documents

### Opening a Document

1. Click **Open PDF** in the sidebar
2. Select the PDF file you want to sign
3. The document will display in the viewer

### Placing Your Signature

1. Click **Place Signature** in the toolbar
2. Click on the document where you want the signature to appear
3. A signature placeholder will be shown
4. You can drag to adjust position or click Remove to replace

### Filling Signature Information

Required fields:
- **Name**: Your full legal name
- **Reason**: Why you're signing (Approved, Reviewed, etc.)
- **Certificate**: Select your signing key

Optional fields:
- **Email**: Your email address
- **ID/Employee Number**: Organization identifier
- **Location**: Where you're signing from
- **Signature Image**: Upload your handwritten signature

### Completing the Signature

1. Enter your PIN if required
2. Click **Sign Document**
3. Wait for the signing process to complete
4. Note the **Verification ID** for future reference

The signed document will be saved with "_signed" appended to the filename.

---

## Managing Keys

### Generating New Keys

1. Go to **Keys** in the sidebar
2. Click **+ Generate New Key**
3. Fill in the key details:
   - Alias (unique name)
   - Key type and size
   - Subject name and email
   - Validity period
4. Click **Generate Key**

### Key Security

- Keys are encrypted with AES-256-GCM
- Only accessible after unlocking with master password
- Export keys for backup (encrypted with separate password)

### Importing/Exporting Keys

**Export:**
1. Select the key to export
2. Click **Export**
3. Enter an export password
4. Save the encrypted key file

**Import:**
1. Click **Import Key**
2. Select the exported key file
3. Enter the export password
4. The key will be added to your keystore

---

## Verifying Signatures

### Verifying a Signed Document

1. Open the signed PDF in SecureSign Pro
2. The signature panel will show verification status
3. Green checkmark = Valid signature
4. Red X = Invalid or tampered document

### Verification Details

- **Signer Name**: Who signed the document
- **Sign Date**: When it was signed
- **Reason**: Why it was signed
- **Verification ID**: Unique identifier
- **Certificate Status**: Key validity
- **Document Integrity**: Whether content changed after signing

---

## Audit Logs

### Viewing Audit History

1. Go to **Audit Log** in the sidebar
2. Browse all system events
3. Filter by event type or date range

### Event Types

- **DOCUMENT_SIGNED**: A document was signed
- **DOCUMENT_VERIFIED**: A signature was verified
- **KEY_GENERATED**: A new key was created
- **KEY_DELETED**: A key was removed
- **KEYSTORE_UNLOCKED**: Application was unlocked
- **LICENSE_ACTIVATED**: License was activated

### Verifying Log Integrity

Click **Verify Integrity** to check that audit logs haven't been tampered with. The system uses cryptographic hash chains to detect any modifications.

### Exporting Logs

1. Click **Export**
2. Choose format (JSON or CSV)
3. Select date range (optional)
4. Save the export file

---

## License Management

### License Types

| Type | Signatures | Duration | Features |
|------|------------|----------|----------|
| Trial | 50 | 30 days | Basic |
| Standard | 500 | 1 year | + Timestamp |
| Professional | Unlimited | 1 year | + Batch signing |
| Enterprise | Unlimited | 1 year | All features |

### Checking License Status

Go to **License** in the sidebar to view:
- License type and status
- Expiration date
- Signatures used/remaining
- Enabled features

### Renewing or Upgrading

Contact your IT administrator or sales@securesign.pro for:
- License renewal
- Upgrade to higher tier
- Volume licensing

---

## Security Best Practices

### Password Security

- Use a unique, strong master password
- Don't share your password
- Change it periodically
- Don't store it in plain text

### Key Management

- Generate separate keys for different purposes
- Use 4096-bit RSA for sensitive documents
- Set appropriate validity periods
- Back up your keys securely

### Document Handling

- Verify signatures before trusting documents
- Check the verification ID matches
- Report suspicious documents to IT

### Application Security

- Lock the application when away (Ctrl+L)
- Enable auto-lock in settings
- Keep the application updated
- Don't disable security features

---

## Troubleshooting

### Common Issues

**"Keystore is locked"**
- Enter your master password to unlock
- If forgotten, contact IT for recovery options

**"License invalid"**
- Check expiration date
- Verify you're on the correct machine
- Contact IT for reactivation

**"Signature failed"**
- Ensure PDF is not already digitally locked
- Check your certificate hasn't expired
- Verify keystore is unlocked

**"Document tampered"**
- The document was modified after signing
- Obtain the original signed version
- Report to the document sender

### Getting Help

- **Email**: support@securesign.pro
- **Documentation**: https://securesign.pro/docs
- **IT Support**: Contact your organization's IT helpdesk

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open File | Ctrl+O |
| Sign Document | Ctrl+S |
| Verify Document | Ctrl+V |
| Settings | Ctrl+, |
| Lock Application | Ctrl+L |
| Quit | Ctrl+Q |

---

## Glossary

- **Digital Signature**: Cryptographic proof of document authenticity
- **RSA**: Widely-used public-key cryptography algorithm
- **ECDSA**: Elliptic curve digital signature algorithm
- **SHA-256**: Secure hash algorithm producing 256-bit hash
- **Keystore**: Encrypted storage for cryptographic keys
- **Certificate**: Digital document binding identity to public key
- **Audit Log**: Tamper-evident record of all actions
- **Verification ID**: Unique identifier for each signature
