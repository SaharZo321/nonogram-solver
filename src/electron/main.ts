import { app, BrowserWindow, ipcMain, Menu, nativeTheme } from 'electron'
import { ipcMainHandle, ipcMainOn, ipcWebContentsSend, isDev, isMacOs } from './util.js'
import { getPreloadPath, getUIPath } from './pathResolver.js'

const minWindowSize = {
    width: 900,
    height: 600,
}

function menuTemplate(mainWindow: BrowserWindow) {
    return Menu.buildFromTemplate([
        {
            label: "App",
            submenu: [
                {
                    label: "Quit",
                    click: app.quit
                },
                {
                    label: "Open DevTools",
                    click: () => mainWindow.webContents.openDevTools(),
                    visible: isDev()
                }
            ]
        }, {
            label: "Theme",
            submenu: [
                {
                    label: "System",
                    click: () => nativeTheme.themeSource = "system"
                },
                {
                    label: "Light",
                    click: () => nativeTheme.themeSource = "light"
                },
                {
                    label: "Dark",
                    click: () => nativeTheme.themeSource = "dark"
                },
            ]
        }
    ])
}

function createWindow() {

    const mainWindow = new BrowserWindow({
        minHeight: minWindowSize.height,
        minWidth: minWindowSize.width,
        height: minWindowSize.height,
        width: minWindowSize.width,
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: "#FFF",
            height: 36,
        },
        webPreferences: {
            preload: getPreloadPath(),
            sandbox: false,
        },
    })
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5173")
    } else {
        mainWindow.loadFile(getUIPath())
    }
    ipcMainHandle("isDev", isDev)
    ipcMainHandle("isMacOs", isMacOs)
    ipcMainOn("sendFrameAction", payload => {
        switch (payload) {
            case 'QUIT':
                app.quit()
                break
            case 'MAXIMIZE':
                !mainWindow.isMaximized() ? mainWindow.maximize() : mainWindow.unmaximize()
                break
            case 'MINIMIZE':
                mainWindow.minimize()
                break
            case 'OPEN_DEVTOOLS':
                mainWindow.webContents.openDevTools()
                break

        }
    })
    nativeTheme.addListener("updated", () => {
        ipcWebContentsSend("subscribeThemeChange", mainWindow.webContents, nativeTheme.shouldUseDarkColors ? "dark" : "light")
    })

    ipcMainOn("setTitleBarOverlay", payload => {
        mainWindow.setTitleBarOverlay(payload)
    })

    ipcMainHandle("getSystemTheme", () => nativeTheme.shouldUseDarkColors ? "dark" : "light")

    if (isMacOs()) {
        mainWindow.setMenu(menuTemplate(mainWindow))
    }
}


app.whenReady().then(() => {
    createWindow()
})