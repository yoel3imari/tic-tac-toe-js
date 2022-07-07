// case click event
// marks X O
// set turns (random)
// calculate winning 3 lined marks

var board = [
    ["*", "*", "*"],
    ["*", "*", "*"],
    ["*", "*", "*"]
];
var playTurn = NaN;
var counter = 0;
var x_win = 0;
var o_win = 0;
const x_color = "#C24C9C";
const y_color = "#90C111";
const main_color = "#320455"

function slctOne(e) {
    return document.querySelector(e);
}

function slctAll(e) {
    return document.querySelectorAll(e);
}

// clear the board and update turn
function clearBoard() {
    counter = 0;
    const canvas = slctOne("#_canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "none";
    var x = Math.random();
    playTurn = (x > 0.5) ? true : false;
    whosTurn();
    slctAll(".case").forEach(elm => {
        elm.classList.remove("filled");
        elm.style.backgroundColor = "";
        board = [
            ["*", "*", "*"],
            ["*", "*", "*"],
            ["*", "*", "*"]
        ];
        elm.innerText = "";
    })
}

// update on page refresh
document.addEventListener("DOMContentLoaded", () => {
    var x = Math.random();
    playTurn = (x > 0.5) ? true : false;
    whosTurn();

    // get center of first case to pos canvas on board
    const canvas = slctOne("#_canvas");
    var c11_center = getCenter(".c11");
    canvas.style.left = `${c11_center[0]}px`;
    canvas.style.top = `${c11_center[1]}px`;
    canvas.style.display = "none";
});

// check whose turn to update turn section
function whosTurn() {
    const pt = slctAll(".player-turn");
    // 1 -> X ; 0 -> O
    if (playTurn) {
        pt[0].style.opacity = "1";
        pt[1].style.opacity = ".25";
    } else {
        pt[1].style.opacity = "1";
        pt[0].style.opacity = ".25";
    }
}

// check if X or O wins to update score
function whoWins() {
    if (playTurn) {
        x_win += 1;
        slctOne("._X_").innerText = x_win;
    } else {
        o_win += 1;
        slctOne("._O_").innerText = o_win;
    }
}

// main function
// on case click
slctAll(".case").forEach(elm => {
    elm.addEventListener("click", () => {
        // check if the case is already filled, skip if so
        if (!elm.classList.contains("filled")) {
            counter += 1;
            // get case position
            var line = elm.getAttribute("data-line") - 1;
            var col = elm.getAttribute("data-col") - 1;
            // set style
            elm.style.backgroundColor = "#32045525";
            elm.style.color = (playTurn) ? x_color : y_color;
            // what symbol to set
            elm.innerText = (playTurn) ? "X" : "O";
            // mark elm as filled
            elm.classList.add("filled");
            // fill the matrix
            board[line][col] = (playTurn) ? 1 : 0;
            // verify board
            if (counter > 4) {
                var mark = (playTurn) ? 1 : 0;
                // if win return true
                var win = verifyBoard(line, col, mark);
                if (win[0]) {
                    // block all left cases
                    slctAll(".case").forEach(c => {
                        if (!c.classList.contains("filled"))
                            c.classList.add("filled");
                    });
                    // reset click counter
                    counter = 0;
                    //draw winning line
                    winLine(win[1], win[2]);
                    whoWins();
                    
                    return;
                }
            }
            // switch turn
            playTurn = !playTurn;
            whosTurn();
        }
    })
});

// check the board
function verifyBoard(line, col, mark) {
    // 0 for line - 1 for col - 2 for diag
    if (checkLine(line, mark)) return [true, 0, line];
    if (checkColumn(col, mark)) return [true, 1, col];
    if (line == col || line - col == 2 || col - line == 2) {
        var diag = checkDiagonal(mark);
        if (diag[0]) return [true, 2, diag[1]];
    }

    return false;
}

function checkLine(line, mark) {
    var x = (mark) ? 1 : 0;
    if (
        board[line][0] == x &&
        board[line][1] == x &&
        board[line][2] == x
    ) {
        return true;
    }
    return false;
}

function checkColumn(col, mark) {
    var x = (mark) ? 1 : 0;
    if (
        board[0][col] == x &&
        board[1][col] == x &&
        board[2][col] == x
    ) {
        return true;
    }
    return false;
}

function checkDiagonal(mark) {
    var x = (mark) ? 1 : 0;
    if (
        board[0][0] == x &&
        board[1][1] == x &&
        board[2][2] == x
    ) {
        return [true, 1];
    }

    else if (
        board[0][2] == x &&
        board[1][1] == x &&
        board[2][0] == x
    ) {
        return [true, 2];
    }

    return false;
}

// draw winning line
function winLine(type, pos) {
    // line
    if (type == 0) {
        pos = pos + 1;
        drawLine([0, 100 * pos - 100], [200, 100 * pos - 100]);
    }
    // col
    else if (type == 1) {
        pos = pos + 1;
        drawLine([100 * pos - 100, 0], [100 * pos - 100, 200]);
    }
    // diag
    else if (type == 2) {
        if (pos == 1) {
            drawLine([0, 0], [200, 200]);
        }

        else if (pos == 2) {
            drawLine([200, 0], [0, 200]);
        }
    }
}

function getCenter(_case) {
    const c = slctOne(_case);
    var cx = c.offsetLeft + c.offsetWidth / 2;
    var cy = c.offsetTop + c.offsetHeight / 2;
    // return center of case
    return [cx, cy];
}

function drawLine(a, b) {
    // draw the line XD
    const canvas = slctOne("#_canvas");
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = main_color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
}

// clear the board
slctOne('.clear-board button').addEventListener("click", () => clearBoard());