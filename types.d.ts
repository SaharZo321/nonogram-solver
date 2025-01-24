interface Window {
    electron: {
        isDev: () => Promise<boolean>
        sendFrameAction: (payload: EventPayloadMapping["sendFrameAction"]) => void
    }
}

type EventPayloadMapping = {
    isDev: boolean,
    sendFrameAction: "QUIT" | "MAXIMIZE" | "MINIMIZE" | "OPEN_DEVTOOLS",
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