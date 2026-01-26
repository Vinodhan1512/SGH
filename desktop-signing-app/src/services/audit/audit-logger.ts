/**
 * SecureSign Pro - Audit Logger
 *
 * Implements tamper-evident, hash-chained audit logging for compliance.
 * All audit entries are cryptographically linked to prevent tampering.
 *
 * Features:
 * - Immutable append-only log
 * - Hash chain linking entries
 * - Digital signature on each entry
 * - SQLite storage for reliability
 * - Integrity verification
 */

import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import {
  AuditLogEntry,
  AuditEventType,
  AuditExportOptions,
  SecureSignError,
  ErrorCodes,
} from '../../shared/types';
import { AUDIT_CONFIG, APP_CONFIG } from '../../shared/constants';
import { hashData, signData, verifySignature } from '../crypto/crypto-engine';
import { generateId, getCurrentTimestamp } from '../../shared/utils';

// ==================== Interfaces ====================

export interface LogEventParams {
  eventType: AuditEventType;
  userId?: string;
  userName?: string;
  documentHash?: string;
  documentName?: string;
  actionDetails: Record<string, unknown>;
  ipAddress?: string;
  machineId: string;
}

export interface AuditQueryOptions {
  fromDate?: Date;
  toDate?: Date;
  eventTypes?: AuditEventType[];
  userId?: string;
  documentHash?: string;
  limit?: number;
  offset?: number;
}

export interface IntegrityCheckResult {
  isValid: boolean;
  totalEntries: number;
  verifiedEntries: number;
  brokenChainAt?: string;
  invalidSignatureAt?: string;
  errors: string[];
}

// ==================== Audit Logger Class ====================

export class AuditLogger {
  private db: Database.Database;
  private appSigningKey: string;  // Private key for signing entries
  private appVerifyKey: string;   // Public key for verification
  private lastEntryHash: string | null = null;

  constructor(
    appDataPath: string,
    appSigningKey: string,
    appVerifyKey: string
  ) {
    this.appSigningKey = appSigningKey;
    this.appVerifyKey = appVerifyKey;

    // Ensure directory exists
    const auditDir = path.join(appDataPath, APP_CONFIG.PATHS.AUDIT);
    if (!fs.existsSync(auditDir)) {
      fs.mkdirSync(auditDir, { recursive: true });
    }

    const dbPath = path.join(auditDir, 'audit.db');
    this.db = new Database(dbPath);

    this.initializeDatabase();
    this.loadLastEntryHash();
  }

  // ==================== Initialization ====================

  /**
   * Initialize the audit database schema
   */
  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        event_type TEXT NOT NULL,
        user_id TEXT,
        user_name TEXT,
        document_hash TEXT,
        document_name TEXT,
        action_details TEXT NOT NULL,
        ip_address TEXT,
        machine_id TEXT NOT NULL,
        previous_hash TEXT,
        entry_hash TEXT NOT NULL,
        signature TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_audit_event_type ON audit_logs(event_type);
      CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_document_hash ON audit_logs(document_hash);
    `);
  }

  /**
   * Load the hash of the last entry for chain continuity
   */
  private loadLastEntryHash(): void {
    const result = this.db.prepare(`
      SELECT entry_hash FROM audit_logs
      ORDER BY timestamp DESC, created_at DESC
      LIMIT 1
    `).get() as { entry_hash: string } | undefined;

    this.lastEntryHash = result?.entry_hash || null;
  }

  // ==================== Logging Operations ====================

  /**
   * Log an audit event
   */
  async logEvent(params: LogEventParams): Promise<string> {
    const id = generateId();
    const timestamp = getCurrentTimestamp();

    // Create entry data for hashing
    const entryData = {
      id,
      timestamp,
      eventType: params.eventType,
      userId: params.userId,
      userName: params.userName,
      documentHash: params.documentHash,
      documentName: params.documentName,
      actionDetails: params.actionDetails,
      ipAddress: params.ipAddress,
      machineId: params.machineId,
      previousHash: this.lastEntryHash,
    };

    // Calculate entry hash
    const entryHash = hashData(JSON.stringify(entryData), 'SHA256').hash;

    // Sign the entry
    const signature = signData(entryHash, this.appSigningKey, 'RSA-SHA256');

    // Insert into database
    const stmt = this.db.prepare(`
      INSERT INTO audit_logs (
        id, timestamp, event_type, user_id, user_name,
        document_hash, document_name, action_details,
        ip_address, machine_id, previous_hash, entry_hash, signature
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      timestamp,
      params.eventType,
      params.userId || null,
      params.userName || null,
      params.documentHash || null,
      params.documentName || null,
      JSON.stringify(params.actionDetails),
      params.ipAddress || null,
      params.machineId,
      this.lastEntryHash,
      entryHash,
      signature.signature
    );

