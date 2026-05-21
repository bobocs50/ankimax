import { ipcMain, BrowserWindow } from 'electron';

ipcMain.handle('app:get-version', () => {
  return '0.1.0';
});

ipcMain.handle('message:post-message', (_event, message: string) => {
  console.log('Message received:', message);
});

ipcMain.handle('window:expand', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.setSize(680, 500);
});

ipcMain.handle('window:collapse', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.setSize(680, 125);
});