import { useEffect, useRef, useState } from "react";
import Board from "../../../../Board/Board";
import { BoardContainerPage } from "../../../Board/PageLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ParallelSolver from "../../../../Board/BoardSolvers";


export default function BoardSolutions() {
    const location = useLocation()
    const [shownBoard, setShownBoard] = useState(new Board(location.state ? location.state : { size: 10 }))
    const solverRef = useRef(new ParallelSolver(shownBoard))
    const navigate = useNavigate()
    useEffect(() => {
        if (!location.state) {
            alert('Board not found, returning to board creation')
            navigate('/ai-solver/board-creation')
        } else {
            const solution = solverRef.current.findNextSolution()
            if (solution) {
                const { board } = solution
                setShownBoard(board)
            }
        }
    }, [])
    return (location.state ?
        <BoardContainerPage board={shownBoard} interactable={false}>
            <Box display='flex' flexDirection='column' width={300}>
                <Button variant="contained" size='large' onClick={() => navigate('/ai-solver/board-creation')} sx={{ fontWeight: 'bold' }}>
                    Create Another Board
                </Button>
            </Box>
        </BoardContainerPage> :
        <></>
    )
}