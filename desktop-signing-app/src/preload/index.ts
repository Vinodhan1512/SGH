/**
 * SecureSign Pro - Preload Script
 *
 * Secure bridge between renderer and main process.
 * Exposes only necessary APIs to the renderer through contextBridge.
 */

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPC_CHANNELS } from '../shared/types';

// ==================== Type Definitions ====================

interface ElectronAPI {
  // System
  getMachineId: () => Promise<string>;
  getAppVersion: () => Promise<{ version: string; name: string }>;
  openFileDialog: (options?: { filters?: Array<{ name: string; extensions: string[] }> }) => Promise<string | null>;
  saveFileDialog: (options?: { filters?: Array<{ name: string; extensions: string[] }>; defaultPath?: string }) => Promise<string | null>;

  // Document
  openDocument: (filePath: string) => Promise<{ success: boolean; data?: unknown; error?: { message: string } }>;
  signDocument: (request: unknown) => Promise<{ success: boolean; data?: unknown; error?: { message: string } }>;
  verifyDocument: (filePath: string) => Promise<{ success: boolean; data?: unknown; error?: { message: string } }>;

  // Keystore
  getKeystoreStatus: () => Promise<{ exists: boolean; isUnlocked: boolean }>;
  unlockKeystore: (password: string) => Promise<{ success: boolean; error?: { message: string } }>;
  lockKeystore: () => Promise<{ success: boolean }>;
  changeKeystorePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: { message: string } }>;

  // Certificates
  listCertificates: () => Promise<{ success: boolean; data?: unknown[]; error?: { message: string } }>;
  generateCertificate: (options: unknown) => Promise<{ success: boolean; data?: { keyId: string }; error?: { message: string } }>;
  deleteCertificate: (keyId: string) => Promise<{ success: boolean; error?: { message: string } }>;

  // License
  getLicenseInfo: () => Promise<{ success: boolean; data?: unknown; error?: { message: string } }>;
  activateLicense: (request: unknown) => Promise<{ success: boolean; data?: unknown; error?: { message: string } }>;
  validateLicense: () => Promise<{ success: boolean; data?: unknown; error?: { message: string } }>;

  // Audit
  getAuditLogs: (options?: unknown) => Promise<{ success: boolean; data?: { logs: unknown[]; total: number }; error?: { message: string } }>;
  verifyAuditIntegrity: () => Promise<{ success: boolean; data?: unknown; error?: { message: string } }>;
  exportAuditLogs: (options: unknown) => Promise<{ success: boolean; data?: { path: string }; error?: { message: string } }>;

  // Event listeners
  onMenuCommand: (callback: (command: string) => void) => () => void;
}

// ==================== API Implementation ====================

const electronAPI: ElectronAPI = {
  // System operations
  getMachineId: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_MACHINE_ID),
  getAppVersion: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_APP_VERSION),
  openFileDialog: (options) => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_OPEN_FILE_DIALOG, options),
  saveFileDialog: (options) => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_SAVE_FILE_DIALOG, options),

  // Document operations
  openDocument: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_OPEN, filePath),
  signDocument: (request) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_SIGN, request),
  verifyDocument: (filePath) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_VERIFY, filePath),

  // Keystore operations
  getKeystoreStatus: () => ipcRenderer.invoke(IPC_CHANNELS.KEYSTORE_STATUS),
  unlockKeystore: (password) => ipcRenderer.invoke(IPC_CHANNELS.KEYSTORE_UNLOCK, password),
  lockKeystore: () => ipcRenderer.invoke(IPC_CHANNELS.KEYSTORE_LOCK),
  changeKeystorePassword: (currentPassword, newPassword) =>
    ipcRenderer.invoke(IPC_CHANNELS.KEYSTORE_CHANGE_PASSWORD, { currentPassword, newPassword }),

  // Certificate operations
  listCertificates: () => ipcRenderer.invoke(IPC_CHANNELS.CERTIFICATE_LIST),
  generateCertificate: (options) => ipcRenderer.invoke(IPC_CHANNELS.CERTIFICATE_GENERATE, options),
  deleteCertificate: (keyId) => ipcRenderer.invoke(IPC_CHANNELS.CERTIFICATE_DELETE, keyId),

  // License operations
  getLicenseInfo: () => ipcRenderer.invoke(IPC_CHANNELS.LICENSE_GET_INFO),
  activateLicense: (request) => ipcRenderer.invoke(IPC_CHANNELS.LICENSE_ACTIVATE, request),
  validateLicense: () => ipcRenderer.invoke(IPC_CHANNELS.LICENSE_VALIDATE),

  // Audit operations
  getAuditLogs: (options) => ipcRenderer.invoke(IPC_CHANNELS.AUDIT_GET_LOGS, options),
  verifyAuditIntegrity: () => ipcRenderer.invoke(IPC_CHANNELS.AUDIT_VERIFY_INTEGRITY),
  exportAuditLogs: (options) => ipcRenderer.invoke(IPC_CHANNELS.AUDIT_EXPORT, options),

  // Menu event listeners
  onMenuCommand: (callback) => {
    const commands = [
      'menu:open-file',
      'menu:sign-document',
      'menu:verify-document',
      'menu:key-management',
      'menu:audit-logs',
      'menu:settings',
      'menu:about',
    ];

    const listeners: Array<(event: IpcRendererEvent) => void> = [];

    commands.forEach((command) => {
      const listener = () => callback(command);
      ipcRenderer.on(command, listener);
      listeners.push(listener);
    });

    // Return cleanup function
    return () => {
      commands.forEach((command, index) => {
        ipcRenderer.removeListener(command, listeners[index]);
      });
    };
  },
};

// ==================== Expose API to Renderer ====================

contextBridge.exposeInMainWorld('electron', electronAPI);

// ==================== Type Declaration for Window ====================

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
