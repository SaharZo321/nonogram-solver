export enum BoardTile {
    Unmarked, Marked, Flagged
}

export type Position = {
    row: number,
    column: number,
}

export type LineConstraint = number[]
export type BoardConstraints = {
    rows: LineConstraint[],
    columns: LineConstraint[],
}

export type BoardGrid = BoardTile[][]

type BoardParams = {
    size: number,
    grid?: BoardGrid,
    constraints?: BoardConstraints
}

export default class Board {
    static firstPosition = { row: 0, column: 0 }
    size: number
    grid: BoardGrid
    constraints: BoardConstraints

    constructor(
        {
            size,
            grid = new Array(size).fill(new Array(size).fill(BoardTile.Unmarked)),
            constraints = {
                rows: new Array(size).fill([]),
                columns: new Array(size).fill([]),
            }
        }: BoardParams
    ) {
        this.size = size;
        this.grid = grid;
        this.constraints = constraints
    }

    get gridClone() {
        return this.grid.map(row => [...row]);
    }

    setTile({ row, column }: Position, state: BoardTile) {
        this.grid[row][column] = state
        return this
    }

    getTile({ row, column }: Position) {
        return this.grid[row][column];
    }

    setRow(rowIndex: number, newRow: BoardTile[]) {
        this.grid[rowIndex] = newRow
        return this
    }

    get constraintsClone(): BoardConstraints {
        return {
            rows: this.constraints.rows.map(row => [...row]),
            columns: this.constraints.columns.map(column => [...column]),
        }
    }

    generateTileConstraints(position: Position) {
        const { row, column } = position
        let count = 0;
        const rowConstraint = [];

        for (let c = 0; c < this.size; c++) {
            const state = this.getTile({ row, column: c })
            if (state === BoardTile.Marked)
                count++;
            if (count !== 0 && (state !== BoardTile.Marked || c === this.size - 1)) {
                rowConstraint.push(count);
                count = 0;
            }
        }
        const newRowConstraints = this.constraints.rows
        newRowConstraints[row] = rowConstraint
        this.constraints.rows = newRowConstraints

        const columnConstraint = []
        count = 0
        for (let r = 0; r < this.size; r++) {
            const state = this.getTile({ row: r, column })
            if (state === BoardTile.Marked)
                count++;
            if (count !== 0 && (state !== BoardTile.Marked || r === this.size - 1)) {
                columnConstraint.push(count);
                count = 0;
            }
        }
        const newColumnConstraints = this.constraints.columns;
        newColumnConstraints[column] = columnConstraint;
        return this
    }

    #generateConstraints() {
        let count = 0;
        this.constraints.columns = [];
        for (let c = 0; c < this.size; c++) {
            const column = [];
            for (let r = 0; r < this.size; r++) {
                const tile = this.getTile({ row: r, column: c })
                if (tile === BoardTile.Marked)
                    count++;
                if (count !== 0 && (tile !== BoardTile.Marked || r === this.size - 1)) {
                    column.push(count);
                    count = 0;
                }
            }
            this.constraints.columns.push(column)
        }

        count = 0
        this.constraints.rows = []
        for (let r = 0; r < this.size; r++) {
            const row = []
            for (let c = 0; c < this.size; c++) {
                const tile = this.getTile({ row: r, column: c })
                if (tile === BoardTile.Marked) {
                    count++;
                }
                if (count !== 0 && (tile !== BoardTile.Marked || c === this.size - 1)) {
                    row.push(count);
                    count = 0;
                }
            }
            this.constraints.rows.push(row)
        }
        return this
    }

    randomize(markChance = 0.5) {
        this.grid = this.grid.map(row => {
            return row.map(() => {
                return Math.random() <= markChance ? BoardTile.Marked : BoardTile.Unmarked
            })
        })
        return this.#generateConstraints()
    }

    flipVertically() {
        this.grid = this.gridClone.map((_, rowIndex) => {
            return this.grid[this.size - 1 - rowIndex];
        })
        return this.#generateConstraints()
    }

    flipHorizontally() {
        this.grid = this.gridClone.map((row) => row.reverse())
        return this.#generateConstraints()
    }

    rotateClockwise() {
        this.grid = this.gridClone.map((row, rowIndex) => {
            return row.map((_, columnIndex) => {
                return this.getTile({
                    row: columnIndex,
                    column: rowIndex
                });
            })
        })

        return this.flipHorizontally();
    }

    rotateCounterClockwise() {
        this.grid = this.gridClone.map((row, rowIndex) => {
            return row.map((_, columnIndex) => {
                return this.getTile({
                    row: columnIndex,
                    column: rowIndex
                });
            })
        })
        return this.flipVertically()
    }

    get clone() {
        return new Board({
            size: this.size,
            grid: this.gridClone,
            constraints: this.constraintsClone
        })
    }

    get isGridEmpty() {
        return this.grid.every(row => {
            return row.every(tile => {
                return tile !== BoardTile.Marked
            })
        })
    }

    emptyGrid() {
        this.grid = new Array(this.size).fill(new Array(this.size).fill(BoardTile.Unmarked))
        return this
    }


}

