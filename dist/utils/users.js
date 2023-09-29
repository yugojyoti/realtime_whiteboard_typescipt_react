"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
const users = [];
// add user to the list
const addUser = ({ username, userId, roomId, host, presenter, socketId, }) => {
    const user = { username, userId, roomId, host, presenter, socketId };
    users.push(user);
    return users.filter((user) => user.roomId == roomId);
};
exports.addUser = addUser;
//const remove user
const removeUser = ({ id, roomId }) => {
    // const index = users.findIndex((user) => user.socketId === id);
    // if (index !== -1) {
    //   return users.splice(index, 1)[0];
    // }
    const removeUser = users.filter((usr) => usr.socketId !== id && usr.roomId === roomId);
    return removeUser;
};
exports.removeUser = removeUser;
const getUser = (id) => {
    return users.find((user) => user.socketId === id);
};
exports.getUser = getUser;
const getUserInRoom = (roomId) => {
    return users.filter((user) => user.roomId === roomId);
};
exports.getUserInRoom = getUserInRoom;
