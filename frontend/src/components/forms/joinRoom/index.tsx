import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
const JoinRoomForm = ({ socket, setUser }: { socket: any; setUser: any }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const roomData = {
      username,
      roomId,
      userId: uuidv4(),
      host: false,
      presenter: false,
    };

    setUser(roomData);
    navigate(`/${roomId}`);
    socket.emit("userJoined", roomData);
  };

  return (
    <form className="w-full max-w-md bg-white ">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          type="text"
          placeholder="Enter Your Name"
        />
      </div>
      <div className="mb-6 ">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="room"
        >
          Room code
        </label>

        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="room"
          type="text"
          placeholder=" Enter room code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
      </div>
    </form>
  );
};

export default JoinRoomForm;
