import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      moveWindow: (dx, dy) => ipcRenderer.send('move-window', { dx, dy }),
      setIgnoreMouse: (ignore) => ipcRenderer.send('set-ignore-mouse', ignore),
    })
    contextBridge.exposeInMainWorld('AiRequest', {
      test: () => console.log('test'),
      get: (prompt) => {
        return new Promise((resolve, reject) => {
          ipcRenderer.once('ai-response', (event, response) => {
            resolve(response)
          })
          ipcRenderer.send('ai-request', prompt)
        })
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
