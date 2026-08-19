const { app, BrowserWindow, desktopCapturer, ipcMain, screen, session, shell } = require('electron/main');
const path = require('node:path');
const { createServer } = require('../server');

let localServer;
let appOrigin;
let selectedDisplaySourceId = null;
let activeDisplaySource = null;
let annotationOverlay = null;
let annotationOverlayState = { items: [] };
const allowedSourceIds = new Map();
const CLOUD_URL = process.env.ALPENDRE_SERVER_URL || process.env.CONCORD_SERVER_URL || process.env.LUME_SERVER_URL || 'https://lume-app-ym0d.onrender.com';

function isTrustedUrl(value) {
  try { return Boolean(appOrigin) && new URL(value).origin === appOrigin; }
  catch { return false; }
}

function isTrustedMediaUrl(value) {
  try { return new URL(value).origin === appOrigin; }
  catch { return false; }
}

function isTrustedSender(event) {
  return isTrustedUrl(event.senderFrame?.url || '') && isTrustedUrl(event.sender.getURL());
}

function overlayDisplay() {
  const displays = screen.getAllDisplays();
  const displayId = String(activeDisplaySource?.displayId || '');
  return displays.find((display) => String(display.id) === displayId) || screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) || screen.getPrimaryDisplay();
}

async function showAnnotationOverlay() {
  if (!activeDisplaySource?.isScreen) return false;
  const display = overlayDisplay();
  if (annotationOverlay && !annotationOverlay.isDestroyed()) {
    annotationOverlay.setBounds(display.bounds);
    annotationOverlay.showInactive();
    annotationOverlay.webContents.send('annotation-overlay-state', annotationOverlayState);
    return true;
  }
  annotationOverlay = new BrowserWindow({
    ...display.bounds,
    transparent: true,
    frame: false,
    focusable: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    show: false,
    hasShadow: false,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'annotation-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  annotationOverlay.setIgnoreMouseEvents(true, { forward: true });
  annotationOverlay.setAlwaysOnTop(true, 'screen-saver');
  annotationOverlay.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  annotationOverlay.setContentProtection(true);
  annotationOverlay.on('closed', () => { annotationOverlay = null; });
  await annotationOverlay.loadFile(path.join(__dirname, 'annotation-overlay.html'));
  annotationOverlay.webContents.send('annotation-overlay-state', annotationOverlayState);
  annotationOverlay.showInactive();
  return true;
}

function hideAnnotationOverlay() {
  if (annotationOverlay && !annotationOverlay.isDestroyed()) annotationOverlay.destroy();
  annotationOverlay = null; activeDisplaySource = null; annotationOverlayState = { items: [] };
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
    return isTrustedMediaUrl(requestingOrigin) && ['media', 'display-capture', 'fullscreen'].includes(permission);
  });

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
    const trusted = isTrustedMediaUrl(details?.requestingUrl || webContents.getURL());
    callback(trusted && ['media', 'display-capture', 'fullscreen'].includes(permission));
  });

  session.defaultSession.setDisplayMediaRequestHandler(async (request, callback) => {
    try {
      if (!request.userGesture || !isTrustedMediaUrl(request.securityOrigin) || !isTrustedMediaUrl(request.frame?.url || '')) {
        callback({});
        return;
      }
      const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
      const source = sources.find((item) => item.id === selectedDisplaySourceId);
      activeDisplaySource = source ? { id: source.id, displayId: source.display_id || '', isScreen: source.id.startsWith('screen:') } : null;
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
  }, { useSystemPicker: true });
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
    allowedSourceIds.set(event.sender.id, new Map(sources.map((source) => [source.id, { displayId: source.display_id || '', isScreen: source.id.startsWith('screen:') }])));
    return sources.map((source) => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL(),
      appIcon: source.appIcon?.toDataURL() || null,
      overlayAvailable: source.id.startsWith('screen:'),
    }));
  });

  ipcMain.handle('desktop:select-source', (event, sourceId) => {
    if (!isTrustedSender(event) || typeof sourceId !== 'string') return { accepted: false, overlayAvailable: false };
    const sourceMeta = allowedSourceIds.get(event.sender.id)?.get(sourceId);
    if (!sourceMeta) return { accepted: false, overlayAvailable: false };
    selectedDisplaySourceId = sourceId.slice(0, 300);
    allowedSourceIds.delete(event.sender.id);
    return { accepted: true, overlayAvailable: sourceMeta.isScreen };
  });

  ipcMain.handle('desktop:start-annotation-overlay', async (event) => {
    if (!isTrustedSender(event)) return false;
    return showAnnotationOverlay();
  });

  ipcMain.handle('desktop:update-annotation-overlay', (event, payload) => {
    if (!isTrustedSender(event)) return false;
    const json = JSON.stringify(payload || {});
    if (json.length > 600_000) return false;
    annotationOverlayState = JSON.parse(json);
    if (annotationOverlay && !annotationOverlay.isDestroyed()) annotationOverlay.webContents.send('annotation-overlay-state', annotationOverlayState);
    return true;
  });

  ipcMain.handle('desktop:stop-annotation-overlay', (event) => {
    if (!isTrustedSender(event)) return false;
    hideAnnotationOverlay(); return true;
  });
}

function createWindow(url) {
  const window = new BrowserWindow({
    title: 'Alpendre',
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: '#12131a',
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', 'alpendre.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.once('ready-to-show', () => window.show());
  window.on('closed', hideAnnotationOverlay);
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
  app.setAppUserModelId('com.alpendre.desktop');
  const url = process.env.ALPENDRE_USE_LOCAL === '1' || process.env.CONCORD_USE_LOCAL === '1' || process.env.LUME_USE_LOCAL === '1' ? await startLocalServer() : CLOUD_URL;
  appOrigin = new URL(url).origin;
  configureMediaPermissions();
  registerDesktopHandlers();
  createWindow(url);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(url);
  });
}).catch((error) => {
  console.error('Não foi possível iniciar o Alpendre:', error);
  app.quit();
});

app.on('second-instance', () => {
  const window = BrowserWindow.getAllWindows()[0];
  if (!window) return;
  if (window.isMinimized()) window.restore();
  window.focus();
});

app.on('window-all-closed', () => {
  hideAnnotationOverlay();
  localServer?.close();
  if (process.platform !== 'darwin') app.quit();
});
