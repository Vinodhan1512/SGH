/**
 * SecureSign Pro - Unlock Dialog Component
 */

import React, { useState } from 'react';

interface UnlockDialogProps {
  onUnlock: (password: string) => Promise<boolean>;
  onCancel?: () => void;
}

export const UnlockDialog: React.FC<UnlockDialogProps> = ({ onUnlock, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await onUnlock(password);
      if (!success) {
        setError('Invalid password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog unlock-dialog">
        <div className="dialog-header">
          <h2>🔐 Unlock Keystore</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-content">
            <p>Enter your master password to unlock the keystore.</p>

            <div className="form-group">
              <label>Master Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                required
              />
            </div>

            {error && (
              <div className="alert alert-error">{error}</div>
            )}
          </div>

          <div className="dialog-footer">
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !password}
            >
              {isLoading ? 'Unlocking...' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
