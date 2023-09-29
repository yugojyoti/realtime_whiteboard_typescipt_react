"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const users_1 = require("./utils/users");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: true },
});
const __thispath = path_1.default.resolve();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__thispath, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(__thispath, "frontend", "dist", "index.html"));
    });
}
else {
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}
let roomIdGlobal, imgurlGlobal;
io.on("connection", (socket) => {
    socket.on("userJoined", (data) => {
        const { username, userId, roomId, host, presenter } = data;
        roomIdGlobal = roomId;
        socket.join(roomId);
        const users = (0, users_1.addUser)({
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
        const usr = (0, users_1.getUser)(socket.id);
        if (usr) {
            const removedUser = (0, users_1.removeUser)({ id: socket.id, roomId: usr.roomId });
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
