import { useEffect, useState } from "react";
import { BoardContainerPage } from "Components/Board/PageLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import Board from "Board/Board";
import Solver, { StackSolver } from "Board/Solver";


export default function BoardSolutions() {
    const location = useLocation()
    const [shownBoard, setShownBoard] = useState(new Board(location.state ? location.state : { size: 10 }).emptyGrid())
    const navigate = useNavigate()
    useEffect(() => {
        if (!location.state) {
            alert('Board not found, returning to board creation')
            navigate('/ai-solver/board-creation')
        } else {

            setTimeout(() => {
                const solution = Solver(new Board(location.state))
                setShownBoard(solution.board)

                console.log(solution.steps)
                // StackSolver(new Board(location.state).emptyGrid())
            }, 1000)
            

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