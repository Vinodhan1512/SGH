/**
 * SecureSign Pro - License Panel Component
 */

import React, { useState, useEffect } from 'react';
import { License, LicenseValidationResult } from '../../../shared/types';
import { useAppStore } from '../../store/useAppStore';

export const LicensePanel: React.FC = () => {
  const { licenseInfo, setLicenseInfo } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLicenseInfo();
  }, []);

  const loadLicenseInfo = async () => {
    setIsLoading(true);
    try {
      const result = await window.electron.getLicenseInfo();
      if (result.success && result.data) {
        setLicenseInfo(result.data as typeof licenseInfo);
      }
    } catch (err) {
      console.error('Failed to load license info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async () => {
    setError(null);

    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      const result = await window.electron.activateLicense({
        licenseKey,
        userName,
        userEmail,
      });

      if (result.success) {
        setShowActivateDialog(false);
        loadLicenseInfo();
        setLicenseKey('');
        setUserName('');
        setUserEmail('');
      } else {
        setError((result.data as LicenseValidationResult)?.errors?.join(', ') || 'Activation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Activation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const license = licenseInfo?.license;
  const validation = licenseInfo?.validation;
  const usage = licenseInfo?.usage;

  const getLicenseStatusColor = () => {
    if (!validation?.isValid) return 'red';
    if (validation.remainingDays && validation.remainingDays <= 30) return 'orange';
    return 'green';
  };

  return (
    <div className="license-panel">
      <div className="panel-header">
        <h2>License Information</h2>
        {!license && (
          <button
            className="btn btn-primary"
            onClick={() => setShowActivateDialog(true)}
          >
            Activate License
          </button>
        )}
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      {!license ? (
        <div className="no-license">
          <div className="no-license-icon">📜</div>
          <h3>No License Activated</h3>
          <p>Activate a license to unlock all features.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setShowActivateDialog(true)}
          >
            Activate License
          </button>
        </div>
      ) : (
        <div className="license-info">
          <div className="license-status-card" style={{ borderColor: getLicenseStatusColor() }}>
            <div className="status-header">
              <span className="license-type-badge">{license.licenseType}</span>
              <span className={`status-badge ${validation?.isValid ? 'valid' : 'invalid'}`}>
                {validation?.isValid ? '✅ Valid' : '❌ Invalid'}
              </span>
            </div>

            <div className="license-details">
              <div className="detail-row">
                <span className="label">Licensed To:</span>
                <span className="value">{license.issuedTo}</span>
              </div>

              {license.issuedEmail && (
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{license.issuedEmail}</span>
                </div>
              )}

              <div className="detail-row">
                <span className="label">Activation Date:</span>
                <span className="value">
                  {new Date(license.activationDate).toLocaleDateString()}
                </span>
              </div>

              {license.expiryDate && (
                <div className="detail-row">
                  <span className="label">Expiry Date:</span>
                  <span className="value">
                    {new Date(license.expiryDate).toLocaleDateString()}
                    {validation?.remainingDays !== undefined && (
                      <span className="days-remaining">
                        ({validation.remainingDays} days remaining)
                      </span>
                    )}
                  </span>
                </div>
              )}

              <div className="detail-row">
                <span className="label">Machine ID:</span>
                <span className="value monospace">
                  {license.machineId.substring(0, 12)}...
                </span>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          {usage && (
            <div className="usage-card">
              <h3>Usage Statistics</h3>

              <div className="usage-stats">
                <div className="stat">
                  <span className="stat-value">{usage.signaturesUsed}</span>
                  <span className="stat-label">Signatures Used</span>
                </div>

                {usage.maxSignatures && (
                  <>
                    <div className="stat">
                      <span className="stat-value">{usage.remaining}</span>
                      <span className="stat-label">Remaining</span>
                    </div>

                    <div className="usage-bar">
                      <div
                        className="usage-fill"
                        style={{
                          width: `${Math.min(100, (usage.signaturesUsed / usage.maxSignatures) * 100)}%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="features-card">
            <h3>Licensed Features</h3>
            <ul className="feature-list">
              <li className={license.features.timestampService ? 'enabled' : 'disabled'}>
                {license.features.timestampService ? '✅' : '❌'} Timestamp Service
              </li>
              <li className={license.features.batchSigning ? 'enabled' : 'disabled'}>
                {license.features.batchSigning ? '✅' : '❌'} Batch Signing
              </li>
              <li className={license.features.cloudSync ? 'enabled' : 'disabled'}>
                {license.features.cloudSync ? '✅' : '❌'} Cloud Sync
              </li>
              <li className={license.features.apiAccess ? 'enabled' : 'disabled'}>
                {license.features.apiAccess ? '✅' : '❌'} API Access
              </li>
              <li className={license.features.prioritySupport ? 'enabled' : 'disabled'}>
                {license.features.prioritySupport ? '✅' : '❌'} Priority Support
              </li>
            </ul>
          </div>

          {/* Warnings */}
          {validation?.warnings && validation.warnings.length > 0 && (
            <div className="warnings-card">
              <h3>⚠️ Warnings</h3>
              <ul>
                {validation.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Activate Dialog */}
      {showActivateDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Activate License</h3>
              <button
                className="dialog-close"
                onClick={() => setShowActivateDialog(false)}
              >
                ×
              </button>
            </div>

            <div className="dialog-content">
              <div className="form-group">
                <label>License Key *</label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
                />
              </div>

              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              {error && <div className="alert alert-error">{error}</div>}
            </div>

            <div className="dialog-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowActivateDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleActivate}
                disabled={isLoading || !licenseKey.trim() || !userName.trim()}
              >
                {isLoading ? 'Activating...' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
