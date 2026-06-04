import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {

  //App API
  getVersion: () => ipcRenderer.invoke('app:get-version'),

  //Message API
  postMessage: (message: string, captureEnabled: boolean, history: { role: string; text: string }[]) => ipcRenderer.invoke('message:post-message', message, captureEnabled, history),

  //Flashcard API
  initClipboardBaseline: () => ipcRenderer.invoke('flashcard:init-clipboard-baseline'),
  getCards: () => ipcRenderer.invoke('flashcard:get-cards'),

  //Window API
  expandWindow: () => ipcRenderer.invoke('window:expand'),
  collapseWindow: () => ipcRenderer.invoke('window:collapse')
});
