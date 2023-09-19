class Board {
  constructor() {}

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
