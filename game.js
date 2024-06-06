document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('gameOver');
    const finalScoreElement = document.getElementById('finalScore');
    const playerNameInput = document.getElementById('playerName');
    const saveScoreButton = document.getElementById('saveScore');
    const leaderboardElement = document.getElementById('leaderboard');
    
    const ROWS = 20;
    const COLS = 10;
    const SQ = 20;
    const VACANT = 'WHITE'; // color of an empty square

    // draw a square
    function drawSquare(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

        ctx.strokeStyle = 'BLACK';
        ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }

    // create the board
    let board = [];
    for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLS; c++) {
            board[r][c] = VACANT;
        }
    }

    // draw the board
    function drawBoard() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                drawSquare(c, r, board[r][c]);
            }
        }
    }

    drawBoard();

    // the pieces and their colors
    const PIECES = [
        [Z, 'red'],
        [S, 'green'],
        [T, 'yellow'],
        [O, 'blue'],
        [L, 'purple'],
        [I, 'cyan'],
        [J, 'orange']
    ];

    // generate random pieces
    function randomPiece() {
        let r = randomN = Math.floor(Math.random() * PIECES.length); // 0 -> 6
        return new Piece(PIECES[r][0], PIECES[r][1]);
    }

    // The Object Piece
    function Piece(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;

        this.tetrominoN = 0; // we start from the first pattern
        this.activeTetromino = this.tetromino[this.tetrominoN];

        // we need to control the pieces
        this.x = 3;
        this.y = -2;
    }

    // fill function
    Piece.prototype.fill = function (color) {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                // we draw only occupied squares
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }

    // draw a piece to the board
    Piece.prototype.draw = function () {
        this.fill(this.color);
    }

    // undraw a piece
    Piece.prototype.unDraw = function () {
        this.fill(VACANT);
    }

    // move Down the piece
    Piece.prototype.moveDown = function () {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            // we lock the piece and generate a new one
            this.lock();
            p = randomPiece();
        }
    }

    // move Right the piece
    Piece.prototype.moveRight = function () {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }

    // move Left the piece
    Piece.prototype.moveLeft = function () {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }

    // rotate the piece
    Piece.prototype.rotate = function () {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let kick = 0;

        if (this.collision(0, 0, nextPattern)) {
            if (this.x > COLS / 2) {
                kick = -1; // move the piece to the left
            } else {
                kick = 1; // move the piece to the right
            }
        }

        if (!this.collision(kick, 0, nextPattern)) {
            this.unDraw();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = nextPattern;
            this.draw();
        }
    }

    let score = 0;

    Piece.prototype.lock = function () {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                if (this.y + r < 0) {
                    gameOver = true;
                    gameOverElement.style.display = 'block';
                    finalScoreElement.textContent = score;
                    return;
                }
                board[this.y + r][this.x + c] = this.color;
            }
        }

        for (let r = 0; r < ROWS; r++) {
            let isRowFull = true;
            for (let c = 0; c < COLS; c++) {
                isRowFull = isRowFull && (board[r][c] != VACANT);
            }
            if (isRowFull) {
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < COLS; c++) {
                        board[y][c] = board[y - 1][c];
                    }
                }
                for (let c = 0; c < COLS; c++) {
                    board[0][c] = VACANT;
                }
                score += 10;
            }
        }
        drawBoard();
        scoreElement.textContent = score;
    }

    Piece.prototype.collision = function (x, y, piece) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece.length; c++) {
                if (!piece[r][c]) {
                    continue;
                }
                let newX = this.x + c + x;
                let newY = this.y + r + y;

                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                if (newY < 0) {
                    continue;
                }
                if (board[newY][newX] != VACANT) {
                    return true;
                }
            }
        }
        return false;
    }

    // control the piece
    document.addEventListener('keydown', CONTROL);

    function CONTROL(event) {
        if (event.keyCode == 37) {
            p.moveLeft();
        } else if (event.keyCode ==
