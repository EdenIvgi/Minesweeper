'use strict'

function placeMines(board, i, j) {
    var mineCount = gLevel.MINES
    const rows = board.length
    const cols = board[0].length
    var placedMines = 0

    while (placedMines < mineCount) {
        const randomRow = getRandomInt(0, rows - 1)
        const randomCol = getRandomInt(0, cols - 1)

        if (Math.abs(randomRow - i) <= 1 && Math.abs(randomCol - j) <= 1) continue

        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true
            placedMines++
        }
    }
}

function calculateMinesAround(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }
}

function setMinesNegsCount(board, row, col) {
    var minesCount = 0

    for (var i = row - 1; i <= row + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j >= board[0].length) continue
            if (i === row && j === col) continue
            if (board[i][j].isMine) minesCount++
        }
    }
    return minesCount
}