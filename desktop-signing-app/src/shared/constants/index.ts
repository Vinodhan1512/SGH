/**
 * SecureSign Pro - Application Constants
 *
 * Central configuration for cryptographic parameters,
 * application settings, and security constants.
 */

// ==================== Cryptographic Constants ====================

export const CRYPTO_CONFIG = {
  // RSA Configuration
  RSA: {
    MIN_KEY_SIZE: 2048,
    DEFAULT_KEY_SIZE: 2048,
    RECOMMENDED_KEY_SIZE: 4096,
    SUPPORTED_KEY_SIZES: [2048, 3072, 4096] as const,
    PADDING: 'RSA-PKCS1-SHA256',
  },

  // ECDSA Configuration
  ECDSA: {
    DEFAULT_CURVE: 'P-256',
    SUPPORTED_CURVES: ['P-256', 'P-384', 'P-521'] as const,
    CURVE_KEY_SIZES: {
      'P-256': 256,
      'P-384': 384,
      'P-521': 521,
    } as const,
  },

  // Hash Algorithms
  HASH: {
    DOCUMENT: 'SHA256',
    SIGNATURE: 'SHA256',
    AUDIT_CHAIN: 'SHA256',
    PASSWORD: 'SHA256',
    SUPPORTED: ['SHA256', 'SHA384', 'SHA512'] as const,
  },

  // Key Derivation
  KEY_DERIVATION: {
    ALGORITHM: 'PBKDF2',
    ITERATIONS: 310000,  // OWASP 2023 recommendation
    SALT_LENGTH: 32,  // 256 bits
    KEY_LENGTH: 32,  // 256 bits for AES-256
    DIGEST: 'SHA256',
  },

  // Encryption
  ENCRYPTION: {
    ALGORITHM: 'aes-256-gcm',
    KEY_LENGTH: 32,  // 256 bits
    IV_LENGTH: 12,  // 96 bits for GCM
    AUTH_TAG_LENGTH: 16,  // 128 bits
  },
} as const;

// ==================== Application Constants ====================

export const APP_CONFIG = {
  NAME: 'SecureSign Pro',
  VERSION: '1.0.0',
  COMPANY: 'SecureSign Technologies',
  WEBSITE: 'https://securesign.pro',
  SUPPORT_EMAIL: 'support@securesign.pro',

  // File extensions
  SUPPORTED_FORMATS: ['.pdf'] as const,
  SIGNED_SUFFIX: '_signed',
  BACKUP_EXTENSION: '.ssbackup',

  // Default paths (relative to app data)
  PATHS: {
    KEYSTORE: 'keystore',
    SIGNATURES: 'signatures',
    AUDIT: 'audit',
    BACKUPS: 'backups',
    TEMP: 'temp',
  },

  // Database
  DATABASE: {
    NAME: 'securesign.db',
    VERSION: 1,
  },
} as const;

// ==================== Security Constants ====================

export const SECURITY_CONFIG = {
  // PIN/Password requirements
  PIN: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 12,
    DEFAULT_MIN_LENGTH: 6,
  },

  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },

  // Lockout settings
  LOCKOUT: {
    MAX_ATTEMPTS: 5,
    DURATION_MINUTES: 15,
    PROGRESSIVE_MULTIPLIER: 2,
  },

  // Auto-lock settings
  AUTO_LOCK: {
    DEFAULT_TIMEOUT_MINUTES: 5,
    MIN_TIMEOUT_MINUTES: 1,
    MAX_TIMEOUT_MINUTES: 60,
  },

  // Session settings
  SESSION: {
    KEY_CACHE_TIMEOUT_MS: 300000,  // 5 minutes
    CLEAR_SENSITIVE_DATA_ON_LOCK: true,
  },
} as const;

// ==================== License Constants ====================

