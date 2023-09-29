import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
const CreateRoomForm = ({ socket, setUser }: { socket: any; setUser: any }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(uuidv4());
  const navigate = useNavigate();
  const handleGenerate = () => {
    setRoomId(uuidv4());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room id copied : " + roomId);
  };

  const handleCreateRoom = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const roomData = {
      username,
      roomId,
      userId: uuidv4(),
      host: true,
      presenter: true,
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
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
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
        <div className="flex items-center gap-2">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="room"
            type="text"
            value={roomId}
            placeholder="Generate room code"
            disabled
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs "
            type="button"
            onClick={handleGenerate}
          >
            Generate
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs "
            type="button"
            onClick={handleCopy}
          >
            Copy
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
      </div>
    </form>
  );
};

export default CreateRoomForm;
