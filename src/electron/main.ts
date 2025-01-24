import { app, BrowserWindow } from 'electron'
import path from 'path'
import { ipcMainHandle, ipcMainOn, isDev } from './util.js'
import { getPreloadPath, getUIPath } from './pathResolver.js'
import setMenu from './menu.js'

const minWindowSize = {
    width: 900,
    height: 600,
}

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath()
        },
        minHeight: minWindowSize.height,
        minWidth: minWindowSize.width,
        frame: false,
    })
    mainWindow.setSize(minWindowSize.width, minWindowSize.height)
    setMenu(mainWindow)
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5173")
    } else {
        mainWindow.loadFile(getUIPath())
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