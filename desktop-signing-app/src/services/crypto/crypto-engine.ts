/**
 * SecureSign Pro - Cryptographic Engine
 *
 * Core cryptographic operations using Node.js crypto module.
 * Implements RSA and ECDSA signing, SHA-256/384/512 hashing,
 * and AES-256-GCM encryption.
 *
 * SECURITY NOTE: This module handles sensitive cryptographic operations.
 * All private keys must be handled securely and cleared from memory after use.
 */

import * as crypto from 'crypto';
import { CRYPTO_CONFIG } from '../../shared/constants';
import { KeyType, SignatureAlgorithm, SecureSignError, ErrorCodes } from '../../shared/types';

// ==================== Interfaces ====================

export interface HashResult {
  hash: string;
  algorithm: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyType: KeyType;
  keySize: number;
}

export interface EncryptionResult {
  ciphertext: string;
  iv: string;
  authTag: string;
  algorithm: string;
}

export interface SignResult {
  signature: string;
  algorithm: SignatureAlgorithm;
}

export interface DerivedKey {
  key: Buffer;
  salt: string;
  iterations: number;
}

// ==================== Hashing Functions ====================

/**
 * Hash data using specified algorithm
 */
export function hashData(
  data: Buffer | string,
  algorithm: 'SHA256' | 'SHA384' | 'SHA512' = 'SHA256'
): HashResult {
  const hash = crypto.createHash(algorithm.toLowerCase());
  hash.update(data);
  return {
    hash: hash.digest('hex'),
    algorithm,
  };
}

/**
 * Hash a file and return SHA-256 digest
 */
export async function hashFile(fileBuffer: Buffer): Promise<string> {
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
}

/**
 * Create HMAC for data integrity
 */
export function createHmac(
  data: string | Buffer,
  key: string | Buffer,
  algorithm: string = 'sha256'
): string {
  const hmac = crypto.createHmac(algorithm, key);
  hmac.update(data);
  return hmac.digest('hex');
}

// ==================== Key Generation ====================

/**
 * Generate RSA key pair
 */
export async function generateRsaKeyPair(keySize: number = 2048): Promise<KeyPair> {
  const validKeySizes = CRYPTO_CONFIG.RSA.SUPPORTED_KEY_SIZES as readonly number[];
  if (!validKeySizes.includes(keySize)) {
    throw new SecureSignError(
      ErrorCodes.INVALID_INPUT,
      `Invalid RSA key size. Supported: ${validKeySizes.join(', ')}`
    );
  }

  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'rsa',
      {
        modulusLength: keySize,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(new SecureSignError(
            ErrorCodes.CRYPTO_OPERATION_FAILED,
            `RSA key generation failed: ${err.message}`
          ));
          return;
        }
        resolve({
          publicKey,
          privateKey,
          keyType: 'RSA',
          keySize,
        });
      }
    );
  });
}

/**
 * Generate ECDSA key pair
 */
export async function generateEcdsaKeyPair(
  curve: 'P-256' | 'P-384' | 'P-521' = 'P-256'
): Promise<KeyPair> {
  const curveNames: Record<string, crypto.ECKeyPairOptions<'pem', 'pem'>['namedCurve']> = {
    'P-256': 'prime256v1',
    'P-384': 'secp384r1',
    'P-521': 'secp521r1',
  };

  const namedCurve = curveNames[curve];
  if (!namedCurve) {
    throw new SecureSignError(
      ErrorCodes.INVALID_INPUT,
      `Invalid ECDSA curve. Supported: ${Object.keys(curveNames).join(', ')}`
    );
  }

  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'ec',
      {
        namedCurve,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(new SecureSignError(
            ErrorCodes.CRYPTO_OPERATION_FAILED,
            `ECDSA key generation failed: ${err.message}`
          ));
          return;
        }
        resolve({
          publicKey,
          privateKey,
          keyType: 'ECDSA',
          keySize: CRYPTO_CONFIG.ECDSA.CURVE_KEY_SIZES[curve],
        });
      }
    );
  });
}

/**
 * Generate key pair based on type
 */
export async function generateKeyPair(
  keyType: KeyType,
  keySize?: number
): Promise<KeyPair> {
  if (keyType === 'RSA') {
    return generateRsaKeyPair(keySize || CRYPTO_CONFIG.RSA.DEFAULT_KEY_SIZE);
  } else {
    const curve = keySize === 384 ? 'P-384' : keySize === 521 ? 'P-521' : 'P-256';
    return generateEcdsaKeyPair(curve);
  }
}

// ==================== Digital Signing ====================

/**
 * Sign data using private key
 */
