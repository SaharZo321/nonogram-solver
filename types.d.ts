interface Window {
    electron: {
        isDev: () => Promise<boolean>
        isMacOs: () => Promise<boolean>
        sendFrameAction: (payload: EventPayloadMapping["sendFrameAction"]) => void
        subscribeThemeChange: (callback: (payload: EventPayloadMapping["subscribeThemeChange"]) => void) => UnsubscribeFunction
        getSystemTheme: () => Promise<EventPayloadMapping["getSystemTheme"]>
        setTitleBarOverlay: (payload: EventPayloadMapping["setTitleBarOverlay"]) => void
    }
}

type UnsubscribeFunction = () => void



type EventPayloadMapping = {
    isDev: boolean,
    sendFrameAction: "QUIT" | "MAXIMIZE" | "MINIMIZE" | "OPEN_DEVTOOLS",
    subscribeThemeChange: "dark" | "light",
    setTitleBarOverlay: TitleBarOverlayOptions
    getSystemTheme: "dark" | "light",
    isMacOs: boolean
}

type TitleBarOverlayOptions = {
    color?: string,
    symbolColor?: string,
    height?: number
}

type GridBitArray = number[]

type BoardSolution = GridBitArray[]

interface BoardInterface {
    size: number,
    grid: BoardGrid,
    constraints: BoardConstraints,
}


type BoardTile = "unmarked" | "marked" | "flagged"


type Position = {
    row: number,
    column: number,
}

type BoardGrid = BoardTile[][]

type LineConstraint = number[]

type BoardConstraints = {
    rows: LineConstraint[],
    columns: LineConstraint[],
}