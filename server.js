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
        this.boardPos[i][j] = null;
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

    this.turn = "b";
    this.isOver = false;

    io.sockets.emit("updateConnection", game.getConnections());
    io.sockets.emit("updateGameData", game.getGameData());
  }

  placePiece(arcX, arcY, id) {
    if (this.turn === "b") {
      io.sockets.emit("drawPiece", {
        x: arcX,
        y: arcY,
        color: "b",
        socketId: id,
      });
      this.boardPos[arcX][arcY] = "b";
      this.turn = "w";
    } else if (this.turn === "w") {
      io.sockets.emit("drawPiece", {
        x: arcX,
        y: arcY,
        color: "w",
        socketId: id,
      });
      this.turn = "b";
      this.boardPos[arcX][arcY] = "w";
    }
    io.sockets.emit("updateGameData", game.getGameData());
  }
}

var game = new GameServer();

io.sockets.on("connect", function (socket) {
  socket.on("checkWin", function (data) {
    // piece position
    var row = data.y;
    var col = data.x;
    console.log(row, col);
    console.log(data.color);
    // check in row and col and also diagonoally from its position
    // checking row first
    if (col >= 1 && col <= 16) {
      console.log("checking win!");
      console.log(game.boardPos[col][row]);
      console.log(game.boardPos[col + 1][row]);
      console.log(game.boardPos[col + 2][row]);
      console.log(game.boardPos[col + 3][row]);
      console.log(game.boardPos[col + 4][row]);
      if (
        game.boardPos[col][row] === data.color &&
        game.boardPos[col + 1][row] === data.color &&
        game.boardPos[col + 2][row] === data.color &&
        game.boardPos[col + 3][row] === data.color &&
        game.boardPos[col + 4][row] === data.color
      ) {
        console.log("win confirmed");
        io.sockets.emit("announceWin", { color: data.color, id: data.id });
        console.log(`${data.color} wins!`);
        game.isOver = true;
        // should clean up
      }
    }
  });

  socket.on("checkIfIllegalMove", function (data) {
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
      io.sockets.emit("updateConnection", game.getConnections());
      io.sockets.emit("updateGameData", game.getGameData());
      io.sockets.emit("assignColor");
    }
  });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Server connected");
});
