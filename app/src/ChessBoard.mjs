

export default class ChessBoard {

    static size = 800;
    static cellCount = 8;
    static gridWidth = 2;
    static margin = -1;

    constructor(canvas) {

        this.ctx = canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;


        this.pieces = {
            white: [],
            black: []
        };

        this.grid = [];
    }

    init() {

        //  define layout parameters before first draw
        ChessBoard.gridSize = ChessBoard.cellCount * GridCell.size + (ChessBoard.gridWidth * (ChessBoard.cellCount + 1));
        ChessBoard.margin = (ChessBoard.size - ChessBoard.gridSize) / 2;
        console.log(ChessBoard);
        GridCell.baseOffset = ChessBoard.margin + ChessBoard.gridWidth;
        GridCell.interval = GridCell.size + ChessBoard.gridWidth;
        console.log(GridCell);

        for(let i = 0; i < ChessBoard.cellCount; ++i) {
            this.grid[i] = [];
            for(let j = 0; j < ChessBoard.cellCount; ++j) {
                this.grid[i][j] = new GridCell(i, j);
            }
        }

        this.draw();
    }

    draw() {

        const bSize = ChessBoard.size;
        const cCount = ChessBoard.cellCount;
        const gSize = ChessBoard.gridSize;
        const margin = ChessBoard.margin;
        ChessBoard.margin = margin;

        const ctx = this.ctx;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, bSize, bSize);
        ctx.fillStyle = '#000000';   //  white cells will leave black grid
        // lines
        ctx.fillRect(margin, margin, gSize, gSize);

        for(let i = 0; i < cCount; ++i) {
            for(let j = 0; j < cCount; ++j) {
                this.grid[i][j].draw(ctx);
            }
        }
    }
}


class GridCell {

    static size = 80;   //  as drawn on canvas
    static baseOffset = -1;
    static interval = -1;

    /** for converting between number & text formats */
    static columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    /** columns are lettered a - h across the board from left to right
     * (viewed from white); ranks (rows) are numbered 1 - 8 from bottom to
     * top (viewed from white) */
    constructor(column, rank) {

        this.position = [column, rank];
        this.index = `${GridCell.columns[column]}${rank}`;

        const x0 = GridCell.baseOffset + (GridCell.interval) * column;
        const y0 = GridCell.baseOffset + (GridCell.interval) * (ChessBoard.cellCount - rank - 1);
        this.bb = [x0, y0, x0 + GridCell.size, y0 + GridCell.size];
    }

    draw(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.bb[0], this.bb[1], GridCell.size, GridCell.size);
    }
}
