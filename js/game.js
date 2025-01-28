'use strict'

var gBoard

const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    coveredCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    const size = gLevel.SIZE
    gGame.isOn = true
    gBoard = buildBoard(size)
    placeMines(gBoard, 2)
    calculateMinesAround(gBoard)
    renderBoard(gBoard, '.board-container')
    console.log(gBoard)
}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        const row = []
        for (var j = 0; j < size; j++) {
            row.push({
                minesAroundCount: 0,
                isCovered: true,
                isMine: false,
                isMarked: false
            })
        }
        board.push(row)

    }
    return board

}

function onCellClicked(elCell, i, j) {
    var cell = gBoard[i][j]

    if (!cell.isCovered) return;

    cell.isCovered = false;

    elCell.classList.add('uncovered')

    if (cell.isMine) {
        elCell.innerText = '#'
        console.log('Game over')

    } else if (cell.minesAroundCount > 0) {
        elCell.innerText = cell.minesAroundCount
    } else {

        elCell.innerText = ''
    }
}

function onCellMarked(elCell) {

}

function checkGameOver() {

}

function expandUncover(board, elCell, i, j) {

}

