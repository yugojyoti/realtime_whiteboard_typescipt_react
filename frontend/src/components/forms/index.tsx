import React from "react";
import CreateRoomForm from "./createRoom";
import JoinRoomForm from "./joinRoom";

const Forms = ({ socket, setUser }: { socket: any; setUser: any }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-teal-50">
      <div className="grid grid-cols-2 gap-20 p-6 bg-white rounded-lg shadow-lg  ">
        <div className="col-span-1 border-2 border-teal-500 p-8 bg-white ">
          <h1 className="text-2xl font-bold mb-4 text-center text-emerald-600">
            Create Room
          </h1>
          <CreateRoomForm socket={socket} setUser={setUser} />
        </div>

        <div className="col-span-1  border-2 border-teal-500 p-8 bg-white ">
          <h1 className="text-2xl font-bold mb-4 text-center text-emerald-600">
            Join Room
          </h1>
          <JoinRoomForm socket={socket} setUser={setUser} />
        </div>
      </div>
    </div>
  );
};

export default Forms;
