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
const multiplier = 0.99;
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
    document.getElementById('play').addEventListener('click', () => {
        reset = true;
        restart();
        document.getElementById('play').classList.add('hidden')
    });
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

function endGame(){
    document.removeEventListener('keydown', control);
    document.getElementById('rotate').removeEventListener('click', rotate);
    document.getElementById('left').removeEventListener('click', moveLeft);
    document.getElementById('right').removeEventListener('click', moveRight);
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

    // Hide the game over message if it is currently visible
    let gameOver = document.getElementById('gameOverMessage');
    if (gameOver.classList.contains('gameover-on')) {
        gameOver.classList.add('gameover-off');
        gameOver.classList.remove('gameover-on');
    }
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

let pageColor = currentColor;
var root = document.querySelector(':root');
var rootStyles = getComputedStyle(root);
var bgRed = rootStyles.getPropertyValue('--bg-basic');

function changeBackground(){
    console.log(currentColor)
    pageColor=currentColor
    if (pageColor === 'red'){
        root.style.setProperty('--bg-basic', 'linear-gradient(180deg, rgb(100% 0% 0%) 0%, rgb(77.248% 0% 0%) 6.25%, rgb(58.618% 0% 0%) 12.5%, rgb(43.581% 0% 0%) 18.75%, rgb(31.641% 0% 0%) 25%, rgb(22.34% 0% 0%) 31.25%, rgb(15.259% 0% 0%) 37.5%, rgb(10.011% 0% 0%) 43.75%, rgb(6.25% 0% 0%) 50%, rgb(3.664% 0% 0%) 56.25%, rgb(1.978% 0% 0%) 62.5%, rgb(0.954% 0% 0%) 68.75%, rgb(0.391% 0% 0%) 75%, rgb(0.124% 0% 0%) 81.25%, rgb(0.024% 0% 0%) 87.5%, rgb(0.002% 0% 0%) 93.75%, rgb(0% 0% 0%) 100% )');
    } else if(pageColor === 'orange'){
        root.style.setProperty('--bg-basic', 'linear-gradient(180deg, rgb(100% 64.706% 0%) 0%, rgb(77.248% 49.984% 0%) 6.25%, rgb(58.618% 37.929% 0%) 12.5%, rgb(43.581% 28.199% 0%) 18.75%, rgb(31.641% 20.473% 0%) 25%, rgb(22.34% 14.456% 0%) 31.25%, rgb(15.259% 9.873% 0%) 37.5%, rgb(10.011% 6.478% 0%) 43.75%, rgb(6.25% 4.044% 0%) 50%, rgb(3.664% 2.371% 0%) 56.25%, rgb(1.978% 1.28% 0%) 62.5%, rgb(0.954% 0.617% 0%) 68.75%, rgb(0.391% 0.253% 0%) 75%, rgb(0.124% 0.08% 0%) 81.25%, rgb(0.024% 0.016% 0%) 87.5%, rgb(0.002% 0.001% 0%) 93.75%, rgb(0% 0% 0%) 100% )');
    } else if(pageColor === 'yellow'){
        root.style.setProperty('--bg-basic', 'linear-gradient(180deg, rgb(100% 100% 0%) 0%, rgb(77.248% 77.248% 0%) 6.25%, rgb(58.618% 58.618% 0%) 12.5%, rgb(43.581% 43.581% 0%) 18.75%, rgb(31.641% 31.641% 0%) 25%, rgb(22.34% 22.34% 0%) 31.25%, rgb(15.259% 15.259% 0%) 37.5%, rgb(10.011% 10.011% 0%) 43.75%, rgb(6.25% 6.25% 0%) 50%, rgb(3.664% 3.664% 0%) 56.25%, rgb(1.978% 1.978% 0%) 62.5%, rgb(0.954% 0.954% 0%) 68.75%, rgb(0.391% 0.391% 0%) 75%, rgb(0.124% 0.124% 0%) 81.25%, rgb(0.024% 0.024% 0%) 87.5%, rgb(0.002% 0.002% 0%) 93.75%, rgb(0% 0% 0%) 100% )');
    } else if(pageColor === 'green'){
        root.style.setProperty('--bg-basic', 'linear-gradient(180deg, rgb(0% 50.196% 0%) 0%, rgb(0% 38.775% 0%) 6.25%, rgb(0% 29.424% 0%) 12.5%, rgb(0% 21.876% 0%) 18.75%, rgb(0% 15.882% 0%) 25%, rgb(0% 11.214% 0%) 31.25%, rgb(0% 7.659% 0%) 37.5%, rgb(0% 5.025% 0%) 43.75%, rgb(0% 3.137% 0%) 50%, rgb(0% 1.839% 0%) 56.25%, rgb(0% 0.993% 0%) 62.5%, rgb(0% 0.479% 0%) 68.75%, rgb(0% 0.196% 0%) 75%, rgb(0% 0.062% 0%) 81.25%, rgb(0% 0.012% 0%) 87.5%, rgb(0% 0.001% 0%) 93.75%, rgb(0% 0% 0%) 100% )');
    } else if(pageColor === 'cyan'){
        root.style.setProperty('--bg-basic', 'linear-gradient(180deg, rgb(0% 100% 100%) 0%, rgb(0% 77.248% 77.248%) 6.25%, rgb(0% 58.618% 58.618%) 12.5%, rgb(0% 43.581% 43.581%) 18.75%, rgb(0% 31.641% 31.641%) 25%, rgb(0% 22.34% 22.34%) 31.25%, rgb(0% 15.259% 15.259%) 37.5%, rgb(0% 10.011% 10.011%) 43.75%, rgb(0% 6.25% 6.25%) 50%, rgb(0% 3.664% 3.664%) 56.25%, rgb(0% 1.978% 1.978%) 62.5%, rgb(0% 0.954% 0.954%) 68.75%, rgb(0% 0.391% 0.391%) 75%, rgb(0% 0.124% 0.124%) 81.25%, rgb(0% 0.024% 0.024%) 87.5%, rgb(0% 0.002% 0.002%) 93.75%, rgb(0% 0% 0%) 100% )');
    } else if(pageColor === 'blue'){
        root.style.setProperty('--bg-basic', 'linear-gradient(180deg, rgb(0% 0% 100%) 0%, rgb(0% 0% 77.248%) 6.25%, rgb(0% 0% 58.618%) 12.5%, rgb(0% 0% 43.581%) 18.75%, rgb(0% 0% 31.641%) 25%, rgb(0% 0% 22.34%) 31.25%, rgb(0% 0% 15.259%) 37.5%, rgb(0% 0% 10.011%) 43.75%, rgb(0% 0% 6.25%) 50%, rgb(0% 0% 3.664%) 56.25%, rgb(0% 0% 1.978%) 62.5%, rgb(0% 0% 0.954%) 68.75%, rgb(0% 0% 0.391%) 75%, rgb(0% 0% 0.124%) 81.25%, rgb(0% 0% 0.024%) 87.5%, rgb(0% 0% 0.002%) 93.75%, rgb(0% 0% 0%) 100% )');
    } else if(pageColor === 'purple'){
        root.style.setProperty('--bg-basic', 'linear-gradient(180deg, rgb(50.196% 0% 50.196%) 0%, rgb(47.059% 0% 47.059%) 6.25%, rgb(43.922% 0% 43.922%) 12.5%, rgb(40.784% 0% 40.784%) 18.75%, rgb(37.647% 0% 37.647%) 25%, rgb(34.51% 0% 34.51%) 31.25%, rgb(31.373% 0% 31.373%) 37.5%, rgb(28.235% 0% 28.235%) 43.75%, rgb(25.098% 0% 25.098%) 50%, rgb(21.961% 0% 21.961%) 56.25%, rgb(18.824% 0% 18.824%) 62.5%, rgb(15.686% 0% 15.686%) 68.75%, rgb(12.549% 0% 12.549%) 75%, rgb(9.412% 0% 9.412%) 81.25%, rgb(6.275% 0% 6.275%) 87.5%, rgb(3.137% 0% 3.137%) 93.75%, rgb(0% 0% 0%) 100% )');
    }
}


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
    changeBackground()
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
                decreaseTimer();
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
 * Decrease the timer by 1%. Time is rounded to the nearest whole number.
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
    console.log("Checking for game over...");
    // Check if any cell in the second row is taken
    for (let i = width; i < width * 2; i++) {
        if (squares[i].classList.contains('taken')) {
            console.log("Game over detected: cell in second row is taken.");
            return true;
        }
    }
    return false;
}

/**
 * Ends the game and returns false.
 */
function endGame() {
    console.log("Ending game...");
    run = false;
    toggleGameOverMessage();

    // Remove keyboard event listener
    document.removeEventListener('keydown', control);

    // Remove on-screen button event listeners
    document.getElementById('left').removeEventListener('click', moveLeft);
    document.getElementById('rotate').removeEventListener('click', rotate);
    document.getElementById('right').removeEventListener('click', moveRight);
    document.getElementById('down').removeEventListener('click', moveDown);

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
                clearTimeout(gameLoopTimeout);
                gameLoopTimeout = setTimeout(runGame, timer);
            }
        } else {
            clearTimeout(gameLoopTimeout);
            gameLoopTimeout = setTimeout(runGame, timer);
        }
    } else if (run === false) {
        toggleGameOverMessage();
        endGame();
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

