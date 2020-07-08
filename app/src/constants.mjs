


const boardSize = 800;
const cellSize = 80;   //  as drawn on canvas
const cellCount = 8;
const gridWidth = 2;

const gridSize = cellCount * cellSize + (gridWidth * (cellCount + 1));
const boardMargin = (boardSize - gridSize) / 2;

const cellBaseOffset = boardMargin + gridWidth;
const cellInterval = cellSize + gridWidth;

/** for converting between number & text formats */
const columnLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

/** interactive cell colors */
const emptyCell = 'white';
const targetCell = 'hsl(0deg, 0%, 90%)';
const activeCell = 'hsl(240deg, 35%, 90%)';
const activeTargetCell = 'hsl(240deg, 35%, 85%)';
const destination = 'hsl(120deg, 35%, 90%)';


export {
    boardSize,
    cellCount,
    gridWidth,
    gridSize,
    boardMargin,
    cellSize,
    cellBaseOffset,
    cellInterval,
    columnLabels,
    emptyCell,
    targetCell,
    activeCell,
    activeTargetCell,
    destination
};
