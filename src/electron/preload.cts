import electron, { app, IpcRendererEvent, Menu } from "electron"

electron.contextBridge.exposeInMainWorld("electron", {
    isDev: () => ipcInvoke("isDev"),
    isMacOs: () => ipcInvoke("isMacOs"),
    sendFrameAction: payload => ipcSend("sendFrameAction", payload),
    subscribeThemeChange: callback => ipcOn("subscribeThemeChange", callback),
    setTitleBarOverlay: payload => ipcSend("setTitleBarOverlay", payload),
    getSystemTheme: () => ipcInvoke("getSystemTheme")
} satisfies Window["electron"])

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key)
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void,
) {
    const cb = (event: IpcRendererEvent, payload: any) => callback(payload)
    electron.ipcRenderer.on(key, cb)
    return () => electron.ipcRenderer.off(key, cb)
}

function ipcSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload: EventPayloadMapping[Key],
) {
    electron.ipcRenderer.send(key, payload)
}

