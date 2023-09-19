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

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Server connected");
});

io.on("connection", (socket) => {
  console.log("user connected");
});
