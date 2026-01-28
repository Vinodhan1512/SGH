/**
 * SecureSign Pro - Header Component
 */

import React from 'react';
import { LicenseType } from '../../../shared/types';

interface HeaderProps {
  onLock: () => void;
  isUnlocked: boolean;
  licenseType?: LicenseType;
}

export const Header: React.FC<HeaderProps> = ({ onLock, isUnlocked, licenseType }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-logo">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
          </svg>
          <span className="app-name">SecureSign Pro</span>
        </div>
      </div>

      <div className="header-center">
        {licenseType && (
          <span className={`license-badge license-${licenseType.toLowerCase()}`}>
            {licenseType}
          </span>
        )}
      </div>

      <div className="header-right">
        <div className={`status-indicator ${isUnlocked ? 'unlocked' : 'locked'}`}>
          <span className="status-icon">{isUnlocked ? '🔓' : '🔒'}</span>
          <span className="status-text">{isUnlocked ? 'Unlocked' : 'Locked'}</span>
        </div>

        {isUnlocked && (
          <button className="btn btn-secondary btn-sm" onClick={onLock}>
            Lock
          </button>
        )}
      </div>
    </header>
  );
};
