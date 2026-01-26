/**
 * SecureSign Pro - Key Management Component
 */

import React, { useState, useEffect } from 'react';
import { Certificate } from '../../../shared/types';
import { useAppStore } from '../../store/useAppStore';

export const KeyManagement: React.FC = () => {
  const { certificates, setCertificates, isKeystoreUnlocked } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for generating new key
  const [alias, setAlias] = useState('');
  const [keyType, setKeyType] = useState<'RSA' | 'ECDSA'>('RSA');
  const [keySize, setKeySize] = useState(2048);
  const [subjectName, setSubjectName] = useState('');
  const [subjectEmail, setSubjectEmail] = useState('');
  const [validityDays, setValidityDays] = useState(365);

  useEffect(() => {
    if (isKeystoreUnlocked) {
      loadCertificates();
    }
  }, [isKeystoreUnlocked]);

  const loadCertificates = async () => {
    setIsLoading(true);
    try {
      const result = await window.electron.listCertificates();
      if (result.success && result.data) {
        setCertificates(result.data as Certificate[]);
      }
    } catch (err) {
      setError('Failed to load certificates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setError(null);

    if (!alias.trim() || !subjectName.trim()) {
      setError('Alias and subject name are required');
      return;
    }

    setIsLoading(true);

    try {
      const result = await window.electron.generateCertificate({
        alias,
        keyType,
        keySize,
        subjectName,
        subjectEmail,
        validityDays,
      });

      if (result.success) {
        setShowGenerateDialog(false);
        loadCertificates();
        // Reset form
        setAlias('');
        setSubjectName('');
        setSubjectEmail('');
      } else {
        setError(result.error?.message || 'Failed to generate key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (keyId: string, keyAlias: string) => {
    if (!confirm(`Are you sure you want to delete "${keyAlias}"? This cannot be undone.`)) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await window.electron.deleteCertificate(keyId);
      if (result.success) {
        loadCertificates();
      } else {
        setError(result.error?.message || 'Failed to delete key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete key');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isKeystoreUnlocked) {
    return (
      <div className="key-management">
        <h2>Key Management</h2>
        <div className="panel-message warning">
          <p>🔒 Please unlock the keystore to manage keys.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="key-management">
      <div className="panel-header">
        <h2>Key Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowGenerateDialog(true)}
        >
          + Generate New Key
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading && <div className="loading">Loading...</div>}

      <div className="keys-list">
        {certificates.length === 0 ? (
          <div className="empty-state">
            <p>No signing keys found.</p>
            <p>Generate a new key to start signing documents.</p>
          </div>
        ) : (
          certificates.map((cert) => (
            <div key={cert.id} className="key-card">
              <div className="key-info">
                <h3>{cert.alias}</h3>
                <div className="key-details">
                  <span className="detail">
                    <strong>Type:</strong> {cert.keyType}-{cert.keySize}
                  </span>
                  <span className="detail">
                    <strong>Subject:</strong> {cert.subjectName}
                  </span>
                  {cert.subjectEmail && (
                    <span className="detail">
                      <strong>Email:</strong> {cert.subjectEmail}
                    </span>
                  )}
                  <span className="detail">
                    <strong>Valid Until:</strong>{' '}
                    {new Date(cert.validTo).toLocaleDateString()}
                  </span>
                  <span className="detail fingerprint">
                    <strong>Fingerprint:</strong>{' '}
                    {cert.fingerprintSha256.substring(0, 16)}...
                  </span>
                </div>
              </div>
              <div className="key-actions">
                <button className="btn btn-secondary btn-sm">Export</button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cert.id, cert.alias)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showGenerateDialog && (
        <div className="dialog-overlay">
          <div className="dialog generate-dialog">
            <div className="dialog-header">
              <h3>Generate New Signing Key</h3>
              <button
                className="dialog-close"
                onClick={() => setShowGenerateDialog(false)}
              >
                ×
              </button>
            </div>

            <div className="dialog-content">
              <div className="form-group">
                <label>Key Alias *</label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="My Signing Key"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Key Type</label>
                  <select
                    value={keyType}
                    onChange={(e) => setKeyType(e.target.value as 'RSA' | 'ECDSA')}
                  >
                    <option value="RSA">RSA</option>
                    <option value="ECDSA">ECDSA</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Key Size</label>
                  <select
                    value={keySize}
                    onChange={(e) => setKeySize(Number(e.target.value))}
                  >
                    {keyType === 'RSA' ? (
                      <>
                        <option value={2048}>2048 bits</option>
                        <option value={3072}>3072 bits</option>
                        <option value={4096}>4096 bits</option>
                      </>
                    ) : (
                      <>
                        <option value={256}>P-256</option>
                        <option value={384}>P-384</option>
                        <option value={521}>P-521</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Subject Name *</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={subjectEmail}
                  onChange={(e) => setSubjectEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label>Validity Period</label>
                <select
                  value={validityDays}
                  onChange={(e) => setValidityDays(Number(e.target.value))}
                >
                  <option value={365}>1 Year</option>
                  <option value={730}>2 Years</option>
                  <option value={1095}>3 Years</option>
                  <option value={1825}>5 Years</option>
                </select>
              </div>

              {error && <div className="alert alert-error">{error}</div>}
            </div>

            <div className="dialog-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowGenerateDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={isLoading || !alias.trim() || !subjectName.trim()}
              >
                {isLoading ? 'Generating...' : 'Generate Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
