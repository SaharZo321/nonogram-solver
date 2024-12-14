import { Box, ButtonBase, Icon, SxProps, useTheme } from "@mui/material"
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ColorModeContext, SettingsContext } from "@renderer/App"
import { BoardTile } from "../../Board/Board"
import { CloseRounded } from "@mui/icons-material"
import styled from "@emotion/styled"
import { BoardUtilsContext } from "./BoardContainer"



type TileProps = {
    state: BoardTile
    tileVMinSize: number,
    position: {
        row: number,
        column: number,
    }
}

const TileWrapper = styled(Box)`
    border: 1px black solid;
    display: grid;
    box-sizing: border-box;
`

const TileMask = styled.div`
    width: 100%;
    height: 100%;
    grid-row: 1;
    grid-column: 1;

    @media (hover: hover) {
        &:hover {
            background-color: ${props => props.color};
        }
   }
`
export const Tile = memo((props: TileProps) => {
    const { hoverColor } = useContext(SettingsContext)
    const boardUtilsContext = useContext(BoardUtilsContext)
    // const boardContext = useContext(BoardContext)
    // const [tileState, setTileState] = useState(boardContext.board.getTile(props.position))
    const tileState = props.state
    const { mode } = useTheme().palette
    const handleMouseDown = useCallback((button: number) => {
        if (!boardUtilsContext.interactable) return
        switch (button) {
            case 0: {
                boardUtilsContext.setTile?.(props.position, boardUtilsContext.mainDrawState)
                // setTileState(BoardTile.Marked)
            } break
            case 2: {
                boardUtilsContext.setTile?.(props.position, BoardTile.Unmarked)
                // setTileState(BoardTile.Unmarked)
            } break
        }
    }, [props.position])

    const handleMouseOver = useCallback((buttons: number) => {
        if (!boardUtilsContext.interactable) return
        switch (buttons) {
            case 1: {
                boardUtilsContext.setTile?.(props.position, boardUtilsContext.mainDrawState)
                // setTileState(BoardTile.Marked)
            } break
            case 2: {
                boardUtilsContext.setTile?.(props.position, BoardTile.Unmarked)
                // setTileState(BoardTile.Unmarked)
            } break
        }
    }, [props.position])

    return (
        <TileWrapper
            onMouseDown={event => {
                event.preventDefault()
                handleMouseDown(event.button)
            }}
            onMouseOver={event => {
                handleMouseOver(event.buttons)
            }}
            onContextMenu={event => {
                event.preventDefault()
            }}
            sx={{
                backgroundColor: tileState === BoardTile.Marked ? 'black' : (mode === 'light' ? 'white' : 'lightgray'),
                cursor: boardUtilsContext.interactable ? 'pointer' : undefined,
                height: `${props.tileVMinSize}vmin`,
                width: `${props.tileVMinSize}vmin`,
            }}
        >
            {
                tileState === BoardTile.Flagged &&
                <Icon sx={{
                    width: '100%',
                    height: '100%',
                    gridRow: 1,
                    gridColumn: 1,
                }}>
                    <CloseRounded sx={{
                        width: '100%',
                        height: '100%',
                    }} />
                </Icon>
            }
            {
                boardUtilsContext.interactable &&
                <TileMask color={hoverColor} />
            }
        </TileWrapper>
    )
}, ({ state, tileVMinSize: tileSize }, { state: nextState, tileVMinSize: nextTileSize }) => state === nextState && tileSize === nextTileSize)
