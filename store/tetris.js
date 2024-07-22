import { createStore } from 'vuex';

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

export const tetrisStore = createStore({
  state: {
    board: createEmptyBoard(),
    currentPiece: null,
    currentPosition: { x: 0, y: 0 },
    score: 0,
    level: 1,
    gameOver: false,
    gameInterval: null
  },
  mutations: {
    setBoard(state, board) {
      state.board = board;
    },
    setCurrentPiece(state, piece) {
      state.currentPiece = piece;
    },
    setCurrentPosition(state, position) {
      state.currentPosition = position;
    },
    setScore(state, score) {
      state.score = score;
    },
    setLevel(state, level) {
      state.level = level;
    },
    setGameOver(state, gameOver) {
      state.gameOver = gameOver;
    },
    setGameInterval(state, interval) {
      state.gameInterval = interval;
    }
  },
  actions: {
    startGame({ commit, dispatch }) {
      commit('setBoard', createEmptyBoard());
      commit('setScore', 0);
      commit('setLevel', 1);
      commit('setGameOver', false);
      dispatch('spawnNewPiece');
      const gameInterval = setInterval(() => dispatch('moveDown'), 1000);
      commit('setGameInterval', gameInterval);
    },
    stopGame({ state, commit }) {
      if (state.gameInterval) {
        clearInterval(state.gameInterval);
        commit('setGameInterval', null);
      }
    },
    spawnNewPiece({ commit, state }) {
      const newPiece = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
      const newPosition = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece[0].length / 2), y: 0 };
      
      if (this.isCollision(newPiece, newPosition)) {
        commit('setGameOver', true);
        this.stopGame();
      } else {
        commit('setCurrentPiece', newPiece);
        commit('setCurrentPosition', newPosition);
      }
    },
    moveLeft({ state, commit }) {
      const newPosition = { ...state.currentPosition, x: state.currentPosition.x - 1 };
      if (!this.isCollision(state.currentPiece, newPosition)) {
        commit('setCurrentPosition', newPosition);
      }
    },
    moveRight({ state, commit }) {
      const newPosition = { ...state.currentPosition, x: state.currentPosition.x + 1 };
      if (!this.isCollision(state.currentPiece, newPosition)) {
        commit('setCurrentPosition', newPosition);
      }
    },
    moveDown({ state, commit, dispatch }) {
      const newPosition = { ...state.currentPosition, y: state.currentPosition.y + 1 };
      if (!this.isCollision(state.currentPiece, newPosition)) {
        commit('setCurrentPosition', newPosition);
      } else {
        this.lockPiece();
        this.clearLines();
        dispatch('spawnNewPiece');
      }
    },
    rotate({ state, commit }) {
      const rotatedPiece = state.currentPiece[0].map((_, index) =>
        state.currentPiece.map(row => row[index]).reverse()
      );
      if (!this.isCollision(rotatedPiece, state.currentPosition)) {
        commit('setCurrentPiece', rotatedPiece);
      }
    },
    isCollision(piece, position) {
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x] && (
            position.x + x < 0 ||
            position.x + x >= BOARD_WIDTH ||
            position.y + y >= BOARD_HEIGHT ||
            this.state.board[position.y + y][position.x + x]
          )) {
            return true;
          }
        }
      }
      return false;
    },
    lockPiece({ state, commit }) {
      const newBoard = state.board.map(row => [...row]);
      state.currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            newBoard[state.currentPosition.y + y][state.currentPosition.x + x] = value;
          }
        });
      });
      commit('setBoard', newBoard);
    },
    clearLines({ state, commit }) {
      let linesCleared = 0;
      const newBoard = state.board.filter(row => {
        if (row.every(cell => cell !== 0)) {
          linesCleared++;
          return false;
        }
        return true;
      });
      
      while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
      }
      
      commit('setBoard', newBoard);
      commit('setScore', state.score + linesCleared * 100);
      if (state.score % 1000 === 0) {
        commit('setLevel', state.level + 1);
        // Increase game speed
        clearInterval(state.gameInterval);
        const newInterval = setInterval(() => this.moveDown(), 1000 - (state.level * 50));
        commit('setGameInterval', newInterval);
      }
    }
  }
});

export default tetrisStore;
