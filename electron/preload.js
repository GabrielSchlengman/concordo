const { contextBridge, ipcRenderer } = require('electron');

const desktopBridge = {
  isDesktop: true,
  platform: process.platform,
  getDisplaySources: () => ipcRenderer.invoke('desktop:get-sources'),
  selectDisplaySource: (sourceId) => ipcRenderer.invoke('desktop:select-source', sourceId),
  startAnnotationOverlay: () => ipcRenderer.invoke('desktop:start-annotation-overlay'),
  updateAnnotationOverlay: (payload) => ipcRenderer.invoke('desktop:update-annotation-overlay', payload),
  stopAnnotationOverlay: () => ipcRenderer.invoke('desktop:stop-annotation-overlay'),
};

contextBridge.exposeInMainWorld('concordDesktop', desktopBridge);
