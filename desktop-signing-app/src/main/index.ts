/**
 * SecureSign Pro - Main Electron Process
 *
 * Entry point for the desktop application.
 * Handles window management, IPC communication, and application lifecycle.
 */

import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { machineIdSync } from 'node-machine-id';
import { UI_CONFIG, APP_CONFIG } from '../shared/constants';
import { generateKeyPair, generateSelfSignedCertificate } from '../services/crypto/crypto-engine';
import { getKeystoreManager, KeystoreManager } from '../services/keystore/keystore-manager';
import { createAuditLogger, AuditLogger } from '../services/audit/audit-logger';
import { createLicenseManager, LicenseManager } from '../services/license/license-manager';
import { createSigningEngine, SigningEngine, SigningContext } from '../services/signing/signing-engine';
import { createPdfEngine, PdfEngine } from '../services/pdf/pdf-engine';
import { IPC_CHANNELS } from '../shared/types';

// ==================== Global State ====================

let mainWindow: BrowserWindow | null = null;
let keystoreManager: KeystoreManager | null = null;
let auditLogger: AuditLogger | null = null;
let licenseManager: LicenseManager | null = null;
let signingEngine: SigningEngine | null = null;
let pdfEngine: PdfEngine | null = null;

const machineId = machineIdSync();
const appDataPath = path.join(app.getPath('userData'), 'SecureSignPro');

// App signing keys (for audit log signing)
let appSigningKey: string = '';
let appVerifyKey: string = '';

// ==================== Window Management ====================

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: UI_CONFIG.WINDOW.DEFAULT_WIDTH,
    height: UI_CONFIG.WINDOW.DEFAULT_HEIGHT,
    minWidth: UI_CONFIG.WINDOW.MIN_WIDTH,
    minHeight: UI_CONFIG.WINDOW.MIN_HEIGHT,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, '../preload/index.js'),
    },
    icon: path.join(__dirname, '../../assets/icon.png'),
    title: APP_CONFIG.NAME,
    show: false,
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

// ==================== Application Menu ====================

function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open PDF...',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow?.webContents.send('menu:open-file'),
        },
        { type: 'separator' },
        {
          label: 'Sign Document...',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu:sign-document'),
        },
        {
          label: 'Verify Document...',
          accelerator: 'CmdOrCtrl+V',
          click: () => mainWindow?.webContents.send('menu:verify-document'),
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Key Management',
          click: () => mainWindow?.webContents.send('menu:key-management'),
        },
        {
          label: 'Audit Logs',
          click: () => mainWindow?.webContents.send('menu:audit-logs'),
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow?.webContents.send('menu:settings'),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://securesign.pro/docs'),
        },
        {
          label: 'Support',
          click: () => shell.openExternal('mailto:support@securesign.pro'),
        },
        { type: 'separator' },
        {
          label: `About ${APP_CONFIG.NAME}`,
          click: () => mainWindow?.webContents.send('menu:about'),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ==================== Initialization ====================

async function initializeApp(): Promise<void> {
  // Ensure app data directory exists
  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
  }

  // Initialize or load app signing keys
  await initializeAppKeys();

  // Initialize managers
  keystoreManager = getKeystoreManager(appDataPath);
  await keystoreManager.initialize();

  auditLogger = createAuditLogger(appDataPath, appSigningKey, appVerifyKey);
  licenseManager = createLicenseManager(appDataPath, machineId);
  pdfEngine = createPdfEngine();

  // AUTO-ACTIVATE DEMO TRIAL LICENSE (30 days)
  // This is for demo/evaluation purposes
  if (licenseManager.isFreshInstall()) {
    console.log('First launch detected - activating 30-day demo trial...');
    await licenseManager.autoActivateDemoTrial();
    console.log('Demo trial activated successfully!');
  }

  // Log application start
  await auditLogger.logApplicationStart(machineId, APP_CONFIG.VERSION);
}

async function initializeAppKeys(): Promise<void> {
  const keysPath = path.join(appDataPath, 'app-keys.json');

  if (fs.existsSync(keysPath)) {
    const keys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
    appSigningKey = keys.privateKey;
    appVerifyKey = keys.publicKey;
  } else {
    // Generate new app keys for audit log signing
    const keyPair = await generateKeyPair('RSA', 2048);
    appSigningKey = keyPair.privateKey;
    appVerifyKey = keyPair.publicKey;

    fs.writeFileSync(keysPath, JSON.stringify({
      privateKey: appSigningKey,
      publicKey: appVerifyKey,
      createdAt: new Date().toISOString(),
    }));
  }
}

