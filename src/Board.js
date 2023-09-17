class Board {
  constructor() {
    this.turn = "b";
  }

  placePiece(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x, "Coordinate y: " + y);
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fill();
  }

  createBoard() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var boardWidth = canvas.width;

    ctx.strokeStyle = "black";
    ctx.beginPath();

    for (var x = 0; x <= boardWidth; x += 50) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, boardWidth);
    }

    for (var y = 0; y <= boardWidth; y += 50) {
      ctx.moveTo(0, y);
      ctx.lineTo(boardWidth, y);
    }

    ctx.stroke();
  }
}

export default Board;
