import express, { Application, Request, Response } from "express";

import { createServer } from "http";
import { Server } from "socket.io";
import { addUser, getUser, removeUser } from "./utils/users";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app: Application = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: true },
});

const __thispath = path.resolve();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__thispath, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__thispath, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}
let roomIdGlobal: string, imgurlGlobal: string;
io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { username, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    const users = addUser({
      username,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });

    socket.emit("userIsJoined", { success: true, users: users });
    socket.broadcast.to(roomId).emit("userJoinedMessage", username);
    socket.broadcast.to(roomId).emit("allUsers", users);
    socket.broadcast
      .to(roomId)
      .emit("whiteBoardDataResponse", { imgUrl: imgurlGlobal });
  });

  socket.on("whiteBoardData", (data) => {
    imgurlGlobal = data;
    socket.broadcast
      .to(roomIdGlobal)
      .emit("whiteBoardDataResponse", { imgUrl: imgurlGlobal });
  });
  socket.on("disconnect", (data) => {
    const usr = getUser(socket.id);

    if (usr) {
      const removedUser = removeUser({ id: socket.id, roomId: usr.roomId });
      socket.broadcast.to(usr.roomId).emit("userLeftMessage", {
        username: usr.username,
        users: removedUser,
      });
    }
  });
});

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log("server is running on http://localhost:5000 ");
});