// ==================== IPC Handlers ====================

function setupIpcHandlers(): void {
  // System operations
  ipcMain.handle(IPC_CHANNELS.SYSTEM_GET_MACHINE_ID, () => machineId);

  ipcMain.handle(IPC_CHANNELS.SYSTEM_GET_APP_VERSION, () => ({
    version: APP_CONFIG.VERSION,
    name: APP_CONFIG.NAME,
  }));

  ipcMain.handle(IPC_CHANNELS.SYSTEM_OPEN_FILE_DIALOG, async (_, options) => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      filters: options?.filters || [{ name: 'PDF Files', extensions: ['pdf'] }],
      properties: ['openFile'],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle(IPC_CHANNELS.SYSTEM_SAVE_FILE_DIALOG, async (_, options) => {
    const result = await dialog.showSaveDialog(mainWindow!, {
      filters: options?.filters || [{ name: 'PDF Files', extensions: ['pdf'] }],
      defaultPath: options?.defaultPath,
    });
    return result.canceled ? null : result.filePath;
  });

  // Document operations
  ipcMain.handle(IPC_CHANNELS.DOCUMENT_OPEN, async (_, filePath: string) => {
    try {
      const loadedPdf = await pdfEngine!.loadDocument(filePath);
      const docInfo = await pdfEngine!.getDocumentInfo();
      return { success: true, data: docInfo };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.DOCUMENT_SIGN, async (_, request) => {
    try {
      if (!keystoreManager?.isUnlocked()) {
        return {
          success: false,
          error: { message: 'Keystore is locked. Please unlock first.' },
        };
      }

      const context: SigningContext = {
        keystoreManager: keystoreManager!,
        auditLogger: auditLogger!,
        licenseManager: licenseManager!,
        machineId,
      };

      signingEngine = createSigningEngine(context);
      const result = await signingEngine.signDocument(request);

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.DOCUMENT_VERIFY, async (_, filePath: string) => {
    try {
      if (!signingEngine) {
        const context: SigningContext = {
          keystoreManager: keystoreManager!,
          auditLogger: auditLogger!,
          licenseManager: licenseManager!,
          machineId,
        };
        signingEngine = createSigningEngine(context);
      }

      const result = await signingEngine.verifyDocument(filePath);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  // Keystore operations
  ipcMain.handle(IPC_CHANNELS.KEYSTORE_STATUS, () => ({
    exists: keystoreManager?.exists() || false,
    isUnlocked: keystoreManager?.isUnlocked() || false,
  }));

  ipcMain.handle(IPC_CHANNELS.KEYSTORE_UNLOCK, async (_, password: string) => {
    try {
      const success = await keystoreManager!.unlock(password);
      await auditLogger!.logEvent({
        eventType: 'KEYSTORE_UNLOCKED',
        machineId,
        actionDetails: { success },
      });
      return { success };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.KEYSTORE_LOCK, async () => {
    keystoreManager?.lock();
    await auditLogger!.logEvent({
      eventType: 'KEYSTORE_LOCKED',
      machineId,
      actionDetails: {},
    });
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.KEYSTORE_CHANGE_PASSWORD, async (_, { currentPassword, newPassword }) => {
    try {
      await keystoreManager!.changeMasterPassword(currentPassword, newPassword);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  // Certificate operations
  ipcMain.handle(IPC_CHANNELS.CERTIFICATE_LIST, async () => {
    try {
      if (!keystoreManager?.isUnlocked()) {
        return { success: false, error: { message: 'Keystore is locked' } };
      }
      const keys = keystoreManager.listKeys();
      return { success: true, data: keys };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.CERTIFICATE_GENERATE, async (_, options) => {
    try {
      if (!keystoreManager?.isUnlocked()) {
        return { success: false, error: { message: 'Keystore is locked' } };
      }

      const keyPair = await generateKeyPair(options.keyType, options.keySize);
      const certificate = generateSelfSignedCertificate(keyPair, {
        commonName: options.subjectName,
        organization: options.subjectOrganization,
        email: options.subjectEmail,
      }, options.validityDays);

      const certData = JSON.parse(certificate);

      const keyId = await keystoreManager.addKey(
        options.alias,
        options.keyType,
        options.keySize,
        keyPair.publicKey,
        keyPair.privateKey,
        {
          id: '',
          alias: options.alias,
          subjectName: options.subjectName,
          subjectEmail: options.subjectEmail,
          validFrom: new Date(),
          validTo: new Date(Date.now() + options.validityDays * 24 * 60 * 60 * 1000),
          publicKey: keyPair.publicKey,
          keyType: options.keyType,
          keySize: options.keySize,
          fingerprintSha256: certData.certificate.signatureAlgorithm,
          isDefault: false,
          createdAt: new Date(),
        }
      );

      await auditLogger!.logEvent({
        eventType: 'KEY_GENERATED',
        machineId,
        actionDetails: {
          keyId,
          alias: options.alias,
          keyType: options.keyType,
          keySize: options.keySize,
        },
      });

      return { success: true, data: { keyId } };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.CERTIFICATE_DELETE, async (_, keyId: string) => {
    try {
      if (!keystoreManager?.isUnlocked()) {
        return { success: false, error: { message: 'Keystore is locked' } };
      }
      await keystoreManager.deleteKey(keyId);

      await auditLogger!.logEvent({
        eventType: 'KEY_DELETED',
        machineId,
        actionDetails: { keyId },
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  // License operations
  ipcMain.handle(IPC_CHANNELS.LICENSE_GET_INFO, async () => {
    const license = licenseManager!.getLicenseInfo();
    const validation = await licenseManager!.validate();
    return {
      success: true,
      data: {
        license,
        validation,
        usage: licenseManager!.getUsageStats(),
      },
    };
  });

  ipcMain.handle(IPC_CHANNELS.LICENSE_ACTIVATE, async (_, request) => {
    try {
      const result = await licenseManager!.activate(
        request.licenseKey,
        request.userName,
        request.userEmail,
        request.organization
      );

      await auditLogger!.logEvent({
        eventType: result.isValid ? 'LICENSE_ACTIVATED' : 'LICENSE_INVALID',
        machineId,
        actionDetails: {
          licenseKey: request.licenseKey.substring(0, 9) + '...',
          isValid: result.isValid,
          errors: result.errors,
        },
      });

      return { success: result.isValid, data: result };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.LICENSE_VALIDATE, async () => {
    const result = await licenseManager!.validate();
    return { success: true, data: result };
  });

  // Audit operations
  ipcMain.handle(IPC_CHANNELS.AUDIT_GET_LOGS, async (_, options) => {
    try {
      const logs = auditLogger!.getLogs(options);
      const count = auditLogger!.getLogCount(options);
      return { success: true, data: { logs, total: count } };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.AUDIT_VERIFY_INTEGRITY, async () => {
    try {
      const result = auditLogger!.verifyIntegrity();
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });

  ipcMain.handle(IPC_CHANNELS.AUDIT_EXPORT, async (_, options) => {
    try {
      const exportData = auditLogger!.exportLogs(options);

      const savePath = await dialog.showSaveDialog(mainWindow!, {
        filters: [
          { name: 'JSON', extensions: ['json'] },
          { name: 'CSV', extensions: ['csv'] },
        ],
        defaultPath: `audit_export_${new Date().toISOString().slice(0, 10)}.${options.format}`,
      });

      if (savePath.filePath) {
        fs.writeFileSync(savePath.filePath, exportData);
        return { success: true, data: { path: savePath.filePath } };
      }

      return { success: false, error: { message: 'Export cancelled' } };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  });
}

// ==================== App Lifecycle ====================

app.whenReady().then(async () => {
  await initializeApp();
  setupIpcHandlers();
  createMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  // Log application close
  if (auditLogger) {
    await auditLogger.logApplicationClose(machineId);
    auditLogger.close();
  }

  // Lock keystore
  keystoreManager?.lock();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  if (auditLogger) {
    await auditLogger.logApplicationClose(machineId);
  }
});

// Security: Disable navigation to unknown protocols
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'file:') {
      event.preventDefault();
    }
  });
});
