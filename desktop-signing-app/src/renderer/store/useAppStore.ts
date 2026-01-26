/**
 * SecureSign Pro - Application State Store
 *
 * Centralized state management using React Context and hooks.
 */

import { create } from 'zustand';
import { DocumentInfo, License, LicenseValidationResult, Certificate } from '../../shared/types';

// ==================== Store Types ====================

interface AppState {
  // Keystore state
  keystoreExists: boolean;
  isKeystoreUnlocked: boolean;
  setKeystoreStatus: (exists: boolean, unlocked: boolean) => void;

  // Document state
  loadedDocument: DocumentInfo | null;
  setLoadedDocument: (doc: DocumentInfo | null) => void;

  // License state
  licenseInfo: {
    license: License | null;
    validation: LicenseValidationResult | null;
    usage: {
      signaturesUsed: number;
      maxSignatures?: number;
      remaining?: number;
    } | null;
  } | null;
  setLicenseInfo: (info: AppState['licenseInfo']) => void;

  // Certificates state
  certificates: Certificate[];
  setCertificates: (certs: Certificate[]) => void;
  selectedCertificateId: string | null;
  setSelectedCertificateId: (id: string | null) => void;

  // UI state
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  language: string;
  setLanguage: (lang: string) => void;

  // Signature state
  signaturePosition: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  setSignaturePosition: (pos: AppState['signaturePosition']) => void;
  signatureImage: string | null;
  setSignatureImage: (img: string | null) => void;

  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// ==================== Store Implementation ====================

export const useAppStore = create<AppState>((set) => ({
  // Keystore
  keystoreExists: false,
  isKeystoreUnlocked: false,
  setKeystoreStatus: (exists, unlocked) =>
    set({ keystoreExists: exists, isKeystoreUnlocked: unlocked }),

  // Document
  loadedDocument: null,
  setLoadedDocument: (doc) => set({ loadedDocument: doc }),

  // License
  licenseInfo: null,
  setLicenseInfo: (info) => set({ licenseInfo: info }),

  // Certificates
  certificates: [],
  setCertificates: (certs) => set({ certificates: certs }),
  selectedCertificateId: null,
  setSelectedCertificateId: (id) => set({ selectedCertificateId: id }),

  // UI
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  language: 'en-US',
  setLanguage: (lang) => set({ language: lang }),

  // Signature
  signaturePosition: null,
  setSignaturePosition: (pos) => set({ signaturePosition: pos }),
  signatureImage: null,
  setSignatureImage: (img) => set({ signatureImage: img }),

  // Notifications
  notifications: [],
  addNotification: (type, message) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          message,
          timestamp: Date.now(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
