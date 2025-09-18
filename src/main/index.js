import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import AI from '../core/AI'

let win

function createWindow() {
  win = new BrowserWindow({
    width: 550,
    height: 520,
    resizable: false,
    show: false,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    autoHideMenuBar: true,
    acceptFirstMouse: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false,
    },
    ...(process.platform === 'linux' ? { icon } : {})
  })

  win.on('ready-to-show', () => {
    win.setIgnoreMouseEvents(false, { forward: true })
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

  // IPC: переключение режима игнорирования мыши
  ipcMain.on('set-ignore-mouse', (event, ignore) => {
    if (!win) return
    win.setIgnoreMouseEvents(ignore, { forward: true })
  })

// IPC для перемещения окна
ipcMain.on('move-window', (event, { dx, dy }) => {
  if (!win) return
  const [x, y] = win.getPosition()
  win.setPosition(x + dx, y + dy)
})

// IPC для отправки запроса на AI
ipcMain.on('ai-request', async (event, prompt) => {
  try {
    const response = await AI.generateResponse(prompt)
    event.sender.send('ai-response', response)
  } catch (err) {
    console.error(err)
    event.sender.send('ai-response', `Ошибка: ${err.message}`)
  }
})


// Старт приложения
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.kazilsky.ukagaka')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
