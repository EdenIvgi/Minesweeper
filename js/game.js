'use strict'

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

var gBoard
var gLives = 3
var gIsFirstClick = true
var gTimerInterval = null
var gStartTime = null
var gHintActive = false
var gHints = 3
var gSafeClicks = 3
var gBoardHistory = []

onInit()

function onInit() {
    stopTimer()
    gGame.secsPassed = 0
    gGame.markedCount = 0
    gGame.isOn = true
    gIsFirstClick = true
    gLives = 3
    gSafeClicks = 3
    gHints = 3
    updateHintButton()
    gBoard = buildBoard(gLevel.SIZE)
    gGame.coveredCount = gLevel.SIZE ** 2
    renderBoard(gBoard, '.board-container')
    document.getElementById("timer").innerText = "0.00"
    updateSafeClickButton()
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
    gLevel.SIZE = size
    gLevel.MINES = mines
    document.querySelector(".selected-level")?.classList.remove("selected-level")
    elButton.classList.add("selected-level")
    onInit()
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return

    if (gHintActive) {
        getHint(gBoard, i, j)
        gHintActive = false
        return
    }

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
        console.log('You left ' + gLives + ' lives')
        updateLivesDisplay()
        if (gLives === 0) {
            onGameOver()
            return
        }
    } else {
        elCell.innerText = cell.minesAroundCount > 0 ? cell.minesAroundCount : ''
        gGame.coveredCount--
        if (cell.minesAroundCount === 0) expandUncover(gBoard, i, j)
    }

    checkVictory()
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

function checkVictory() {
    var uncoveredCells = 0
    var totalCells = gLevel.SIZE ** 2

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && !cell.isCovered) {
                uncoveredCells++
            }
        }
    }

    if (totalCells - uncoveredCells === gLevel.MINES) {
        gGame.isOn = false
        gGame.secsPassed = getElapsedTime()
        stopTimer()
        updateSmileyButton('😎')
        console.log("Game Won!")
    }
}

function onGameOver() {
    gGame.isOn = false
    gGame.secsPassed = getElapsedTime()
    stopTimer()
    updateSmileyButton("🫨")

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                cell.isCovered = false
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                if (elCell) {
                    elCell.innerText = '💥'
                    elCell.classList.remove('covered')
                    elCell.classList.add('uncovered')
                }
            }
        }
    }
}

function getElapsedTime() {
    return ((Date.now() - gStartTime) / 1000).toFixed(2)
}

function onSafeClick() {
    if (!gGame.isOn || gSafeClicks === 0) return

    gSafeClicks--;
    updateSafeClickButton()

    var safeCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]

            if (!cell.isMine && !cell.isMarked && cell.isCovered) {
                safeCells.push({ i, j })
            }
        }
    }

    if (safeCells.length === 0) return

    var randIdx = Math.floor(Math.random() * safeCells.length)
    var safeCell = safeCells[randIdx]
    var elSafeCell = document.querySelector(`.cell-${safeCell.i}-${safeCell.j}`)
    if (!elSafeCell) return

    elSafeCell.classList.add('safe-click')

    setTimeout(() => {
        elSafeCell.classList.remove('safe-click')
    }, 1500)
}

function updateSafeClickButton() {
    var elSafeClickBtn = document.getElementById("safe-click-btn")
    if (elSafeClickBtn) {
        elSafeClickBtn.innerText = `Safe (${gSafeClicks})`
    }
}

function activateHint() {
    if (gHints === 0 || !gGame.isOn) return

    gHintActive = true
}

function getHint(board, i, j) {
    if (gHints === 0) return

    var revealedCells = []

    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= board.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= board[row].length) continue

            var cell = board[row][col]
            if (cell.isCovered) {
                cell.isCovered = false
                var elCell = document.querySelector(`.cell-${row}-${col}`)
                elCell.classList.remove('covered')
                elCell.classList.add('hint-revealed')
                elCell.innerText = cell.isMine ? '💥' : (cell.minesAroundCount > 0 ? cell.minesAroundCount : '')
                revealedCells.push({ row, col, cell })
            }
        }
    }

    gHints--
    updateHintButton()

    setTimeout(() => {
        for (var revealed of revealedCells) {
            var elCell = document.querySelector(`.cell-${revealed.row}-${revealed.col}`)
            elCell.classList.add('covered')
            elCell.classList.remove('hint-revealed')
            elCell.innerText = ''
            revealed.cell.isCovered = true
        }
    }, 1500)
}

function revealHint(i, j) {
    if (gHints === 0) return

    var revealedCells = []

    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= gBoard.length) continue

        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= gBoard[row].length) continue

            var cell = gBoard[row][col]
            if (cell.isCovered) {
                cell.isCovered = false
                var elCell = document.querySelector(`.cell-${row}-${col}`)
                elCell.classList.remove('covered')
                elCell.classList.add('hint-revealed')
                elCell.innerText = cell.isMine ? '💥' : (cell.minesAroundCount > 0 ? cell.minesAroundCount : '')
                revealedCells.push({ row, col, cell })
            }
        }
    }

    gHints--
    updateHintButton()

    setTimeout(() => {
        for (var revealed of revealedCells) {
            var elCell = document.querySelector(`.cell-${revealed.row}-${revealed.col}`)
            elCell.classList.add('covered')
            elCell.classList.remove('hint-revealed')
            elCell.innerText = ''
            revealed.cell.isCovered = true
        }
    }, 1500)
}

function updateHintButton() {
    var elHintBtn = document.getElementById("hint-btn")
    if (elHintBtn) {
        elHintBtn.innerText = `Hint (${gHints})`
    }
}


















