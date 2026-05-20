const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // File system
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanDirectory: (path) => ipcRenderer.invoke('scan-directory', path),
  getDrives: () => ipcRenderer.invoke('get-drives'),
  openInExplorer: (path) => ipcRenderer.invoke('open-in-explorer', path),
  getHomeDir: () => ipcRenderer.invoke('get-home-dir'),
});
