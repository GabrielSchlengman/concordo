const { contextBridge, ipcRenderer } = require('electron');

const desktopBridge = {
  isDesktop: true,
  platform: process.platform,
  getDisplaySources: () => ipcRenderer.invoke('desktop:get-sources'),
  selectDisplaySource: (sourceId) => ipcRenderer.invoke('desktop:select-source', sourceId),
};

contextBridge.exposeInMainWorld('concordDesktop', desktopBridge);
