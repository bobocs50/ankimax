import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {

  //App API
  getVersion: () => ipcRenderer.invoke('app:get-version'),

  //Message API
  postMessage: (message: string, captureScreenEnabled: boolean, history: { role: string; text: string }[]) => ipcRenderer.invoke('message:post-message', message, captureScreenEnabled, history),

  //Flashcard API
  getDecks: () => ipcRenderer.invoke('flashcard:get-decks'),
  initClipboardBaseline: () => ipcRenderer.invoke('flashcard:init-clipboard-baseline'),
  checkClipboard: () => ipcRenderer.invoke('flashcard:check-clipboard'),
  generateCard: () => ipcRenderer.invoke('flashcard:generate-card'),
  sendAnki: (card: { front: string; back: string; deckName: string }) => ipcRenderer.invoke('flashcard:send-anki', card),

  //Window API
  expandWindow: () => ipcRenderer.invoke('window:expand'),
  collapseWindow: () => ipcRenderer.invoke('window:collapse'),
  showDeckMenu: (decks: string[], selectedDeck: string) => ipcRenderer.invoke('window:show-deck-menu', decks, selectedDeck),
  onDeckSelected: (cb: (deck: string) => void) => ipcRenderer.on('deck-selected', (_e, deck) => cb(deck))
});
