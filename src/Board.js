class Board {
  constructor() {
    this.turn = "b";
    // keeping track of piece positions on the board
    this.boardPos = [];
    for (var i = 0; i < 19; i++) {
      this.boardPos[i] = [];
      for (var j = 0; j < 19; j++) {
        this.boardPos[i][j] = false;
      }
    }
  }

  placePiece(canvas, event) {
    const ctx = canvas.getContext("2d");

    var x = event.offsetX;
    var y = event.offsetY;

    var downX = Math.floor(x / 50);
    var downY = Math.floor(y / 50);

    var upX = Math.ceil(x / 50);
    var upY = Math.ceil(y / 50);

    var arcX;
    var arcY;

    if (Math.abs(downX * 50 - x) < Math.abs(upX * 50 - x)) {
      arcX = downX;
    } else {
      arcX = upX;
    }

    if (Math.abs(downY * 50 - y) < Math.abs(upY * 50 - y)) {
      arcY = downY;
    } else {
      arcY = upY;
    }

    if (this.boardPos[arcX][arcY]) {
      window.alert(
        "There is already a piece here! Please choose an empty intersection."
      );
    } else {
      this.drawPiece(ctx, arcX, arcY);
    }
  }

  drawPiece(ctx, arcX, arcY) {
    console.log("arcX: " + arcX + ", arcY: " + arcY);
    this.boardPos[arcX][arcY] = true;
    ctx.beginPath();
    ctx.arc(arcX * 50, arcY * 50, 20, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    if (this.turn === "b") {
      ctx.fillStyle = "black";
      this.turn = "w";
    } else {
      ctx.fillStyle = "white";
      this.turn = "b";
    }
    ctx.fill();
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
