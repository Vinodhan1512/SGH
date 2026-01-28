/**
 * SecureSign Pro - PIN/OTP Authentication Service
 *
 * Provides local authentication before signing operations.
 * Supports PIN-based and TOTP-based verification.
 */

import * as crypto from 'crypto';
import { authenticator } from 'otplib';
import {
  deriveKeyFromPassword,
  hashData,
  encryptData,
  decryptData,
  generateSecurePin,
} from '../crypto/crypto-engine';
import { SECURITY_CONFIG, CRYPTO_CONFIG } from '../../shared/constants';
import { SecureSignError, ErrorCodes } from '../../shared/types';

// ==================== Interfaces ====================

interface PinData {
  hash: string;
  salt: string;
  iterations: number;
  createdAt: string;
  lastChanged: string;
}

interface OtpData {
  secret: string;  // Encrypted
  backupCodes: string[];  // Hashed
  enabledAt: string;
}

interface AuthState {
  pin?: PinData;
  otp?: OtpData;
  failedAttempts: number;
  lockoutUntil?: string;
  lastSuccessfulAuth?: string;
}

// ==================== PIN Service Class ====================

export class PinService {
  private state: AuthState;
  private encryptionKey: Buffer;
  private onStateChange?: (state: AuthState) => void;

  constructor(
    encryptionKey: Buffer,
    initialState?: AuthState,
    onStateChange?: (state: AuthState) => void
  ) {
    this.encryptionKey = encryptionKey;
    this.onStateChange = onStateChange;
    this.state = initialState || {
      failedAttempts: 0,
    };
  }

  // ==================== PIN Management ====================

  /**
   * Set up a new PIN
   */
  async setupPin(pin: string): Promise<void> {
    this.validatePinFormat(pin);

    const salt = crypto.randomBytes(CRYPTO_CONFIG.KEY_DERIVATION.SALT_LENGTH).toString('base64');
    const derived = await deriveKeyFromPassword(pin, salt);

    this.state.pin = {
      hash: derived.key.toString('base64'),
      salt,
      iterations: derived.iterations,
      createdAt: new Date().toISOString(),
      lastChanged: new Date().toISOString(),
    };

    this.state.failedAttempts = 0;
    this.state.lockoutUntil = undefined;

    this.saveState();
  }

  /**
   * Verify PIN
   */
  async verifyPin(pin: string): Promise<boolean> {
    if (!this.state.pin) {
      throw new SecureSignError(
        ErrorCodes.AUTH_PIN_INVALID,
        'PIN not set up'
      );
    }

    // Check lockout
    if (this.isLockedOut()) {
      const remainingTime = this.getRemainingLockoutTime();
      throw new SecureSignError(
        ErrorCodes.AUTH_PIN_LOCKED,
        `Account locked. Try again in ${remainingTime} seconds`
      );
    }

    // Verify PIN
    const derived = await deriveKeyFromPassword(pin, this.state.pin.salt);
    const computedHash = derived.key.toString('base64');

    // Constant-time comparison
    const isValid = crypto.timingSafeEqual(
      Buffer.from(computedHash),
      Buffer.from(this.state.pin.hash)
    );

    if (isValid) {
      this.state.failedAttempts = 0;
      this.state.lockoutUntil = undefined;
      this.state.lastSuccessfulAuth = new Date().toISOString();
      this.saveState();
      return true;
    } else {
      this.handleFailedAttempt();
      return false;
    }
  }

  /**
   * Change PIN
   */
  async changePin(currentPin: string, newPin: string): Promise<void> {
    // Verify current PIN
    const isValid = await this.verifyPin(currentPin);
    if (!isValid) {
      throw new SecureSignError(
        ErrorCodes.AUTH_PIN_INVALID,
        'Current PIN is incorrect'
      );
    }

    // Set new PIN
    await this.setupPin(newPin);
  }

  /**
   * Check if PIN is set up
   */
  isPinSetup(): boolean {
    return this.state.pin !== undefined;
  }

