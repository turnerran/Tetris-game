const width = 20; // main game yard height
const height = 20; // main game yard height
const gameBoard = new Array(height);
const square_size = 20; // smallest size of game
const color = {
    background: "rgba(127, 59, 231, 0.89)",
    wall: "MIDNIGHTBLUE",
    solid: "#49b5ab",
    currentA: "#ef6666",
    currentB: "#66efe4",
    currentC: "#18a6ec",
    currentD: "#44ce51",
    currentE: "#e9cf2b",
    currentF: "rgb(236, 156, 43)",
    currentG: "red",
    completed: "green"
}

const squareTypes = {
    background: 0,
    wall: 1,
    bottom: 2,
    current: 3,
    done: 4
}

for (let x = 0; x < width; x++) {
    gameBoard[x] = new Array(height).fill(squareTypes.background);
}

    // Mark bottom
for (let x = 0; x < width; x++){
    gameBoard[x][height - 1] = squareTypes.bottom;
}
    // Mark walls
for (let y = 0; y < height; y++) {
    gameBoard[0][y] = squareTypes.wall;
    gameBoard[width - 1][y] = squareTypes.wall;
}

// Generate gameBoard - well

const gameDiv = document.getElementsByClassName("tetris-container")[0];
gameDiv.style.width = (width * square_size) + "px";
gameDiv.style.height = (height * square_size) + "px";
for (let y = 0; y < height; y++) {
    let row = document.createElement("div");
    row.style.left = square_size * + "px";
    row.style.width = ((width - 2) * square_size) + "px";
    row.style.height = square_size + "px";
    row.style.display = "flex";
    row.style["margin-left"] = square_size + "px";
    row.setAttribute("id", "row_" + y);
    for (let x = 0; x < width; x++) {
        let square = document.createElement("div");
        square.setAttribute("id", "square_x" + x + "y" + y);
        square.style.position = "absolute";
        square.style.left = x * square_size + "px";
        square.style.top = y * square_size + "px";
        square.style.width = square_size + "px";
        square.style.height = square_size + "px";
        square.style.zIndex = 0;
        const block_type = gameBoard[x][y];
        if (block_type == squareTypes.background) {
            square.style.background = color.background;
        }
        if (block_type == squareTypes.wall || block_type == squareTypes.bottom) {
            square.style.background = color.wall;
        }    
        if (block_type == squareTypes.background) {
            row.appendChild(square);
        }
        else{
            gameDiv.appendChild(square);
        }
    }
    gameDiv.appendChild(row);
}

//generate next lobby
const nextContainer = document.getElementsByClassName("tetris-next-container")[0];
let index = 0;
for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++, index++) {
    let square = document.createElement("div");
    square.setAttribute("id", "next_" + index);
    square.style.position = "absolute";
    square.style.left = 0 + x * square_size + "px";
    square.style.top = 0 + y * square_size + "px";
    square.style.width = square_size + "px";
    square.style.height = square_size + "px";
    square.style.background = color.background;
    nextContainer.appendChild(square);
    }
}
nextContainer.style.width =  3 * square_size + "px";
nextContainer.style.height =  3 * square_size  + "px";

let currentScore = 0;
const bonusScore = 500;

let position = { x: width / 2 - 1, y: 0 };
const direction = {left: 0, right: 1, bottom: 2};

let current = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let next = [0, 0, 0, 0, 0, 0, 0, 0, 0];

let A = [0, 0, 1, 0, 0, 1, 0, 1, 1];

let B = [1, 0, 0, 1, 0, 0, 1, 1, 0];

let C = [0, 0, 0, 0, 1, 0, 1, 1, 1];

let D = [0, 0, 0, 0, 1, 1, 1, 1, 0];

let E = [0, 0, 0, 1, 1, 0, 0, 1, 1];

let F = [1, 1, 0, 1, 1, 0, 0, 0, 0];

let G = [0, 0, 0, 1, 1, 1, 0, 0, 0];

