import { ipcMain, BrowserWindow, Menu } from 'electron';

export function register() {
  // Expands the window to show the chat panel
  ipcMain.handle('window:expand', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.setSize(680, 500);
  });

  // Collapses the window back to the HUD bar
  ipcMain.handle('window:collapse', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.setSize(680, 125);
  });

  // Shows a native OS context menu with deck names; sends selected deck back via IPC
  ipcMain.handle('window:show-deck-menu', (event, decks: string[], selectedDeck: string) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    const menu = Menu.buildFromTemplate(
      [...decks].sort((a, b) => a.localeCompare(b)).map(deck => ({
        label: deck,
        type: 'radio' as const,
        checked: deck === selectedDeck,
        click: () => win.webContents.send('deck-selected', deck),
      }))
    );
    menu.popup({ window: win });
  });
}