  /**
   * Remove PIN (requires current PIN verification)
   */
  async removePin(currentPin: string): Promise<void> {
    const isValid = await this.verifyPin(currentPin);
    if (!isValid) {
      throw new SecureSignError(
        ErrorCodes.AUTH_PIN_INVALID,
        'PIN is incorrect'
      );
    }

    this.state.pin = undefined;
    this.saveState();
  }

  // ==================== OTP Management ====================

  /**
   * Set up TOTP
   */
  async setupOtp(): Promise<{
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
  }> {
    // Generate secret
    const secret = authenticator.generateSecret();

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(10);
    const hashedBackupCodes = backupCodes.map(code =>
      hashData(code, 'SHA256').hash
    );

    // Encrypt the secret
    const encryptedSecret = encryptData(secret, this.encryptionKey);

    // Store OTP data
    this.state.otp = {
      secret: JSON.stringify(encryptedSecret),
      backupCodes: hashedBackupCodes,
      enabledAt: new Date().toISOString(),
    };

    this.saveState();

    // Generate QR code URL
    const otpauth = authenticator.keyuri(
      'user',
      'SecureSign Pro',
      secret
    );

    return {
      secret,
      qrCodeUrl: otpauth,
      backupCodes,
    };
  }

  /**
   * Verify OTP token
   */
  async verifyOtp(token: string): Promise<boolean> {
    if (!this.state.otp) {
      throw new SecureSignError(
        ErrorCodes.AUTH_OTP_INVALID,
        'OTP not set up'
      );
    }

    // Check lockout
    if (this.isLockedOut()) {
      const remainingTime = this.getRemainingLockoutTime();
      throw new SecureSignError(
        ErrorCodes.AUTH_PIN_LOCKED,
        `Account locked. Try again in ${remainingTime} seconds`
      );
    }

    // Check if it's a backup code
    const tokenHash = hashData(token, 'SHA256').hash;
    const backupCodeIndex = this.state.otp.backupCodes.indexOf(tokenHash);
    if (backupCodeIndex !== -1) {
      // Remove used backup code
      this.state.otp.backupCodes.splice(backupCodeIndex, 1);
      this.state.failedAttempts = 0;
      this.state.lastSuccessfulAuth = new Date().toISOString();
      this.saveState();
      return true;
    }

    // Decrypt secret and verify token
    try {
      const encryptedSecret = JSON.parse(this.state.otp.secret);
      const secret = decryptData(encryptedSecret, this.encryptionKey).toString('utf8');

      const isValid = authenticator.verify({
        token,
        secret,
      });

      if (isValid) {
        this.state.failedAttempts = 0;
        this.state.lastSuccessfulAuth = new Date().toISOString();
        this.saveState();
        return true;
      } else {
        this.handleFailedAttempt();
        return false;
      }
    } catch {
      this.handleFailedAttempt();
      return false;
    }
  }

  /**
   * Check if OTP is set up
   */
  isOtpSetup(): boolean {
    return this.state.otp !== undefined;
  }

  /**
   * Disable OTP
   */
  async disableOtp(pin: string): Promise<void> {
    if (!this.isPinSetup()) {
      throw new SecureSignError(
        ErrorCodes.AUTH_PIN_INVALID,
        'PIN required to disable OTP'
      );
    }

    const isPinValid = await this.verifyPin(pin);
    if (!isPinValid) {
      throw new SecureSignError(
        ErrorCodes.AUTH_PIN_INVALID,
        'PIN is incorrect'
      );
    }

    this.state.otp = undefined;
    this.saveState();
  }

