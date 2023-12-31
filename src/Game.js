import Board from "./Board";
import { io } from "socket.io-client";

class Game {
  constructor() {
    this.board = new Board();
    this.isOver = false;
    this.status = "disconnected";
    this.playerOne = null;
    this.playerTwo = null;
    this.socket = null;
    this.firstSocketId = null;
    this.updatedfirstSocketId = false;
  }

  assignColor() {
    if (this.playerOne.id === this.socket.id) {
      window.alert("Player 1 - playing black");
    } else if (this.playerTwo && this.playerTwo.id === this.socket.id) {
      window.alert("Player 2 - playing white");
    }
  }

  cleanUp() {
    this.socket.off("connect");
    this.socket.off("disconnect");
    this.socket.off("updateConnection");
    this.socket.off("boardHasTwoPlayers");
    this.board = new Board();
    this.isOver = false;
    this.status = "disconnected";
    this.playerOne = null;
    this.playerTwo = null;
    this.firstSocketId = null;
  }

  initSocket() {
    this.socket = io("http://localhost:3000", { transports: ["websocket"] });
    this.socket.on("connect", this.connect.bind(this));
    this.socket.on("disconnect", this.disconnect.bind(this));
    this.socket.on("updateConnection", this.updateConnection.bind(this));
    this.socket.on("boardHasTwoPlayers", this.boardHasTwoPlayers.bind(this));
    this.socket.on("assignColor", this.assignColor.bind(this));
    this.socket.on("createBoard", this.board.createBoard.bind(this));
    this.socket.on("sendErrorMsg", (msg, id) => {
      if (this.socket.id === id) {
        window.alert(msg);
      }
    });
    this.socket.on("drawPiece", (data) => {
      this.drawPiece(data.x, data.y, data.color);
      console.log(data.x, data.y);
      this.socket.emit("checkWin", {
        x: data.x,
        y: data.y,
        color: data.color,
        id: data.socketId,
      });
    });
    this.socket.on("announceWin", (data) => {
      if (this.socket.id === data.id) {
        window.alert(
          "You win! Congrats. Game Over. Board will be cleared for new game. Please click OK and wait a few seconds."
        );
      } else {
        if (data.color === "b") {
          window.alert(
            `Player 1 - black wins! Game over. Board will be cleared for new game. Please click OK and wait a few seconds`
          );
        } else {
          window.alert(
            `Player 2 - white wins! Game over. Board will be cleared for new game. Please click OK and wait a few seconds`
          );
        }
      }
      this.socket.emit("resetGame");
    });
  }

  connect() {
    console.log("Connected: %s", this.socket.id);
    this.status = "connected";
    if (this.firstSocketId === null) {
      this.firstSocketId = this.socket.id;
      this.socket.emit("join");
    }
  }

  disconnect() {
    console.log("Disconnected: %s", this.socket.id);
    this.status = "disconnected";
  }

  updateConnection(connections) {
    this.playerOne = connections.playerOne;
    this.playerTwo = connections.playerTwo;
  }

  boardHasTwoPlayers() {
    if (this.playerOne === null && this.playerTwo === null) {
      window.alert("Game already has two players!");
    }
  }

  placePiece(that, canvas, event) {
    // that is reference to Game

    // first check if authorized player
    that.socket.emit("checkIfAuthorizedPlayer", that.socket.id);
    if (
      this.socket.id === this.playerOne.id ||
      this.socket.id === this.playerTwo.id
    ) {
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
    }

    if (arcX > 0 && arcX < 21 && arcY > 0 && arcY < 21) {
      // check if move is illegal
      that.socket.emit("checkIfIllegalMove", {
        x: arcX,
        y: arcY,
        id: that.socket.id,
      });
    }
  }

  drawPiece(x, y, color) {
    var canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    this.board.drawPiece(ctx, x, y, color);
  }

  init() {
    this.initSocket();
    this.board.createBoard();
    var canvasElm = document.querySelector("canvas");
    var that = this;
    canvasElm.addEventListener("mousedown", function (e) {
      that.placePiece(that, canvasElm, e);
    });
  }
}

export default Game;
