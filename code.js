const width = 20; // main game yard height
const height = 20; // main game yard height
const gameBoard = new Array(height);
const square_size = 40; // smallest size of game
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

const collideType = {
    bottomOrTetris: 0,
    notCollide: 1,
    ceiling : 2
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

let isGameOver = false;
let currentScore = 0;
const bonusScore = 500;
const animationTime = 800;

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
        case B:
            return "currentB"
        case C:
            return "currentC"
        case D:
            return "currentD"
        case E:
            return "currentE"
        case F:
            return "currentF"
        case G:
            return "currentG"
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

function resetPreviousCurrent(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (gameBoard[x][y] === squareTypes.current){
                const square = getSquareByXandY(x,y)
                gameBoard[x][y] = squareTypes.background;
                square.style.background = color.background;
            }
        }
    }
}

function getSquareByXandY(x,y){
    return document.getElementById("square_x" + x + "y" + y);
}

function animateDoneRow(){
    showFireworks();
    let timer = 0;
    const classname = "animation-target";
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let rowElement = document.getElementById("row_" + y);
            const block_type = gameBoard[x][y];
            if (block_type === squareTypes.done || block_type === squareTypes.current) {
                // timer += animationTime;
                setTimeout(() => {
                    rowElement.classList.toggle(classname);
                    setTimeout(() => {
                        rowElement.classList.toggle(classname);
                    }, animationTime);
                }, timer);
                break;
            }
        }
    }
}
function showFireworks(){
    var fireWorksElement = document.getElementsByClassName("fireworks")[0];
    setTimeout(() => {
        fireWorksElement.style.display = "block";
        setTimeout(() => {
            fireWorksElement.style.display = "none";
        },3000);
}   , 0);
}

function drawDoneState(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let square = getSquareByXandY(x,y)
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
function copyAboveRow(row){
    for (let y = row; y > 0; y--){
        for (let x = width - 1; x > 0 ; x--){
            if (gameBoard[x][y] === squareTypes.bottom){
                break;
            }
            let square = getSquareByXandY(x, y)
            let aboveSquare = getSquareByXandY(x, y - 1)
            if (gameBoard[x][y] === squareTypes.current){
                gameBoard[x][y] = squareTypes.done;
            }
            gameBoard[x][y] = gameBoard[x][y - 1];
            square.style.background = aboveSquare.style.background;
        }
    }
}
function resetBoard(){
    drawCleanBoard()
    initAndCreateNewTetrises();
    updateScore(0);
}

function drawCleanBoard(){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let square = getSquareByXandY(x,y)
            const block_type = gameBoard[x][y];
            if (block_type === squareTypes.current || block_type === squareTypes.done) {
                square.style.background = color.background;
                gameBoard[x][y] = squareTypes.background;
            }
        }
    }
}

function resetAll(){
    initAndCreateNewTetrises();
    makeMove();
    resetBoard();
    updateScore(0);
    makeMove();
}

function initAndCreateNewTetrises(){
    setInitialPosition();
    current = make_random();
    do { 
        next = make_random();
    }
    while (next === current)
    update_next();
}

function setInitialPosition(){
    position.x = width / 2 - 1;
    position.y = 0;
}

function CheckAndActIfFullRow(){
    let shouldCopy = false;
    for (let y = height - 1; y >= 0 && !shouldCopy; y--){
        var isoneDone = false;
        for (let x = width - 1; x >= 0 ; x--){
            if (gameBoard[x][y] === squareTypes.background){
                    break;
            }
            else if (gameBoard[x][y] === squareTypes.done || gameBoard[x][y] === squareTypes.current){
                isoneDone = true;
            }
            if (x === 0 && isoneDone){
                shouldCopy = true;
                row = y;
            }
        }
    }
 
    if (shouldCopy){
        markCurrentAsDone();
        animateDoneRow();
        setTimeout(() => {
            copyAboveRow(row);
            drawDoneState();
            markCurrentAndNextTetris();
            drawCurrentTetris();
        }, animationTime);
    }
    return shouldCopy;
}

