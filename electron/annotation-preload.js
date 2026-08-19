const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('concordAnnotationOverlay', {
  onState: (listener) => ipcRenderer.on('annotation-overlay-state', (_event, state) => listener(state)),
});