// Array containing all currents
let currents = [A, B, C, D, E, F, G];
// Select next current
function make_random() {
    // Select random current
    let index = Math.floor(Math.random() * currents.length);
    // Copy current into current array (avoid reference assignment)
    return currents[index];
    // return currents[2];
}
function getColorByType(type = "current"){
    const tetrisColor = type === "current" ? current : next;
    switch (tetrisColor) {
        case A:
            return "currentA"
            break;
        case B:
            return "currentB"
            break;
        case C:
            return "currentC"
            break;
        case D:
            return "currentD"
            break;
        case E:
            return "currentE"
            break;
        case F:
            return "currentF"
            break;
        case G:
            return "currentG"
            break;
      }
}
function update_next() {
    const nextColor = getColorByType("next");
    for (let i = 0; i < 9; i++) {
        let square = document.getElementById("next_" + i);
        next[i] === 1
        ? (square.style.background = color[nextColor])
        : (square.style.background = color.background);
    }
}
// function update_current() {
//     const currentColor = getColorByType();
//     for (let i = 0; i < 9; i++) {
//         let square = document.getElementById("current_container_" + i);
//         current[i] === 1
//         ? (square.style.background = color[currentColor])
//         : (square.style.background = color.background);
//     }
// }
function resetPreviousCurrent(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let currentPosition = gameBoard[x][y];
            if (currentPosition === squareTypes.current){
                gameBoard[x][y] = squareTypes.background;
                const square = document.getElementById("square_x" + x + "y" + y);
                square.style.background = color.background;
            }
        }
    }
}
function animateDoneRow(row){
    const classname = "animation-target";
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let rowElement = document.getElementById("row_" + y);
            const block_type = gameBoard[x][y];
            if (y === row && block_type === squareTypes.done) {
                    rowElement.classList.toggle(classname);
                    setTimeout(function() {
                        rowElement.classList.toggle(classname);
                    }, 800);
                break;
            }
        }
    }
}
function drawDoneState(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let square = document.getElementById("square_x" + x + "y" + y);
            const block_type = gameBoard[x][y];
            if (block_type === squareTypes.background || block_type === squareTypes.current) {
                square.style.background = color.background;
            }
            if (block_type === squareTypes.done) {
                // square.style.background = color.completed;
            }
            if (block_type === squareTypes.wall || block_type === squareTypes.bottom) {
            square.style.background = color.wall;
            }   
        }
    }
}
function copyAboveRow(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let square = document.getElementById("square_x" + x + "y" + y);
            const block_type = gameBoard[x][y];
            if (block_type === squareTypes.background || block_type === squareTypes.current) {
                square.style.background = color.background;
            }
            if (block_type === squareTypes.done) {
                // square.style.background = color.completed;
            }
            if (block_type === squareTypes.wall || block_type === squareTypes.bottom) {
            square.style.background = color.wall;
            }   
        }
    }
}
function resetBoard(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let square = document.getElementById("square_x" + x + "y" + y);
            const block_type = gameBoard[x][y];
            if (block_type === squareTypes.current || block_type === squareTypes.done) {
                square.style.background = color.background;
                gameBoard[x][y] = squareTypes.background;
            }
        }
    }
    initAndCreateNewTetrises();
}
function resetBoth(){
    initAndCreateNewTetrises();
    drawDoneState();
}
function initAndCreateNewTetrises(){
    setInitialPosition();
    current = make_random();
    do { 
        next = make_random();
    }
    while (next === current)
    update_next();
    // update_current();
    drawTetris();
}
function setInitialPosition(){
    position.x = width / 2 - 1;
    position.y = 0;
}
function CheckAndActIfFullRow(){
    let shouldCopy = false;
    let row;
    for (let y = height - 1; y >= 0 && !shouldCopy; y--){
        var isoneDone = false;
        for (let x = width - 1; x >= 0 ; x--){
            if (gameBoard[x][y] !== squareTypes.wall && gameBoard[x][y] !== squareTypes.bottom &&
                gameBoard[x][y] !== squareTypes.done){
                    break;
            }
            else if (gameBoard[x][y] === squareTypes.done){
                isoneDone = true;
            }
            if (x === 0 && isoneDone){
                shouldCopy = true;
                row = y;
            }
        }
    }
    if (shouldCopy){
        for (let y = row; y > 0; y--){
            for (let x = width - 1; x > 0 ; x--){
                if (gameBoard[x][y] === squareTypes.bottom){
                    break;
                }
                if (gameBoard[x][y] === squareTypes.current){
                    gameBoard[x][y] = squareTypes.done;
                }
                gameBoard[x][y] = gameBoard[x][y - 1];
            }
        }
        animateDoneRow(row)
        setTimeout(() => {
            drawDoneState();
            initAndCreateNewTetrises();
        }, 800);
    }
    return shouldCopy;
}
function drawTetris(step = null) {
    let nextStep;
    let bottomEdge = current.some( (value,index) => index > 5 && value === 1);
    let leftEdge = current.some( (value,index) => (index === 0 || index === 3 || index === 6) && value === 1);
    let rightEdge = current.some( (value,index) => (index === 2 || index === 5 || index === 8) && value === 1);
    
    if (step === direction.left){
        nextStep = position.x - 1;
        if (nextStep > 1 + (leftEdge ? 0 : -1)){
            position.x = nextStep;
        }
    }
    if (step === direction.right){
        nextStep = position.x + 1;
        if (nextStep < width - 2 + (rightEdge ? 0 : 1)){
            position.x = nextStep;
        }
    }
    if (step === direction.bottom){
        nextStep = position.y + 1;
        if (nextStep < height - 3 + (bottomEdge ? 0 : 1)){
            position.y = nextStep;
        }
    }
    const x = position.x;
    const y = position.y;
    if (step != null){
        resetPreviousCurrent();
    }
    const currentColor = getColorByType();
    for(var i = 0; i < 3;i++){
        for (var j = 0; j < 3; j++){
            const currX = x - 1 + j;
            const currY = y + i;
            const position = j + (i * 3);
            if (current[position] === 1){
                let square = document.getElementById("square_x" + currX + "y" + currY);
                square.style.background = color[currentColor];
                gameBoard[currX][currY] = squareTypes.current;
            } 
        }
    }
    let didCollide = false;
    for(var i = 0; i < 3 && !didCollide;i++){
        for (var j = 0; j < 3 && !didCollide; j++){
            const currX = x - 1 + j;
            const currY = y + i;
            const nextDownStep = gameBoard[currX][currY + 1];
            const position = j + (i * 3);
            if (current[position] === 1){
                if (nextDownStep === squareTypes.bottom || nextDownStep === squareTypes.done){
                    didCollide = true;
                    if (currY - i <= 0){
                        alert("GAME OVER !");
                        resetBoard();
                        break;
                    }
                }
            }
        }
    }
    var isFull = CheckAndActIfFullRow();
    if (!isFull && didCollide){
        markCurrentAsDone();
        addPoints(false);
        markCurrentAndNextTetris();
    }
    if (isFull){
        addPoints(true);
    }
}
function addPoints(isBonus = false){
    var scoreElement = document.getElementById("score");
    if (isBonus){
        currentScore += bonusScore;
    }
    else{
        const currentPoints = GetCurrentPoints();
        currentScore += currentPoints;
    }
    scoreElement.innerText = currentScore;
}
function GetCurrentPoints(){
    return current.filter(x => x === 1).length;
}
function markCurrentAndNextTetris(){
    resetPreviousCurrent();
    current = next;
    next = make_random();
    update_next();
    // update_current();
    cleanBoard();
    setInitialPosition();
    drawTetris();
}
function cleanBoard(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (gameBoard[x][y] === squareTypes.current){
                gameBoard[x][y] = squareTypes.background;
            }
        }
    }
}
function markCurrentAsDone(){
    const x = position.x;
    const y = position.y;

    resetPreviousCurrent();
    const currentColor = getColorByType();
    for(var i = 0; i < 3; i++){
        for (var j = 0; j < 3; j++){
            const currX = x - 1 + j;
            const currY = y + i;
            const position = j + (i * 3);
            if (current[position] === 1){
                let square = document.getElementById("square_x" + currX + "y" + currY);
                square.style.background = color[currentColor];
                gameBoard[currX][currY] = squareTypes.done;
            } 
        }
    }
}

window.onload = function () {
    resetBoth();
    drawTetris();

    document.getElementsByClassName("reset-button")[0].addEventListener("click", function(){
        resetBoth();
        });

        document.addEventListener("keydown", (e) => {
        const key_code = e.keyCode;
        let step;
        // Left
        if (key_code == 37) {
            step = direction.left;
        }
        // Right
        if (key_code == 39) {
            step = direction.right;
        }
        // Down
        if (key_code == 40) {
            step = direction.bottom;
        }

        drawTetris(step);
        });


}
