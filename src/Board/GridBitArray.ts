import Board, { BoardConstraints, BoardGrid, BoardTile } from "./Board";

export class GridBitArray {

    private static CHUNK_SIZE = 32

    private static getEmptyArray(tileNumber: number): number[] {
        return new Array(Math.ceil(tileNumber / this.CHUNK_SIZE)).fill(0)
    }


    static convertBoard(board: Board): number[] {
        const tileNumber = board.size * board.size
        const bits = this.getEmptyArray(tileNumber)
        board.grid.forEach((row, rowIndex) => {
            row.forEach((tile, columnIndex) => {
                this.set({ row: rowIndex, column: columnIndex }, board.size, tile, bits)
            })
        })
        return bits
    }

    static convertBoardFast(board: Board): number[] {
        const longArray = board.gridClone.reduce((accumulator, currentRow) => accumulator.concat(currentRow), [])
        const tileNumber = longArray.length;
        const bits = this.getEmptyArray(tileNumber)

        for (let i = 0; i < tileNumber; i += this.CHUNK_SIZE) {
            const chunk = longArray.slice(i, i + this.CHUNK_SIZE).reverse().join('');
            const number = parseInt(chunk, 2);
            bits[Math.floor(i / this.CHUNK_SIZE)] = number;
        }

        return bits;
    }

    private static set(position: { row: number, column: number }, gridSize: number, tile: BoardTile, bits: number[]) {
        const index = position.row * gridSize + position.column
        const wordIndex = Math.floor(index / 32);
        const bitIndex = index % 32;
        if (tile === BoardTile.Marked) {
            bits[wordIndex] |= (1 << bitIndex);
        } else {
            bits[wordIndex] &= ~(1 << bitIndex);
        }
    }

    private static get(position: { row: number, column: number }, gridSize: number, bits: number[]): number {
        const index = position.row * gridSize + position.column
        const wordIndex = Math.floor(index / 32);
        const bitIndex = (index % 32);

        return (bits[wordIndex] >> bitIndex) & 1;
    }

    static getGrid(gridSize: number, bits: number[]): BoardGrid {
        const grid: BoardGrid = []
        for (let row = 0; row < gridSize; row++) {
            const rowArr = new Array(gridSize).fill(0)
            for (let column = 0; column < gridSize; column++) {
                const tile = this.get({ row, column }, gridSize, bits)
                rowArr[column] = tile as BoardTile
            }
            grid.push(rowArr)
        }
        return grid
    }
}