export function signData(
  data: Buffer | string,
  privateKey: string,
  algorithm: SignatureAlgorithm = 'RSA-SHA256'
): SignResult {
  try {
    const hashAlgorithm = algorithm.includes('SHA384') ? 'sha384' :
                          algorithm.includes('SHA512') ? 'sha512' : 'sha256';

    const signer = crypto.createSign(hashAlgorithm);
    signer.update(data);
    signer.end();

    const signature = signer.sign(privateKey, 'base64');

    return {
      signature,
      algorithm,
    };
  } catch (error) {
    throw new SecureSignError(
      ErrorCodes.CRYPTO_OPERATION_FAILED,
      `Signing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Verify signature using public key
 */
export function verifySignature(
  data: Buffer | string,
  signature: string,
  publicKey: string,
  algorithm: SignatureAlgorithm = 'RSA-SHA256'
): boolean {
  try {
    const hashAlgorithm = algorithm.includes('SHA384') ? 'sha384' :
                          algorithm.includes('SHA512') ? 'sha512' : 'sha256';

    const verifier = crypto.createVerify(hashAlgorithm);
    verifier.update(data);
    verifier.end();

    return verifier.verify(publicKey, signature, 'base64');
  } catch (error) {
    throw new SecureSignError(
      ErrorCodes.CRYPTO_OPERATION_FAILED,
      `Signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Create a document signature with metadata
 */
export function createDocumentSignature(
  documentHash: string,
  privateKey: string,
  metadata: {
    signerName: string;
    signerEmail?: string;
    reason: string;
    timestamp: string;
    verificationId: string;
  },
  algorithm: SignatureAlgorithm = 'RSA-SHA256'
): SignResult {
  // Create signed attributes (data to be signed)
  const signedAttributes = JSON.stringify({
    documentHash,
    signerName: metadata.signerName,
    signerEmail: metadata.signerEmail,
    reason: metadata.reason,
    timestamp: metadata.timestamp,
    verificationId: metadata.verificationId,
    algorithm,
  });

  return signData(signedAttributes, privateKey, algorithm);
}

/**
 * Verify a document signature with metadata
 */
export function verifyDocumentSignature(
  documentHash: string,
  signature: string,
  publicKey: string,
  metadata: {
    signerName: string;
    signerEmail?: string;
    reason: string;
    timestamp: string;
    verificationId: string;
  },
  algorithm: SignatureAlgorithm = 'RSA-SHA256'
): boolean {
  const signedAttributes = JSON.stringify({
    documentHash,
    signerName: metadata.signerName,
    signerEmail: metadata.signerEmail,
    reason: metadata.reason,
    timestamp: metadata.timestamp,
    verificationId: metadata.verificationId,
    algorithm,
  });

  return verifySignature(signedAttributes, signature, publicKey, algorithm);
}

// ==================== Encryption/Decryption ====================

/**
 * Encrypt data using AES-256-GCM
 */
export function encryptData(
  plaintext: string | Buffer,
  key: Buffer
): EncryptionResult {
  if (key.length !== CRYPTO_CONFIG.ENCRYPTION.KEY_LENGTH) {
    throw new SecureSignError(
      ErrorCodes.CRYPTO_ENCRYPTION_FAILED,
      `Invalid key length. Expected ${CRYPTO_CONFIG.ENCRYPTION.KEY_LENGTH} bytes.`
    );
  }

  const iv = crypto.randomBytes(CRYPTO_CONFIG.ENCRYPTION.IV_LENGTH);
  const cipher = crypto.createCipheriv(
    CRYPTO_CONFIG.ENCRYPTION.ALGORITHM,
    key,
    iv,
    { authTagLength: CRYPTO_CONFIG.ENCRYPTION.AUTH_TAG_LENGTH }
  );

  const data = typeof plaintext === 'string' ? Buffer.from(plaintext, 'utf8') : plaintext;
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    algorithm: CRYPTO_CONFIG.ENCRYPTION.ALGORITHM,
  };
}

/**
 * Decrypt data using AES-256-GCM
 */
export function decryptData(
  encryptedData: EncryptionResult,
  key: Buffer
): Buffer {
  if (key.length !== CRYPTO_CONFIG.ENCRYPTION.KEY_LENGTH) {
    throw new SecureSignError(
      ErrorCodes.CRYPTO_DECRYPTION_FAILED,
      `Invalid key length. Expected ${CRYPTO_CONFIG.ENCRYPTION.KEY_LENGTH} bytes.`
    );
  }

  try {
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const authTag = Buffer.from(encryptedData.authTag, 'base64');
    const ciphertext = Buffer.from(encryptedData.ciphertext, 'base64');

    const decipher = crypto.createDecipheriv(
      CRYPTO_CONFIG.ENCRYPTION.ALGORITHM,
      key,
      iv,
      { authTagLength: CRYPTO_CONFIG.ENCRYPTION.AUTH_TAG_LENGTH }
    );
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  } catch (error) {
    throw new SecureSignError(
      ErrorCodes.CRYPTO_DECRYPTION_FAILED,
      'Decryption failed. Invalid key or corrupted data.'
    );
  }
}

// ==================== Key Derivation ====================

/**
 * Derive encryption key from password using PBKDF2
 */
export async function deriveKeyFromPassword(
  password: string,
  salt?: string
): Promise<DerivedKey> {
  const saltBuffer = salt
    ? Buffer.from(salt, 'base64')
    : crypto.randomBytes(CRYPTO_CONFIG.KEY_DERIVATION.SALT_LENGTH);

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      saltBuffer,
      CRYPTO_CONFIG.KEY_DERIVATION.ITERATIONS,
      CRYPTO_CONFIG.KEY_DERIVATION.KEY_LENGTH,
      CRYPTO_CONFIG.KEY_DERIVATION.DIGEST,
      (err, derivedKey) => {
        if (err) {
          reject(new SecureSignError(
            ErrorCodes.CRYPTO_KEY_DERIVATION_FAILED,
            `Key derivation failed: ${err.message}`
          ));
          return;
        }
        resolve({
          key: derivedKey,
          salt: saltBuffer.toString('base64'),
          iterations: CRYPTO_CONFIG.KEY_DERIVATION.ITERATIONS,
        });
      }
    );
  });
}

