import { Box, styled } from "@mui/material";
import Board, { BoardTile, Position } from "../../Board/Board";
import { TileGridContainer } from "./Grid";
import { ColumnConstraints, RowsConstraints } from "./Constraints";
import { createContext, memo, useContext, useEffect, useMemo, useReducer } from "react";


export type BoardContainerProps = {
    board: Board,
    interactable?: boolean,
    setTile?: (position: Position, state: BoardTile) => void
    mainDrawState?: BoardTile
}
const size = 70
const Containter = styled(Box)({
    display: 'grid',
    justifyContent: 'center',
    gridTemplateRows: '30% 70%',
    gridTemplateColumns: '30% 70%',
    width: `${size}vmin`,
    height: `${size}vmin`,
})


type BoardUtilsContext = {
    interactable?: boolean,
    setTile?: (position: Position, state: BoardTile) => void,
    mainDrawState: BoardTile
}

const initBoardUtilsContext: BoardUtilsContext = {
    interactable: true,
    setTile: (position: Position, state: BoardTile) => { },
    mainDrawState: BoardTile.Marked
}

export const BoardUtilsContext = createContext(initBoardUtilsContext)

export const BoardContainer = (props: BoardContainerProps) => {
    const { rows, columns } = props.board.constraints

    const boardUtilsContext: BoardUtilsContext = useMemo(() => ({
        interactable: props.interactable,
        setTile: props.setTile,
        mainDrawState: props.mainDrawState ? props.mainDrawState : BoardTile.Marked,
    }), [props.interactable, props.mainDrawState, props.setTile])

    useEffect(() => {
        if (props.interactable && !props.setTile) {
            console.warn('Board is interactable but setTile is undefined')
        }
    }, [])

    const fontSize = `${size / props.board.size / 2.6}vmin`
    return (
        <BoardUtilsContext.Provider value={boardUtilsContext}>
                <Containter>
                    <Box />
                    <ColumnConstraints constraints={columns} sx={{ pb: '0.5vmin' }} fontSize={fontSize} />
                    <RowsConstraints constraints={rows} sx={{ pr: '1.5vmin' }} fontSize={fontSize}/>
                    <TileGridContainer grid={props.board.grid} tileSize={70 * size / 100 / props.board.size} />
                </Containter>
        </BoardUtilsContext.Provider >
    )
}