import { memo } from "react";
import { Tile } from "./Tile";
import { Box, SxProps, styled } from "@mui/material";



type GridProps = {
    sx?: SxProps,
    tileSx?: SxProps,
    grid: BoardGrid,
    tileSize: number,
}

const GridContainer = styled(Box)(({ theme }) => ({
    boxSizing: 'border-box',
    display: 'grid',
    outline: `0.5vmin solid ${theme.palette.mode === 'dark' ? 'lightgrey' : 'black'}`,

}))
export const Grid = memo((props: GridProps) => {

    const gridSize = props.grid.length
    const gridAsArray = props.grid.reduce((accumulator, currentRow) => accumulator.concat(currentRow))
        .map((tileState, index) => {
            const position = {
                row: Math.floor(index / gridSize),
                column: index % gridSize
            }

            return (
                <Tile key={index} state={tileState} position={position} tileVMinSize={props.tileSize} />
            )
        })

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
})