const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0d0d0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── Window controls ──────────────────────────────────────────────────────────
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});
ipcMain.on('window-close', () => mainWindow.close());

// ── File system ──────────────────────────────────────────────────────────────
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('scan-directory', async (event, dirPath) => {
  try {
    const files = [];
    const scanDir = (dir, depth = 0) => {
      if (depth > 5) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        try {
          const stat = fs.statSync(fullPath);
          if (entry.isDirectory()) {
            scanDir(fullPath, depth + 1);
          } else {
            files.push({
              id: Buffer.from(fullPath).toString('base64').slice(0, 20),
              name: entry.name,
              path: fullPath,
              size: stat.size,
              modified: stat.mtime.toISOString(),
              ext: path.extname(entry.name).toLowerCase(),
            });
          }
        } catch (e) {}
      }
    };
    scanDir(dirPath);
    return { success: true, files };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-drives', async () => {
  // Windows drive detection
  const drives = [];
  for (let i = 65; i <= 90; i++) {
    const drive = `${String.fromCharCode(i)}:\\`;
    if (fs.existsSync(drive)) {
      try {
        const stat = fs.statSync(drive);
        drives.push({ letter: String.fromCharCode(i), path: drive });
      } catch (e) {}
    }
  }
  return drives;
});

ipcMain.handle('open-in-explorer', async (event, filePath) => {
  shell.showItemInFileExplorer(filePath);
});

ipcMain.handle('get-home-dir', () => os.homedir());
