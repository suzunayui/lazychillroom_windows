const { contextBridge, ipcRenderer } = require('electron')

// メインプロセスとの安全な通信を提供
contextBridge.exposeInMainWorld('electronAPI', {
  // アプリケーション情報
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // チャット関連の機能（今後追加予定）
  sendMessage: (message) => ipcRenderer.invoke('send-message', message),
  onMessage: (callback) => ipcRenderer.on('new-message', callback),
  
  // ファイル操作（今後追加予定）
  selectFile: () => ipcRenderer.invoke('select-file'),
  
  // ウィンドウ操作
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window')
})
