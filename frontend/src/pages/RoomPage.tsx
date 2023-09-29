import React, { useRef, useState } from "react";
import WhiteBoard from "../components/Whiteboard";
import ClientBoard from "./ClientBoard";
import { IUser } from "../App";

const RoomPage = ({
  user,
  socket,
  users,
}: {
  user: IUser | null;
  socket: any;
  users: IUser[];
}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState("5");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState(false);

  const handleClearCanvas = () => {
    const canvas: any = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillRect = "white";

      ctx.clearRect(
        0,
        0,
        canvasRef?.current?.width,
        canvasRef?.current?.height
      );
      setElements([]);
    }
  };
  const handleUndo = () => {
    if (elements.length === 1) {
      handleClearCanvas();
    }
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    );
  };
  const handleRedo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

  return (
    <div className="container bg-teal-50 ">
      <div className=" justify-start" onClick={() => setTab(!tab)}>
        <button className="bg-teal-500 text-white px-4 py-2 ml-10 mt-5  font-bold rounded-sm hover:bg-teal-800 ">
          Users
        </button>
        {tab && (
          <div
            className="text-white bg-emerald-800 bg-opacity-80 fixed top-0 h-full"
            style={{ width: "250px", left: "0%" }}
          >
            <div className="flex justify-center">
              <button
                className="text-white bg-red-500 px-6 py-3 font-bold text-2xl rounded-sm my-5 border "
                onClick={() => setTab(!tab)}
              >
                Close
              </button>
            </div>
            <div className="w-full mt-5 pt-5">
              {" "}
              {users.map((u) => (
                <p key={u.userId} className="capitalize text-center w-full">
                  {u.username}
                  {user && user.userId === u.userId && " [ You ] "}
                </p>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <h1 className=" py-6 text-center font-bold text-4xl">
            {" "}
            White Board Sharing App{" "}
            <span className="font-semibold text-lg ">
              {" "}
              [
              <span className="text-emerald-600 font-semibold text-lg mx-1">
                Online Users :{users.length}
              </span>{" "}
              ]
            </span>
          </h1>
        </div>
      </div>
      <div>
        {user && user.presenter && (
          <div>
            <div className="flex col-span-full justify-center gap-4 my-2 ">
              <div className="flex items-center p-1 gap-1">
                <label htmlFor="pencil">Pencil</label>
                <input
                  type="radio"
                  name="tool"
                  checked={tool === "pencil"}
                  value="pencil"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>

              <div className="flex items-center p-1 gap-1">
                <label htmlFor="line">Line</label>
                <input
                  type="radio"
                  name="tool"
                  checked={tool === "line"}
                  value="line"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>

              <div className="flex items-center p-1 gap-1">
                <label htmlFor="rectangle">Rectangle</label>
                <input
                  type="radio"
                  name="tool"
                  checked={tool === "rectangle"}
                  value="rectangle"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>
              <div className="flex items-center p-1 gap-1">
                <label htmlFor="line">Circle</label>
                <input
                  type="radio"
                  name="tool"
                  checked={tool === "circle"}
                  value="circle"
                  onChange={(e) => setTool(e.target.value)}
                />
              </div>
              <div className="flex items-center p-1 gap-1">
                <label htmlFor="color">Select Color</label>
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="flex items-center p-1 gap-1">
                <label htmlFor="strokeWidth">Select Stroke Size</label>
                <input
                  type="range"
                  id="strokeWidth"
                  value={strokeWidth}
                  min={1}
                  max={20}
                  onChange={(e) => setStrokeWidth(e.target.value)}
                />
                <span>{strokeWidth}</span>
              </div>
            </div>
            <div className="flex justify-center my-2 gap-4">
              <button
                className="bg-red-500 hover:bg-red-700 font-semibold px-2 py-2 text-sm text-white rounded-sm"
                onClick={handleClearCanvas}
              >
                Clear Canvas
              </button>
              <button
                onClick={handleUndo}
                disabled={elements.length === 0}
                className="bg-orange-500 hover:bg-orange-700 font-semibold px-2 py-1 text-sm text-white rounded-sm disabled:opacity-50 "
              >
                Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={history.length < 1}
                className="bg-emerald-500 hover:bg-emerald-700 px-2 py-1 font-semibold text-sm text-white rounded-sm disabled:opacity-50"
              >
                Redo
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-center ">
          {user?.presenter ? (
            <div className=" border-2 border-black bg-white h-1/2 w-2/3">
              <WhiteBoard
                canvasRef={canvasRef}
                ctxRef={ctxRef}
                elements={elements}
                setElements={setElements}
                tool={tool}
                color={color}
                strokeWidth={strokeWidth}
                user={user}
                socket={socket}
              />
            </div>
          ) : (
            <ClientBoard user={user} socket={socket} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
