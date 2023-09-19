import Board from "./Board";
import { io } from "socket.io-client";

class Game {
  constructor() {
    this.board = new Board();
    const socket = io("http://localhost:3000", { transports: ["websocket"] });
  }

  checkPlayers() {
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
