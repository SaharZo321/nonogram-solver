import { useCallback, useEffect, useState } from "react";
import { BoardContainerPage } from "Components/Board/PageLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Slider, useTheme } from "@mui/material";
import Board from "Board/Board";
import Solver, { StackSolver } from "Board/Solver";
import { NavigateBefore, NavigateNext, Pause, PlayArrow } from "@mui/icons-material";
import { GridBitArray } from "Board/GridBitArray";


export default function BoardSolutions() {
    const location = useLocation()
    const [shownBoard, setShownBoard] = useState(new Board(location.state ? location.state : { size: 10 }).emptyGrid())
    const [steps, setSteps] = useState<GridBitArray[]>([])
    const [position, setPosition] = useState(0)
    const [playingState, setPlayingState] = useState({ isPlaying: false, mode: false })
    const [animationParams, setAnimationParams] = useState({ step: 1, interval: 100 })
    const navigate = useNavigate()
    const theme = useTheme()
    useEffect(() => {
        if (!location.state) {
            alert('Board not found, returning to board creation')
            navigate('/ai-solver/board-creation')
        } else {

            const timeout = setTimeout(() => {
                const solution = Solver(new Board(location.state))
                setShownBoard(solution.steps[0].getBoard(location.state))
                setSteps(solution.steps)
                const step = 1
                const interval = Math.min(Math.max(Math.ceil(30000 / solution.steps.length), 5), 800)
                setAnimationParams({ step, interval })
                console.log(solution.steps.length)
                // StackSolver(new Board(location.state).emptyGrid())
            }, 1000)

            return () => clearTimeout(timeout)
        }
    }, [])
    useEffect(() => {
        if (playingState.isPlaying) {
            const nextPosition = position + animationParams.step
            const interval = setInterval(() => {
                if (nextPosition < 0 || nextPosition >= steps.length) {
                    setPlayingState({ isPlaying: false, mode: false })
                    setPosition(0)
                    setShownBoard(steps[steps.length - 1].getBoard(location.state))
                } else {
                    setPosition(nextPosition)
                    setShownBoard(steps[nextPosition].getBoard(location.state))
                }
            }, animationParams.interval)
            return () => clearInterval(interval)
        }
    }, [playingState.isPlaying, position])

    const onStepsSliderChange = useCallback((position: number) => {
        const newPosition = (position + steps.length) % steps.length
        setPosition(newPosition)
        setPlayingState(prev => ({ ...prev, isPlaying: false }))
        setShownBoard(steps[newPosition].getBoard(location.state))
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
                    <IconButton
                        size="large"
                        color='primary'
                        onClick={() => setPlayingState(prev => ({ isPlaying: !prev.isPlaying, mode: !prev.isPlaying }))}
                        disabled={steps.length === 0}>
                        {
                            playingState.isPlaying ?
                                <Pause fontSize="large" /> :
                                <PlayArrow fontSize="large" />}
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
                <Slider
                    disabled={steps.length === 0}
                    aria-label="steps-indicator"
                    value={position}
                    min={0}
                    step={1}
                    max={steps.length - 1}
                    onChange={(_, value) => onStepsSliderChange(value as number)}
                    onChangeCommitted={() => setPlayingState(prev => ({ ...prev, isPlaying: prev.mode }))}
                    sx={{
                        height: 4,
                        '& .MuiSlider-thumb': {
                            width: 16,
                            height: 16,
                            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                            '&::before': {
                                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                            },
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
                                    ? 'rgb(255 255 255 / 16%)'
                                    : 'rgb(0 0 0 / 16%)'
                                    }`,
                            },
                            '&.Mui-active': {
                                width: 24,
                                height: 24,
                            },
                        },
                        '& .MuiSlider-rail': {
                            opacity: 0.28,
                        },
                    }}
                />
                <Button variant="contained" size='large' onClick={() => navigate('/ai-solver/board-creation')} sx={{ fontWeight: 'bold' }}>
                    Create Another Board
                </Button>
            </Box>
        </BoardContainerPage> :
        <></>
    )
}