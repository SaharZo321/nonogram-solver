import { Box, Button, List, ListItem, Typography, } from "@mui/material";

import Board, { BoardTile, Position } from "@board/Board";
import { PropsWithChildren, useCallback, useReducer, useState } from "react";
import styled from "@emotion/styled";
import { useDebouncedCallback } from "use-debounce";
import { Flip, RotateLeftRounded, RotateRightRounded } from "@mui/icons-material";
import { BoardContainerPage } from "@components/Board/PageLayout";
import { useNavigate } from "react-router-dom";
import { StyledButton, StyledSlider } from "@components/General/StyledComponents";

const defaultSize = 10
const demoBoard = new Board({ size: defaultSize })

type BoardReducerActions = {
    type: 'randomize',
    markingChance?: number,
} | {
    type: 'clear-board',
} | {
    type: 'change-size',
    size: number,
} | {
    type: 'rotate-right',
} | {
    type: 'rotate-left',
} | {
    type: 'flip-vertically',
} | {
    type: 'flip-horizontally',
} | {
    type: 'set-tile',
    tile: {
        position: Position,
        state: BoardTile,
    }
} | {
    type: 'flip-tile',
    tile: {
        position: Position,
    }
}

const boardReducer = (state: Board, action: BoardReducerActions) => {
    switch (action.type) {
        case "randomize":
            const clone = state.clone.randomize(action.markingChance ? action.markingChance : 0.5);
            return clone
        case "clear-board":
            return new Board({ size: state.size });
        case "change-size":
            return new Board({ size: action.size ? action.size : 10 });
        case "rotate-right":
            return state.clone.rotateClockwise();
        case "rotate-left":
            return state.clone.rotateCounterClockwise();
        case "flip-vertically":
            return state.clone.flipVertically()
        case "flip-horizontally":
            return state.clone.flipHorizontally()
        case "set-tile":
            return state.clone.setTile(action.tile.position, action.tile.state).generateTileConstraints(action.tile.position);
        case "flip-tile":
            const tileState = state.getTile(action.tile.position);
            return state.clone.setTile(action.tile.position,
                tileState === BoardTile.Marked ? BoardTile.Unmarked : BoardTile.Marked)
                .generateTileConstraints(action.tile.position);
        default:
            console.error("invalid action type");
            return state;
    }
}

