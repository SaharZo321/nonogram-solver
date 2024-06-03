import Board, { BoardConstraints, BoardGrid, BoardTile } from "./Board";

export class GridBitArray {
    private bits: number[];

    constructor(tileNumber: number) {
        this.bits = new Array(Math.ceil(tileNumber / 32)).fill(0)
    }

    static convertBoard(board: Board) {
        const tileNumber = board.size * board.size;
        const array = new GridBitArray(tileNumber)
        board.grid.forEach((row, rowIndex) => {
            row.forEach((tile, columnIndex) => {
                array.set({ row: rowIndex, column: columnIndex }, board.size, tile)
            })
        })
        return array
    }



    set(position: { row: number, column: number }, gridSize: number, tile: BoardTile) {
        const index = position.row * gridSize + position.column
        const wordIndex = Math.floor(index / 32);
        const bitIndex = index % 32;
        if (tile === BoardTile.Marked) {
            this.bits[wordIndex] |= (1 << bitIndex);
        } else {
            this.bits[wordIndex] &= ~(1 << bitIndex);
        }
    }

    get(position: { row: number, column: number }, gridSize: number): number {
        const index = position.row * gridSize + position.column
        const wordIndex = Math.floor(index / 32);
        const bitIndex = index % 32;

        return (this.bits[wordIndex] >> bitIndex) & 1;
    }

    private getGrid(gridSize: number) {
        const grid: BoardGrid = []
        let str = ''
        for (let row = 0; row < gridSize; row++) {
            const rowArr = new Array(gridSize).fill(0)
            for (let column = 0; column < gridSize; column++) {
                const tile = this.get({ row, column }, gridSize)
                str += tile
                rowArr[column] = tile as BoardTile
            }
            grid.push(rowArr)
        }
        // console.log(grid, str)
        return grid
    }

    getBoard(boardTemplate: {size: number, constraints: BoardConstraints}): Board {
        const grid = this.getGrid(boardTemplate.size)
        return new Board({...boardTemplate ,grid})
    }

    clone(): GridBitArray {
        const clone = new GridBitArray(0);
        clone.bits = this.bits.slice();
        return clone;
    }
}