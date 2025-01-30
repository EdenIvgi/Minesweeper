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

var gIsFirstClick = true

function onInit() {
    const size = gLevel.SIZE
    gGame.isOn = true
    gBoard = buildBoard(size)
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
    if (gIsFirstClick) {
        gIsFirstClick = false
        placeMines(gBoard, i, j)
        calculateMinesAround(gBoard)
        renderBoard(gBoard, '.board-container')
        elCell = document.querySelector(`.cell-${i}-${j}`)
    }

    var cell = gBoard[i][j]

    if (!cell.isCovered) return

    cell.isCovered = false
    elCell.classList.remove('covered')
    elCell.classList.add('uncovered')

    if (cell.isMine) {
        elCell.innerText = '#'
        console.log(' Game over');
    } else if (cell.minesAroundCount > 0) {
        elCell.innerText = cell.minesAroundCount
    } else {
        elCell.innerText = ''
        expandUncover(gBoard, i, j)
    }

    checkGameOver()
}

function onCellMarked(event, elCell, i, j) {
    event.preventDefault()

    var cell = gBoard[i][j]

    if (cell.isCovered) {
        cell.isMarked = !cell.isMarked
        elCell.innerText = cell.isMarked ? '🚩' : ''
    }
    checkGameOver()
}

function checkGameOver() {

    var totalMines = 0
    var minesFlagged = 0
    var coveredCells = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]

            if (cell.isMine) totalMines++
            if (cell.isMine && cell.isMarked) minesFlagged++
            if (cell.isCovered) coveredCells++
        }
    }

    if (minesFlagged === totalMines && coveredCells === totalMines) {
        console.log('Victory!')
        gGame.isOn = false
    }
}

function expandUncover(board, i, j) {

    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= board.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= board[row].length) continue
            if (row === i && col === j) continue

            var neighborCell = document.querySelector(`.cell-${row}-${col}`)
            if (!neighborCell) continue

            if (board[row][col].isCovered) {
                onCellClicked(neighborCell, row, col)
            }
        }
    }
}


