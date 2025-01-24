import { Box, styled } from "@mui/material";
import { ColumnConstraints, RowsConstraints } from "./Constraints";
import { createContext, useEffect, useMemo } from "react";
import Board from "@board-utils/board";
import { Grid } from "./Grid";


export type BoardContainerProps = {
    board: Board,
    interactable?: boolean,
    setTile?: (position: Position, state: BoardTile) => void
    mainDrawState?: BoardTile,
    hoverColor?: string,
}
const size = 70
const Container = styled(Box)({
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
    mainDrawState: BoardTile,
    hoverColor?: string
}

const initBoardUtilsContext: BoardUtilsContext = {
    interactable: true,
    setTile: () => { },
    mainDrawState: "marked",
}

export const BoardUtilsContext = createContext(initBoardUtilsContext)

export function BoardContainer(props: BoardContainerProps) {
    const { rows, columns } = props.board.constraints

    const boardUtilsContext: BoardUtilsContext = useMemo(() => ({
        interactable: props.interactable,
        setTile: props.setTile,
        mainDrawState: props.mainDrawState ? props.mainDrawState : "marked",
        hoverColor: props.hoverColor
    }), [props])

    useEffect(() => {
        if (props.interactable && !props.setTile) {
            console.warn('Board is interactable but setTile is undefined')
        }
    }, [])

    const fontSize = `${size / props.board.size / 2.6}vmin`
    return (
        <BoardUtilsContext.Provider value={boardUtilsContext}>
            <Container>
                <Box />
                <ColumnConstraints constraints={columns} sx={{ pb: '0.5vmin' }} fontSize={fontSize} />
                <RowsConstraints constraints={rows} sx={{ pr: '1.5vmin' }} fontSize={fontSize} />
                <Grid grid={props.board.grid} tileSize={70 * size / 100 / props.board.size} />
            </Container>
        </BoardUtilsContext.Provider >
    )
}