import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {

  //App API
  getVersion: () => ipcRenderer.invoke('app:get-version'),

  //Message API
  postMessage: (message: string) => ipcRenderer.invoke('message:post-message', message),

  //Window API
  expandWindow: () => ipcRenderer.invoke('window:expand'),
  collapseWindow: () => ipcRenderer.invoke('window:collapse')
});
