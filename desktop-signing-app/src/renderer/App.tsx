/**
 * SecureSign Pro - Main Application Component
 *
 * Root component that manages application state and routing.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { PdfViewer } from './components/pdf-viewer/PdfViewer';
import { SignaturePanel } from './components/signature-panel/SignaturePanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { AuditViewer } from './components/audit-viewer/AuditViewer';
import { LicensePanel } from './components/license/LicensePanel';
import { KeyManagement } from './components/settings/KeyManagement';
import { UnlockDialog } from './components/common/UnlockDialog';
import { SetupWizard } from './components/common/SetupWizard';
import { AboutDialog } from './components/common/AboutDialog';
import { useAppStore } from './store/useAppStore';
import './styles/app.css';

// ==================== Types ====================

type ViewType = 'pdf' | 'settings' | 'audit' | 'license' | 'keys';

// ==================== Main App Component ====================

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('pdf');
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isKeystoreUnlocked,
    keystoreExists,
    loadedDocument,
    setKeystoreStatus,
    setLoadedDocument,
    licenseInfo,
    setLicenseInfo,
  } = useAppStore();

  // ==================== Initialization ====================

  useEffect(() => {
    initializeApp();
    setupMenuListeners();
  }, []);

  const initializeApp = async () => {
    try {
      // Check keystore status
      const status = await window.electron.getKeystoreStatus();
      setKeystoreStatus(status.exists, status.isUnlocked);

      if (!status.exists) {
        setShowSetupWizard(true);
      } else if (!status.isUnlocked) {
        setShowUnlockDialog(true);
      }

      // Load license info
      const licenseResult = await window.electron.getLicenseInfo();
      if (licenseResult.success && licenseResult.data) {
        setLicenseInfo(licenseResult.data);
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupMenuListeners = () => {
    const cleanup = window.electron.onMenuCommand((command) => {
      switch (command) {
        case 'menu:open-file':
          handleOpenFile();
          break;
        case 'menu:sign-document':
          // Handled by SignaturePanel
          break;
        case 'menu:verify-document':
          handleVerifyDocument();
          break;
        case 'menu:key-management':
          setCurrentView('keys');
          break;
        case 'menu:audit-logs':
          setCurrentView('audit');
          break;
        case 'menu:settings':
          setCurrentView('settings');
          break;
        case 'menu:about':
          setShowAboutDialog(true);
          break;
      }
    });

    return cleanup;
  };

  // ==================== Event Handlers ====================

  const handleOpenFile = useCallback(async () => {
    const filePath = await window.electron.openFileDialog();
    if (filePath) {
      const result = await window.electron.openDocument(filePath);
      if (result.success && result.data) {
        setLoadedDocument(result.data);
        setCurrentView('pdf');
      } else {
        alert(`Failed to open document: ${result.error?.message}`);
      }
    }
  }, [setLoadedDocument]);

  const handleVerifyDocument = useCallback(async () => {
    if (!loadedDocument) {
      const filePath = await window.electron.openFileDialog();
      if (filePath) {
        const result = await window.electron.verifyDocument(filePath);
        if (result.success) {
          alert('Document verification completed. Check the results.');
        } else {
          alert(`Verification failed: ${result.error?.message}`);
        }
      }
    } else {
      const result = await window.electron.verifyDocument(loadedDocument.filePath);
      if (result.success) {
        alert('Document verification completed.');
      } else {
        alert(`Verification failed: ${result.error?.message}`);
      }
    }
  }, [loadedDocument]);

  const handleUnlock = async (password: string): Promise<boolean> => {
    const result = await window.electron.unlockKeystore(password);
    if (result.success) {
      setKeystoreStatus(true, true);
      setShowUnlockDialog(false);
      return true;
    }
    return false;
  };

  const handleSetupComplete = () => {
    setShowSetupWizard(false);
    setKeystoreStatus(true, true);
  };

  const handleLock = async () => {
    await window.electron.lockKeystore();
    setKeystoreStatus(keystoreExists, false);
    setShowUnlockDialog(true);
  };

  // ==================== Render ====================

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading SecureSign Pro...</p>
      </div>
    );
  }

  if (showSetupWizard) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  return (
    <div className="app">
      <Header
        onLock={handleLock}
        isUnlocked={isKeystoreUnlocked}
        licenseType={licenseInfo?.license?.licenseType}
      />

      <div className="app-content">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          onOpenFile={handleOpenFile}
        />

        <main className="main-content">
          {currentView === 'pdf' && (
            <div className="pdf-workspace">
              <PdfViewer document={loadedDocument} onOpenFile={handleOpenFile} />
              <SignaturePanel
                document={loadedDocument}
                isKeystoreUnlocked={isKeystoreUnlocked}
              />
            </div>
          )}

          {currentView === 'settings' && <SettingsPanel />}
          {currentView === 'audit' && <AuditViewer />}
          {currentView === 'license' && <LicensePanel />}
          {currentView === 'keys' && <KeyManagement />}
        </main>
      </div>

      {showUnlockDialog && (
        <UnlockDialog
          onUnlock={handleUnlock}
          onCancel={() => {
            // Can't cancel if keystore exists and is locked
          }}
        />
      )}

      {showAboutDialog && (
        <AboutDialog onClose={() => setShowAboutDialog(false)} />
      )}
    </div>
  );
};

export default App;
