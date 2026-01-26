/**
 * SecureSign Pro - Settings Panel Component
 */

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const SettingsPanel: React.FC = () => {
  const { theme, setTheme, language, setLanguage } = useAppStore();
  const [requirePin, setRequirePin] = useState(false);
  const [autoLock, setAutoLock] = useState(5);
  const [defaultReason, setDefaultReason] = useState('Approved');

  return (
    <div className="settings-panel">
      <h2>Settings</h2>

      <div className="settings-section">
        <h3>Appearance</h3>

        <div className="setting-item">
          <label>Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          >
            <option value="system">System Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="ar-SA">العربية (Arabic)</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Security</h3>

        <div className="setting-item">
          <label>Require PIN before signing</label>
          <input
            type="checkbox"
            checked={requirePin}
            onChange={(e) => setRequirePin(e.target.checked)}
          />
        </div>

        <div className="setting-item">
          <label>Auto-lock after (minutes)</label>
          <select
            value={autoLock}
            onChange={(e) => setAutoLock(Number(e.target.value))}
          >
            <option value={1}>1 minute</option>
            <option value={5}>5 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={0}>Never</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Signing Defaults</h3>

        <div className="setting-item">
          <label>Default Reason</label>
          <select
            value={defaultReason}
            onChange={(e) => setDefaultReason(e.target.value)}
          >
            <option value="Approved">Approved</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Certified">Certified</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>

        <div className="setting-actions">
          <button className="btn btn-secondary">Export Settings</button>
          <button className="btn btn-secondary">Import Settings</button>
          <button className="btn btn-danger">Reset to Defaults</button>
        </div>
      </div>
    </div>
  );
};
