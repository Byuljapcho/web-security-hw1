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
    console.log(1, this.playerOne);
    console.log(2, this.playerTwo);
    if (this.playerTwo.id === -1) {
      window.alert("Player 1 - playing black");
    } else {
      window.alert("Player 2 - playing white");
    }
  }

  cleanUp() {
    this.socket.off("connect");
    this.socket.off("disconnect");
    this.socket.off("throw");
    this.socket.off("updateConnection");
    this.socket.off("updateGame");
    this.socket.off("hasWinner");
    this.socket.off("boardFull");
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
    this.socket.on("hasWinner", this.hasWinner.bind(this));
    this.socket.on("boardIsFull", this.boardIsFull.bind(this));
    this.socket.on("assignColor", this.assignColor.bind(this));
  }

  connect() {
    console.log("Connected: %s", this.socket.id);
    this.status = "connected";
    console.log("mango");
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
    // console.log("update game data");
    // console.log(gameData);
    this.board.updateBoardPos(gameData.boardPos);
    this.isOver = gameData.isOver;
    this.board.updateTurn(gameData.turn);
  }

  boardIsFull() {
    if (this.playerOne === null && this.playerTwo === null) {
      window.alert("Game already has two players!");
    }
  }

  hasWinner(winner) {
    const user = this.getCurrentUser();

    if (user.isPlayer || user.isWatcher) {
      this.openDlg("Winner is " + winner.name, "");
    }
  }

  init() {
    this.initSocket();
    this.board.createBoard();
    var canvasElm = document.querySelector("canvas");
    var that = this;
    canvasElm.addEventListener("mousedown", function (e) {
      that.board.placePiece(canvasElm, e);
    });
  }
}

export default Game;
