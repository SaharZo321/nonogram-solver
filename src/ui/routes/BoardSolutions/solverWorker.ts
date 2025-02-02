import GridBitArray from "../../board-utils/gridBitArray.js"

self.onmessage = (event) => {
    const result = solver(event.data)
    self.postMessage(result)
}


type BoardLine = (1 | 0)[]
type BoardLineSolutions = BoardLine[]

function solver(constraints: BoardConstraints): BoardSolution {
    const size = constraints.rows.length;
    const allRowsSolutions = findAllRowsSolutions(constraints)
    console.log("found all rows solutions")
    const steps: BoardSolution = [GridBitArray.getEmpty(size * size)]

    function solve(
        bitArray: GridBitArray,
        rowIndex = 0,
    ): boolean {

        if (rowIndex === allRowsSolutions.length) {
            return true
        }
        const thisRowsSolutions = allRowsSolutions[rowIndex];
        for (let i = 0; i < thisRowsSolutions.length; i++) {
            bitArray.setRow(rowIndex, thisRowsSolutions[i]);
            const gridSnapshot = bitArray.bitsClone
            steps.push(gridSnapshot)
            self.postMessage(rowIndex)
            if (!isRowValid(bitArray, constraints, rowIndex)) { continue; }
            const solution = solve(bitArray, rowIndex + 1)
            if (solution) {
                return solution;
            }
        }
        bitArray.emptyRow(rowIndex);
        return false;
    }
    if (!solve(new GridBitArray(size))) {
        steps.push(GridBitArray.getEmpty(size * size))
    }
    return steps

}

function verifyRow(lineConstraint: LineConstraint, line: BoardLine, lastIndexToCheck = line.length - 1) {
    let lineConstraintIndex = 0;
    let markedTilesCounter = 0;
    let lastTileWasMarked = false;
    let minUnsolvedLength = lineConstraint.reduce((sum, constraint) => sum + constraint + 1, 0) - 1;

    for (let tileIndex = 0; tileIndex <= lastIndexToCheck; tileIndex++) {
        switch (line[tileIndex]) {
            case 1: {
                if (!lastTileWasMarked && lineConstraintIndex >= lineConstraint.length) {
                    //started a new group and there too many groups
                    return false;
                }
                markedTilesCounter++;
                lastTileWasMarked = true; //starts a new group
                break;
            }
            case 0: {
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

function verifyColumn(bitArray: GridBitArray, lineConstraint: LineConstraint, lastIndexToCheck: number, lineIndex: number): boolean {
    let lineConstraintIndex = 0;
    let markedTilesCounter = 0;
    let lastTileWasMarked = false;
    let minUnsolvedLength = lineConstraint.reduce((sum, constraint) => sum + constraint + 1, 0) - 1;

    for (let tileIndex = 0; tileIndex <= lastIndexToCheck; tileIndex++) {
        switch (bitArray.get({ row: tileIndex, column: lineIndex })) {
            case 1: {
                if (!lastTileWasMarked && lineConstraintIndex >= lineConstraint.length) {
                    //started a new group and there too many groups
                    return false;
                }
                markedTilesCounter++;
                lastTileWasMarked = true; //starts a new group
                break;
            }
            case 0: {
                if (lastTileWasMarked) {
                    if (lineConstraint[lineConstraintIndex] !== markedTilesCounter) {
                        //last tile was marked and the group was too short/long
                        return false;
                    }
                    minUnsolvedLength -= markedTilesCounter + 1;
                    markedTilesCounter = 0;
                    lineConstraintIndex++;
                } else if (minUnsolvedLength >= bitArray.getSize() - tileIndex) {
                    //there is not enough room for the left constraints
                    return false;
                }
                lastTileWasMarked = false;
                break;
            }
        }
    }
    // checks if the newest tile was the last in the line
    if (lastIndexToCheck === bitArray.getSize() - 1) {
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

function isRowValid(bitArray: GridBitArray, constraints: BoardConstraints, rowIndex: number): boolean {
    for (let col = 0; col < bitArray.getSize(); col++) {
        if (!verifyColumn(bitArray, constraints.columns[col], rowIndex, col)) {
            return false;
        }
    }
    return true;
}


function findAllRowsSolutions(constraints: BoardConstraints) {

    const findAllLineSolutions = (lineConstraint: LineConstraint, line: BoardLine = new Array(constraints.columns.length).fill(0), lineSolutions: BoardLineSolutions = [], index = 0) => {
        if (index >= line.length) {
            lineSolutions.push([...line]);
            return lineSolutions;
        }
        line[index] = 1;
        if (verifyRow(lineConstraint, line, index)) {
            findAllLineSolutions(lineConstraint, line, lineSolutions, index + 1);
        }
        line[index] = 0;
        if (verifyRow(lineConstraint, line, index)) {
            findAllLineSolutions(lineConstraint, line, lineSolutions, index + 1);
        }
        return lineSolutions;
    }

    return constraints.rows.map(row => findAllLineSolutions(row))
}