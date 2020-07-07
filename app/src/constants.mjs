


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


export {
    boardSize,
    cellCount,
    gridWidth,
    gridSize,
    boardMargin,
    cellSize,
    cellBaseOffset,
    cellInterval,
    columnLabels
};
