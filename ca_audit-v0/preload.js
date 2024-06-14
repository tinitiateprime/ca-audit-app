const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getUsers: () => ipcRenderer.invoke('get-users'),
  saveUsers: (users) => ipcRenderer.invoke('save-users', users),
  checkAdmin: (credentials) => ipcRenderer.invoke('check-admin', credentials),
  readClients: () => ipcRenderer.invoke('read-clients'),
  getAudits: (client) => ipcRenderer.invoke('get-audits',client),
  writeClient: (client) => ipcRenderer.invoke('write-client', client),
  modifyClient: (client) => ipcRenderer.invoke('modify-client', client),
  saveClientToSharePoint: (client) => ipcRenderer.invoke('save-client-to-sharepoint', client),
  saveJSON: (jsonString,client,audit) => ipcRenderer.invoke('save-json', jsonString,client,audit),
  getJSOndata: (username,client,audit) => ipcRenderer.invoke('get-data-json', username,client,audit),
});
