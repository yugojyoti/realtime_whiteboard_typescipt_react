interface IUser {
  username: string;
  userId: string;
  roomId: string;
  host: boolean;
  presenter: boolean;
  socketId: string;
}

const users: Array<IUser> = [];

// add user to the list

const addUser = ({
  username,
  userId,
  roomId,
  host,
  presenter,
  socketId,
}: IUser) => {
  const user = { username, userId, roomId, host, presenter, socketId };
  users.push(user);
  return users.filter((user) => user.roomId == roomId);
};

//const remove user

const removeUser = ({ id, roomId }: { id: string; roomId: string }) => {
  // const index = users.findIndex((user) => user.socketId === id);
  // if (index !== -1) {
  //   return users.splice(index, 1)[0];
  // }
  const removeUser = users.filter(
    (usr) => usr.socketId !== id && usr.roomId === roomId
  );
  return removeUser;
};

const getUser = (id: string) => {
  return users.find((user) => user.socketId === id);
};

const getUserInRoom = (roomId: string) => {
  return users.filter((user) => user.roomId === roomId);
};

export { addUser, removeUser, getUser, getUserInRoom };
