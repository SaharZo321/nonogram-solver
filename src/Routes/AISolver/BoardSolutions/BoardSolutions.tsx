import { useCallback, useEffect, useState } from "react";
import { BoardContainerPage } from "@components/Board/PageLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, IconButton, useTheme } from "@mui/material";
import Board from "@board/Board";
import { NavigateBefore, NavigateNext, Pause, PlayArrow } from "@mui/icons-material";
import { GridBitArray } from "@board/GridBitArray";
import { StyledSlider } from "@components/General/StyledComponents";
import { Solution } from "./SolverWorker";




export default function BoardSolutions() {
    const location = useLocation()
    const [shownBoard, setShownBoard] = useState(new Board(location.state ? location.state : { size: 10 }).emptyGrid())
    const [steps, setSteps] = useState<number[][]>([])
    const [position, setPosition] = useState(0)
    const [playingState, setPlayingState] = useState({ isPlaying: false, mode: false })
    const [animationParams, setAnimationParams] = useState({ step: 1, interval: 100 })
    const navigate = useNavigate()



    useEffect(() => {
        if (!location.state) {
            alert('Board not found, returning to board creation')
            navigate('/ai-solver/board-creation')
        } else {

            const solverWorker = new Worker(new URL("./SolverWorker.ts", import.meta.url), { type: "module" })

            solverWorker.onmessage = (event) => {
                const solution: Solution = event.data;
                console.log(solution)
                const grid = GridBitArray.getGrid(location.state.size, solution.steps[0])
                setShownBoard(new Board({ ...location.state, grid }))
                setSteps(solution.steps)
                const step = 1
                const interval = Math.min(Math.max(Math.ceil(30000 / solution.steps.length), 5), 800)
                setAnimationParams({ step, interval })
                console.log(solution.steps.length)
            }
            const timeout = setTimeout(() => solverWorker.postMessage(location.state), 500)


            return () => {
                clearTimeout(timeout)
                solverWorker.terminate()
            }
        }
    }, [])
    useEffect(() => {
        if (playingState.isPlaying) {
            const nextPosition = position + animationParams.step
            const interval = setInterval(() => {
                if (nextPosition < 0 || nextPosition >= steps.length) {
                    setPlayingState({ isPlaying: false, mode: false })
                    setPosition(0)
                    const grid = GridBitArray.getGrid(location.state.size, steps[steps.length - 1])
                    setShownBoard(new Board({ ...location.state, grid }))
                } else {
                    setPosition(nextPosition)
                    const grid = GridBitArray.getGrid(location.state.size, steps[nextPosition])
                    setShownBoard(new Board({ ...location.state, grid }))
                }
            }, animationParams.interval)
            return () => clearInterval(interval)
        }
    }, [playingState.isPlaying, position])

    const onStepsSliderChange = useCallback((position: number) => {
        const newPosition = (position + steps.length) % steps.length
        setPosition(newPosition)
        setPlayingState(prev => ({ ...prev, isPlaying: false }))
        const grid = GridBitArray.getGrid(location.state.size, steps[newPosition])
        setShownBoard(new Board({ ...location.state, grid }))
    }, [steps])

    return (location.state ?
        <BoardContainerPage board={shownBoard} interactable={false}>
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
                    {steps.length !== 0 ?
                        <IconButton
                            size="large"
                            color='primary'
                            onClick={() => setPlayingState(prev => ({ isPlaying: !prev.isPlaying, mode: !prev.isPlaying }))}
                        >
                            {
                                playingState.isPlaying ?
                                    <Pause fontSize="large" /> :
                                    <PlayArrow fontSize="large" />
                            }
                        </IconButton> :
                        <CircularProgress size={35} sx={{ marginY: "auto" }} />
                    }
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
                <Button variant="contained" size='large' onClick={() => navigate('/ai-solver/board-creation')} sx={{ fontWeight: 'bold' }}>
                    Create Another Board
                </Button>
                <Box display='flex' justifyContent='space-around'>

                </Box>
            </Box>
        </BoardContainerPage > :
        <></>
    )
}