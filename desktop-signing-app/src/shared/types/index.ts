/**
 * SecureSign Pro - Core Type Definitions
 *
 * This file contains all shared TypeScript interfaces and types
 * used throughout the application.
 */

// ==================== Signature Types ====================

export interface SignatureRequest {
  documentPath: string;
  signerInfo: SignerInfo;
  signatureImage?: string;  // Base64 encoded image or file path
  signaturePosition: SignaturePosition;
  reason: string;
  location?: string;
  pinOrOtp?: string;
  useTimestamp?: boolean;
  certificateId: string;
}

export interface SignerInfo {
  name: string;
  email?: string;
  id?: string;
  organization?: string;
  title?: string;
}

export interface SignaturePosition {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SignatureResult {
  success: boolean;
  verificationId: string;
  signedDocumentPath: string;
  timestamp: string;
  signatureDetails: SignatureDetails;
  auditLogId: string;
  error?: string;
}

export interface SignatureDetails {
  signerName: string;
  signerEmail?: string;
  signerId?: string;
  signerOrganization?: string;
  reason: string;
  location?: string;
  timestamp: string;
  timezone: string;
  verificationId: string;
  algorithm: SignatureAlgorithm;
  certificateFingerprint: string;
  isTimestamped: boolean;
  timestampToken?: string;
}

export type SignatureAlgorithm = 'RSA-SHA256' | 'RSA-SHA384' | 'RSA-SHA512' | 'ECDSA-SHA256' | 'ECDSA-SHA384';

export interface VisibleSignatureOptions {
  showSignerName: boolean;
  showEmail: boolean;
  showDate: boolean;
  showReason: boolean;
  showVerificationId: boolean;
  showImage: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
}

// ==================== Certificate/Key Types ====================

export interface Certificate {
  id: string;
  alias: string;
  subjectName: string;
  subjectEmail?: string;
  subjectOrganization?: string;
  issuer?: string;
  serialNumber?: string;
  validFrom: Date;
  validTo: Date;
  publicKey: string;  // PEM encoded
  keyType: KeyType;
  keySize: number;
  fingerprintSha256: string;
  fingerprintSha1?: string;
  isDefault: boolean;
  createdAt: Date;
}

export type KeyType = 'RSA' | 'ECDSA';

export interface KeyPairInfo {
  id: string;
  alias: string;
  keyType: KeyType;
  keySize: number;
  publicKey: string;
  createdAt: Date;
  certificate?: Certificate;
}

export interface KeyGenerationOptions {
  alias: string;
  keyType: KeyType;
  keySize: number;  // RSA: 2048, 3072, 4096; ECDSA: 256, 384, 521
  subjectName: string;
  subjectEmail?: string;
  subjectOrganization?: string;
  validityDays: number;
  password: string;
}

export interface KeystoreConfig {
  masterPasswordHash: string;
  salt: string;
  iterations: number;
  algorithm: string;
  createdAt: string;
  version: number;
}

// ==================== Audit Types ====================

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  userId?: string;
  userName?: string;
  documentHash?: string;
  documentName?: string;
  actionDetails: Record<string, unknown>;
  ipAddress?: string;
  machineId: string;
  previousHash?: string;
  entryHash: string;
  signature: string;
}

export type AuditEventType =
  | 'APPLICATION_STARTED'
  | 'APPLICATION_CLOSED'
  | 'DOCUMENT_OPENED'
  | 'DOCUMENT_SIGNED'
  | 'DOCUMENT_VERIFIED'
  | 'SIGNATURE_VERIFIED'
  | 'SIGNATURE_FAILED'
  | 'KEY_GENERATED'
  | 'KEY_IMPORTED'
  | 'KEY_EXPORTED'
  | 'KEY_DELETED'
  | 'CERTIFICATE_IMPORTED'
  | 'LICENSE_ACTIVATED'
  | 'LICENSE_VALIDATED'
  | 'LICENSE_EXPIRED'
  | 'LICENSE_INVALID'
  | 'PIN_CHANGED'
  | 'PIN_VERIFIED'
  | 'PIN_FAILED'
  | 'OTP_VERIFIED'
  | 'OTP_FAILED'
  | 'SETTINGS_CHANGED'
  | 'KEYSTORE_UNLOCKED'
  | 'KEYSTORE_LOCKED'
  | 'BACKUP_CREATED'
  | 'BACKUP_RESTORED';

