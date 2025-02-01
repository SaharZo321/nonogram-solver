import { useMemo } from "react";
import { Tile } from "./Tile";
import { Box, SxProps, styled } from "@mui/material";



type GridProps = {
    sx?: SxProps,
    tileSx?: SxProps,
    grid: BoardGrid,
    interactable?: boolean,
    onTileChange?: (position: Position, state: BoardTile) => void,
    hoverColor?: string,
    tileColor?: string
}

const GridContainer = styled(Box)(({ theme }) => ({
    boxSizing: 'border-box',
    display: 'grid',
    outline: `0.5vmin solid ${theme.palette.mode === 'dark' ? 'lightgrey' : 'black'}`,

}))
export const Grid = (props: GridProps) => {

    const gridSize = props.grid.length
    const gridAsArray = useMemo(() => (
        props.grid.flatMap((row, rowIndex) => row.map((tileState, colIndex) => {
                const position = {
                    row: rowIndex,
                    column: colIndex
                }

                return (
                    <Tile
                        key={`${rowIndex}-${colIndex}`}
                        state={tileState}
                        tileColor={props.tileColor}
                        hoverColor={props.hoverColor}
                        onChange={props.onTileChange ? state => props.onTileChange?.(position, state) : undefined}
                    />
                )
            })
    )), [props.grid, props.hoverColor, props.tileColor])

    return (
        <GridContainer sx={{
            gridTemplateColumns: `repeat(${gridSize}, auto)`,
            ...props.sx
        }}>
            {
                gridAsArray
            }
        </GridContainer >
    )
}