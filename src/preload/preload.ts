import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {

  //App API
  getVersion: () => ipcRenderer.invoke('app:get-version'),

  //Message API
  postMessage: (message: string, captureScreenEnabled: boolean, history: { role: string; text: string }[]) => ipcRenderer.invoke('message:post-message', message, captureScreenEnabled, history),

  //Flashcard API
  initClipboardBaseline: () => ipcRenderer.invoke('flashcard:init-clipboard-baseline'),
  checkClipboard: () => ipcRenderer.invoke('flashcard:check-clipboard'),
  generateCard: () => ipcRenderer.invoke('flashcard:generate-card'),

  //Window API
  expandWindow: () => ipcRenderer.invoke('window:expand'),
  collapseWindow: () => ipcRenderer.invoke('window:collapse')
});
