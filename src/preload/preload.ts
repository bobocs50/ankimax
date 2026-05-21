import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  postHelloWorld: () => ipcRenderer.invoke('app:test'),
  postMessage: (message: string) => ipcRenderer.invoke('message:post-message', message)
});
