import { app, BrowserWindow, screen, desktopCapturer } from 'electron';
import path from 'node:path';
import './ipc';

const isDev = !app.isPackaged;

//Windows
function createFloatingHud() {
  const window = new BrowserWindow({
    width: 680,
    height: 125,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: true,
    skipTaskbar: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  window.setContentProtection(true);

  // Position at top center of screen
  const display = screen.getPrimaryDisplay();
  const x = Math.round((display.bounds.width - 680) / 2);
  const y = 40;
  window.setPosition(x, y);

  if (isDev) {
    void window.loadURL('http://localhost:5173');
    window.webContents.openDevTools({ mode: 'detach' });
    return;
  }

  void window.loadFile(path.join(__dirname, '../../dist/index.html'));
}

//Starts after app is finished initializing -> Runs once
app.whenReady().then(() => {
  createFloatingHud();
  if (!app.isPackaged) {
    // Trigger permission prompt in development mode
    desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1, height: 1 } }).catch(() => {});
  }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createFloatingHud();
    }
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
