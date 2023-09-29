import "./App.css";
import Forms from "./components/forms/index";
import { Routes, Route } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export interface IUser {
  username: string;
  userId: string;
  roomId: string;
  host: boolean;
  presenter: boolean;
  socketId?: string;
}

const server =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const socket = io(server, connectionOptions);

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userJoined");
        setUsers(data.users);
      } else {
        console.log("userJoined Error ");
      }
    });
    socket.on("allUsers", (data) => {
      setUsers(data);
    });

    socket.on("userJoinedMessage", (data) => {
      toast.info(`${data} joined the room`);
    });
    socket.on("userLeftMessage", (data) => {
      setUsers(data.users);
      toast.info(`${data.username} left the room`);
    });
  }, []);
  return (
    <>
      <div className="container">
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={<Forms socket={socket} setUser={setUser} />}
          />
          <Route
            path="/:roomId"
            element={<RoomPage user={user} socket={socket} users={users} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
