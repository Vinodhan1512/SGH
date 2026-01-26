/**
 * SecureSign Pro - About Dialog Component
 */

import React from 'react';

interface AboutDialogProps {
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ onClose }) => {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog about-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="about-content">
          <div className="about-logo">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>

          <h1>SecureSign Pro</h1>
          <p className="version">Version 1.0.0</p>

          <p className="description">
            Enterprise-grade digital document signing application with
            cryptographic security and comprehensive audit trails.
          </p>

          <div className="about-section">
            <h3>Features</h3>
            <ul>
              <li>RSA & ECDSA digital signatures</li>
              <li>SHA-256 cryptographic hashing</li>
              <li>Secure encrypted keystore</li>
              <li>Tamper-evident PDF signing</li>
              <li>Complete audit logging</li>
              <li>Offline signing support</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Security Standards</h3>
            <ul>
              <li>AES-256-GCM encryption</li>
              <li>PBKDF2 key derivation (310k iterations)</li>
              <li>Hash-chained audit logs</li>
              <li>Machine-bound licensing</li>
            </ul>
          </div>

          <div className="about-footer">
            <p>© 2024 SecureSign Technologies</p>
            <p>
              <a href="https://securesign.pro" target="_blank" rel="noopener noreferrer">
                securesign.pro
              </a>
              {' | '}
              <a href="mailto:support@securesign.pro">
                support@securesign.pro
              </a>
            </p>
          </div>
        </div>

        <button className="dialog-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};
