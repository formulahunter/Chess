import * as CONST from './constants.mjs';


export default class ChessPiece {

    static TYPE = [
        'KING',
        'QUEEN',
        'ROOK',
        'BISHOP',
        'KNIGHT',
        'PAWN'
    ];

    constructor(type, color, cell) {
        this.type = type;
        this.color = color;
        this.cell = cell;

        let icon = this.icon = document.createElement('img');
        icon.width = 50;
        icon.height = 50;
        icon.src = `img/${type.toLowerCase()}-w.svg`;

        this.srcLoad = new Promise((resolve, reject) => {
            icon.addEventListener('load', () => {
                this.draw = drawSource;
                this.needsRedraw = true;
                resolve();
            });
            icon.addEventListener('error', (ev) => {
                reject(`error loading ${type} icon: ${ev.toString()}`);
            });
        });
    }

    /** experiment with dynamically defined method - instances draw a text
     * representation of their type until the image source has loaded, then
     * render the icon normally. */
    draw = drawNoSource;
}


function drawSource(ctx, force = false) {

    if(!this.needsRedraw && !force) {
        return;
    }

    //  if this piece is not on the board, it's cell will be undefined
    if(!this.cell) {
        return;
    }

    const [x0, y0] = [
        this.cell.bb[0] + (CONST.cellSize - this.icon.width) / 2,
        this.cell.bb[1] + (CONST.cellSize - this.icon.height) / 2
    ];
    ctx.fillStyle = '#ffffff';
    ctx.drawImage(this.icon, x0, y0, this.icon.width, this.icon.height);
}
function drawNoSource(ctx, force = false) {

    if(!this.needsRedraw && !force) {
        return;
    }

    ctx.save();

    //  center-align the text and position it at the middle of the cell
    //  minor correction for letters appearing too high, possibly related to
    //  text baseline
    const [x0, y0] = [
        this.cell.bb[0] + CONST.cellSize / 2,
        this.cell.bb[1] + CONST.cellSize / 2 + CONST.cellSize / 15
    ];

    //  set center alignment/justification
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = 'black';
    ctx.fillText(this.type === 'KNIGHT' ? 'N' : this.type[0], x0, y0);

    ctx.restore();
}
