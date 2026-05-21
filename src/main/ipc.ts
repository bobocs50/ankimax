import { ipcMain } from 'electron';

ipcMain.handle('app:get-version', () => {
  return '0.1.0';
});

ipcMain.handle('app:test', () => {
  console.log('Hello World');
});

ipcMain.handle('message:post-message', (_event, message: string) => {
  console.log('Message received:', message);
});