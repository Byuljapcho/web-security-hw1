import Board from "./Board";

class Game {
  constructor() {
    this.board = new Board();
    this.black = false;
    this.white = false;
  }

  startGame() {
    // checkPlayers();
  }

  checkPlayers() {
    console.log(1, localStorage.getItem("black"));
    console.log(2, localStorage.getItem("white"));
    if (localStorage.getItem("black") === "false") {
      window.alert("Player 1 - playing black");
      localStorage.setItem("black", "true");
    } else if (localStorage.getItem("white") === "false") {
      window.alert("Player 2 - playing white");
      localStorage.setItem("white", "true");
    } else {
      window.alert("Game already has two players");
    }
  }

  init() {
    console.log("mango hey");
    this.board.createBoard();
    document
      .getElementById("play-btn")
      .addEventListener("click", this.startGame);
  }
}

export default Game;
