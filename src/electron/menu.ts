import { BrowserWindow, Menu, app } from "electron";
import { isDev } from "./util.js";

export default function setMenu(mainWindow: BrowserWindow) {
    mainWindow.setMenu(Menu.buildFromTemplate([
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
        }
    ]))
}