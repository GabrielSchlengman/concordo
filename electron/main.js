const { app, BrowserWindow, desktopCapturer, ipcMain, session, shell } = require('electron/main');
const path = require('node:path');
const { createServer } = require('../server');

let localServer;
let appOrigin;
let selectedDisplaySourceId = null;
const allowedSourceIds = new Map();
const CLOUD_URL = process.env.CONCORD_SERVER_URL || process.env.LUME_SERVER_URL || 'https://lume-app-ym0d.onrender.com';

function isTrustedUrl(value) {
  try { return Boolean(appOrigin) && new URL(value).origin === appOrigin; }
  catch { return false; }
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    localServer = createServer();
    localServer.once('error', reject);
    localServer.listen(0, '127.0.0.1', () => {
      const address = localServer.address();
      resolve(`http://127.0.0.1:${address.port}`);
    });
  });
}

function configureMediaPermissions() {
  session.defaultSession.setPermissionCheckHandler((_webContents, permission, requestingOrigin) => {
    return isTrustedUrl(requestingOrigin) && ['media', 'display-capture', 'fullscreen'].includes(permission);
  });

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const trusted = isTrustedUrl(webContents.getURL());
    callback(trusted && ['media', 'display-capture', 'fullscreen'].includes(permission));
  });

  session.defaultSession.setDisplayMediaRequestHandler(async (request, callback) => {
    try {
      if (!request.userGesture || !isTrustedUrl(request.securityOrigin) || !isTrustedUrl(request.frame?.url || '')) {
        callback({});
        return;
      }
      const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
      const source = sources.find((item) => item.id === selectedDisplaySourceId);
      selectedDisplaySourceId = null;
      allowedSourceIds.clear();
      if (!source) {
        callback({});
        return;
      }
      callback({
        video: source,
        ...(request.audioRequested && process.platform === 'win32' ? { audio: 'loopback' } : {}),
      });
    } catch {
      callback({});
    }
  });
}

function registerDesktopHandlers() {
  ipcMain.handle('desktop:get-sources', async (event) => {
    const owner = BrowserWindow.fromWebContents(event.sender);
    if (!isTrustedUrl(event.senderFrame?.url || '') || !isTrustedUrl(event.sender.getURL()) || !owner?.isFocused()) return [];
    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 320, height: 180 },
      fetchWindowIcons: true,
    });
    allowedSourceIds.set(event.sender.id, new Set(sources.map((source) => source.id)));
    return sources.map((source) => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL(),
      appIcon: source.appIcon?.toDataURL() || null,
    }));
  });

  ipcMain.handle('desktop:select-source', (event, sourceId) => {
    if (!isTrustedUrl(event.senderFrame?.url || '') || !isTrustedUrl(event.sender.getURL()) || typeof sourceId !== 'string') return false;
    if (!allowedSourceIds.get(event.sender.id)?.has(sourceId)) return false;
    selectedDisplaySourceId = sourceId.slice(0, 300);
    allowedSourceIds.delete(event.sender.id);
    return true;
  });
}

function createWindow(url) {
  const window = new BrowserWindow({
    title: 'Concord',
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: '#12131a',
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', 'concord.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.once('ready-to-show', () => window.show());
  window.loadURL(url);

  window.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
    try {
      const parsed = new URL(targetUrl);
      if (['https:', 'http:'].includes(parsed.protocol)) shell.openExternal(parsed.toString());
    } catch { /* endereço inválido */ }
    return { action: 'deny' };
  });

  window.webContents.on('will-navigate', (event, targetUrl) => {
    if (!isTrustedUrl(targetUrl)) event.preventDefault();
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();

app.whenReady().then(async () => {
  app.setAppUserModelId('com.concord.desktop');
  const url = process.env.CONCORD_USE_LOCAL === '1' || process.env.LUME_USE_LOCAL === '1' ? await startLocalServer() : CLOUD_URL;
  appOrigin = new URL(url).origin;
  configureMediaPermissions();
  registerDesktopHandlers();
  createWindow(url);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(url);
  });
}).catch((error) => {
  console.error('Não foi possível iniciar o Concord:', error);
  app.quit();
});

app.on('second-instance', () => {
  const window = BrowserWindow.getAllWindows()[0];
  if (!window) return;
  if (window.isMinimized()) window.restore();
  window.focus();
});

app.on('window-all-closed', () => {
  localServer?.close();
  if (process.platform !== 'darwin') app.quit();
});