/**
 * Hash password for storage (for PIN verification, not encryption)
 */
export async function hashPassword(password: string): Promise<{
  hash: string;
  salt: string;
}> {
  const derived = await deriveKeyFromPassword(password);
  return {
    hash: derived.key.toString('base64'),
    salt: derived.salt,
  };
}

/**
 * Verify password against stored hash
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const derived = await deriveKeyFromPassword(password, salt);
  const computedHash = derived.key.toString('base64');

  // Constant-time comparison to prevent timing attacks
  if (computedHash.length !== storedHash.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < computedHash.length; i++) {
    result |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }

  return result === 0;
}

// ==================== Random Generation ====================

/**
 * Generate cryptographically secure random bytes
 */
export function generateRandomBytes(length: number): Buffer {
  return crypto.randomBytes(length);
}

/**
 * Generate a random hex string
 */
export function generateRandomHex(length: number): string {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

/**
 * Generate a secure random PIN
 */
export function generateSecurePin(length: number = 6): string {
  const bytes = crypto.randomBytes(length);
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += (bytes[i] % 10).toString();
  }
  return pin;
}

// ==================== Certificate Operations ====================

/**
 * Generate a self-signed certificate
 */
export function generateSelfSignedCertificate(
  keyPair: KeyPair,
  subject: {
    commonName: string;
    organization?: string;
    email?: string;
    country?: string;
  },
  validityDays: number = 365
): string {
  // Note: In production, use a proper X.509 library like node-forge
  // This is a simplified representation for the certificate data

  const now = new Date();
  const notBefore = now.toISOString();
  const notAfter = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000).toISOString();

  const certData = {
    version: 3,
    serialNumber: generateRandomHex(20),
    subject: {
      CN: subject.commonName,
      O: subject.organization,
      emailAddress: subject.email,
      C: subject.country,
    },
    issuer: {
      CN: subject.commonName,  // Self-signed
      O: subject.organization,
    },
    validity: {
      notBefore,
      notAfter,
    },
    publicKey: keyPair.publicKey,
    keyType: keyPair.keyType,
    keySize: keyPair.keySize,
    signatureAlgorithm: keyPair.keyType === 'RSA' ? 'RSA-SHA256' : 'ECDSA-SHA256',
  };

  // Sign the certificate data
  const certDataString = JSON.stringify(certData);
  const signature = signData(certDataString, keyPair.privateKey, certData.signatureAlgorithm as SignatureAlgorithm);

  return JSON.stringify({
    certificate: certData,
    signature: signature.signature,
  });
}

/**
 * Calculate certificate fingerprint
 */
export function calculateFingerprint(publicKey: string): string {
  return hashData(publicKey, 'SHA256').hash;
}

// ==================== Utility Functions ====================

/**
 * Check if a private key is encrypted (PEM format)
 */
export function isPrivateKeyEncrypted(privateKeyPem: string): boolean {
  return privateKeyPem.includes('ENCRYPTED');
}

/**
 * Get key info from PEM
 */
export function getKeyInfo(publicKeyPem: string): {
  type: KeyType;
  size: number;
} {
  try {
    const keyObject = crypto.createPublicKey(publicKeyPem);
    const keyDetails = keyObject.asymmetricKeyDetails;

    if (keyObject.asymmetricKeyType === 'rsa') {
      return {
        type: 'RSA',
        size: keyDetails?.modulusLength || 0,
      };
    } else if (keyObject.asymmetricKeyType === 'ec') {
      const curveSize: Record<string, number> = {
        'prime256v1': 256,
        'secp384r1': 384,
        'secp521r1': 521,
      };
      return {
        type: 'ECDSA',
        size: curveSize[keyDetails?.namedCurve || ''] || 256,
      };
    }

    throw new Error('Unknown key type');
  } catch (error) {
    throw new SecureSignError(
      ErrorCodes.CRYPTO_OPERATION_FAILED,
      `Failed to parse key: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
