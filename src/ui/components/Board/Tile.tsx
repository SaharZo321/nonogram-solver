import { Box, Icon, useTheme } from "@mui/material"
import { memo, useCallback, useContext } from "react"
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
    const {interactable, hoverColor, setTile, mainDrawState} = useContext(BoardUtilsContext)
    // const boardContext = useContext(BoardContext)
    // const [tileState, setTileState] = useState(boardContext.board.getTile(props.position))
    const tileState = props.state
    const { mode } = useTheme().palette
    const handleMouseDown = useCallback((button: number) => {
        if (!interactable) return
        switch (button) {
            case 0: {
                setTile?.(props.position, mainDrawState)
            } break
            case 2: {
                setTile?.(props.position, "unmarked")
            } break
        }
    }, [props.position])

    const handleMouseOver = useCallback((buttons: number) => {
        if (!interactable) return
        switch (buttons) {
            case 1: {
                setTile?.(props.position, mainDrawState)
            } break
            case 2: {
                setTile?.(props.position, "unmarked")
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
                backgroundColor: tileState === "marked" ? 'black' : (mode === 'light' ? 'white' : 'lightgray'),
                cursor: interactable ? 'pointer' : undefined,
                height: `${props.tileVMinSize}vmin`,
                width: `${props.tileVMinSize}vmin`,
            }}
        >
            {
                tileState === "flagged" &&
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
                interactable &&
                <TileMask color={hoverColor} />
            }
        </TileWrapper>
    )
}, ({ state, tileVMinSize: tileSize }, { state: nextState, tileVMinSize: nextTileSize }) => state === nextState && tileSize === nextTileSize)
