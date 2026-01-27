/**
 * SecureSign Pro - Setup Wizard Component
 *
 * Simplified first-time setup for demo version.
 * License is auto-activated as 30-day trial.
 */

import React, { useState, useEffect } from 'react';

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trialInfo, setTrialInfo] = useState<{ daysRemaining: number } | null>(null);

  useEffect(() => {
    // Check trial license info
    loadTrialInfo();
  }, []);

  const loadTrialInfo = async () => {
    try {
      const result = await window.electron.getLicenseInfo();
      if (result.success && result.data?.validation?.remainingDays) {
        setTrialInfo({ daysRemaining: result.data.validation.remainingDays });
      }
    } catch (err) {
      console.error('Failed to load license info:', err);
    }
  };

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
      const result = await window.electron.unlockKeystore(password);

      if (result.success) {
        setStep(2);
      } else {
        // First time - keystore doesn't exist yet, proceed to create
        setStep(2);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create keystore');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!signerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electron.generateCertificate({
        alias: 'Demo Signing Key',
        keyType: 'RSA',
        keySize: 2048,
        subjectName: signerName,
        subjectEmail: signerEmail,
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
          <p>Enterprise Document Signing Solution</p>
          {trialInfo && (
            <div className="trial-badge">
              ✨ 30-Day Trial Active ({trialInfo.daysRemaining} days remaining)
            </div>
          )}
        </div>

        <div className="wizard-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Security</span>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Setup Key</span>
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
                  autoFocus
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
                className="btn btn-primary btn-lg btn-full"
                onClick={handleCreateKeystore}
                disabled={isLoading || password.length < 8 || password !== confirmPassword}
              >
                {isLoading ? 'Creating...' : 'Continue'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step">
              <h2>🔑 Create Your Signing Key</h2>
              <p>
                Enter your details to create your digital signing certificate.
                This will be used to sign documents.
              </p>

              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Enter your full name"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="key-info">
                <div className="info-item">
                  <span className="label">Key Type:</span>
                  <span className="value">RSA 2048-bit</span>
                </div>
                <div className="info-item">
                  <span className="label">Algorithm:</span>
                  <span className="value">SHA-256 with RSA</span>
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
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleGenerateKey}
                  disabled={isLoading || !signerName.trim()}
                >
                  {isLoading ? 'Generating...' : 'Create Key & Start'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="wizard-footer">
          <p className="demo-note">
            🎯 <strong>Demo Version</strong> - 30-day trial with full features
          </p>
        </div>
      </div>
    </div>
  );
};