    // Update last entry hash for chain
    this.lastEntryHash = entryHash;

    return id;
  }

  /**
   * Log application start
   */
  async logApplicationStart(machineId: string, version: string): Promise<string> {
    return this.logEvent({
      eventType: 'APPLICATION_STARTED',
      machineId,
      actionDetails: {
        version,
        startTime: getCurrentTimestamp(),
        platform: process.platform,
        nodeVersion: process.version,
      },
    });
  }

  /**
   * Log application close
   */
  async logApplicationClose(machineId: string): Promise<string> {
    return this.logEvent({
      eventType: 'APPLICATION_CLOSED',
      machineId,
      actionDetails: {
        closeTime: getCurrentTimestamp(),
      },
    });
  }

  // ==================== Query Operations ====================

  /**
   * Get audit logs with filters
   */
  getLogs(options: AuditQueryOptions = {}): AuditLogEntry[] {
    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params: unknown[] = [];

    if (options.fromDate) {
      query += ' AND timestamp >= ?';
      params.push(options.fromDate.toISOString());
    }

    if (options.toDate) {
      query += ' AND timestamp <= ?';
      params.push(options.toDate.toISOString());
    }

    if (options.eventTypes && options.eventTypes.length > 0) {
      const placeholders = options.eventTypes.map(() => '?').join(',');
      query += ` AND event_type IN (${placeholders})`;
      params.push(...options.eventTypes);
    }

    if (options.userId) {
      query += ' AND user_id = ?';
      params.push(options.userId);
    }

    if (options.documentHash) {
      query += ' AND document_hash = ?';
      params.push(options.documentHash);
    }

    query += ' ORDER BY timestamp DESC';

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }

    const rows = this.db.prepare(query).all(...params) as Array<{
      id: string;
      timestamp: string;
      event_type: string;
      user_id: string | null;
      user_name: string | null;
      document_hash: string | null;
      document_name: string | null;
      action_details: string;
      ip_address: string | null;
      machine_id: string;
      previous_hash: string | null;
      entry_hash: string;
      signature: string;
    }>;

    return rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      eventType: row.event_type as AuditEventType,
      userId: row.user_id || undefined,
      userName: row.user_name || undefined,
      documentHash: row.document_hash || undefined,
      documentName: row.document_name || undefined,
      actionDetails: JSON.parse(row.action_details),
      ipAddress: row.ip_address || undefined,
      machineId: row.machine_id,
      previousHash: row.previous_hash || undefined,
      entryHash: row.entry_hash,
      signature: row.signature,
    }));
  }

  /**
   * Get log entry by ID
   */
  getLogById(id: string): AuditLogEntry | null {
    const row = this.db.prepare(
      'SELECT * FROM audit_logs WHERE id = ?'
    ).get(id) as {
      id: string;
      timestamp: string;
      event_type: string;
      user_id: string | null;
      user_name: string | null;
      document_hash: string | null;
      document_name: string | null;
      action_details: string;
      ip_address: string | null;
      machine_id: string;
      previous_hash: string | null;
      entry_hash: string;
      signature: string;
    } | undefined;

    if (!row) return null;

    return {
      id: row.id,
      timestamp: row.timestamp,
      eventType: row.event_type as AuditEventType,
      userId: row.user_id || undefined,
      userName: row.user_name || undefined,
      documentHash: row.document_hash || undefined,
      documentName: row.document_name || undefined,
      actionDetails: JSON.parse(row.action_details),
      ipAddress: row.ip_address || undefined,
      machineId: row.machine_id,
      previousHash: row.previous_hash || undefined,
      entryHash: row.entry_hash,
      signature: row.signature,
    };
  }

  /**
   * Get logs for a specific document
   */
  getDocumentHistory(documentHash: string): AuditLogEntry[] {
    return this.getLogs({ documentHash });
  }

  /**
   * Get total log count
   */
  getLogCount(options: Omit<AuditQueryOptions, 'limit' | 'offset'> = {}): number {
    let query = 'SELECT COUNT(*) as count FROM audit_logs WHERE 1=1';
    const params: unknown[] = [];

    if (options.fromDate) {
      query += ' AND timestamp >= ?';
      params.push(options.fromDate.toISOString());
    }

    if (options.toDate) {
      query += ' AND timestamp <= ?';
      params.push(options.toDate.toISOString());
    }

    if (options.eventTypes && options.eventTypes.length > 0) {
      const placeholders = options.eventTypes.map(() => '?').join(',');
      query += ` AND event_type IN (${placeholders})`;
      params.push(...options.eventTypes);
    }

    const result = this.db.prepare(query).get(...params) as { count: number };
    return result.count;
  }

  // ==================== Integrity Verification ====================

  /**
   * Verify the integrity of the audit log chain
   */
  verifyIntegrity(): IntegrityCheckResult {
    const errors: string[] = [];
    let verifiedEntries = 0;
    let brokenChainAt: string | undefined;
    let invalidSignatureAt: string | undefined;

    // Get all entries ordered by timestamp
    const entries = this.db.prepare(`
      SELECT * FROM audit_logs
      ORDER BY timestamp ASC, created_at ASC
    `).all() as Array<{
      id: string;
      timestamp: string;
      event_type: string;
      user_id: string | null;
      user_name: string | null;
      document_hash: string | null;
      document_name: string | null;
      action_details: string;
      ip_address: string | null;
      machine_id: string;
      previous_hash: string | null;
      entry_hash: string;
      signature: string;
    }>;

    const totalEntries = entries.length;
    let expectedPreviousHash: string | null = null;

    for (const entry of entries) {
      // Verify chain link
      if (entry.previous_hash !== expectedPreviousHash) {
        errors.push(`Chain broken at entry ${entry.id}`);
        if (!brokenChainAt) brokenChainAt = entry.id;
      }

      // Recalculate entry hash
      const entryData = {
        id: entry.id,
        timestamp: entry.timestamp,
        eventType: entry.event_type,
        userId: entry.user_id,
        userName: entry.user_name,
        documentHash: entry.document_hash,
        documentName: entry.document_name,
        actionDetails: JSON.parse(entry.action_details),
        ipAddress: entry.ip_address,
        machineId: entry.machine_id,
        previousHash: entry.previous_hash,
      };

      const calculatedHash = hashData(JSON.stringify(entryData), 'SHA256').hash;

      if (calculatedHash !== entry.entry_hash) {
        errors.push(`Hash mismatch at entry ${entry.id}`);
        if (!brokenChainAt) brokenChainAt = entry.id;
      }

      // Verify signature
      try {
        const isValidSignature = verifySignature(
          entry.entry_hash,
          entry.signature,
          this.appVerifyKey,
          'RSA-SHA256'
        );

        if (!isValidSignature) {
          errors.push(`Invalid signature at entry ${entry.id}`);
          if (!invalidSignatureAt) invalidSignatureAt = entry.id;
        } else {
          verifiedEntries++;
        }
      } catch {
        errors.push(`Signature verification failed at entry ${entry.id}`);
        if (!invalidSignatureAt) invalidSignatureAt = entry.id;
      }

      expectedPreviousHash = entry.entry_hash;
    }

    return {
      isValid: errors.length === 0,
      totalEntries,
      verifiedEntries,
      brokenChainAt,
      invalidSignatureAt,
      errors,
    };
  }

  /**
   * Verify a single entry
   */
  verifyEntry(entryId: string): boolean {
    const entry = this.getLogById(entryId);
    if (!entry) return false;

    // Recalculate hash
    const entryData = {
      id: entry.id,
      timestamp: entry.timestamp,
      eventType: entry.eventType,
      userId: entry.userId,
      userName: entry.userName,
      documentHash: entry.documentHash,
      documentName: entry.documentName,
      actionDetails: entry.actionDetails,
      ipAddress: entry.ipAddress,
      machineId: entry.machineId,
      previousHash: entry.previousHash,
    };

    const calculatedHash = hashData(JSON.stringify(entryData), 'SHA256').hash;

    if (calculatedHash !== entry.entryHash) {
      return false;
    }

    // Verify signature
    try {
      return verifySignature(
        entry.entryHash,
        entry.signature,
        this.appVerifyKey,
        'RSA-SHA256'
      );
    } catch {
      return false;
    }
  }

  // ==================== Export Operations ====================

  /**
   * Export audit logs
   */
  exportLogs(options: AuditExportOptions): string {
    const logs = this.getLogs({
      fromDate: options.fromDate,
      toDate: options.toDate,
      eventTypes: options.eventTypes,
    });

    switch (options.format) {
      case 'json':
        return this.exportToJson(logs, options.includeSignatures);

      case 'csv':
        return this.exportToCsv(logs, options.includeSignatures);

      case 'pdf':
        // PDF export would require additional implementation
        return this.exportToJson(logs, options.includeSignatures);

      default:
        return this.exportToJson(logs, options.includeSignatures);
    }
  }

  /**
   * Export to JSON format
   */
  private exportToJson(logs: AuditLogEntry[], includeSignatures = false): string {
    const exportData = logs.map(log => {
      const entry: Record<string, unknown> = {
        id: log.id,
        timestamp: log.timestamp,
        eventType: log.eventType,
        userId: log.userId,
        userName: log.userName,
        documentHash: log.documentHash,
        documentName: log.documentName,
        actionDetails: log.actionDetails,
        machineId: log.machineId,
        entryHash: log.entryHash,
      };

      if (includeSignatures) {
        entry.signature = log.signature;
        entry.previousHash = log.previousHash;
      }

      return entry;
    });

    return JSON.stringify({
      exportDate: getCurrentTimestamp(),
      totalRecords: logs.length,
      records: exportData,
    }, null, 2);
  }

  /**
   * Export to CSV format
   */
  private exportToCsv(logs: AuditLogEntry[], includeSignatures = false): string {
    const headers = [
      'ID',
      'Timestamp',
      'Event Type',
      'User ID',
      'User Name',
      'Document Hash',
      'Document Name',
      'Action Details',
      'Machine ID',
      'Entry Hash',
    ];

    if (includeSignatures) {
      headers.push('Signature', 'Previous Hash');
    }

    const rows = logs.map(log => {
      const row = [
        log.id,
        log.timestamp,
        log.eventType,
        log.userId || '',
        log.userName || '',
        log.documentHash || '',
        log.documentName || '',
        JSON.stringify(log.actionDetails).replace(/"/g, '""'),
        log.machineId,
        log.entryHash,
      ];

      if (includeSignatures) {
        row.push(log.signature, log.previousHash || '');
      }

      return row.map(cell => `"${cell}"`).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  // ==================== Maintenance ====================

  /**
   * Archive old logs (move to separate table/file)
   */
  archiveOldLogs(beforeDate: Date): number {
    // Create archive table if not exists
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs_archive (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        event_type TEXT NOT NULL,
        user_id TEXT,
        user_name TEXT,
        document_hash TEXT,
        document_name TEXT,
        action_details TEXT NOT NULL,
        ip_address TEXT,
        machine_id TEXT NOT NULL,
        previous_hash TEXT,
        entry_hash TEXT NOT NULL,
        signature TEXT NOT NULL,
        archived_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Move old entries to archive
    const result = this.db.prepare(`
      INSERT INTO audit_logs_archive
      SELECT *, datetime('now') as archived_at
      FROM audit_logs
      WHERE timestamp < ?
    `).run(beforeDate.toISOString());

    // Delete from main table
    this.db.prepare(`
      DELETE FROM audit_logs WHERE timestamp < ?
    `).run(beforeDate.toISOString());

    return result.changes;
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
  }
}

// ==================== Factory Function ====================

let auditLoggerInstance: AuditLogger | null = null;

export function getAuditLogger(
  appDataPath: string,
  appSigningKey: string,
  appVerifyKey: string
): AuditLogger {
  if (!auditLoggerInstance) {
    auditLoggerInstance = new AuditLogger(appDataPath, appSigningKey, appVerifyKey);
  }
  return auditLoggerInstance;
}

export function createAuditLogger(
  appDataPath: string,
  appSigningKey: string,
  appVerifyKey: string
): AuditLogger {
  return new AuditLogger(appDataPath, appSigningKey, appVerifyKey);
}
