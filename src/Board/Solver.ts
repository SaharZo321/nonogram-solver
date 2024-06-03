import Board, { LineConstraint, BoardTile } from "./Board";
import { GridBitArray } from "./GridBitArray";

export type BoardSolution = {
    isSolved: boolean,
    board: Board
    nextSolutionRowIndexes?: number[]
}

type BoardLine = BoardTile[]
type BoardLineSolutions = BoardLine[]


export default function Solver(boardRefrence: Board): {board: Board, steps: GridBitArray[]} {

    const emptyBoard = boardRefrence.clone.emptyGrid()
    const allRowsSolutions = findAllRowsSolutions(emptyBoard)
    const steps: GridBitArray[] = [GridBitArray.convertBoard(emptyBoard)]

    function Solve(
        board: Board,
        rowIndex = 0): Board | undefined {

        if (rowIndex === allRowsSolutions.length) {
            return board
        }
        const thisRowsSolutions = allRowsSolutions[rowIndex];

        for (let i = 0; i < thisRowsSolutions.length; i++) {
            const newBoard = board.clone.setRow(rowIndex, thisRowsSolutions[i]);
            const gridSnapshot = GridBitArray.convertBoard(newBoard)
            steps.push(gridSnapshot)
            if (!isRowValid(newBoard, rowIndex)) { continue; }
            const solution = Solve(newBoard, rowIndex + 1)
            if (!solution) { continue; }
            return solution;
        }
        return undefined;
    }
    const solution = Solve(boardRefrence.emptyGrid())
    return !solution ? { board: boardRefrence.emptyGrid(), steps: [] } : { board: solution, steps }

}

function verifyLine(lineConstraint: LineConstraint, line: BoardLine, lastIndexToCheck = line.length - 1) {
    let lineConstraintIndex = 0;
    let markedTilesCounter = 0;
    let lastTileWasMarked = false;
    let minUnsolvedLength = lineConstraint.reduce((sum, constraint) => sum + constraint + 1, 0) - 1;

    for (let tileIndex = 0; tileIndex <= lastIndexToCheck; tileIndex++) {
        switch (line[tileIndex]) {
            case BoardTile.Marked: {
                if (!lastTileWasMarked && lineConstraintIndex >= lineConstraint.length) {
                    //started a new group and there too many groups
                    return false;
                }
                markedTilesCounter++;
                lastTileWasMarked = true; //starts a new group
                break;
            }
            case BoardTile.Unmarked: {
                if (lastTileWasMarked) {
                    if (lineConstraint[lineConstraintIndex] !== markedTilesCounter) {
                        //last tile was marked and the group was too short/long
                        return false;
                    }
                    minUnsolvedLength -= markedTilesCounter + 1;
                    markedTilesCounter = 0;
                    lineConstraintIndex++;
                } else if (minUnsolvedLength >= line.length - tileIndex) {
                    //there is not enough room for the left constraints
                    return false;
                }
                lastTileWasMarked = false;
                break;
            }
        }
    }
    // checks if the newest tile was the last in the line
    if (lastIndexToCheck === line.length - 1) {
        // make sure the row is done
        if (lastTileWasMarked) {
            return lineConstraintIndex === lineConstraint.length - 1 && markedTilesCounter === lineConstraint[lineConstraintIndex];
        }
        //returns if there is the number of groups needed if the last tile was unmarked
        return lineConstraintIndex === lineConstraint.length;
    }
    // make sure the row is done if last tile was marked 
    if (lastTileWasMarked) {
        //returns if number of last marked tiles is smaller than the group's
        return markedTilesCounter <= lineConstraint[lineConstraintIndex];
    }
    return true;
}

function isRowValid(board: Board, rowIndex: number): boolean {
    const columnsArray = getColumnsArray(board);
    return columnsArray.every((column, columnIndex) => {
        const isLineValid = verifyLine(board.constraintsClone.columns[columnIndex], column, rowIndex);
        return isLineValid;
    })
}

function getColumnsArray(board: Board) {
    const columnsArray = [];
    for (let c = 0; c < board.size; c++) {
        const column = []
        for (let r = 0; r < board.size; r++) {
            column.push(board.getTile({
                row: r,
                column: c
            }));
        }
        columnsArray.push(column);
    }
    return columnsArray;
}

function findAllRowsSolutions(board: Board) {

    const findAllLineSolutions = (lineConstraint: LineConstraint, line: BoardLine, lineSolutions: BoardLineSolutions = [], index = 0) => {
        if (index >= line.length) {
            lineSolutions.push([...line]);
            return lineSolutions;
        }
        line[index] = BoardTile.Marked;
        if (verifyLine(lineConstraint, line, index)) {
            findAllLineSolutions(lineConstraint, line, lineSolutions, index + 1);
        }
        line[index] = BoardTile.Unmarked;
        if (verifyLine(lineConstraint, line, index)) {
            findAllLineSolutions(lineConstraint, line, lineSolutions, index + 1);
        }
        return lineSolutions;
    }

    return board.gridClone.map((row, rowIndex) => findAllLineSolutions(
        board.constraintsClone.rows[rowIndex],
        row,
    ))
}
