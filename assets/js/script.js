const grid = document.querySelector('#gameBoard');
for (let i = 0; i < 200; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.classList.remove('tetromino');
    cell.classList.remove('taken');
    grid.appendChild(cell);
    if (i >= 200) {
        cell.classList.add('taken bottom-row');
    }
}

//Variables
let run;


//Functions

document.addEventListener('DOMContentLoaded', function () {
    //event listener for start button. runGame called upn click
    document.getElementById('resetButton').addEventListener('click', function () {
        //setup board function called
        setupBoard();
        run = true;
        drawBlock();
        runGame();
    });
})

/**

 * Clears the board and resets the game.

 */
function setupBoard() {
    //clear the board
    squares.forEach(square => {
        square.classList.remove('tetromino');
        square.classList.remove('taken');
    });
    //reset the score
    playerScore = 0;
    displayScore();
    //reset the timer
    timer = 300;
    run = false
}


function restart() {
    //call setupBoard and runGame
    setupBoard();
    drawBlock();
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
const width = 10; // Number of columns in the grid
const height = 20; // Number of rows in the grid
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

let random = Math.floor(Math.random() * tetrominoes.length);
let current = tetrominoes[random];


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



/** 
 * Move the block down by one row
 * */
function moveDown() {
    undrawBlock();
    currentPosition += width;
    drawBlock();
    if (freeze()) {
        // Check for filled rows and update the score
        checkFilledRow();
        updateScore();
    }
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
 * Rotates the Tetromino 90 degrees clockwise.
 */
function rotate(matrix = current) {
    console.log("Rotating block...");
    undrawBlock();

    const rotatedMatrix = current[0].map((_, colIndex) => current.map(row => row[colIndex])).map(row => row.reverse());
    console.log("Rotated Matrix:", rotatedMatrix);

    const originalPosition = currentPosition;
    current = rotatedMatrix;

    // Check if the rotated Tetromino is within the grid and not overlapping with taken cells
    const isValidPosition = current.every((row, rowIndex) => row.every((cell, cellIndex) => {
        const newPosition = currentPosition + rowIndex * width + cellIndex;
        const isValid = cell === 0 || (newPosition >= 0 && newPosition < squares.length && !squares[newPosition].classList.contains('taken') && newPosition % width >= 0 && newPosition % width < width);
        if (!isValid) {
            console.log(`Invalid position at row ${rowIndex}, col ${cellIndex}, newPosition ${newPosition}`);
        }
        return isValid;
    }));

    if (!isValidPosition) {
        console.log("Invalid position, rotating back to original...");
        current = current[0].map((_, colIndex) => current.map(row => row[colIndex])).map(row => row.reverse()).map(row => row.reverse()).map(row => row.reverse()); // Rotate back to original
        currentPosition = originalPosition;
    }

    drawBlock();
    console.log("Block rotated successfully.");
}


/**
 * Freezes the current Tetromino in place if it has collided with a taken cell.
 * Adds the 'taken' class to the cells occupied by the Tetromino.
 * Spawns a new Tetromino and resets the current position.
 */
function freeze() {
    if (current.some((row, rowIndex) => row.some((cell, cellIndex) => {
            const index = currentPosition + rowIndex * width + cellIndex + width;
            return cell === 1 && (index >= squares.length || squares[index].classList.contains('taken'));
        }))) {
        current.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
            if (cell === 1) {
                squares[currentPosition + rowIndex * width + cellIndex].classList.add('taken');
            }
        }));
        // Start a new Tetromino falling
        random = Math.floor(Math.random() * tetrominoes.length);
        current = tetrominoes[random];
        currentPosition = 4;
        drawBlock();
        return true;
    }
    return false;
}

// Control the Tetromino
function control(e) {
    if (e.keyCode === 65) {
        moveLeft();
    } else if (e.keyCode === 87) {
        rotate();
    } else if (e.keyCode === 68) {
        moveRight();
    } else if (e.keyCode === 83) {
        moveDown();
    }
}

document.addEventListener('keydown', control);




/**Checks for end of game */
function checkGameOver() {
    return false;
}

/**
 * 
 * returns false
 */
function endGame() {
    return false;
}








let playerScore;
let highScore;

/**
 * displays the player score
 */
function displayScore() {
    document.querySelector(".player-score").value = playerScore
}

function checkHighScore() {
    if (playerScore > highScore) {
        highScore = playerScore
    } else {
        return false;
    }
}


function checkFilledRow() {

}


function clearRow() {

}


function updateScore() {
    decreaseTimer();
}

//could have

function rotateBlock() {

}








/**
 * Toggles the game over message on and off.
 */
function toggleGameOverMessage() {
    //game over message
    let gameOver = document.getElementById('gameOverMessage');
    if (gameOver.classList.contains('gameover-off')) {

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
    console.log('running');
    if (run === true) {

        moveDown();

        if (freeze()) {
            //checkFilledRow(); // all the flled rows and board would be adjusted here
            if (checkGameOver()) {
                run = endGame();
            } else {
                setTimeout(runGame, timer);
            }
        }

    } else if (run === false) {
        toggleGameOverMessage();
    }
}