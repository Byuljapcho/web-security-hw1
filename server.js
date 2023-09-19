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

  resetGame() {
    for (var i = 1; i < 21; i++) {
      this.boardPos[i] = [];
      for (var j = 1; j < 21; j++) {
        this.boardPos[i][j] = null;
      }
    }
    this.turn = "b";
    io.sockets.emit("createBoard");
  }

  quit(id) {
    var color;
    if (this.connectionOne.id === id) {
      this.connectionOne.id = -1;
      color = "b";
    } else if (this.connectionTwo.id === id) {
      this.connectionTwo.id = -1;
      color = "w";
    }

    for (var i = 1; i < 21; i++) {
      this.boardPos[i] = [];
      for (var j = 1; j < 21; j++) {
        if (this.boardPos[i][j] === color) {
          this.boardPos[i][j] = null;
        }
      }
    }

    this.turn = "b";

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

  checkWin(data) {
    this.checkHorizontal(data);
    this.checkVertical(data);
    this.checkDiagonal(data);
  }

  checkDiagonal(data) {
    // check i,i pairs first
    for (var i = 1; i <= 16; i++) {
      console.log(game.boardPos[i][i]);
      console.log(game.boardPos[i + 1][i + 1]);
      console.log(game.boardPos[i + 2][i + 2]);
      console.log(game.boardPos[i + 3][i + 3]);
      console.log(game.boardPos[i + 4][i + 4]);
      if (
        game.boardPos[i][i] === data.color &&
        game.boardPos[i + 1][i + 1] === data.color &&
        game.boardPos[i + 2][i + 2] === data.color &&
        game.boardPos[i + 3][i + 3] === data.color &&
        game.boardPos[i + 4][i + 4] === data.color
      ) {
        io.sockets.emit("announceWin", { color: data.color, id: data.id });
      }
    }

    // check for (2,1) and (3,2) and so on
    for (var i = 2; i <= 16; i++) {
      console.log(game.boardPos[i][i - 1]);
      console.log(game.boardPos[i + 1][i]);
      console.log(game.boardPos[i + 2][i + 1]);
      console.log(game.boardPos[i + 3][i + 2]);
      console.log(game.boardPos[i + 4][i + 3]);
      if (
        game.boardPos[i][i - 1] === data.color &&
        game.boardPos[i + 1][i] === data.color &&
        game.boardPos[i + 2][i + 1] === data.color &&
        game.boardPos[i + 3][i + 2] === data.color &&
        game.boardPos[i + 4][i + 3] === data.color
      ) {
        io.sockets.emit("announceWin", { color: data.color, id: data.id });
      }
    }

    // check for (1,2) and (2,3) and so on
    for (var i = 1; i <= 15; i++) {
      console.log(game.boardPos[i][i + 1]);
      console.log(game.boardPos[i + 1][i + 2]);
      console.log(game.boardPos[i + 2][i + 3]);
      console.log(game.boardPos[i + 3][i + 4]);
      console.log(game.boardPos[i + 4][i + 5]);
      if (
        game.boardPos[i][i + 1] === data.color &&
        game.boardPos[i + 1][i + 2] === data.color &&
        game.boardPos[i + 2][i + 3] === data.color &&
        game.boardPos[i + 3][i + 4] === data.color &&
        game.boardPos[i + 4][i + 5] === data.color
      ) {
        io.sockets.emit("announceWin", { color: data.color, id: data.id });
      }
    }
  }

  checkVertical(data) {
    // check each row vertically
    var col = data.x;
    for (var i = 1; i <= 16; i++) {
      if (
        game.boardPos[col][i] === data.color &&
        game.boardPos[col][i + 1] === data.color &&
        game.boardPos[col][i + 2] === data.color &&
        game.boardPos[col][i + 3] === data.color &&
        game.boardPos[col][i + 4] === data.color
      ) {
        io.sockets.emit("announceWin", { color: data.color, id: data.id });
      }
    }
  }

  checkHorizontal(data) {
    // check each row horizontally
    var row = data.y;
    for (var i = 1; i <= 16; i++) {
      if (
        game.boardPos[i][row] === data.color &&
        game.boardPos[i + 1][row] === data.color &&
        game.boardPos[i + 2][row] === data.color &&
        game.boardPos[i + 3][row] === data.color &&
        game.boardPos[i + 4][row] === data.color
      ) {
        io.sockets.emit("announceWin", { color: data.color, id: data.id });
      }
    }
  }
}

var game = new GameServer();

io.sockets.on("connect", function (socket) {
  socket.on("checkWin", function (data) {
    game.checkWin(data);
  });

  socket.on("resetGame", function () {
    game.resetGame();
  });

  socket.on("checkIfIllegalMove", function (data) {
    // illegal to start if second player has not joined
    if (game.connectionTwo.id === -1) {
      io.sockets.emit(
        "sendErrorMsg",
        "Second player has not joined. Game cannot start unless it has two players.",
        data.id
      );
    }
    // illegal to place piece if not your turn yet
    else if (
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
    console.log("disconnected from server");
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
  console.log(`Server listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Server connected");
});
