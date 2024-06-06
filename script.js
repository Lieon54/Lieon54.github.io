
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FF8F33', '#33FFF5', '#F533FF'];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentPiece = null;
let score = 0;
let gameInterval = null;

const pieces = 'IJLOSTZ'.split('').map((type) => createPiece(type));

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('leftButton').addEventListener('click', () => movePiece(-1));
document.getElementById('rightButton').addEventListener('click', () => movePiece(1));
document.getElementById('downButton').addEventListener('click', () => dropPiece());
document.getElementById('rotateButton').addEventListener('click', () => rotatePiece());

function startGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    score = 0;
    document.getElementById('score').innerText = score;
    spawnPiece();
    gameInterval = setInterval(gameLoop, 500);
}

function gameLoop() {
    if (!dropPiece()) {
        lockPiece();
        clearLines();
        spawnPiece();
        if (collision()) {
            clearInterval(gameInterval);
            saveHighScore();
            alert('Game Over');
        }
    }
    drawBoard();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillStyle = cell;
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });

    if (currentPiece) {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillStyle = currentPiece.color;
                    ctx.fillRect((currentPiece.x + x) * BLOCK_SIZE, (currentPiece.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.strokeRect((currentPiece.x + x) * BLOCK_SIZE, (currentPiece.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }
}

function createPiece(type) {
    const shapes = {
        I: [
            [1, 1, 1, 1]
        ],
        J: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        L: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        O: [
            [1, 1],
            [1, 1]
        ],
        S: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        T: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        Z: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    };

    return {
        shape: shapes[type].map(row => row.slice()),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        x: Math.floor(COLS / 2) - 1,
        y: 0
    };
}

function spawnPiece() {
    currentPiece = pieces[Math.floor(Math.random() * pieces.length)];
}

function movePiece(offset) {
    currentPiece.x += offset;
    if (collision()) {
        currentPiece.x -= offset;
    }
    drawBoard();
}

function dropPiece() {
    currentPiece.y += 1;
    if (collision()) {
        currentPiece.y -= 1;
        return false;
    }
    return true;
}

function rotatePiece() {
    const oldShape = currentPiece.shape.map(row => row.slice());
    currentPiece.shape = currentPiece.shape[0].map((val, index) =>
        currentPiece.shape.map(row => row[index]).reverse()
    );

    if (collision()) {
        currentPiece.shape = oldShape;
    }
    drawBoard();
}

function collision() {
    return currentPiece.shape.some((row, dy) => {
        return row.some((cell, dx) => {
            let x = currentPiece.x + dx;
            let y = currentPiece.y + dy;
            return cell && (x < 0 || x >= COLS || y >= ROWS || board[y] && board[y][x]);
        });
    });
}

function lockPiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        });
    });
}

function clearLines() {
    let lines = 0;
    board = board.reduce((newBoard, row) => {
        if (row.every(cell => cell)) {
            lines += 1;
            newBoard.unshift(Array(COLS).fill(null));
        } else {
            newBoard.push(row);
        }
        return newBoard;
    }, []);
    score += lines * 100;
    document.getElementById('score').innerText = score;
}

function saveHighScore() {
    const name = prompt('Enter your name:');
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 5)));
    updateHighScores();
}

function updateHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const highScoresList = document.getElementById('highScores');
    highScoresList.innerHTML = highScores.map(score => `<li>${score.name}: ${score.score}</li>`).join('');
}

updateHighScores();
