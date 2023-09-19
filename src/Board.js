class Board {
  constructor() {
    this.turn = "b";
    this.over = false;

    // keeping track of all piece positions on the board
    this.boardPos = [];
    for (var i = 1; i < 21; i++) {
      this.boardPos[i] = [];
      for (var j = 1; j < 21; j++) {
        this.boardPos[i][j] = false;
      }
    }

    // keeping track of black pieces positions on the board
    this.blackPos = [];
    for (var i = 1; i < 21; i++) {
      this.blackPos[i] = [];
      for (var j = 1; j < 21; j++) {
        this.blackPos[i][j] = false;
      }
    }

    // keeping track of white pieces positions on the board
    this.whitePos = [];
    for (var i = 1; i < 21; i++) {
      this.whitePos[i] = [];
      for (var j = 1; j < 21; j++) {
        this.whitePos[i][j] = false;
      }
    }
  }

  updateBoardPos(update) {
    // console.log("update", update);
    this.boardPos = update;
  }

  updateTurn(update) {
    // console.log("update", update);
    this.turn = update;
  }

  checkWin() {
    this.checkVertical();
    this.checkHorizontal();
    this.checkDiagonal();
  }

  checkDiagonal() {}

  checkHorizontal() {
    // starting with black
    for (var i = 1; i < 21; i++) {
      for (var j = 1; j < 21; j++) {
        if (j >= 1 && j <= 16) {
          if (
            this.blackPos[j][i] &&
            this.blackPos[j + 1][i] &&
            this.blackPos[j + 2][i] &&
            this.blackPos[j + 3][i] &&
            this.blackPos[j + 4][i]
          ) {
            window.alert("Player 1 - black wins!");
          }
        }
      }
    }

    // checking white
    for (var i = 1; i < 21; i++) {
      var counter = 0;
      for (var j = 1; j < 21; j++) {
        if (this.whitePos[j][i]) {
          counter++;
        }
      }
      if (counter === 5) {
        window.alert("Player 2 - white wins!");
      }
    }
  }

  checkVertical() {
    // starting with black
    for (var i = 1; i < 21; i++) {
      var counter = 0;
      for (var j = 1; j < 21; j++) {
        if (this.blackPos[i][j]) {
          counter++;
        }
      }
      if (counter === 5) {
        window.alert("Player 1 - black wins!");
      }
    }

    // checking white
    for (var i = 1; i < 21; i++) {
      var counter = 0;
      for (var j = 1; j < 21; j++) {
        if (this.whitePos[i][j]) {
          counter++;
        }
      }
      if (counter === 5) {
        window.alert("Player 2 - white wins!");
      }
    }
  }

  drawPiece(ctx, arcX, arcY, color) {
    ctx.beginPath();
    ctx.arc(arcX * 50, arcY * 50, 20, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    if (color === "b") {
      ctx.fillStyle = "black";
      ctx.fill();
    } else if (color === "w") {
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  createBoard() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var boardWidth = canvas.width;

    ctx.strokeStyle = "black";
    ctx.beginPath();

    for (var x = 50; x <= boardWidth - 50; x += 50) {
      ctx.moveTo(x, 50);
      ctx.lineTo(x, boardWidth - 50);
    }

    for (var y = 50; y <= boardWidth - 50; y += 50) {
      ctx.moveTo(50, y);
      ctx.lineTo(boardWidth - 50, y);
    }

    ctx.stroke();
  }
}

export default Board;
