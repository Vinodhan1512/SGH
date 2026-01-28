/**
 * SecureSign Pro - Signature Panel Component
 *
 * Handles signature configuration and signing workflow.
 */

import React, { useState, useRef, useEffect } from 'react';
import { DocumentInfo, Certificate, SignatureRequest } from '../../../shared/types';
import { useAppStore } from '../../store/useAppStore';

interface SignaturePanelProps {
  document: DocumentInfo | null;
  isKeystoreUnlocked: boolean;
}

export const SignaturePanel: React.FC<SignaturePanelProps> = ({
  document,
  isKeystoreUnlocked,
}) => {
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signerId, setSignerId] = useState('');
  const [reason, setReason] = useState('Approved');
  const [location, setLocation] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    certificates,
    setCertificates,
    selectedCertificateId,
    setSelectedCertificateId,
    signaturePosition,
    signatureImage,
    setSignatureImage,
    addNotification,
  } = useAppStore();

  // Load certificates on mount
  useEffect(() => {
    if (isKeystoreUnlocked) {
      loadCertificates();
    }
  }, [isKeystoreUnlocked]);

  const loadCertificates = async () => {
    const result = await window.electron.listCertificates();
    if (result.success && result.data) {
      setCertificates(result.data as Certificate[]);
      // Select first certificate if none selected
      if (result.data.length > 0 && !selectedCertificateId) {
        setSelectedCertificateId((result.data[0] as Certificate).id);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setError('Signature image must be less than 500KB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSignatureImage(base64.split(',')[1]); // Remove data URL prefix
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSign = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!document) {
      setError('No document loaded');
      return;
    }

    if (!signaturePosition) {
      setError('Please place your signature on the document first');
      return;
    }

    if (!signerName.trim()) {
      setError('Signer name is required');
      return;
    }

    if (!selectedCertificateId) {
      setError('Please select a signing certificate');
      return;
    }

    setIsLoading(true);

    try {
      const request: SignatureRequest = {
        documentPath: document.filePath,
        signerInfo: {
          name: signerName,
          email: signerEmail || undefined,
          id: signerId || undefined,
        },
        signatureImage: signatureImage || undefined,
        signaturePosition,
        reason,
        location: location || undefined,
        pinOrOtp: pin || undefined,
        certificateId: selectedCertificateId,
      };

      const result = await window.electron.signDocument(request);

      if (result.success && result.data) {
        setSuccess(`Document signed successfully! Verification ID: ${(result.data as any).verificationId}`);
        addNotification('success', 'Document signed successfully');
      } else {
        setError(result.error?.message || 'Signing failed');
        addNotification('error', result.error?.message || 'Signing failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isKeystoreUnlocked) {
    return (
      <div className="signature-panel">
        <div className="panel-header">
          <h3>Digital Signature</h3>
        </div>
        <div className="panel-content">
          <div className="panel-message warning">
            <p>🔒 Please unlock the keystore to sign documents.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signature-panel">
      <div className="panel-header">
        <h3>Digital Signature</h3>
      </div>

      <div className="panel-content">
        {!document ? (
          <div className="panel-message">
            <p>Open a PDF document to sign.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSign(); }}>
            {/* Signer Information */}
            <div className="form-section">
              <h4>Signer Information</h4>

              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label>ID / Employee Number</label>
                <input
                  type="text"
                  value={signerId}
                  onChange={(e) => setSignerId(e.target.value)}
                  placeholder="Optional identifier"
                />
              </div>
            </div>

            {/* Signature Details */}
            <div className="form-section">
              <h4>Signature Details</h4>

              <div className="form-group">
                <label>Reason *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="Approved">Approved</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Witnessed">Witnessed</option>
                  <option value="Certified">Certified</option>
                  <option value="Author">Author</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Signature Image */}
            <div className="form-section">
              <h4>Signature Image (Optional)</h4>

              <div className="signature-image-upload">
                {signatureImage ? (
                  <div className="signature-preview">
                    <img
                      src={`data:image/png;base64,${signatureImage}`}
                      alt="Signature"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setSignatureImage(null)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Signature Image
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Certificate Selection */}
            <div className="form-section">
              <h4>Signing Certificate *</h4>

              <div className="form-group">
                <select
                  value={selectedCertificateId || ''}
                  onChange={(e) => setSelectedCertificateId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a certificate</option>
                  {certificates.map((cert) => (
                    <option key={cert.id} value={cert.id}>
                      {cert.alias} ({cert.keyType}-{cert.keySize})
                    </option>
                  ))}
                </select>
              </div>

              {certificates.length === 0 && (
                <p className="help-text">
                  No certificates found. Please generate or import a signing key.
                </p>
              )}
            </div>

            {/* PIN Verification */}
            <div className="form-section">
              <h4>PIN Verification (Optional)</h4>

              <div className="form-group">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN if configured"
                />
              </div>
            </div>

            {/* Signature Position Indicator */}
            <div className="form-section">
              <h4>Signature Position</h4>
              {signaturePosition ? (
                <p className="position-info">
                  ✅ Placed on page {signaturePosition.page} at ({Math.round(signaturePosition.x)}, {Math.round(signaturePosition.y)})
                </p>
              ) : (
                <p className="help-text">
                  Click "Place Signature" above and click on the document to position your signature.
                </p>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            {/* Sign Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={isLoading || !signaturePosition || !signerName || !selectedCertificateId}
            >
              {isLoading ? 'Signing...' : 'Sign Document'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
