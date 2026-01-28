/**
 * SecureSign Pro - Database Connection Manager
 *
 * Manages SQLite database connections with support for:
 * - Connection pooling
 * - Migrations
 * - Backup/restore
 */

import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import { APP_CONFIG } from '../shared/constants';

// ==================== Types ====================

interface DatabaseConfig {
  path: string;
  readonly?: boolean;
  fileMustExist?: boolean;
}

// ==================== Database Manager ====================

export class DatabaseManager {
  private db: Database.Database | null = null;
  private dbPath: string;

  constructor(appDataPath: string) {
    this.dbPath = path.join(appDataPath, APP_CONFIG.DATABASE.NAME);
  }

  /**
   * Initialize database connection
   */
  initialize(): Database.Database {
    // Ensure directory exists
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.dbPath);

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');

    // Enable WAL mode for better concurrency
    this.db.pragma('journal_mode = WAL');

    // Run migrations
    this.runMigrations();

    return this.db;
  }

  /**
   * Get database instance
   */
  getDatabase(): Database.Database {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * Run database migrations
   */
  private runMigrations(): void {
    if (!this.db) return;

    // Create migrations table if not exists
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        applied_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get applied migrations
    const applied = this.db
      .prepare('SELECT name FROM migrations')
      .all()
      .map((row: { name: string }) => row.name);

    // Define migrations
    const migrations = [
      {
        name: '001_initial_schema',
        sql: `
          -- Audit Log Table
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
          CREATE INDEX IF NOT EXISTS idx_audit_document_hash ON audit_logs(document_hash);

          -- Signatures Table
          CREATE TABLE IF NOT EXISTS signatures (
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
            signature_value TEXT NOT NULL,
            algorithm TEXT NOT NULL,
            is_timestamped INTEGER DEFAULT 0,
            timestamp_token TEXT,
            created_at TEXT NOT NULL
          );

          CREATE INDEX IF NOT EXISTS idx_signatures_verification_id ON signatures(verification_id);
          CREATE INDEX IF NOT EXISTS idx_signatures_document_hash ON signatures(document_hash);

          -- Documents Table
          CREATE TABLE IF NOT EXISTS documents (
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

          CREATE INDEX IF NOT EXISTS idx_documents_file_hash ON documents(file_hash);

          -- Settings Table
          CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );
        `,
      },
    ];

    // Apply pending migrations
    for (const migration of migrations) {
      if (!applied.includes(migration.name)) {
        this.db.exec(migration.sql);
        this.db
          .prepare('INSERT INTO migrations (name) VALUES (?)')
          .run(migration.name);
      }
    }
  }

  /**
   * Create a database backup
   */
  backup(backupPath: string): void {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Ensure backup directory exists
    const dir = path.dirname(backupPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db.backup(backupPath);
  }

  /**
   * Restore from a backup
   */
  restore(backupPath: string): void {
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file not found');
    }

    // Close current connection
    this.close();

    // Copy backup to main database path
    fs.copyFileSync(backupPath, this.dbPath);

    // Reinitialize
    this.initialize();
  }

  /**
   * Vacuum database to reclaim space
   */
  vacuum(): void {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    this.db.exec('VACUUM');
  }

  /**
   * Get database statistics
   */
  getStats(): {
    size: number;
    pageCount: number;
    pageSize: number;
  } {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stats = fs.statSync(this.dbPath);
    const pageCount = this.db.pragma('page_count', { simple: true }) as number;
    const pageSize = this.db.pragma('page_size', { simple: true }) as number;

    return {
      size: stats.size,
      pageCount,
      pageSize,
    };
  }
}

// ==================== Singleton Instance ====================

let dbManagerInstance: DatabaseManager | null = null;

export function getDatabaseManager(appDataPath: string): DatabaseManager {
  if (!dbManagerInstance) {
    dbManagerInstance = new DatabaseManager(appDataPath);
  }
  return dbManagerInstance;
}
