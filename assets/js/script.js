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
let timer = 1000;
const multiplier = 0.96;
const width = 10; // Number of columns in the grid
const height = 20; // Number of rows in the grid
let squares = [];
let currentPosition = 4;
let currentRotation = 0;
let playerScore = 0;
let highScore = 0;
let tickCounter = 0;
let reset = false;
let gameLoopTimeout;
//Functions

document.addEventListener('DOMContentLoaded', function () {
    //event listener for start button. runGame called upn click
    document.getElementById('resetButton').addEventListener('click', () => {
        reset = true;
        restart();
    });
})

/**

 * Clears the board and resets the game.

 */
function setupBoard() {
    //clear the board
    squares.forEach(square => {
        square.classList.remove('tetromino', 'taken');
        square.style.backgroundColor = '';
    });
    //reset the score
    playerScore = 0;
    displayScore();
    //reset the timer
    timer = 1000;
    run = false;
    tickCounter = 0;
}

function startGame() {
    document.getElementById('left').addEventListener('click', moveLeft);
    document.getElementById('rotate').addEventListener('click', rotate);
    document.getElementById('right').addEventListener('click', moveRight);

}

function restart() {
    setupBoard();
    run = false;
    tickCounter = 0;
    timer = 1000; // Reset the timer to its initial value
    document.removeEventListener('keydown', control);
    document.addEventListener('keydown', control);

    document.getElementById('left').removeEventListener('click', moveLeft);
    document.getElementById('left').addEventListener('click', moveLeft);

    document.getElementById('rotate').removeEventListener('click', rotate);
    document.getElementById('rotate').addEventListener('click', rotate);

    document.getElementById('right').removeEventListener('click', moveRight);
    document.getElementById('right').addEventListener('click', moveRight);

    reset = false; // Reset the reset flag
    clearTimeout(gameLoopTimeout); // Clear any existing timeouts
    gameLoopTimeout = setTimeout(runGame, 1000); // Start the game loop after a short delay
}


// Define Tetromino shapes with colors
const tetrominoes = [
    // L-Tetromino
    {
        shape: [
            [1, 1, 1],
            [1, 0, 0]
        ],
        color: 'orange'
    },
    // Z-Tetromino
    {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: 'red'
    },
    // T-Tetromino
    {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: 'purple'
    },
    // O-Tetromino
    {
        shape: [
            [1, 1, 0],
            [1, 1, 0]
        ],
        color: 'yellow'
    },
    // I-Tetromino
    {
        shape: [
            [1, 1, 1, 1],
            [0, 0, 0, 0]
        ],
        color: 'cyan'
    },
    // S-Tetromino
    {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: 'green'
    },
    // J-Tetromino
    {
        shape: [
            [1, 1, 1],
            [0, 0, 1]
        ],
        color: 'blue'
    }
];

squares = Array.from(grid.querySelectorAll('.cell'));

/** 
 * Randomly generates the new block from pre-defined blocks 
 * */

let random = Math.floor(Math.random() * tetrominoes.length);
let current = tetrominoes[random].shape;
let currentColor = tetrominoes[random].color;


/** 
 * Draw the Tetromino on the board
 * */
function drawBlock() {
    current.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (cell === 1) {
                squares[currentPosition + rowIndex * width + cellIndex].style.backgroundColor = currentColor;
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
                squares[currentPosition + rowIndex * width + cellIndex].style.backgroundColor = '';
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
        clearRow();
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
                squares[currentPosition + rowIndex * width + cellIndex].style.backgroundColor = currentColor;
            }
        }));
        // Start a new Tetromino falling
        random = Math.floor(Math.random() * tetrominoes.length);
        current = tetrominoes[random].shape;
        currentColor = tetrominoes[random].color;
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


function clearRow() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

        if (row.every(index => squares[index].classList.contains('taken'))) {
            playerScore += 1
            displayScore()
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

/**
 * displays the player score
 */
function displayScore() {
    document.querySelector(".player-score").textContent = playerScore
    checkHighScore()
    document.querySelector(".high-score").textContent = highScore
}

function checkHighScore() {
    if (playerScore > highScore) {
        highScore = playerScore
    } else {
        return;
    }
}


/**
 * Decrease the timer by 4%. Time is rounded to the nearest whole number.
 * Time is in milliseconds.
 */
function decreaseTimer() {
    timer = (timer * multiplier).toFixed(0);
    //console.log(timer); for tesitng purposes
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



//Gameloop
startGame();
console.log(run);
/**
 * The main game loop function. Uses a setTimeout to call itself every tick.
 */
function runGame() {
    console.log('start of run game: ' + run);
    if (tickCounter === 0) {
        run = true;
        tickCounter++;
    } else {
        tickCounter++;
    }

    console.log('running');
    if (run === true) {
        console.log('should move down' + tickCounter);
        moveDown();

        if (freeze()) {
            if (checkGameOver()) {
                run = endGame();
            } else {
                gameLoopTimeout = setTimeout(runGame, timer);
            }
        } else {
            gameLoopTimeout = setTimeout(runGame, timer);
        }
    } else if (run === false) {
        toggleGameOverMessage();
        console.log('return run' + run);
        return;
    }

    if (reset === true) {
        run = false;
        console.log('Game reset');
        return;
    }

    console.log('end of run game: ' + run);
}

