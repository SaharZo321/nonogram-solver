import { app, BrowserWindow } from 'electron'
import path from 'path'
import { ipcMainHandle, ipcMainOn, isDev } from './util.js'
import { getPreloadPath } from './pathResolver.js'

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath()
        },
        minHeight: 600,
        minWidth: 900,
        frame: false,
    })
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5173")
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'))
    }
    ipcMainHandle("isDev", isDev)
    ipcMainOn("sendFrameAction", payload => {
        switch(payload) {
            case 'QUIT':
                app.quit()
                break
            case 'MAXIMIZE':
                mainWindow.maximize()
                break
            case 'MINIMIZE':
                mainWindow.minimize()
                break
            case 'OPEN_DEVTOOLS':
                mainWindow.webContents.openDevTools()
                break
                
        }
    })
})