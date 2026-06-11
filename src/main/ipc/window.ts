import { ipcMain, BrowserWindow } from 'electron';

export function register() {
  // Expands the window to show the chat panel
  ipcMain.handle('window:expand', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.setSize(680, 500);
  });

  // Collapses the window back to the HUD bar
  ipcMain.handle('window:collapse', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.setSize(680, 125);
  });
}
