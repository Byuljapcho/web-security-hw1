class Board {
  constructor() {
    this.turn = "b";
  }

  placePiece(canvas, event) {
    const ctx = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    // console.log("Coordinate x: " + x, "Coordinate y: " + y);

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();

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
