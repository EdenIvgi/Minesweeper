'use strict'
onInit()
function renderBoard(mat, selector) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const className = `cell cell-${i}-${j} covered`
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" 
                        oncontextmenu="onCellMarked(event, this, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(updateTimer, 100)
}

function updateTimer() {
    var elTimer = document.getElementById("timer")
    if (!elTimer) return

    var elapsedTime = (Date.now() - gStartTime) / 1000
    gGame.secsPassed = elapsedTime
    elTimer.innerText = elapsedTime.toFixed(2)
}

function stopTimer() {
    clearInterval(gTimerInterval)
    gTimerInterval = null
    gGame.secsPassed = 0
}

