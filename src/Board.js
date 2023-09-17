class Board {
  constructor() {
    this.turn = "b";
  }

  placePiece(canvas, event) {
    // if (color === "black")
    // if (color === "white")
    let rect = canvas.getBoundingClientRect();
    console.log(1, rect.left);
    console.log(2, rect.top);
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x, "Coordinate y: " + y);
  }

  createBoard() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var boardWidth = canvas.width;
    console.log(boardWidth);

    ctx.strokeStyle = "red";

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
