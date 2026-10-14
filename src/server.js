import app from "./app.js";
import cronJobController from "./controllers/cronJobController.js";
import socketIoController from "./controllers/socketIoController.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

// Cron game 1 Phut
cronJobController.cronJobGame1p(io);

// Check xem ai connect vào sever
socketIoController.sendMessageAdmin(io);

server.listen(port, () => {
  console.log(`Connected success http://localhost:${port}`);
});
