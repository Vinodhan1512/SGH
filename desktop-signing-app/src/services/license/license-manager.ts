/**
 * SecureSign Pro - License Manager
 *
 * Handles software license validation and enforcement.
 * Supports offline validation with online activation.
 *
 * License Features:
 * - Machine-bound activation
 * - Expiry date validation
 * - Usage limits (signature count)
 * - Feature flags by tier
 * - Offline validation support
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  License,
  LicenseType,
  LicenseFeatures,
  LicenseValidationResult,
  LicenseActivationRequest,
  SecureSignError,
  ErrorCodes,
} from '../../shared/types';
import { LICENSE_CONFIG, CRYPTO_CONFIG } from '../../shared/constants';
import {
  encryptData,
  decryptData,
  verifySignature,
  hashData,
  EncryptionResult,
} from '../crypto/crypto-engine';
import { generateId, getCurrentTimestamp } from '../../shared/utils';

// ==================== License Public Key ====================

// This public key would be embedded in the application
// The private key is kept secure on the license server
const LICENSE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0M4qJcn8eM8T9l3Y+K9w
vHqjHzkLkFwXnj5yI5yN4vKyFcM1Kl0UuL8uj7YfmYQaYPJnCrTqBPbUhGxVfCn
zHvGqPUeIYJY5KrQ3sHMBdPmzhQvNxv8KhDk3q5mKQvGxCLB0Q7cKqDpYwXsLbK
S7eDxLbK0dXGvHF7JqpRMKTmJcBK3mDqQrL5YnNhBJp8vDcJNoBrPhZkGmD2KQZM
vCkLCPnLlCVn3qAUPx5nKQqQBwcHBfPL8PHxKcLqHqXCqsL5vPD8QKBQZQ7qKp6
Q8LpPqPcLpPkLpPkLpPkLpPkLpPkLpPkLpPkLpPkLpPkLpPkLpPkLpPkLpPkLpPk
LwIDAQAB
-----END PUBLIC KEY-----`;

// ==================== Interfaces ====================

interface StoredLicense {
  license: License;
  signature: string;
  activatedAt: string;
  lastValidated: string;
}

interface LicensePayload {
  licenseKey: string;
  licenseType: LicenseType;
  issuedTo: string;
  issuedEmail?: string;
  issuedOrganization?: string;
  machineId: string;
  activationDate: string;
  expiryDate?: string;
  maxSignatures?: number;
  features: LicenseFeatures;
}

// ==================== License Manager Class ====================

export class LicenseManager {
  private licensePath: string;
  private storedLicense: StoredLicense | null = null;
  private machineId: string;
  private encryptionKey: Buffer;
  private validationCache: LicenseValidationResult | null = null;
  private lastValidationTime: number = 0;

  constructor(appDataPath: string, machineId: string) {
    this.licensePath = path.join(appDataPath, 'license.enc');
    this.machineId = machineId;

    // Derive encryption key from machine ID
    this.encryptionKey = crypto.pbkdf2Sync(
      machineId,
      'SecureSignPro-License-Salt',
      100000,
      32,
      'sha256'
    );

    this.loadLicense();
  }

  // ==================== License Loading ====================

  /**
   * Load license from disk
   */
  private loadLicense(): void {
    if (!fs.existsSync(this.licensePath)) {
      this.storedLicense = null;
      return;
    }

    try {
      const encryptedData = fs.readFileSync(this.licensePath, 'utf8');
      const parsed = JSON.parse(encryptedData);

      const decrypted = decryptData(parsed.data as EncryptionResult, this.encryptionKey);
      this.storedLicense = JSON.parse(decrypted.toString('utf8'));

      // Verify machine binding
      if (this.storedLicense && this.storedLicense.license.machineId !== this.machineId) {
        this.storedLicense = null;
      }
    } catch {
      this.storedLicense = null;
    }
  }

  /**
   * Save license to disk
   */
  private saveLicense(): void {
    if (!this.storedLicense) return;

    const encrypted = encryptData(
      JSON.stringify(this.storedLicense),
      this.encryptionKey
    );

    const fileData = {
      version: 1,
      data: encrypted,
    };

    fs.writeFileSync(this.licensePath, JSON.stringify(fileData));
  }

  // ==================== License Activation ====================

  /**
   * Activate a license key
   */
  async activate(
    licenseKey: string,
    userName: string,
    userEmail?: string,
    organization?: string
  ): Promise<LicenseValidationResult> {
    // Validate license key format
    const normalizedKey = this.normalizeLicenseKey(licenseKey);
    if (!this.isValidKeyFormat(normalizedKey)) {
      return {
        isValid: false,
        errors: ['Invalid license key format'],
        warnings: [],
      };
    }

    // Decode license key
    const licenseData = this.decodeLicenseKey(normalizedKey);
    if (!licenseData) {
      return {
        isValid: false,
        errors: ['Unable to decode license key'],
        warnings: [],
      };
    }

    // In production, this would call the license server for online activation
    // For offline capability, we'll validate the embedded signature
    const isSignatureValid = this.verifyLicenseSignature(licenseData);
    if (!isSignatureValid) {
      return {
        isValid: false,
        errors: ['Invalid license signature'],
        warnings: [],
      };
    }

    // Create license record
    const license: License = {
      id: generateId(),
      licenseKey: normalizedKey,
      licenseType: licenseData.type,
      issuedTo: userName,
      issuedEmail: userEmail,
      issuedOrganization: organization,
      machineId: this.machineId,
      activationDate: new Date(),
      expiryDate: licenseData.expiryDate ? new Date(licenseData.expiryDate) : undefined,
      maxSignatures: licenseData.maxSignatures,
      signaturesUsed: 0,
      features: this.getFeaturesByType(licenseData.type),
      isActive: true,
    };

    // Create and sign the license payload
    const payload: LicensePayload = {
      licenseKey: license.licenseKey,
      licenseType: license.licenseType,
      issuedTo: license.issuedTo,
      issuedEmail: license.issuedEmail,
      issuedOrganization: license.issuedOrganization,
      machineId: license.machineId,
      activationDate: license.activationDate.toISOString(),
      expiryDate: license.expiryDate?.toISOString(),
      maxSignatures: license.maxSignatures,
      features: license.features,
    };

    const payloadHash = hashData(JSON.stringify(payload), 'SHA256').hash;

    // Store license
    this.storedLicense = {
      license,
      signature: payloadHash,  // In production, this would be a server signature
      activatedAt: getCurrentTimestamp(),
      lastValidated: getCurrentTimestamp(),
    };

    this.saveLicense();
    this.validationCache = null;

    return this.validate();
  }

  /**
   * Deactivate current license
   */
  async deactivate(): Promise<void> {
    if (fs.existsSync(this.licensePath)) {
      fs.unlinkSync(this.licensePath);
    }
    this.storedLicense = null;
    this.validationCache = null;
  }

  // ==================== License Validation ====================

  /**
   * Validate the current license
   */
  async validate(): Promise<LicenseValidationResult> {
    // Use cache if recent
    const cacheTimeout = 5 * 60 * 1000;  // 5 minutes
    if (
      this.validationCache &&
      Date.now() - this.lastValidationTime < cacheTimeout
    ) {
      return this.validationCache;
    }

    if (!this.storedLicense) {
      return {
        isValid: false,
        errors: ['No license installed'],
        warnings: [],
      };
    }

    const license = this.storedLicense.license;
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check machine binding
    if (license.machineId !== this.machineId) {
      errors.push('License is bound to a different machine');
    }

    // Check expiry
    if (license.expiryDate) {
      const now = new Date();
      if (license.expiryDate < now) {
        errors.push('License has expired');
      } else {
        const daysUntilExpiry = Math.ceil(
          (license.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilExpiry <= 30) {
          warnings.push(`License expires in ${daysUntilExpiry} days`);
        }
      }
    }

    // Check usage limits
    if (license.maxSignatures !== undefined && license.maxSignatures !== null) {
      if (license.signaturesUsed >= license.maxSignatures) {
        errors.push('Signature limit reached');
      } else {
        const remaining = license.maxSignatures - license.signaturesUsed;
        if (remaining <= 10) {
          warnings.push(`Only ${remaining} signatures remaining`);
        }
      }
    }

    // Check if active
    if (!license.isActive) {
      errors.push('License is not active');
    }

    // Calculate remaining values
    let remainingDays: number | undefined;
    if (license.expiryDate) {
      remainingDays = Math.max(
        0,
        Math.ceil((license.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      );
    }

    let remainingSignatures: number | undefined;
    if (license.maxSignatures !== undefined && license.maxSignatures !== null) {
      remainingSignatures = Math.max(0, license.maxSignatures - license.signaturesUsed);
    }

    const result: LicenseValidationResult = {
      isValid: errors.length === 0,
      license: errors.length === 0 ? license : undefined,
      remainingDays,
      remainingSignatures,
      errors,
      warnings,
    };

    // Update cache
    this.validationCache = result;
    this.lastValidationTime = Date.now();

    // Update last validated time
    if (this.storedLicense) {
      this.storedLicense.lastValidated = getCurrentTimestamp();
      this.saveLicense();
    }

    return result;
  }

  /**
   * Quick check if license is valid
   */
  isValid(): boolean {
    if (this.validationCache) {
      return this.validationCache.isValid;
    }
    return this.storedLicense !== null &&
           this.storedLicense.license.isActive &&
           this.storedLicense.license.machineId === this.machineId;
  }

  // ==================== Usage Tracking ====================

  /**
   * Increment signature usage count
   */
  async incrementUsage(): Promise<void> {
    if (!this.storedLicense) {
      throw new SecureSignError(
        ErrorCodes.LICENSE_INVALID,
        'No license installed'
      );
    }

    this.storedLicense.license.signaturesUsed++;
    this.validationCache = null;  // Invalidate cache
    this.saveLicense();
  }

  /**
   * Get current usage statistics
   */
  getUsageStats(): {
    signaturesUsed: number;
    maxSignatures?: number;
    remaining?: number;
    percentUsed?: number;
  } | null {
    if (!this.storedLicense) return null;

    const { signaturesUsed, maxSignatures } = this.storedLicense.license;

    return {
      signaturesUsed,
      maxSignatures: maxSignatures ?? undefined,
      remaining: maxSignatures !== undefined && maxSignatures !== null
        ? Math.max(0, maxSignatures - signaturesUsed)
        : undefined,
      percentUsed: maxSignatures !== undefined && maxSignatures !== null && maxSignatures > 0
        ? Math.round((signaturesUsed / maxSignatures) * 100)
        : undefined,
    };
  }

  // ==================== License Information ====================

  /**
   * Get current license details
   */
  getLicenseInfo(): License | null {
    return this.storedLicense?.license || null;
  }

  /**
   * Check if a feature is available
   */
  hasFeature(feature: keyof LicenseFeatures): boolean {
    if (!this.storedLicense) return false;
    return this.storedLicense.license.features[feature] === true;
  }

  /**
   * Get license type display name
   */
  getLicenseTypeName(): string {
    if (!this.storedLicense) return 'None';
    return LICENSE_CONFIG.TYPES[this.storedLicense.license.licenseType].name;
  }

  // ==================== Helper Methods ====================

  /**
   * Normalize license key format
   */
  private normalizeLicenseKey(key: string): string {
    return key.toUpperCase().replace(/[^A-Z0-9]/g, '').match(/.{1,4}/g)?.join('-') || key;
  }

  /**
   * Validate license key format
   */
  private isValidKeyFormat(key: string): boolean {
    const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return pattern.test(key);
  }

  /**
   * Decode license key to extract embedded data
   */
  private decodeLicenseKey(key: string): {
    type: LicenseType;
    expiryDate?: string;
    maxSignatures?: number;
  } | null {
    try {
      // Remove dashes and decode
      const cleanKey = key.replace(/-/g, '');

      // In a real implementation, this would decode encrypted/encoded data
      // For this example, we'll use a simple format:
      // First 2 chars = type (01=TRIAL, 02=STANDARD, 03=PROFESSIONAL, 04=ENTERPRISE)
      // Next 8 chars = expiry date (YYYYMMDD) or 00000000 for no expiry
      // Rest = checksum/signature

      const typeCode = cleanKey.substring(0, 2);
      const expiryCode = cleanKey.substring(2, 10);

      const typeMap: Record<string, LicenseType> = {
        '01': 'TRIAL',
        '02': 'STANDARD',
        '03': 'PROFESSIONAL',
        '04': 'ENTERPRISE',
      };

      const type = typeMap[typeCode] || 'TRIAL';
      const typeConfig = LICENSE_CONFIG.TYPES[type];

      let expiryDate: string | undefined;
      if (expiryCode !== '00000000') {
        const year = expiryCode.substring(0, 4);
        const month = expiryCode.substring(4, 6);
        const day = expiryCode.substring(6, 8);
        expiryDate = `${year}-${month}-${day}`;
      }

      return {
        type,
        expiryDate,
        maxSignatures: typeConfig.maxSignatures ?? undefined,
      };
    } catch {
      return null;
    }
  }

  /**
   * Verify license signature (simplified for offline validation)
   */
  private verifyLicenseSignature(_licenseData: {
    type: LicenseType;
    expiryDate?: string;
    maxSignatures?: number;
  }): boolean {
    // In production, this would verify against the embedded signature
    // using the LICENSE_PUBLIC_KEY
    // For now, we'll accept all properly formatted keys
    return true;
  }

  /**
   * Get features by license type
   */
  private getFeaturesByType(type: LicenseType): LicenseFeatures {
    return LICENSE_CONFIG.TYPES[type].features;
  }

  // ==================== Trial License ====================

  /**
   * Create a trial license
   */
  async activateTrial(userName: string, userEmail?: string): Promise<LicenseValidationResult> {
    // Generate a trial license key
    const trialKey = this.generateTrialKey();
    return this.activate(trialKey, userName, userEmail);
  }

  /**
   * Auto-activate demo trial on first launch
   * This is for demo/evaluation purposes - automatically grants 30-day trial
   */
  async autoActivateDemoTrial(): Promise<LicenseValidationResult> {
    // Check if license already exists
    if (this.storedLicense) {
      return this.validate();
    }

    // Generate demo trial key (30 days)
    const trialKey = this.generateTrialKey();

    // Auto-activate with demo user info
    const result = await this.activate(
      trialKey,
      'Demo User',
      'demo@securesign.pro',
      'SecureSign Demo'
    );

    return result;
  }

  /**
   * Check if this is a fresh install (no license)
   */
  isFreshInstall(): boolean {
    return this.storedLicense === null;
  }

  /**
   * Generate a trial license key
   */
  private generateTrialKey(): string {
    const now = new Date();
    const expiry = new Date(now.getTime() + LICENSE_CONFIG.TYPES.TRIAL.durationDays * 24 * 60 * 60 * 1000);
    const expiryStr = expiry.toISOString().slice(0, 10).replace(/-/g, '');

    // Format: 01 (trial) + expiry date + random chars
    const random = crypto.randomBytes(5).toString('hex').toUpperCase();
    const key = `01${expiryStr}${random}`;

    return key.match(/.{1,4}/g)?.join('-') || key;
  }
}

// ==================== Factory Function ====================

let licenseManagerInstance: LicenseManager | null = null;

export function getLicenseManager(appDataPath: string, machineId: string): LicenseManager {
  if (!licenseManagerInstance) {
    licenseManagerInstance = new LicenseManager(appDataPath, machineId);
  }
  return licenseManagerInstance;
}

export function createLicenseManager(appDataPath: string, machineId: string): LicenseManager {
  return new LicenseManager(appDataPath, machineId);
}
