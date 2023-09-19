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
    console.log("assignColor: %s", this.socket.id);
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
    this.socket.off("updateGame");
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
    this.socket.on("updateGameData", this.updateGameData.bind(this));
    this.socket.on("boardHasTwoPlayers", this.boardHasTwoPlayers.bind(this));
    this.socket.on("assignColor", this.assignColor.bind(this));
    this.socket.on("sendErrorMsg", (msg, id) => {
      console.log(1, this.socket.id);
      console.log(2, id);
      if (this.socket.id === id) {
        window.alert(msg);
      }
    });
    this.socket.on("drawPiece", (data) => {
      this.drawPiece(data.x, data.y, data.color);
      this.socket.emit("checkWin", {
        x: data.x,
        y: data.y,
        color: data.color,
        id: data.socketId,
      });
    });
    this.socket.on("announceWin", (data) => {
      console.log("hello");
      if (this.socket.id === data.id) {
        window.alert("You win! Congrats. Game Over.");
      } else {
        if (data.color === "b") {
          window.alert(`Player 1 - black wins! Game over.`);
        } else {
          window.alert(`Player 2 - white wins! Game over.`);
        }
      }
    });
  }

  connect() {
    console.log("Connected: %s", this.socket.id);
    this.status = "connected";
    console.log("yummy");
    if (this.firstSocketId === null) {
      this.firstSocketId = this.socket.id;
      console.log("firstSocketId", this.firstSocketId);
      this.socket.emit("join");
    }
  }

  disconnect() {
    console.log("Disconnected: %s", this.socket.id);
    this.status = "disconnected";
  }

  updateConnection(connections) {
    console.log("update connections");
    console.log(connections);
    this.playerOne = connections.playerOne;
    this.playerTwo = connections.playerTwo;
  }

  updateGameData(gameData) {
    console.log("update game data");
    console.log(gameData);
    this.board.updateBoardPos(gameData.boardPos);
    this.isOver = gameData.isOver;
    this.board.updateTurn(gameData.turn);
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
