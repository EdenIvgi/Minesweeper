'use strict'
var gBoard
var gLives = 3
var gIsFirstClick = true
var gTimerInterval = null
var gStartTime = null

const gLevel = {
    SIZE: 8,
    MINES: 14
}

const gGame = {
    isOn: false,
    coveredCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gGame.isOn = true
    gIsFirstClick = true
    gLives = 3
    gGame.secsPassed = 0
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board-container')
    updateLivesDisplay()
    updateSmileyButton("😃")
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

function setGameLevel(size, mines, elButton) {
    stopTimer()
    gLevel.SIZE = size
    gLevel.MINES = mines
    document.querySelector(".selected-level")?.classList.remove("selected-level")
    elButton.classList.add("selected-level")
    resetGame()
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return

    if (gIsFirstClick) {
        gIsFirstClick = false
        startTimer()
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
        elCell.innerText = '💥'
        gLives--
        updateLivesDisplay()
        if (gLives === 0) {
            onGameOver()
            return
        }
    } else {
        elCell.innerText = cell.minesAroundCount > 0 ? cell.minesAroundCount : ''
        if (cell.minesAroundCount === 0) expandUncover(gBoard, i, j)
    }

    checkGameOver()
}

function onCellMarked(event, elCell, i, j) {
    event.preventDefault()
    if (gIsFirstClick) return

    var cell = gBoard[i][j]

    if (cell.isCovered) {
        cell.isMarked = !cell.isMarked
        elCell.innerText = cell.isMarked ? '🚩' : ''
        gGame.markedCount += cell.isMarked ? 1 : -1
    }
    checkGameOver()
}

function updateLivesDisplay() {
    var elLives = document.getElementById('lives-count')
    elLives.innerText = '❤️'.repeat(gLives)
}

function updateSmileyButton(emoji) {
    var elSmiley = document.getElementById('smiley-btn')
    if (elSmiley) {
        elSmiley.innerText = emoji
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

function resetGame() {
    stopTimer()
    gGame.secsPassed = 0
    gGame.markedCount = 0
    document.getElementById("timer").innerText = "0.00"

    gLives = 3
    gIsFirstClick = true
    gGame.isOn = true

    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board-container')

    updateLivesDisplay()
    updateSmileyButton("😃")
}

function checkGameOver() {
    var coveredCells = 0
    var allCellsMarkedOrUncovered = true
    var allFlagsCorrect = true

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]

            if (cell.isCovered && !cell.isMarked) coveredCells++

            if (cell.isMarked && !cell.isMine) {
                allFlagsCorrect = false
            }

            if (cell.isCovered && !cell.isMine && !cell.isMarked) {
                allCellsMarkedOrUncovered = false
            }
        }
    }

    if (allFlagsCorrect && allCellsMarkedOrUncovered) {
        gGame.isOn = false
        gGame.secsPassed = getElapsedTime()
        stopTimer()
        updateSmileyButton("😎")
    }
}

function onGameOver() {
    gGame.isOn = false
    gGame.secsPassed = getElapsedTime()
    stopTimer()
    updateSmileyButton("🫨")
}

function getElapsedTime() {
    return ((Date.now() - gStartTime) / 1000).toFixed(2)
}








