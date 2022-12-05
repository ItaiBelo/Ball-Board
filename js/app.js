'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'
const sound = new Audio('audio/pop.mp3')

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src="img/glue.png">'

var gBallCounter
var gBallsOnBoard = 0
var gCount = 0
var gIsVictory = false
var elTitle = document.querySelector('h1')
var gGameStarted = true
var gIntervalId
var gIntervalIdGlue
var gBallsArouns
// Model:
var gBoard
var gGamerPos

function onInitGame() {
    gBallCounter = 0
    gGamerPos = { i: getRandomInt(1, 8), j: getRandomInt(1, 10) }
    gBoard = buildBoard()
    renderBoard(gBoard)
    for (var i = 0; i < 3; i++) renderBall()
    // while (gIsVictory === false)
    gIntervalId = setInterval(renderBall, 3000)
    gIntervalIdGlue = setInterval(renderGlue, 5000)
}

function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
        }
    }
    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[0][4].type = FLOOR
    board[9][4].type = FLOOR
    board[5][0].type = FLOOR
    board[5][11].type = FLOOR

    return board
}

function renderBall() {
    var randRow = getRandomInt(1, 8)
    var randColl = getRandomInt(1, 10)
    var newBall = { i: randRow, j: randColl }
    const targetBallCell = gBoard[randRow][randColl]

    if (targetBallCell.gameElement === BALL || targetBallCell.gameElement === GAMER || targetBallCell.gameElement === GLUE) return

    newBall = { i: randRow, j: randColl }
    // console.log(newBall)
    gBoard[randRow][randColl].gameElement = BALL
    gBallsOnBoard++
    renderCell(newBall, BALL_IMG)
}

function renderGlue() {
    var randRow = getRandomInt(1, 8)
    var randColl = getRandomInt(1, 10)
    var newGlue = { i: randRow, j: randColl }
    const targetBallCell = gBoard[randRow][randColl]

    if (targetBallCell.gameElement === BALL || targetBallCell.gameElement === GAMER) return

    newGlue = { i: randRow, j: randColl }
    // console.log(newBall)
    gBoard[randRow][randColl].gameElement = GLUE
    gBallsOnBoard++
    renderCell(newGlue, GLUE_IMG)
}

// Render the board to an HTML table
function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            if (currCell.type === FLOOR) {
                cellClass += ' floor'
                currCell.type += FLOOR
            }
            else if (currCell.type === WALL) cellClass += ' wall'
            // console.log(cellClass)

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {

    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)
    // console.log('i gamer pos: ' + gGamerPos.i, 'j : ' + gGamerPos.j)
    const targetCell = gBoard[i][j]
    // console.log(targetCell)

    if (targetCell.type === WALL) return
    // Calculate distance to make sure we are moving to a neighbor cell
    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
        if (targetCell.gameElement === BALL) {
            sound.play()
            gBallCounter++
            gBallsOnBoard--
            elTitle.innerText = `Balls collected : ${gBallCounter}`
            if (gBallsOnBoard === 0) {
                // elTitle.innerText = `victory`
                if (isVictory()) {
                    onOpenModal()
                    clearInterval(gIntervalId)
                }
            }
        }

        // DONE: Move the gamer
        // REMOVING FROM
        // update Model
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // update DOM
        renderCell(gGamerPos, '')

        // ADD TO
        // update Model
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        // update DOM
        renderCell(gGamerPos, GAMER_IMG)

    }
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

function isVictory() {
    // var elReset = document.querySelector('.rest')
    if (gBallsOnBoard === 0) {
        onOpenModal()
        gIsVictory = true
        return true
    }
    return false
}
// Move the player by keyboard arrows

function onHandleKey(event) {
    const i = gGamerPos.i
    const j = gGamerPos.j
    // console.log('event.key:', event.key)
    switch (event.key) {
        case 'ArrowLeft':
            if (i === 5 && j === 0) {
                gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
                renderCell(gGamerPos, '')
                gBoard[i][j].gameElement = GAMER
                gGamerPos = { i: 5, j: 11 }
                renderCell(gGamerPos, GAMER_IMG)
            }
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            if (i === 5 && j === 11) {
                gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
                renderCell(gGamerPos, '')
                gBoard[i][j].gameElement = GAMER
                gGamerPos = { i: 5, j: 0 }
                renderCell(gGamerPos, GAMER_IMG)
            }
            moveTo(i, j + 1)
            break
        case 'ArrowUp':
            if (i === 0 && j === 4) {
                gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
                renderCell(gGamerPos, '')
                gBoard[i][j].gameElement = GAMER
                gGamerPos = { i: 9, j: 4 }
                renderCell(gGamerPos, GAMER_IMG)
            }
            moveTo(i - 1, j)
            break
        case 'ArrowDown':
            if (i === 9 && j === 4) {
                gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
                renderCell(gGamerPos, '')
                gBoard[i][j].gameElement = GAMER
                gGamerPos = { i: 0, j: 4 }
                renderCell(gGamerPos, GAMER_IMG)
            }
            moveTo(i + 1, j)
            break
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function onOpenModal() {
    // Todo: show the modal and schedule its closin
    var gElModal = document.querySelector('.modal')
    // gModalHeader.style.color = getRandomColor()
    gElModal.style.display = 'block'

}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
