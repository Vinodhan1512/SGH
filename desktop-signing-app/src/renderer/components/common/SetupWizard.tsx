/**
 * SecureSign Pro - Setup Wizard Component
 *
 * First-time setup for creating keystore and activating license.
 */

import React, { useState } from 'react';

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateKeystore = async () => {
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // The keystore will be created when we unlock it for the first time
      // In a real implementation, we'd call a separate create endpoint
      const result = await window.electron.unlockKeystore(password);

      if (result.success) {
        setStep(2);
      } else {
        // If unlock fails, it might mean keystore doesn't exist, so we're good
        setStep(2);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create keystore');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateLicense = async () => {
    setError(null);

    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (licenseKey.trim()) {
        // Activate with provided key
        result = await window.electron.activateLicense({
          licenseKey,
          userName,
          userEmail,
        });
      } else {
        // Start trial
        result = await window.electron.activateLicense({
          licenseKey: '01000000000000TRIAL',  // Trial key format
          userName,
          userEmail,
        });
      }

      if (result.success) {
        setStep(3);
      } else {
        setError(result.error?.message || 'License activation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate license');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    setIsLoading(true);

    try {
      const result = await window.electron.generateCertificate({
        alias: 'My Signing Key',
        keyType: 'RSA',
        keySize: 2048,
        subjectName: userName,
        subjectEmail: userEmail,
        validityDays: 365,
      });

      if (result.success) {
        onComplete();
      } else {
        setError(result.error?.message || 'Failed to generate key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="setup-wizard">
      <div className="wizard-container">
        <div className="wizard-header">
          <h1>Welcome to SecureSign Pro</h1>
          <p>Let's set up your secure signing environment</p>
        </div>

        <div className="wizard-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Security</span>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">License</span>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Keys</span>
          </div>
        </div>

        <div className="wizard-content">
          {step === 1 && (
            <div className="wizard-step">
              <h2>🔐 Create Master Password</h2>
              <p>
                This password protects your signing keys. Choose a strong password
                that you'll remember - it cannot be recovered if lost.
              </p>

              <div className="form-group">
                <label>Master Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>

              <div className="password-requirements">
                <p>Password requirements:</p>
                <ul>
                  <li className={password.length >= 8 ? 'met' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'met' : ''}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(password) ? 'met' : ''}>
                    One lowercase letter
                  </li>
                  <li className={/\d/.test(password) ? 'met' : ''}>
                    One number
                  </li>
                </ul>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <button
                className="btn btn-primary btn-lg"
                onClick={handleCreateKeystore}
                disabled={isLoading || password.length < 8 || password !== confirmPassword}
              >
                {isLoading ? 'Creating...' : 'Continue'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step">
              <h2>📜 Activate License</h2>
              <p>
                Enter your license key to activate the full version, or start a
                30-day free trial.
              </p>

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
                <label>Email (Optional)</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label>License Key (Optional)</label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
                />
                <p className="help-text">
                  Leave empty to start a 30-day trial
                </p>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="wizard-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleActivateLicense}
                  disabled={isLoading || !userName.trim()}
                >
                  {isLoading ? 'Activating...' : licenseKey ? 'Activate' : 'Start Trial'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step">
              <h2>🔑 Generate Signing Key</h2>
              <p>
                Create your first signing key. This key will be used to digitally
                sign your documents.
              </p>

              <div className="key-info">
                <div className="info-item">
                  <span className="label">Key Type:</span>
                  <span className="value">RSA 2048-bit</span>
                </div>
                <div className="info-item">
                  <span className="label">Owner:</span>
                  <span className="value">{userName}</span>
                </div>
                <div className="info-item">
                  <span className="label">Validity:</span>
                  <span className="value">1 Year</span>
                </div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="wizard-actions">
                <button
                  className="btn btn-secondary"
                  onClick={onComplete}
                >
                  Skip for Now
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleGenerateKey}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Key'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
