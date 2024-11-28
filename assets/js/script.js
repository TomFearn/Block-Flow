const grid = document.querySelector('#gameBoard');
for (let i = 0; i < 200; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    grid.appendChild(cell);
}

//Variables
let run;























































































//Functions

document.addEventListener('DOMContentLoaded', function(){
    //event listener for start button. runGame called upn click
    document.getElementById('resetButton').addEventListener('click', function() {
        //setup board function called
        run = true;
        setupBoard();
        spawnBlock();
        runGame();
    });
})
    
/**

 * Clears the board and resets the game.

 */
function setupBoard() {
}

function restart() {
    //call setupBoard and runGame
    setupBoard();
    spawnBlock();
    runGame();
    toggleGameOverMessage();
}


let timer = 300;
const multiplier = 0.96;
    
/**
 * Decrease the timer by 4%. Time is rounded to the nearest whole number.
 * Time is in milliseconds.
 */
function decreaseTimer() {
    timer = (timer * multiplier).toFixed(0);
    //console.log(timer); for tesitng purposes
}


































































































































































































































// Variables
const width = 10;
let squares = [];
let currentPosition = 4;
let currentRotation = 0;

// Define Tetromino shapes
const tetrominoes = [
    // L-Tetromino
    [
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // Z-Tetromino
    [
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // T-Tetromino
    [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // O-Tetromino
    [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // I-Tetromino
    [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // S-Tetromino
    [
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // J-Tetromino
    [
        [1, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
];

squares = Array.from(grid.querySelectorAll('.cell'));

/** 
 * Randomly generates the new block from pre-defined blocks 
 * */
function newRandomBlock() {
    let random = Math.floor(Math.random() * tetrominoes.length);
    let current = tetrominoes[random];
}

/** 
 * Draw the Tetromino on the board
 * */
function drawBlock() {
    current.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (cell === 1) {
                squares[currentPosition + rowIndex * width + cellIndex].classList.add('tetromino');
            }
        });
    });
}

/** 
 * Undraw the Tetromino on the board
 * */
function undrawBlock() {
    current.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (cell === 1) {
                squares[currentPosition + rowIndex * width + cellIndex].classList.remove('tetromino');
            }
        });
    });
}

spawnBlock();


/** 
 * Move the block down by one row
 * */
function moveDown() {
    undrawBlock();
    currentPosition += width;
    drawBlock();
    freeze();
}

/** 
 * Move the Tetromino left, unless at the edge or there is a blockage
 * */
function moveLeft() {
    undrawBlock();
    const isAtLeftEdge = current.some((row, rowIndex) => row.some((cell, cellIndex) => cell === 1 && (currentPosition + rowIndex * width + cellIndex) % width === 0));
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some((row, rowIndex) => row.some((cell, cellIndex) => cell === 1 && squares[currentPosition + rowIndex * width + cellIndex].classList.contains('taken')))) {
        currentPosition += 1;
    }
    drawBlock();
}


/** 
 * Move the Tetromino right, unless at the edge or there is a blockage
 * */
function moveRight() {
    undrawBlock();
    const isAtRightEdge = current.some((row, rowIndex) => row.some((cell, cellIndex) => cell === 1 && (currentPosition + rowIndex * width + cellIndex) % width === width - 1));
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some((row, rowIndex) => row.some((cell, cellIndex) => cell === 1 && squares[currentPosition + rowIndex * width + cellIndex].classList.contains('taken')))) {
        currentPosition -= 1;
    }
    drawBlock();
}


/**
 * Freezes the current Tetromino in place if it has collided with a taken cell.
 * Adds the 'taken' class to the cells occupied by the Tetromino.
 * Spawns a new Tetromino and resets the current position.
 */
function freeze() {
    if (current.some((row, rowIndex) => row.some((cell, cellIndex) => cell === 1 && squares[currentPosition + rowIndex * width + cellIndex + width].classList.contains('taken')))) {
        current.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
            if (cell === 1) {
                squares[currentPosition + rowIndex * width + cellIndex].classList.add('taken');
            }
        }));
        // Start a new Tetromino falling
        spawnBlock();
        currentPosition = 4;
        draw();
    }
}




stopBlock()


checkGameOver() 


function endGame() {
    return false;
}






































































































































































































































































































































let playerScore
let highScore


function displayScore(){
    document.querySelector(".player-score").value = playerScore
}

function checkHighScore(){
    if (playerScore > highScore){
        highScore = playerScore
    } else{
        return
    }
}


function checkFilledRow(){
    
}


function clearRow(){

}


function updateScore(){
    ++playerScore
}

//could have

rotateBlock()











































































































































































































































































/**
 * Toggles the game over message on and off.
 */
function toggleGameOverMessage() {
    //game over message
    let gameOver = document.getElementById('gameOverMessage');
    if (gameOver.classList.contains('gamever-off')) {
        gameOver.classList.add('gameover-on');
        gameOver.classList.remove('gameover-off');
    } else {
        gameOver.classList.add('gameover-off');
        gameOver.classList.remove('gameover-on');
    }
}






//Gameloop

/**
 * The main game loop function. Uses a setTimeout to call itself every tick.
 */
function runGame() {
    if (run === true) {

        moveDown();
        
        if (checkCollison()) {
            stopBlock();
            checkFilledRow(); // all the flled rows and board would be adjusted here
            if (checkGameOver()) {
                run = endGame();
            } else {
                spawnBlock();
                setTimeout(runGame, timer);
            }
        } else {
            setTimeout(runGame, timer);
        }
    } else if (run === false) {
        toggleGameOverMessage();
    }
}
