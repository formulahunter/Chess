import * as CONST from './constants.mjs';
import ChessPiece from './ChessPiece.mjs';


export default class ChessBoard {

    constructor(canvas) {

        const ctx = this.ctx = canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        canvas.addEventListener('mousemove', this.setMouseTarget.bind(this));

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CONST.boardSize, CONST.boardSize);
        ctx.fillStyle = '#000000';   //  white cells will leave black grid
        // lines
        ctx.fillRect(CONST.boardMargin, CONST.boardMargin, CONST.gridSize, CONST.gridSize);

        this.mouseTarget = false;
        this.needsRedraw = false;

        this.pieces = {
            white: [],
            black: []
        };

        this.grid = [];

        for(let i = 0; i < CONST.cellCount; ++i) {
            this.grid[i] = [];
            for(let j = 0; j < CONST.cellCount; ++j) {
                this.grid[i][j] = new GridCell(j, i);
            }
        }
    }

    init() {

        let newGameRanks = [
            [2, 3, 4, 1, 0, 4, 3, 2],
            [5, 5, 5, 5, 5, 5, 5, 5]
        ];
        let srcLoads = [];
        let front, back;
        for(let i = 0; i < newGameRanks[0].length; ++i) {
            front = new ChessPiece(ChessPiece.TYPE[newGameRanks[0][i]], 'W');
            srcLoads.push(front.srcLoad);
            this.grid[0][i].setPiece(front);

            back = new ChessPiece(ChessPiece.TYPE[newGameRanks[1][i]], 'W');
            srcLoads.push(back.srcLoad);
            this.grid[1][i].setPiece(back);
        }
        srcLoads.map(prms => prms.then(() => {
            this.needsRedraw = true;
            this.draw();
        }));
        this.draw(true);
    }

    setMouseTarget(ev) {
        let [x, y] = [
            ev.clientX - this.ctx.canvas.offsetLeft,
            ev.clientY - this.ctx.canvas.offsetTop
        ];


        //  if a target is already designated, check it first
        //  (avoids needless looping in the common scenario where new target
        //  is same as existing target)
        if(this.mouseTarget && this.mouseTarget.hit(x, y)) {
            //  nothing to see here, move along...
            return;
        }

        let target = false;
        for(let i = 0; i < this.grid.length; ++i) {
            for(let j = 0; j < this.grid.length; ++j) {
                if(this.grid[i][j].hit(x, y)) {
                    target = this.grid[i][j];
                    break;
                }
            }
        }

        //  if a target is already designated, it is not the same as the new
        //  target and so must be deactivated (regardless of whether or not a
        //  new target was found)
        if(this.mouseTarget) {
            this.mouseTarget.isMouseTarget = false;
            this.mouseTarget.needsRedraw = true;
            this.mouseTarget = false;
            this.needsRedraw = true;
        }

        //  if a new target was found, activate it
        if(target) {
            this.mouseTarget = target;
            target.isMouseTarget = true;
            target.needsRedraw = true;
            this.needsRedraw = true;
        }

        //  this does not belong here
        this.draw();

        //  return the new target, or false if no target was found
        return target;
    }

    draw(force = false) {

        if(!this.needsRedraw && !force) {
            return;
        }

        const ctx = this.ctx;
        for(let i = 0; i < CONST.cellCount; ++i) {
            for(let j = 0; j < CONST.cellCount; ++j) {
                this.grid[j][i].draw(ctx, force);
            }
        }

        this.needsRedraw = false;
    }
}


class GridCell {

    /** columns are lettered a - h across the board from left to right
     * (viewed from white); ranks (rows) are numbered 1 - 8 from bottom to
     * top (viewed from white) */
    constructor(column, rank) {

        this.position = [column, rank];
        this.index = `${CONST.columnLabels[column]}${rank}`;

        const x0 = CONST.cellBaseOffset + (CONST.cellInterval) * column;
        const y0 = CONST.cellBaseOffset + (CONST.cellInterval) * (CONST.cellCount - rank - 1);
        this.bb = [x0, y0, x0 + CONST.cellSize, y0 + CONST.cellSize];

        this.piece = false;
        this.isMouseTarget = false;
        this.needsRedraw = false;
    }

    hit(x, y) {
        return x > this.bb[0] && y > this.bb[1] && x < this.bb[2] && y < this.bb[3];
    }

    setPiece(piece) {
        if(this.piece) {
            if(this.piece === piece) {
                console.warn(`piece set redundantly on ${this.index}`);
                return;
            }
            throw new Error(`cannot add multiple pieces on ${this.index}`);
        }

        if(piece.cell) {
            piece.cell.unsetPiece();
        }
        this.piece = piece;
        this.piece.cell = this;
        this.needsRedraw = true;
    }
    unsetPiece() {
        this.piece.cell = false;
        this.piece = false;
    }

    draw(ctx, force = false) {

        if(!this.needsRedraw && !force) {
            return;
        }

        if(this.isMouseTarget) {
            ctx.fillStyle = '#ffbbbb';
        }
        else {
            ctx.fillStyle = '#ffffff';
        }
        ctx.fillRect(this.bb[0], this.bb[1], CONST.cellSize, CONST.cellSize);

        if(this.piece) {
            this.piece.draw(ctx, force);
        }
    }
}
