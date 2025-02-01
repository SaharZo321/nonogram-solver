import { ipcMain, WebContents, WebFrameMain } from "electron"

export function isDev(): boolean {
    return process.env.NODE_ENV === "development"
}
export function isMacOs(): boolean {
    return process.platform === "darwin"
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(key: Key, handler: (payload: EventPayloadMapping[Key]) => void) {
    ipcMain.handle(key, (_, payload) => {
        // validateEventFrame(event.senderFrame)
        return handler(payload)
    })
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (payload: EventPayloadMapping[Key]) => void,
) {
    ipcMain.on(key, (_, payload) => {
        return handler(payload)
    })
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key],
) {
    webContents.send(key, payload)
}

// export function validateEventFrame(frame: WebFrameMain | null) {
//     if (frame === null || (isDev() && new URL(frame.url).host === "localhost:5173")) {
//         return
//     }
//     if (frame.url !== pathToFileURL(getUIPath()).toString()) {
//         throw new Error(`Malicious Event`)
//     }
// }