export interface AuditExportOptions {
  format: 'json' | 'csv' | 'pdf';
  fromDate?: Date;
  toDate?: Date;
  eventTypes?: AuditEventType[];
  includeSignatures?: boolean;
}

// ==================== License Types ====================

export interface License {
  id: string;
  licenseKey: string;
  licenseType: LicenseType;
  issuedTo: string;
  issuedEmail?: string;
  issuedOrganization?: string;
  machineId: string;
  activationDate: Date;
  expiryDate?: Date;
  maxSignatures?: number;
  signaturesUsed: number;
  features: LicenseFeatures;
  isActive: boolean;
}

export type LicenseType = 'TRIAL' | 'STANDARD' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface LicenseFeatures {
  timestampService: boolean;
  batchSigning: boolean;
  cloudSync: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  multiUser: boolean;
  prioritySupport: boolean;
}

export interface LicenseValidationResult {
  isValid: boolean;
  license?: License;
  remainingDays?: number;
  remainingSignatures?: number;
  errors: string[];
  warnings: string[];
}

export interface LicenseActivationRequest {
  licenseKey: string;
  machineId: string;
  userName: string;
  userEmail?: string;
  organization?: string;
}

// ==================== Verification Types ====================

export interface VerificationResult {
  isValid: boolean;
  documentIntact: boolean;
  signatureValid: boolean;
  certificateValid: boolean;
  timestampValid?: boolean;
  signatureDetails?: SignatureDetails;
  certificateInfo?: CertificateInfo;
  tamperDetected: boolean;
  verificationDate: string;
  errors: string[];
  warnings: string[];
}

export interface CertificateInfo {
  subjectName: string;
  issuer: string;
  serialNumber: string;
  validFrom: Date;
  validTo: Date;
  isExpired: boolean;
  isSelfSigned: boolean;
  keyType: KeyType;
  keySize: number;
  fingerprint: string;
}

// ==================== Document Types ====================

export interface DocumentInfo {
  id: string;
  fileName: string;
  filePath: string;
  fileHash: string;
  fileSize: number;
  pageCount: number;
  isSigned: boolean;
  signatureCount: number;
  signatures?: DocumentSignature[];
  metadata?: DocumentMetadata;
  firstOpened: Date;
  lastAccessed: Date;
}

export interface DocumentSignature {
  signatureIndex: number;
  signerName: string;
  signedAt: string;
  reason?: string;
  verificationId: string;
  isValid?: boolean;
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

// ==================== Application Settings ====================

export interface AppSettings {
  general: GeneralSettings;
  signing: SigningSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
  backup: BackupSettings;
}

export interface GeneralSettings {
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  timezone: string;
  defaultSavePath: string;
  autoOpenSigned: boolean;
}

export interface SigningSettings {
  defaultAlgorithm: SignatureAlgorithm;
  defaultCertificateId?: string;
  requirePin: boolean;
  requireOtp: boolean;
  useTimestamp: boolean;
  timestampServerUrl?: string;
  defaultSignatureReason: string;
  defaultSignatureLocation: string;
  visibleSignature: VisibleSignatureOptions;
}

export interface SecuritySettings {
  autoLockTimeout: number;  // minutes, 0 = disabled
  requirePasswordOnStart: boolean;
  minimumPinLength: number;
  maxLoginAttempts: number;
  lockoutDuration: number;  // minutes
  clearClipboardOnLock: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  direction: 'ltr' | 'rtl' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
}

export interface BackupSettings {
  autoBackup: boolean;
  backupInterval: number;  // days
  backupPath: string;
  maxBackups: number;
  includeAuditLogs: boolean;
  encryptBackups: boolean;
}

// ==================== IPC Communication Types ====================

export interface IpcRequest<T = unknown> {
  channel: string;
  data: T;
  requestId: string;
}

export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: IpcError;
  requestId: string;
}

export interface IpcError {
  code: string;
  message: string;
  details?: unknown;
}

