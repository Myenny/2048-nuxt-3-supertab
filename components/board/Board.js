var rotateLeft = function (matrix) {
  var rows = matrix.length;
  var columns = matrix[0].length;
  var res = [];
  for (var row = 0; row < rows; ++row) {
    res.push([]);
    for (var column = 0; column < columns; ++column) {
      res[row][column] = matrix[column][columns - row - 1];
    }
  }
  return res;
};

var Tile = function (value, row, column) {
  this.value = value || 0;
  this.row = row || -1;
  this.column = column || -1;
  this.oldRow = -1;
  this.oldColumn = -1;
  this.markForDeletion = false;
  this.mergedInto = null;
  this.id = Tile.id++;
};

Tile.id = 0;

Tile.prototype.moveTo = function (row, column) {
  this.oldRow = this.row;
  this.oldColumn = this.column;
  this.row = row;
  this.column = column;
};

Tile.prototype.isNew = function () {
  return this.oldRow == -1 && !this.mergedInto;
};

Tile.prototype.hasMoved = function () {
  return (
    (this.fromRow() != -1 &&
      (this.fromRow() != this.toRow() ||
        this.fromColumn() != this.toColumn())) ||
    this.mergedInto
  );
};

Tile.prototype.fromRow = function () {
  return this.mergedInto ? this.row : this.oldRow;
};

Tile.prototype.fromColumn = function () {
  return this.mergedInto ? this.column : this.oldColumn;
};

Tile.prototype.toRow = function () {
  return this.mergedInto ? this.mergedInto.row : this.row;
};

Tile.prototype.toColumn = function () {
  return this.mergedInto ? this.mergedInto.column : this.column;
};

var Board = function () {
  this.tiles = [];
  this.cells = [];
  this.score = 0;
  this.timer = 0;
  this.timerInterval = null;
  for (var i = 0; i < Board.size; ++i) {
    this.cells[i] = [
      this.addTile(),
      this.addTile(),
      this.addTile(),
      this.addTile(),
    ];
  }
  this.addRandomTile();
  this.setPositions();
  this.won = false;
};

Board.prototype.startTimer = function () {
  if (this.timerInterval === null) {
    this.timerInterval = setInterval(() => {
      this.timer += 1;
    }, 1000);
  }
};

Board.prototype.stopTimer = function () {
  if (this.timerInterval !== null) {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
};

Board.prototype.resetTimer = function () {
  this.stopTimer();
  this.timer = 0;
};

Board.prototype.addTile = function () {
  var res = new Tile();
  Tile.apply(res, arguments);
  this.tiles.push(res);
  return res;
};

Board.size = 4;

Board.prototype.moveLeft = function () {
  var hasChanged = false;
  for (var row = 0; row < Board.size; ++row) {
    var currentRow = this.cells[row].filter((tile) => tile.value != 0);
    var resultRow = [];
    for (var target = 0; target < Board.size; ++target) {
      var targetTile = currentRow.length ? currentRow.shift() : this.addTile();
      if (currentRow.length > 0 && currentRow[0].value == targetTile.value) {
        var tile1 = targetTile;
        targetTile = this.addTile(targetTile.value);
        tile1.mergedInto = targetTile;
        var tile2 = currentRow.shift();
        tile2.mergedInto = targetTile;
        targetTile.value += tile2.value;
        this.score += targetTile.value;
      }
      resultRow[target] = targetTile;
      this.won |= targetTile.value == 2048;
      hasChanged |= targetTile.value != this.cells[row][target].value;
    }
    this.cells[row] = resultRow;
  }
  return hasChanged;
};

Board.prototype.setPositions = function () {
  this.cells.forEach((row, rowIndex) => {
    row.forEach((tile, columnIndex) => {
      tile.oldRow = tile.row;
      tile.oldColumn = tile.column;
      tile.row = rowIndex;
      tile.column = columnIndex;
      tile.markForDeletion = false;
    });
  });
};

Board.fourProbability = 0.1;

Board.prototype.addRandomTile = function () {
  var emptyCells = [];
  for (var r = 0; r < Board.size; ++r) {
    for (var c = 0; c < Board.size; ++c) {
      if (this.cells[r][c].value == 0) {
        emptyCells.push({ r: r, c: c });
      }
    }
  }
  var index = ~~(Math.random() * emptyCells.length);
  var cell = emptyCells[index];
  var newValue = Math.random() < Board.fourProbability ? 4 : 2;
  this.cells[cell.r][cell.c] = this.addTile(newValue);
};

Board.prototype.move = function (direction) {
  // 0 -> left, 1 -> up, 2 -> right, 3 -> down
  this.clearOldTiles();
  for (var i = 0; i < direction; ++i) {
    this.cells = rotateLeft(this.cells);
  }
  var hasChanged = this.moveLeft();
  for (var i = direction; i < 4; ++i) {
    this.cells = rotateLeft(this.cells);
  }
  if (hasChanged) {
    this.addRandomTile();
  }
  this.setPositions();
  return this;
};

Board.prototype.clearOldTiles = function () {
  this.tiles = this.tiles.filter((tile) => tile.markForDeletion == false);
  this.tiles.forEach((tile) => {
    tile.markForDeletion = true;
  });
};

Board.prototype.hasWon = function () {
  return this.won && !this.leaderboardSubmitted;
};

// Board.prototype.submitLeaderboard = function () {
//   if (!this.leaderboardSubmitted) {
//     this.leaderboardSubmitted = true;
//     // Code to submit to leaderboard should be called here
//   }
// };

Board.deltaX = [-1, 0, 1, 0];
Board.deltaY = [0, -1, 0, 1];

Board.prototype.hasLost = function () {
  var canMove = false;
  for (var row = 0; row < Board.size; ++row) {
    for (var column = 0; column < Board.size; ++column) {
      canMove |= this.cells[row][column].value == 0;
      for (var dir = 0; dir < 4; ++dir) {
        var newRow = row + Board.deltaX[dir];
        var newColumn = column + Board.deltaY[dir];
        if (
          newRow < 0 ||
          newRow >= Board.size ||
          newColumn < 0 ||
          newColumn >= Board.size
        ) {
          continue;
        }
        canMove |=
          this.cells[row][column].value == this.cells[newRow][newColumn].value;
      }
    }
  }
  return !canMove;
};


export { Board };
