import Board from "./Board";

class Game {
  constructor() {
    this.board = new Board();
    this.black = false;
    this.white = false;
  }

  checkPlayers() {
    // console.log(1, localStorage.getItem("black"));
    // console.log(2, localStorage.getItem("white"));
    // if (localStorage.getItem("black") === "false") {
    //   window.alert("Player 1 - playing black");
    //   localStorage.setItem("black", "true");
    // } else if (localStorage.getItem("white") === "false") {
    //   window.alert("Player 2 - playing white");
    //   localStorage.setItem("white", "true");
    // } else {
    //   window.alert("Game already has two players");
    // }
    if (this.black && this.white) {
      window.alert("Game is ongoing with two players");
    } else if (!this.black) {
      this.black = true;
      window.alert("Player 1 - playing black");
      return;
    } else if (!this.white) {
      this.white = true;
      window.alert("Player 2 - playing white");
    }
  }

  init() {
    this.board.createBoard();
    var canvasElm = document.querySelector("canvas");
    var that = this;
    canvasElm.addEventListener("mousedown", function (e) {
      that.board.placePiece(canvasElm, e);
    });
    document
      .getElementById("play-btn")
      .addEventListener("click", this.checkPlayers.bind(this));
  }
}

export default Game;
