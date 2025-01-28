'use strict'
function renderBoard(mat, selector) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const cell = mat[i][j];
            const className = `cell cell-${i}-${j}`

            const cellContent = cell.isMine ? '#' : ''
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})">${cellContent}</td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML


}
onInit()


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}
