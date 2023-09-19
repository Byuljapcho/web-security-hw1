import http from "http";
import express from "express";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.static("./public"));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST", "PUT"] },
});
const host = "localhost";
const port = 3000;

const vite = await createViteServer({
  server: {
    middlewareMode: true,
    hmr: {
      server,
    },
  },
  appType: "spa",
});

app.use(vite.middlewares);

app.use(express.static("static"));

class GameServer {
  constructor() {
    this.connectionOne = { color: "black", id: -1 };
    this.connectionTwo = { color: "white", id: -1 };
    this.boardPos = [];
    this.blackPos = [];
    this.whitePos = [];

    this.turn = "b";
    this.isOver = false;
  }

  getConnections() {
    return { playerOne: this.connectionOne, playerTwo: this.connectionTwo };
  }
  getGameData() {
    return {
      boardPos: this.boardPos,
      isOver: this.isOver,
      turn: this.turn,
    };
  }

  addConnection(id) {
    console.log("add connection: %s", id);
    if (this.connectionOne.id === -1 || this.connectionOne.id === id) {
      this.connectionOne.id = id;
    } else if (this.connectionTwo.id === -1 || this.connectionTwo.id === id) {
      this.connectionTwo.id = id;
    }
  }

  init() {
    for (var i = 1; i < 21; i++) {
      this.boardPos[i] = [];
      for (var j = 1; j < 21; j++) {
        this.boardPos[i][j] = false;
      }
    }

    for (var i = 1; i < 21; i++) {
      this.blackPos[i] = [];
      for (var j = 1; j < 21; j++) {
        this.blackPos[i][j] = false;
      }
    }

    for (var i = 1; i < 21; i++) {
      this.whitePos[i] = [];
      for (var j = 1; j < 21; j++) {
        this.whitePos[i][j] = false;
      }
    }
  }

  isNotAuthorizedPlayer(id) {
    return (
      game.connectionOne.id !== -1 &&
      game.connectionTwo.id !== -1 &&
      game.connectionOne.id !== id &&
      game.connectionTwo.id !== id
    );
  }

  quit(id) {
    // send game is over? to the client
    console.log("delete connection: %s", id);
    if (this.connectionOne.id === id) {
      this.connectionOne.id = -1;
    } else if (this.connectionTwo.id === id) {
      this.connectionTwo.id = -1;
    }
    this.connectionOne = { color: "black", id: -1 };
    this.connectionTwo = { color: "white", id: -1 };
    this.boardPos = [];
    this.blackPos = [];
    this.whitePos = [];

    this.turn = "b";
    this.isOver = false;

    io.sockets.emit("updateConnection", game.getConnections());
    io.sockets.emit("updateGameData", game.getGameData());
  }

  placePiece(arcX, arcY, id) {
    if (this.turn === "b") {
      io.sockets.emit("drawPiece", { x: arcX, y: arcY, color: "b" });
      this.turn = "w";
      console.log("changed turn to white");
      this.blackPos[arcX][arcY] = true;
    } else if (this.turn === "w") {
      io.sockets.emit("drawPiece", { x: arcX, y: arcY, color: "w" });
      this.turn = "b";
      console.log("changed turn to black");
      this.whitePos[arcX][arcY] = true;
    }
    this.boardPos[arcX][arcY] = true;
    io.sockets.emit("updateGameData", game.getGameData());
  }
}

var game = new GameServer();

io.sockets.on("connect", function (socket) {
  socket.on("checkIfIllegalMove", function (data) {
    console.log(data);
    console.log("y", data.y);
    console.log(game.boardPos);
    console.log(game.boardPos[data.x][data.y]);
    // illegal to place piece if not your turn yet
    if (
      (game.turn === "b" && data.id !== game.connectionOne.id) ||
      (game.turn === "w" && data.id !== game.connectionTwo.id)
    ) {
      io.sockets.emit(
        "sendErrorMsg",
        "The other player has not yet placed a piece. Please wait for your turn",
        data.id
      );
    } else if (game.boardPos[data.x][data.y]) {
      // illegal to put piece on occupied intersection
      io.sockets.emit(
        "sendErrorMsg",
        "There is already a piece here! Please choose an empty intersection.",
        data.id
      );
    } else {
      game.placePiece(data.x, data.y, data.id);
    }
  });

  socket.on("checkIfAuthorizedPlayer", function (id) {
    if (game.isNotAuthorizedPlayer(socket.id)) {
      io.sockets.emit("boardHasTwoPlayers");
    }
  });

  socket.on("disconnect", function () {
    console.log("disconnected from the server");
    game.quit(socket.id);
  });

  socket.on("join", function () {
    console.log("connected to server");
    if (game.isNotAuthorizedPlayer(socket.id)) {
      io.sockets.emit("boardHasTwoPlayers");
    } else {
      game.init();
      game.addConnection(socket.id);
      console.log("added", socket.id);
      console.log("pineapple", game.boardPos);
      io.sockets.emit("updateConnection", game.getConnections());
      io.sockets.emit("updateGameData", game.getGameData());
      io.sockets.emit("assignColor");
    }
  });

  // socket.on("move", function (data) {
  //   if (game.isNotAuthorizedPlayer(data.id)) {
  //     io.sockets.emit("boardHasTwoPlayers");
  //   }

  //   game.move(data.row, data.col, data.color, data.id);

  //   if (game.hasWinner(payload.row, payload.col, payload.color)) {
  //     game.isFinished = true;
  //     io.sockets.emit("hasWinner", { name: game.getConnectionName(socket.id) });
  //   } else if (game.isBoardFull()) {
  //     game.isFinished = true;
  //     io.sockets.emit("boardIsFull");
  //   }

  //   io.sockets.emit("updateGame", game.getGameData());
  // });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Server connected");
});
