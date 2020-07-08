import * as CONST from './constants.mjs';


/** all possible movements (regardless of position) by type */
const MOVEMENTS = {
    'KING':  [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
    ],
    'QUEEN': [
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
        [0, 6],
        [0, 7],
        [-1, 0],
        [-2, 0],
        [-3, 0],
        [-4, 0],
        [-5, 0],
        [-6, 0],
        [-7, 0],
        [0, -1],
        [0, -2],
        [0, -3],
        [0, -4],
        [0, -5],
        [0, -6],
        [0, -7],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        [1, -1],
        [2, -2],
        [3, -3],
        [4, -4],
        [5, -5],
        [6, -6],
        [7, -7],
        [-1, 1],
        [-2, 2],
        [-3, 3],
        [-4, 4],
        [-5, 5],
        [-6, 6],
        [-7, 7],
        [-1, -1],
        [-2, -2],
        [-3, -3],
        [-4, -4],
        [-5, -5],
        [-6, -6],
        [-7, -7],
    ],
    'ROOK': [
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
        [0, 6],
        [0, 7],
        [-1, 0],
        [-2, 0],
        [-3, 0],
        [-4, 0],
        [-5, 0],
        [-6, 0],
        [-7, 0],
        [0, -1],
        [0, -2],
        [0, -3],
        [0, -4],
        [0, -5],
        [0, -6],
        [0, -7],
    ],
    'BISHOP': [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        [1, -1],
        [2, -2],
        [3, -3],
        [4, -4],
        [5, -5],
        [6, -6],
        [7, -7],
        [-1, 1],
        [-2, 2],
        [-3, 3],
        [-4, 4],
        [-5, 5],
        [-6, 6],
        [-7, 7],
        [-1, -1],
        [-2, -2],
        [-3, -3],
        [-4, -4],
        [-5, -5],
        [-6, -6],
        [-7, -7],
    ],
    'KNIGHT': [
        [1, 2],
        [2, 1],
        [2, -1],
        [-1, 2],
        [-1, -2],
        [-2, -1],
        [-2, 1],
        [-1, 2]
    ],
    'PAWN': [
        [0, 1],
        [0, 2]
    ]
}

export default class ChessPiece {

    static TYPE = [
        'KING',
        'QUEEN',
        'ROOK',
        'BISHOP',
        'KNIGHT',
        'PAWN'
    ];

    constructor(type, color) {
        this.type = type;
        this.color = color;
        this._cell = false;

        this.possibleMoves = [];

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

    get cell() {
        return this._cell;
    }
    set cell(cell) {
        this._cell = cell;

        if(cell) {
            const max = CONST.cellCount;
            this.possibleMoves = MOVEMENTS[this.type]
                .map(m => [m[0] + cell.position[0], m[1] + cell.position[1]])
                .filter(m => m[0] >= 0 && m[0] < max && m[1] >= 0 && m[1] < max);
        }
        else {
            this.possibleMoves = [];
        }
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

    //  if this piece is not on the board, it's cell will be 'false'
    if(!this.cell) {
        console.warn(`cannot draw ${this.type} with no cell defined`);
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

    //  if this piece is not on the board, it's cell will be 'false'
    if(!this.cell) {
        console.warn(`cannot draw ${this.type} with no cell defined`);
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
