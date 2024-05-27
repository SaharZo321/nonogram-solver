import Board, { LineConstraint, BoardTile } from "./Board";

export type BoardSolution = {
    isSolved: boolean,
    board: Board
    nextSolutionRowIndexes?: number[]
}

type BoardLine = BoardTile[]
type BoardLineSolutions = BoardLine[]

export default class ParallelSolver {
    #solutions: BoardSolution[];
    #isFoundAllSolutions: boolean;
    #allRowsSolutions;
    #boardRefrence: Board

    constructor(board: Board) {
        this.#boardRefrence = board.clone.emptyGrid();
        this.#solutions = [/*this.getNextSolution()*/];
        this.#isFoundAllSolutions = false;
        this.#allRowsSolutions = this.#findAllRowsSolutions();
    }

    get solutions() {
        return {
            foundSolutions: this.#solutions.map(solution => solution.board),
            isFoundAllSolutions: this.#isFoundAllSolutions,
        }
    }

    get getBoardRefrence() {
        return this.#boardRefrence.clone
    }

    #lastSolution() {
        return this.#solutions[this.#solutions.length - 1];
    }
    ///
    findMoreSolutions(number: number) {
        if (this.#isFoundAllSolutions) { return this.solutions; }
        for (let i = 0; i < number; i++) {
            // find another solution
            const solution = this.#getNextSolution()
            // appends to solution array if solution !== undefined
            // if found all solutions break;
        }
        return this.solutions;
    }


    #findAllRowsSolutions() {
        const findAllLineSolutions = (lineConstraint: LineConstraint, line: BoardLine, lineSolutions: BoardLineSolutions = [], index = 0) => {
            if (index >= line.length) {
                lineSolutions.push([...line]);
                return lineSolutions;
            }
            line[index] = BoardTile.Marked;
            if (this.#verifyLine(lineConstraint, line, index)) {
                findAllLineSolutions(lineConstraint, line, lineSolutions, index + 1);
            }
            line[index] = BoardTile.Unmarked;
            if (this.#verifyLine(lineConstraint, line, index)) {
                findAllLineSolutions(lineConstraint, line, lineSolutions, index + 1);
            }
            return lineSolutions;
        }

        return this.#boardRefrence.gridClone.map((row, rowIndex) => findAllLineSolutions(
            this.#boardRefrence.constraintsClone.rows[rowIndex],
            row,
        ))
    }

    #getNextSolutionRowIndexes(solutionRowIndexes: number[]) {
        let lastIndex = -1;
        for (let i = solutionRowIndexes.length - 1; i >= 0; i--) {
            if (this.#allRowsSolutions[i].length === 1 || solutionRowIndexes[i] === this.#allRowsSolutions[i].length - 1) { continue; }
            lastIndex = i;
            break;
        }
        if (lastIndex === -1) { return; }
        const newSolutionRowIndexes = [...solutionRowIndexes];
        for (let i = lastIndex; i < solutionRowIndexes.length; i++) {
            newSolutionRowIndexes[i] = (solutionRowIndexes[i] + 1) % this.#allRowsSolutions[i].length;
        }
        return newSolutionRowIndexes;
    }

    #verifyLine(lineConstraint: LineConstraint, line: BoardLine, lastIndexToCheck = line.length - 1) {
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
                    } else if (minUnsolvedLength > line.length - tileIndex) {
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

    #getNextSolution(
        board = this.getBoardRefrence,
        lastSolutionRowIndexes: number[] = new Array(board.size).fill(0),
        rowIndex = 0,
    ): undefined | { board: Board, solutionRowIndexes: number[] } {
        if (rowIndex === this.#allRowsSolutions.length) {
            return {
                board: board,
                solutionRowIndexes: []
            };
        }
        const thisRowsSolutions = this.#allRowsSolutions[rowIndex];
        const start = lastSolutionRowIndexes[rowIndex];
        lastSolutionRowIndexes[rowIndex] = 0;
        for (let i = start; i < thisRowsSolutions.length; i++) {
            const newBoard = board.setRow(rowIndex, thisRowsSolutions[i]);
            if (!this.#isRowValid(newBoard, rowIndex)) { continue; }
            const solution = this.#getNextSolution(newBoard, lastSolutionRowIndexes, rowIndex + 1);
            if (!solution) { continue; }
            solution.solutionRowIndexes.unshift(i);
            return solution;
        }
        return undefined;
    }

    findNextSolution() {
        const solution = this.#getNextSolution(this.#boardRefrence, this.#solutions.slice(-1)[0].nextSolutionRowIndexes)
        return !solution ? solution : {
            ...solution,
            nextSolutionRowIndexes: this.#getNextSolutionRowIndexes(solution.solutionRowIndexes),
        };
    }

    #isRowValid(board: Board, rowIndex: number): boolean {
        const columnsArray = this.#getColumnsArray(board);
        return columnsArray.every((column, columnIndex) => {
            const isLineValid = this.#verifyLine(board.constraintsClone.columns[columnIndex], column, rowIndex);
            return isLineValid;
        })
    }

    #getColumnsArray(board: Board) {
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
}