function makeMove(step = null) {
    let nextStep;
    let bottomEdge = current.some( (value,index) => index > 5 && value === 1);
    let leftEdge = current.some( (value,index) => (index === 0 || index === 3 || index === 6) && value === 1);
    let rightEdge = current.some( (value,index) => (index === 2 || index === 5 || index === 8) && value === 1);
    
    if (step === direction.left){
        nextStep = position.x - 1;
        if (nextStep > 1 + (leftEdge ? 0 : -1)){
            if (didCollideSide(direction.left)){
                return;
            }
            position.x = nextStep;
        }
    }
    if (step === direction.right){
        nextStep = position.x + 1;
        if (nextStep < width - 2 + (rightEdge ? 0 : 1)){
            if (didCollideSide(direction.right)){
                return;
            }
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
    drawCurrentTetris();
    const collisionType = didCollide(x,y);
    var isFull = CheckAndActIfFullRow();
    if (!isFull && collisionType === collideType.bottomOrTetris){
        resetPreviousCurrent();
        markCurrentAsDone();
        markCurrentAndNextTetris();
        drawCurrentTetris();
    }
    if (collisionType === collideType.bottomOrTetris){
        addPoints(isFull);
    }
    if (collisionType === collideType.ceiling){
        resetAll();
    }
}

function drawCurrentTetris(){
    const x = position.x;
    const y = position.y;
    const currentColor = getColorByType();
    for(var i = 0; i < 3;i++){
        for (var j = 0; j < 3; j++){
            const currX = x - 1 + j;
            const currY = y + i;
            const position = j + (i * 3);
            if (current[position] === 1){
                let square = getSquareByXandY(currX, currY);
                square.style.background = color[currentColor];
                gameBoard[currX][currY] = squareTypes.current;
            } 
        }
    }
}

function didCollide(x,y){
    let collisionType = collideType.notCollide;
    for(var i = 0; i < 3 && collisionType === collideType.notCollide ;i++){
        for (var j = 0; j < 3 && collisionType === collideType.notCollide; j++){
            const currX = x - 1 + j;
            const currY = y + i;
            const nextDownStep = gameBoard[currX][currY + 1];
            const position = j + (i * 3);
            if (current[position] === 1){
                if (nextDownStep === squareTypes.bottom || nextDownStep === squareTypes.done){
                    collisionType = collideType.bottomOrTetris;
                    if (currY - i <= 1){
                        isGameOver = true;
                        alert("GAME OVER !");
                        drawCleanBoard();
                        return collideType.ceiling;
                    }
                }
            }
        }
    }
    return collisionType;
}

function didCollideSide(side){
    let res = false;
    const step = side === direction.left ? -1 : 1;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (gameBoard[x][y] === squareTypes.current) {
                    if (gameBoard[x + step][y] === squareTypes.done){
                        return true;
                    }
                }
            }
        }
    return false;
}

function addPoints(isBonus = false){
    if (isBonus){
        currentScore += bonusScore;
    }
    else{
        const currentPoints = GetCurrentPoints();
        currentScore += currentPoints;
    }
    updateScore(currentScore);
}

function updateScore(score){
    var scoreElement = document.getElementById("score");
    scoreElement.innerText = score;
}

function GetCurrentPoints(){
    return current.filter(x => x === 1).length;
}

function markCurrentAndNextTetris(){
    resetPreviousCurrent();
    current = next;
    next = make_random();
    update_next();
    cleanBoard();
    setInitialPosition();
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

function rotate(direction) {
    let copy = [...current];
    let map;
    if (direction === "left"){
        map = [2, 5, 8, 1, 4, 7, 0, 3, 6] 
    }
    else if (direction === "right"){
        map = [6, 3, 0, 7, 4, 1, 8, 5, 2];
    }
    else {
        return;
    }
    current.fill(0);
    for (let i = 0; i < 9; i++) {
        current[i] = copy[map[i]];
    }
    resetPreviousCurrent();
    drawCurrentTetris();
}



window.onload = function () {
    resetAll();
    setInterval(this.makeMove, 1000, direction.bottom);
    document.getElementsByClassName("reset-button")[0].addEventListener("click", function(){
        resetAll();
        });

        document.addEventListener("keydown", (e) => {
        const key_code = e.keyCode;
        const isCtrlPressed = e.ctrlKey;
        let step;

        // ROTATE RIGHT
        if (key_code == 37 && isCtrlPressed) {
            this.rotate("left");
            return;
        // ROTATE LEFT
        }if (key_code == 39 && isCtrlPressed) {
            this.rotate("right");
            return;
        }
        // LEFT
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
        if (step !== undefined){
            makeMove(step);
        }
    });
}
