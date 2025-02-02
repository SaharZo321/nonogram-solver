import { Box, Icon, useTheme } from "@mui/material"
import { memo, useCallback } from "react"
import { CloseRounded } from "@mui/icons-material"
import styled from "@emotion/styled"


type TileProps = {
    state: BoardTile
    hoverColor?: string,
    tileColor?: string,
    onChange?: (state: BoardTile) => void
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
    const tileState = props.state
    const { mode } = useTheme().palette

    const handleMouseDown: React.MouseEventHandler = useCallback(event => {
        event.preventDefault()
        if (!props.onChange) return
        switch (event.button) {
            case 0: {
                props.onChange("marked")
            } break
            case 2: {
                props.onChange("unmarked")
            } break
        }
    }, [props.onChange])

    const handleMouseOver: React.MouseEventHandler = useCallback(event => {
        if (!props.onChange) return
        switch (event.buttons) {
            case 1: {
                props.onChange("marked")
            } break
            case 2: {
                props.onChange("unmarked")
            } break
        }
    }, [props.onChange])

    const disableContextMenu: React.MouseEventHandler = useCallback(event => event.preventDefault(), [])

    return (
        <TileWrapper
            onMouseDown={handleMouseDown}
            onMouseOver={handleMouseOver}
            onContextMenu={disableContextMenu}
            sx={{
                backgroundColor: tileState === "marked" ? props.tileColor : (mode === 'light' ? 'white' : 'lightgray'),
                cursor: props.onChange ? 'pointer' : undefined,
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
                props.onChange &&
                <TileMask color={props.hoverColor} />
            }
        </TileWrapper>
    )
}, (props, nextProps) => props.state === nextProps.state && props.hoverColor === nextProps.hoverColor && props.tileColor === nextProps.tileColor)
