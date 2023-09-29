import React, { useEffect, useState } from "react";
import { IUser } from "../App";

const ClientBoard = ({ user, socket }: { user: IUser | null; socket: any }) => {
  const [img, setImg] = useState("");
  useEffect(() => {
    socket.on(
      "whiteBoardDataResponse",
      (data: { imgUrl: string }) => {
        const image = data.imgUrl;
        setImg(image);
      },
      []
    );
  });
  return (
    <div
      className="border-2 border-black bg-white  w-2/3 "
      style={{ height: "600px" }}
    >
      <img
        src={img}
        alt="image"
        style={{
          height: window.innerHeight * 2.1,
          width: "285%",
          minWidth: "200%",
          maxWidth: "1000%",
        }}
      />
    </div>
  );
};

export default ClientBoard;
