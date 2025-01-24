type Tile = 1 | 0

export default class GridBitArray {

    private static CHUNK_SIZE = 32
    private bits: number[]
    private size: number

    constructor(size: number) {
        this.bits = GridBitArray.getEmpty(size * size)
        this.size = size
    }

    public getSize() {
        return this.size;
    }

    public static getEmpty(tileNumber: number): number[] {
        return new Array(Math.ceil(tileNumber / this.CHUNK_SIZE)).fill(0)
    }

    public set(position: { row: number, column: number }, tile: Tile) {
        const index = position.row * this.size + position.column
        const wordIndex = Math.floor(index / 32);
        const bitIndex = index % 32;
        if (tile === 1) {
            this.bits[wordIndex] |= (1 << bitIndex);
        } else {
            this.bits[wordIndex] &= ~(1 << bitIndex);
        }
    }

    public get(position: { row: number, column: number }): (1 | 0) {
        const index = position.row * this.size + position.column
        const wordIndex = Math.floor(index / 32);
        const bitIndex = (index % 32);
        const tile = (this.bits[wordIndex] >> bitIndex) & 1
        return tile > 0 ? 1 : 0;
    }

    public getGrid(gridSize: number): Tile[][] {
        const grid: Tile[][] = []
        for (let row = 0; row < gridSize; row++) {
            const rowArr = new Array(gridSize)
            for (let column = 0; column < gridSize; column++) {
                const tile = this.get({ row, column })
                rowArr[column] = tile
            }
            grid.push(rowArr)
        }
        return grid
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
            const rowArr = new Array(gridSize)
            for (let column = 0; column < gridSize; column++) {
                const tile = this.get({ row, column }, gridSize, bits)
                rowArr[column] = tile ? "marked" : "unmarked"
            }
            grid.push(rowArr)
        }
        return grid
    }

    public setRow(rowIndex: number, row: Tile[]) {
        row.forEach((tile, column) => {
            this.set({ row: rowIndex, column }, tile)
        });
    }

    get bitsClone() {
        return [...this.bits]
    }

    public emptyRow(rowIndex: number) {
        for (let column = 0; column < this.size; column++) {
            this.set({ row: rowIndex, column }, 0)
        }
    }

    public getColumnsArray(): Tile[][] {
        const columnsArray: Tile[][] = []
        for (let column = 0; column < this.size; column++) {
            const rowArray: Tile[] = []
            for (let row = 0; row < this.size; row++) {
                rowArray.push(this.get({ row, column }))
            }
            columnsArray.push(rowArray)
        }
        return columnsArray;
    }
}