// IPC Channel definitions
export const IPC_CHANNELS = {
  // Document operations
  DOCUMENT_OPEN: 'document:open',
  DOCUMENT_SAVE: 'document:save',
  DOCUMENT_SIGN: 'document:sign',
  DOCUMENT_VERIFY: 'document:verify',
  DOCUMENT_GET_INFO: 'document:get-info',

  // Certificate operations
  CERTIFICATE_LIST: 'certificate:list',
  CERTIFICATE_GENERATE: 'certificate:generate',
  CERTIFICATE_IMPORT: 'certificate:import',
  CERTIFICATE_EXPORT: 'certificate:export',
  CERTIFICATE_DELETE: 'certificate:delete',
  CERTIFICATE_SET_DEFAULT: 'certificate:set-default',

  // Keystore operations
  KEYSTORE_UNLOCK: 'keystore:unlock',
  KEYSTORE_LOCK: 'keystore:lock',
  KEYSTORE_STATUS: 'keystore:status',
  KEYSTORE_CHANGE_PASSWORD: 'keystore:change-password',

  // License operations
  LICENSE_ACTIVATE: 'license:activate',
  LICENSE_VALIDATE: 'license:validate',
  LICENSE_DEACTIVATE: 'license:deactivate',
  LICENSE_GET_INFO: 'license:get-info',

  // Audit operations
  AUDIT_GET_LOGS: 'audit:get-logs',
  AUDIT_EXPORT: 'audit:export',
  AUDIT_VERIFY_INTEGRITY: 'audit:verify-integrity',

  // Settings operations
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  SETTINGS_RESET: 'settings:reset',

  // Auth operations
  AUTH_SET_PIN: 'auth:set-pin',
  AUTH_VERIFY_PIN: 'auth:verify-pin',
  AUTH_SETUP_OTP: 'auth:setup-otp',
  AUTH_VERIFY_OTP: 'auth:verify-otp',

  // System operations
  SYSTEM_GET_MACHINE_ID: 'system:get-machine-id',
  SYSTEM_OPEN_FILE_DIALOG: 'system:open-file-dialog',
  SYSTEM_SAVE_FILE_DIALOG: 'system:save-file-dialog',
  SYSTEM_GET_APP_VERSION: 'system:get-app-version',
} as const;

// ==================== Error Types ====================

export class SecureSignError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SecureSignError';
  }
}

export const ErrorCodes = {
  // General errors
  UNKNOWN_ERROR: 'E0001',
  INVALID_INPUT: 'E0002',
  OPERATION_CANCELLED: 'E0003',

  // Document errors
  DOCUMENT_NOT_FOUND: 'E1001',
  DOCUMENT_READ_ERROR: 'E1002',
  DOCUMENT_WRITE_ERROR: 'E1003',
  DOCUMENT_INVALID_FORMAT: 'E1004',
  DOCUMENT_ALREADY_SIGNED: 'E1005',

  // Signature errors
  SIGNATURE_FAILED: 'E2001',
  SIGNATURE_INVALID: 'E2002',
  SIGNATURE_EXPIRED: 'E2003',
  SIGNATURE_TAMPERED: 'E2004',

  // Certificate errors
  CERTIFICATE_NOT_FOUND: 'E3001',
  CERTIFICATE_EXPIRED: 'E3002',
  CERTIFICATE_INVALID: 'E3003',
  CERTIFICATE_GENERATION_FAILED: 'E3004',

  // Keystore errors
  KEYSTORE_LOCKED: 'E4001',
  KEYSTORE_WRONG_PASSWORD: 'E4002',
  KEYSTORE_CORRUPTED: 'E4003',
  KEYSTORE_KEY_NOT_FOUND: 'E4004',

  // License errors
  LICENSE_INVALID: 'E5001',
  LICENSE_EXPIRED: 'E5002',
  LICENSE_MACHINE_MISMATCH: 'E5003',
  LICENSE_USAGE_EXCEEDED: 'E5004',
  LICENSE_ACTIVATION_FAILED: 'E5005',

  // Auth errors
  AUTH_PIN_INVALID: 'E6001',
  AUTH_PIN_LOCKED: 'E6002',
  AUTH_OTP_INVALID: 'E6003',
  AUTH_OTP_EXPIRED: 'E6004',

  // Crypto errors
  CRYPTO_OPERATION_FAILED: 'E7001',
  CRYPTO_KEY_DERIVATION_FAILED: 'E7002',
  CRYPTO_ENCRYPTION_FAILED: 'E7003',
  CRYPTO_DECRYPTION_FAILED: 'E7004',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