  /**
   * Get remaining backup codes count
   */
  getRemainingBackupCodes(): number {
    return this.state.otp?.backupCodes.length || 0;
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(pin: string): Promise<string[]> {
    if (!this.state.otp) {
      throw new SecureSignError(
        ErrorCodes.AUTH_OTP_INVALID,
        'OTP not set up'
      );
    }

    const isPinValid = await this.verifyPin(pin);
    if (!isPinValid) {
      throw new SecureSignError(
        ErrorCodes.AUTH_PIN_INVALID,
        'PIN is incorrect'
      );
    }

    const backupCodes = this.generateBackupCodes(10);
    this.state.otp.backupCodes = backupCodes.map(code =>
      hashData(code, 'SHA256').hash
    );

    this.saveState();

    return backupCodes;
  }

  // ==================== Lockout Management ====================

  /**
   * Check if account is locked out
   */
  isLockedOut(): boolean {
    if (!this.state.lockoutUntil) {
      return false;
    }
    return new Date() < new Date(this.state.lockoutUntil);
  }

  /**
   * Get remaining lockout time in seconds
   */
  getRemainingLockoutTime(): number {
    if (!this.state.lockoutUntil) {
      return 0;
    }
    const remaining = new Date(this.state.lockoutUntil).getTime() - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  /**
   * Get number of failed attempts
   */
  getFailedAttempts(): number {
    return this.state.failedAttempts;
  }

  /**
   * Reset lockout (admin function)
   */
  resetLockout(): void {
    this.state.failedAttempts = 0;
    this.state.lockoutUntil = undefined;
    this.saveState();
  }

  // ==================== Helper Methods ====================

  /**
   * Validate PIN format
   */
  private validatePinFormat(pin: string): void {
    if (pin.length < SECURITY_CONFIG.PIN.MIN_LENGTH) {
      throw new SecureSignError(
        ErrorCodes.INVALID_INPUT,
        `PIN must be at least ${SECURITY_CONFIG.PIN.MIN_LENGTH} characters`
      );
    }

    if (pin.length > SECURITY_CONFIG.PIN.MAX_LENGTH) {
      throw new SecureSignError(
        ErrorCodes.INVALID_INPUT,
        `PIN cannot exceed ${SECURITY_CONFIG.PIN.MAX_LENGTH} characters`
      );
    }

    // Check for sequential or repeated digits
    if (/(.)\1{3,}/.test(pin)) {
      throw new SecureSignError(
        ErrorCodes.INVALID_INPUT,
        'PIN cannot contain more than 3 repeated characters'
      );
    }

    // Check for common patterns
    const commonPatterns = ['1234', '4321', '0000', '1111', '2222'];
    for (const pattern of commonPatterns) {
      if (pin.includes(pattern)) {
        throw new SecureSignError(
          ErrorCodes.INVALID_INPUT,
          'PIN cannot contain common patterns'
        );
      }
    }
  }

  /**
   * Handle failed authentication attempt
   */
  private handleFailedAttempt(): void {
    this.state.failedAttempts++;

    if (this.state.failedAttempts >= SECURITY_CONFIG.LOCKOUT.MAX_ATTEMPTS) {
      // Calculate lockout duration with progressive increase
      const baseMinutes = SECURITY_CONFIG.LOCKOUT.DURATION_MINUTES;
      const multiplier = Math.pow(
        SECURITY_CONFIG.LOCKOUT.PROGRESSIVE_MULTIPLIER,
        Math.floor(this.state.failedAttempts / SECURITY_CONFIG.LOCKOUT.MAX_ATTEMPTS) - 1
      );
      const lockoutMinutes = Math.min(baseMinutes * multiplier, 60);  // Max 60 minutes

      const lockoutUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
      this.state.lockoutUntil = lockoutUntil.toISOString();
    }

    this.saveState();
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
  }

  /**
   * Save state (calls callback if provided)
   */
  private saveState(): void {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }

  /**
   * Get current state for persistence
   */
  getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Update state (for loading from persistence)
   */
  setState(state: AuthState): void {
    this.state = state;
  }
}

// ==================== Factory Function ====================

export function createPinService(
  encryptionKey: Buffer,
  initialState?: AuthState,
  onStateChange?: (state: AuthState) => void
): PinService {
  return new PinService(encryptionKey, initialState, onStateChange);
}
