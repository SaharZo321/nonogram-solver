import { useCallback, useContext, useEffect, useState } from "react";
import { BoardContainerPage } from "@components/Board/PageLayout";
import { Location, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, LinearProgress } from "@mui/material";
import Board from "@board-utils/board";
import { NavigateBefore, NavigateNext, Pause, PlayArrow } from "@mui/icons-material";
import GridBitArray from "@board-utils/gridBitArray";
import { StyledSlider } from "@components/General/StyledComponents";
import { solve, SolverProps } from "./solver";
import { SettingsContext } from "@renderer/App";




export default function BoardSolutions() {
    const { state: boardReference }: Location<BoardInterface> = useLocation()
    const { tileColor } = useContext(SettingsContext)
    const [shownBoard, setShownBoard] = useState(new Board(boardReference).emptyGrid())
    const [steps, setSteps] = useState<BoardSolution>([])
    const [position, setPosition] = useState(0)
    const [playingState, setPlayingState] = useState({ isPlaying: false, mode: false })
    const [animationParams, setAnimationParams] = useState({ step: 1, interval: 100 })
    const [rowIndexState, setRowIndexState] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {

        const onMessage: SolverProps["onMessage"] = message => {
            if (typeof message === "number") {
                setRowIndexState(message)
            } else {
                const steps = message;
                const grid = GridBitArray.getGrid(boardReference.size, steps[0])
                setShownBoard(new Board({ ...boardReference, grid }))
                setSteps(steps)
                const step = 1
                const interval = Math.min(Math.max(Math.ceil(30000 / steps.length), 5), 800)
                setAnimationParams({ step, interval })
            }
        }
        return solve({ onMessage, boardConstraints: boardReference.constraints })


    }, [])

    useEffect(() => {
        if (playingState.isPlaying) {
            const nextPosition = position + animationParams.step
            const interval = setInterval(() => {
                if (nextPosition < 0 || nextPosition >= steps.length) {
                    setPlayingState({ isPlaying: false, mode: false })
                    setPosition(0)
                    const grid = GridBitArray.getGrid(boardReference.size, steps[steps.length - 1])
                    setShownBoard(new Board({ ...boardReference, grid }))
                } else {
                    setPosition(nextPosition)
                    const grid = GridBitArray.getGrid(boardReference.size, steps[nextPosition])
                    setShownBoard(new Board({ ...boardReference, grid }))
                }
            }, animationParams.interval)
            return () => clearInterval(interval)
        }
    }, [playingState.isPlaying, position])

    const onStepsSliderChange = useCallback((position: number) => {
        const newPosition = (position + steps.length) % steps.length
        setPosition(newPosition)
        setPlayingState(prev => ({ ...prev, isPlaying: false }))
        const grid = GridBitArray.getGrid(boardReference.size, steps[newPosition])
        setShownBoard(new Board({ ...boardReference, grid }))
    }, [steps])

    return (
        <BoardContainerPage board={shownBoard} interactable={false} tileColor={tileColor} sizeVMin={60}>
            <Box display='flex' flexDirection='column' width={300} gap='16px'>
                <Box display='flex' justifyContent='space-around'>
                    <IconButton
                        size="large"
                        color='primary'
                        onClick={() => onStepsSliderChange(position - 1)}
                        disabled={steps.length === 0}
                    >
                        <NavigateBefore fontSize="large" />
                    </IconButton>
                    <IconButton
                        size="large"
                        color='primary'
                        onClick={() => setPlayingState(prev => ({ isPlaying: !prev.isPlaying, mode: !prev.isPlaying }))}
                        disabled={steps.length === 0}
                    >
                        {
                            playingState.isPlaying ?
                                <Pause fontSize="large" /> :
                                <PlayArrow fontSize="large" />
                        }
                    </IconButton>
                    <IconButton
                        size="large"
                        color='primary'
                        onClick={() => onStepsSliderChange(position + 1)}
                        disabled={steps.length === 0}
                    >
                        <NavigateNext fontSize="large" />
                    </IconButton>
                </Box>
                <StyledSlider
                    disabled={steps.length === 0}
                    aria-label="steps-indicator"
                    value={position}
                    min={0}
                    step={1}
                    max={steps.length - 1}
                    onChange={(_, value) => onStepsSliderChange(value as number)}
                    onChangeCommitted={() => setPlayingState(prev => ({ ...prev, isPlaying: prev.mode }))}
                />
                <Button variant="contained" size='large' onClick={() => navigate('/board-creation')} sx={{ fontWeight: 'bold' }}>
                    CREATE ANOTHER BOARD
                </Button>

                <Box width="80%" mx="10%" height="4px">
                    {
                        steps.length === 0 &&
                        <LinearProgress variant="determinate" value={(rowIndexState + 1) / shownBoard.size * 100} />
                    }
                </Box>

            </Box>
        </BoardContainerPage >
    )
}