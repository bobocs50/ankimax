import { ipcMain } from 'electron';

ipcMain.handle('app:get-version', () => {
  return '0.1.0';
});
