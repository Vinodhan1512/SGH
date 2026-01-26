/**
 * SecureSign Pro - Audit Viewer Component
 */

import React, { useState, useEffect } from 'react';
import { AuditLogEntry, AuditEventType } from '../../../shared/types';

export const AuditViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<AuditEventType | ''>('');
  const [integrityStatus, setIntegrityStatus] = useState<{
    checked: boolean;
    isValid: boolean;
    errors: string[];
  } | null>(null);

  const pageSize = 20;

  useEffect(() => {
    loadLogs();
  }, [page, filter]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const result = await window.electron.getAuditLogs({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        eventTypes: filter ? [filter] : undefined,
      });

      if (result.success && result.data) {
        setLogs(result.data.logs as AuditLogEntry[]);
        setTotalCount(result.data.total);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    setIsLoading(true);
    try {
      const result = await window.electron.verifyAuditIntegrity();
      if (result.success && result.data) {
        const data = result.data as { isValid: boolean; errors: string[] };
        setIntegrityStatus({
          checked: true,
          isValid: data.isValid,
          errors: data.errors || [],
        });
      }
    } catch (err) {
      console.error('Failed to verify integrity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const result = await window.electron.exportAuditLogs({
        format: 'json',
        includeSignatures: true,
      });

      if (result.success && result.data) {
        alert(`Audit logs exported to: ${result.data.path}`);
      }
    } catch (err) {
      console.error('Failed to export logs:', err);
    }
  };

  const getEventIcon = (eventType: AuditEventType): string => {
    const icons: Record<string, string> = {
      DOCUMENT_SIGNED: '✍️',
      DOCUMENT_VERIFIED: '✅',
      DOCUMENT_OPENED: '📄',
      KEY_GENERATED: '🔑',
      KEY_IMPORTED: '📥',
      KEY_DELETED: '🗑️',
      LICENSE_ACTIVATED: '📜',
      KEYSTORE_UNLOCKED: '🔓',
      KEYSTORE_LOCKED: '🔒',
      APPLICATION_STARTED: '🚀',
      APPLICATION_CLOSED: '👋',
      SIGNATURE_FAILED: '❌',
    };
    return icons[eventType] || '📋';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="audit-viewer">
      <div className="panel-header">
        <h2>Audit Log</h2>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={handleVerifyIntegrity}
            disabled={isLoading}
          >
            Verify Integrity
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      </div>

      {integrityStatus?.checked && (
        <div className={`integrity-status ${integrityStatus.isValid ? 'valid' : 'invalid'}`}>
          {integrityStatus.isValid ? (
            <p>✅ Audit log integrity verified - no tampering detected</p>
          ) : (
            <>
              <p>⚠️ Integrity verification failed</p>
              {integrityStatus.errors.map((err, i) => (
                <p key={i} className="error">{err}</p>
              ))}
            </>
          )}
        </div>
      )}

      <div className="audit-filters">
        <div className="filter-group">
          <label>Filter by Event:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as AuditEventType | '');
              setPage(1);
            }}
          >
            <option value="">All Events</option>
            <option value="DOCUMENT_SIGNED">Document Signed</option>
            <option value="DOCUMENT_VERIFIED">Document Verified</option>
            <option value="DOCUMENT_OPENED">Document Opened</option>
            <option value="KEY_GENERATED">Key Generated</option>
            <option value="LICENSE_ACTIVATED">License Activated</option>
            <option value="KEYSTORE_UNLOCKED">Keystore Unlocked</option>
            <option value="SIGNATURE_FAILED">Signature Failed</option>
          </select>
        </div>

        <div className="log-count">
          Showing {logs.length} of {totalCount} entries
        </div>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      <div className="audit-table-container">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Document</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="timestamp">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="event-type">
                  <span className="event-icon">{getEventIcon(log.eventType)}</span>
                  {log.eventType.replace(/_/g, ' ')}
                </td>
                <td className="document-name">
                  {log.documentName || '-'}
                </td>
                <td className="details">
                  {log.actionDetails && (
                    <details>
                      <summary>View Details</summary>
                      <pre>{JSON.stringify(log.actionDetails, null, 2)}</pre>
                    </details>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