const defaultChance = 0.5
export default function BoardCreation() {
    const [board, dispatchBoard] = useReducer(boardReducer, demoBoard)
    const [randomMarkingChance, setMarkingChance] = useState(defaultChance)
    const navigate = useNavigate()

    const handleBoardSizeChange = useDebouncedCallback((size: number) => {
        dispatchBoard({ type: 'change-size', size })
    }, 100)


    const handleMarkingChanceChange = useCallback((chance: number) => {
        setMarkingChance(chance)
    }, [])

    const handleFlipVertically = useCallback(() => {
        dispatchBoard({ type: 'flip-vertically' })
    }, [])

    const handleFlipHorizontally = useCallback(() => {
        dispatchBoard({ type: 'flip-horizontally' })
    }, [])

    const handleRotateLeft = useCallback(() => {
        dispatchBoard({ type: 'rotate-left' })
    }, [])

    const handleRotateRight = useCallback(() => {
        dispatchBoard({ type: 'rotate-right' })
    }, [])

    const setTile = useCallback((position: Position, state: BoardTile) => {
        dispatchBoard({ type: 'set-tile', tile: { position, state } })
    }, [])

    const randomizeBoard = useCallback(() => {
        dispatchBoard({ type: 'randomize', markingChance: randomMarkingChance })
    }, [randomMarkingChance])

    return (

        <BoardContainerPage
            board={board}
            interactable
            setTile={setTile}
            mainDrawState={BoardTile.Marked}
        >
            <List>
                <BoardUtilsItem text="Change Board Size">
                    <StyledSlider
                        min={5}
                        max={20}
                        step={1}
                        marks={marks}
                        track={false}
                        defaultValue={defaultSize}
                        valueLabelDisplay='auto'
                        onChange={(_, value) => handleBoardSizeChange(value as number)}
                    />
                </BoardUtilsItem>
                <BoardUtilsItem>
                    <RandomizingUtility
                        onClick={randomizeBoard}
                        onSliderChange={handleMarkingChanceChange}
                        defaultChance={defaultChance}
                    />
                </BoardUtilsItem>
                <BoardUtilsItem>
                    <Box sx={{
                        display: 'flex',
                        // gap: '16px',
                        justifyContent: 'space-between',
                        width: '100%',
                        flexDirection: 'row',

                    }}>
                        <StyledButton variant="contained" onClick={handleRotateLeft}>
                            <RotateLeftRounded fontSize='large' />
                        </StyledButton>
                        <StyledButton variant="contained" onClick={handleRotateRight}>
                            <RotateRightRounded fontSize='large' />
                        </StyledButton>
                        <StyledButton variant="contained" onClick={handleFlipHorizontally}>
                            <Flip fontSize='large' />
                        </StyledButton>
                        <StyledButton variant="contained" onClick={handleFlipVertically}>
                            <Flip fontSize='large' sx={{ transform: 'rotate(90deg)' }} />
                        </StyledButton>
                    </Box>
                </BoardUtilsItem>
                <BoardUtilsItem>
                    <Button variant="contained" size='large' sx={{ fontWeight: 'bold', width: '100%' }}
                        onClick={() => {
                            dispatchBoard({ type: 'clear-board' })
                        }}
                    >
                        reset Board
                    </Button>
                </BoardUtilsItem>
                <BoardUtilsItem>
                    <Button variant="contained" size='large' sx={{ fontWeight: 'bold', width: '100%' }}
                        onClick={() => {
                            if (board.isGridEmpty) {
                                alert('Cannot solve an empty grid!')
                            } else {
                                navigate('/ai-solver/board-solutions', {
                                    state: board
                                })
                            }
                        }}
                    >
                        SHOW ME THE SOLUTION
                    </Button>
                </BoardUtilsItem>
                <BoardUtilsItem>
                    <Button variant="contained" size='large' sx={{ fontWeight: 'bold', width: '100%' }}
                    >
                        Save Board
                    </Button>
                </BoardUtilsItem>
            </List>
        </BoardContainerPage>
    )
}

type RandomizingUtilityProps = {
    defaultChance: number
    onClick: () => void,
    onSliderChange: (number: number) => void
}
const RandomizingUtility = (props: RandomizingUtilityProps) => {

    const [chance, setChance] = useState(props.defaultChance)

    const handleSliderChange = useCallback((value: number) => {
        setChance(value as number)
        props.onSliderChange(value as number)
    }, [props.onSliderChange])


    return (
        <Box sx={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'center' }}>
            <Button variant="contained" onClick={props.onClick} size='large' sx={{ fontWeight: 'bold' }}>
                Randomize
            </Button>
            <Typography sx={{ flexBasis: '42px', textAlign: 'center' }}>
                {`${Math.round(chance * 100)}%`}
            </Typography>
            <Box display='flex' flexDirection='column' alignItems='center' flexGrow={2}>
                <Typography>
                    Chance
                </Typography>
                <StyledSlider
                    min={0.01}
                    max={1}
                    step={0.01}
                    track={false}
                    defaultValue={props.defaultChance}
                    onChange={(_, value) => handleSliderChange(value as number)}
                />
            </Box>
        </Box>
    )
}





type BoardUtilsItemProps = PropsWithChildren<{
    text?: string,

}>

const BoardUtilsItem = (props: BoardUtilsItemProps) => {
    return (
        <StyledListItem>
            {
                props.text &&
                <Typography variant="h6" fontWeight='bold'>
                    {props.text}
                </Typography>
            }
            {props.children}
        </StyledListItem>
    )
}

const StyledListItem = styled(ListItem)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    padding: 20px 0;

    @media (max-width: 1000px) and (orientation:portrait) {
        & {
            padding: 12px 0;
        }
    }
`

const marks = [
    {
        value: 5,
        label: '5x5',
    },
    {
        value: 10,
        label: '10x10',
    },
    {
        value: 15,
        label: '15x15',
    },
    {
        value: 20,
        label: '20x20',
    },
];
