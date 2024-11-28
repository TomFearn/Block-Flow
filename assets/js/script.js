const grid = document.querySelector('#gameBoard');
for (let i = 0; i < 200; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    grid.appendChild(cell);
}

//Variables
























































































//Functions

document.addEventListener('DOMContentLoaded', function(){
    //event listener for start button. runGame called upn click
    //setup board function called
})
    
/**

 * Clears the board and resets the game.

 */
setupBoard()
    //clear board



restart()
    //call setupBoard and runGame





































































































































































































































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
function spawnBlock() {
    let random = Math.floor(Math.random() * tetrominoes.length);
    let current = tetrominoes[random];
    current.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (cell === 1) {
                squares[currentPosition + rowIndex * width + cellIndex].classList.add('tetromino');
            }
        });
    });
}

spawnBlock();


moveDown()
    //called every tick

moveLeft()


moveRight()


checkCollison()


stopBlock()


checkGameOver()


endGame()









































































































































































































































































































































displayScore()


checkHighScore()


checkFilledRow()


clearRow()


updateScore()

//could have

rotateBlock()



















































































































































































































































































//Gameloop

runGame()
    //main game loop
