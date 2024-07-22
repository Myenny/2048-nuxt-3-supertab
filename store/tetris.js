import { defineStore } from 'pinia';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const createEmptyBoard = () => Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));

const TETROMINOES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]]
];

export const useTetrisStore = defineStore('tetris', {
  state: () => ({
    board: createEmptyBoard(),
    currentPiece: null,
    currentPosition: { x: 0, y: 0 },
    score: 0,
    level: 1,
    gameOver: false,
    gameInterval: null
  }),
  actions: {
    setBoard(board) {
      this.board = board;
    },
    setCurrentPiece(piece) {
      this.currentPiece = piece;
    },
    setCurrentPosition(position) {
      this.currentPosition = position;
    },
    setScore(score) {
      this.score = score;
    },
    setLevel(level) {
      this.level = level;
    },
    setGameOver(gameOver) {
      this.gameOver = gameOver;
    },
    setGameInterval(interval) {
      this.gameInterval = interval;
    },
    startGame() {
      this.setBoard(createEmptyBoard());
      this.setScore(0);
      this.setLevel(1);
      this.setGameOver(false);
      this.spawnNewPiece();
      const gameInterval = setInterval(() => this.moveDown(), 1000);
      this.setGameInterval(gameInterval);
    },
    stopGame() {
      if (this.gameInterval) {
        clearInterval(this.gameInterval);
        this.setGameInterval(null);
      }
    },
    spawnNewPiece() {
      const newPiece = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
      const newPosition = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece[0].length / 2), y: 0 };
      
      if (this.isCollision(newPiece, newPosition)) {
        this.setGameOver(true);
        this.stopGame();
      } else {
        this.setCurrentPiece(newPiece);
        this.setCurrentPosition(newPosition);
      }
    },
    moveLeft() {
      const newPosition = { ...this.currentPosition, x: this.currentPosition.x - 1 };
      if (!this.isCollision(this.currentPiece, newPosition)) {
        this.setCurrentPosition(newPosition);
      }
    },
    moveRight() {
      const newPosition = { ...this.currentPosition, x: this.currentPosition.x + 1 };
      if (!this.isCollision(this.currentPiece, newPosition)) {
        this.setCurrentPosition(newPosition);
      }
    },
    moveDown() {
      const newPosition = { ...this.currentPosition, y: this.currentPosition.y + 1 };
      if (!this.isCollision(this.currentPiece, newPosition)) {
        this.setCurrentPosition(newPosition);
      } else {
        this.lockPiece();
        this.clearLines();
        this.spawnNewPiece();
      }
    },
    rotate() {
      const rotatedPiece = this.currentPiece[0].map((_, index) =>
        this.currentPiece.map(row => row[index]).reverse()
      );
      if (!this.isCollision(rotatedPiece, this.currentPosition)) {
        this.setCurrentPiece(rotatedPiece);
      }
    },
    isCollision(piece, position) {
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] && (
            position.x + x < 0 ||
            position.x + x >= BOARD_WIDTH ||
            position.y + y >= BOARD_HEIGHT ||
            this.board[position.y + y][position.x + x]
          )) {
            return true;
          }
        }
      }
      return false;
    },
    lockPiece() {
      const newBoard = this.board.map(row => [...row]);
      this.currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            newBoard[this.currentPosition.y + y][this.currentPosition.x + x] = value;
          }
        });
      });
      this.setBoard(newBoard);
    },
    clearLines() {
      let linesCleared = 0;
      const newBoard = this.board.filter(row => {
        if (row.every(cell => cell !== 0)) {
          linesCleared++;
          return false;
        }
        return true;
      });
      
      while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
      }
      
      this.setBoard(newBoard);
      this.setScore(this.score + linesCleared * 100);
      if (this.score % 1000 === 0) {
        this.setLevel(this.level + 1);
        // Increase game speed
        clearInterval(this.gameInterval);
        const newInterval = setInterval(() => this.moveDown(), 1000 - (this.level * 50));
        this.setGameInterval(newInterval);
      }
    }
  }
});
