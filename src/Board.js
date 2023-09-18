class Board {
  constructor() {
    this.turn = "b";
  }

  placePiece(canvas, event) {
    const ctx = canvas.getContext("2d");

    var x = event.offsetX;
    var y = event.offsetY;

    console.log("Offset x: " + x, "Offset y: " + y);

    var downX = Math.floor(x / 50);
    var downY = Math.floor(y / 50);

    console.log("rounded down x: " + downX, "rounded down y: " + downY);

    var upX = Math.ceil(x / 50);
    var upY = Math.ceil(y / 50);
    console.log("rounded up x: " + upX, "rounded up y: " + upY);

    var arcX;
    var arcY;

    if (Math.abs(downX * 50 - x) < Math.abs(upX * 50 - x)) {
      arcX = downX * 50;
    } else {
      arcX = upX * 50;
    }

    if (Math.abs(downY * 50 - y) < Math.abs(upY * 50 - y)) {
      arcY = downY * 50;
    } else {
      arcY = upY * 50;
    }

    ctx.beginPath();
    ctx.arc(arcX, arcY, 20, 0, 2 * Math.PI);
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
