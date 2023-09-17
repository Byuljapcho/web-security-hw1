import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { allowEIO3: true });
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

// app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Server connected");
});

io.on("connection", (socket) => {
  console.log("user connected");
});

server.listen(port, host, () => {
  console.log(`Socket.IO server running at http://${host}:${port}/`);
});