export const LICENSE_CONFIG = {
  // License types and features
  TYPES: {
    TRIAL: {
      name: 'Trial',
      durationDays: 30,
      maxSignatures: 50,
      features: {
        timestampService: false,
        batchSigning: false,
        cloudSync: false,
        customBranding: false,
        apiAccess: false,
        multiUser: false,
        prioritySupport: false,
      },
    },
    STANDARD: {
      name: 'Standard',
      durationDays: 365,
      maxSignatures: 500,
      features: {
        timestampService: true,
        batchSigning: false,
        cloudSync: false,
        customBranding: false,
        apiAccess: false,
        multiUser: false,
        prioritySupport: false,
      },
    },
    PROFESSIONAL: {
      name: 'Professional',
      durationDays: 365,
      maxSignatures: null,  // unlimited
      features: {
        timestampService: true,
        batchSigning: true,
        cloudSync: true,
        customBranding: false,
        apiAccess: false,
        multiUser: false,
        prioritySupport: true,
      },
    },
    ENTERPRISE: {
      name: 'Enterprise',
      durationDays: 365,
      maxSignatures: null,  // unlimited
      features: {
        timestampService: true,
        batchSigning: true,
        cloudSync: true,
        customBranding: true,
        apiAccess: true,
        multiUser: true,
        prioritySupport: true,
      },
    },
  },

  // License validation
  VALIDATION: {
    GRACE_PERIOD_DAYS: 7,
    OFFLINE_VALIDITY_DAYS: 30,
    CHECK_INTERVAL_HOURS: 24,
  },

  // License server (optional online validation)
  SERVER: {
    BASE_URL: 'https://license.securesign.pro/api/v1',
    TIMEOUT_MS: 10000,
  },
} as const;

// ==================== Signature Constants ====================

export const SIGNATURE_CONFIG = {
  // Visual signature defaults
  VISUAL: {
    DEFAULT_WIDTH: 200,
    DEFAULT_HEIGHT: 80,
    MIN_WIDTH: 100,
    MIN_HEIGHT: 40,
    MAX_WIDTH: 400,
    MAX_HEIGHT: 200,
    DEFAULT_FONT_SIZE: 10,
    DEFAULT_BACKGROUND_COLOR: '#FFFFFF',
    DEFAULT_BORDER_COLOR: '#000000',
    DEFAULT_TEXT_COLOR: '#000000',
  },

  // Timestamp Authority
  TSA: {
    DEFAULT_URL: 'http://timestamp.digicert.com',
    TIMEOUT_MS: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000,
  },

  // Verification
  VERIFICATION: {
    CHECK_CERTIFICATE_REVOCATION: true,
    ALLOW_EXPIRED_CERTIFICATES: false,
    ALLOW_SELF_SIGNED: true,
  },
} as const;

// ==================== Audit Constants ====================

export const AUDIT_CONFIG = {
  // Log retention
  RETENTION: {
    DEFAULT_DAYS: 365 * 5,  // 5 years
    MIN_DAYS: 90,
    MAX_DAYS: 365 * 10,  // 10 years
  },

  // Integrity check
  INTEGRITY: {
    CHECK_ON_START: true,
    CHECK_INTERVAL_HOURS: 24,
  },

  // Export
  EXPORT: {
    MAX_RECORDS_PER_FILE: 10000,
    SUPPORTED_FORMATS: ['json', 'csv', 'pdf'] as const,
  },
} as const;

// ==================== UI Constants ====================

export const UI_CONFIG = {
  // Supported languages
  LANGUAGES: [
    { code: 'en-US', name: 'English', direction: 'ltr' },
    { code: 'ar-SA', name: 'العربية', direction: 'rtl' },
  ] as const,

  // Themes
  THEMES: ['light', 'dark', 'system'] as const,

  // Date/time formats
  DATE_FORMATS: [
    'YYYY-MM-DD',
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'DD-MM-YYYY',
  ] as const,

  // PDF viewer
  PDF_VIEWER: {
    DEFAULT_ZOOM: 1.0,
    MIN_ZOOM: 0.25,
    MAX_ZOOM: 4.0,
    ZOOM_STEP: 0.25,
  },

  // Window
  WINDOW: {
    MIN_WIDTH: 1024,
    MIN_HEIGHT: 768,
    DEFAULT_WIDTH: 1280,
    DEFAULT_HEIGHT: 900,
  },
} as const;

// ==================== File Size Limits ====================

export const FILE_LIMITS = {
  MAX_PDF_SIZE_MB: 100,
  MAX_SIGNATURE_IMAGE_SIZE_KB: 500,
  MAX_BACKUP_SIZE_MB: 500,
} as const;

// ==================== Regular Expressions ====================

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  LICENSE_KEY: /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
  PIN: /^\d{4,12}$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const;
