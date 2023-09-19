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

  quit(id) {
    // send game is over? to the client
    console.log("delete connection: %s", id);
    if (this.connectionOne.id === id) {
      this.connectionOne.id = -1;
    } else if (this.connectionTwo.id === id) {
      this.connectionTwo.id = -1;
    }
  }
}

var game = new GameServer();
game.init();

io.sockets.on("connect", function (socket) {
  socket.on("disconnect", function () {
    console.log("disconnected from the server");
    game.quit(socket.id);
  });
  socket.on("join", function () {
    console.log("connected to server");
    if (
      game.connectionOne.id !== -1 &&
      game.connectionTwo.id !== -1 &&
      game.connectionOne.id !== socket.id &&
      game.connectionTwo.id !== socket.id
    ) {
      io.sockets.emit("boardIsFull");
    } else {
      game.addConnection(socket.id);
      console.log("added", socket.id);
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
