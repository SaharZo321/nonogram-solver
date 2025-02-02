import { Box, styled } from "@mui/material";
import { ColumnConstraints, RowsConstraints } from "./Constraints";
import { useEffect, useMemo } from "react";
import Board from "@board-utils/board";
import { Grid } from "./Grid";
import Color from "color";


export type BoardContainerProps = {
    board: Board,
    sizeVMin: number,
    interactable?: boolean,
    setTile?: (position: Position, state: BoardTile) => void,
    hoverColor?: string
    tileColor?: string
    onConstraintClick?: (props: { type: "row" | "column", index: number }) => void
}


const Container = styled(Box)({
    display: 'grid',
    justifyContent: 'center',
    gridTemplateRows: '30% 70%',
    gridTemplateColumns: '23% 77%',
})


export function BoardContainer(props: BoardContainerProps) {

    useEffect(() => {
        if (props.interactable && !props.setTile) {
            console.warn('Board is interactable but setTile is undefined')
        }
    }, [])

    const hoverColor = useMemo(() => Color(props.hoverColor).fade(0.7).hexa(), [props.hoverColor])

    const fontSize = useMemo(() => `${props.sizeVMin / props.board.size * 0.4}vmin`, [props.sizeVMin, props.board.size])

    return (
        <Container width={`${props.sizeVMin}vmin`} height={`${props.sizeVMin * 1.1}vmin`} >
            <Box />
            <ColumnConstraints
                constraints={props.board.constraints.columns}
                sx={{ pb: `${props.sizeVMin / 45}vmin` }}
                fontSize={fontSize}
                onConstraintClick={props.onConstraintClick ?
                    index => props.onConstraintClick?.({ index, type: "column" }) :
                    undefined
                }
            />
            <RowsConstraints
                constraints={props.board.constraints.rows}
                sx={{ pr: `${props.sizeVMin / 55}vmin` }}
                fontSize={fontSize}
                onConstraintClick={props.onConstraintClick ?
                    index => props.onConstraintClick?.({ index, type: "row" }) :
                    undefined
                }
            />
            <Grid
                grid={props.board.grid}
                tileColor={props.tileColor}
                hoverColor={hoverColor}
                interactable={props.interactable}
                onTileChange={props.setTile}
            />
        </Container>
    )
}