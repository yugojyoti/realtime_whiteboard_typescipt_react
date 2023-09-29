import React, { MouseEvent, useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";
import { IUser } from "../../App";

const roughGenerator = rough.generator();

const WhiteBoard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  strokeWidth,
  user,
  socket,
}: {
  canvasRef: any;
  ctxRef: any;
  elements: any;
  setElements: any;
  tool: string;
  color: string;
  strokeWidth: string;
  user: IUser;
  socket: any;
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;

    ctxRef.current = ctx;
  }, [canvasRef, ctxRef]);
  useEffect(() => {});

  useLayoutEffect(() => {
    if (canvasRef) {
      const roughCanvas = rough.canvas(canvasRef.current);
      if (elements.length > 0) {
        ctxRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
      elements.forEach((el: any) => {
        if (el.type === "pencil") {
          roughCanvas.linearPath(el.path, {
            stroke: el.stroke,
            strokeWidth: el.strokeWidth,
            roughness: 0,
            bowing: 500,
          });
        } else if (el.type === "line") {
          roughCanvas.draw(
            roughGenerator.line(el.offsetX, el.offsetY, el.width, el.height, {
              stroke: el.stroke,
              strokeWidth: el.strokeWidth,
              roughness: 0,
            })
          );
        } else if (el.type === "rectangle") {
          roughCanvas.draw(
            roughGenerator.rectangle(
              el.offsetX,
              el.offsetY,
              el.width,
              el.height,
              { stroke: el.stroke, strokeWidth: el.strokeWidth, roughness: 0 }
            )
          );
        } else if (el.type === "circle") {
          roughCanvas.draw(
            roughGenerator.circle(
              el.radiusX,
              el.radiusY,
              el.diameter,

              { stroke: el.stroke, strokeWidth: el.strokeWidth, roughness: 0 }
            )
          );
        }
      });
      const canvasImage = canvasRef.current.toDataURL();
      socket.emit("whiteBoardData", canvasImage);
    }
  }, [elements, canvasRef, ctxRef, socket]);

  const handleMouseDown = (e: MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (tool === "pencil") {
      setElements((prevElements: any) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          strokeWidth: strokeWidth,
        },
      ]);
    } else if (tool === "line") {
      setElements((prevElements: any) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          stroke: color,
          type: "line",
          strokeWidth: strokeWidth,
        },
      ]);
    } else if (tool === "rectangle") {
      setElements((prevElements: any) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          stroke: color,
          type: "rectangle",
          strokeWidth: strokeWidth,
        },
      ]);
    } else if (tool === "circle") {
      setElements((prevElements: any) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          stroke: color,
          type: "circle",
          strokeWidth: strokeWidth,
        },
      ]);
    }

    setIsDrawing(true);
  };
  const handleMouseMove = (e: MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      //pencilby default

      if (tool === "pencil") {
        const last = elements.length;
        const { path } = elements[last - 1];
        const newPath = [...path, [offsetX, offsetY]];
        setElements((prevElements: any) =>
          prevElements.map((el: any, i: number) => {
            if (i === elements.length - 1) {
              return { ...el, path: newPath };
            } else {
              return el;
            }
          })
        );
      } else if (tool === "line") {
        setElements((prevElements: any) =>
          prevElements.map((el: any, i: number) => {
            if (i === elements.length - 1) {
              return {
                ...el,
                width: offsetX,
                height: offsetY,
              };
            } else {
              return el;
            }
          })
        );
      } else if (tool === "rectangle") {
        setElements((prevElements: any) =>
          prevElements.map((el: any, i: number) => {
            if (i === elements.length - 1) {
              return {
                ...el,
                offsetX: el.offsetX,
                offsetY: el.offsetY,
                width: offsetX - el.offsetX,
                height: offsetY - el.offsetY,
              };
            } else {
              return el;
            }
          })
        );
      } else if (tool === "circle") {
        setElements((prevElements: any) =>
          prevElements.map((el: any, i: number) => {
            if (i === elements.length - 1) {
              return {
                ...el,
                offsetX: el.offsetX,
                offsetY: el.offsetY,
                diameter: 2 * (offsetX - el.offsetX),
                radiusX: el.offsetX,
                radiusY: el.offsetY,
              };
            } else {
              return el;
            }
          })
        );
      }
    }
  };
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ height: "600px" }}
        className="overflow-hidden h-full w-full"
      >
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};

export default WhiteBoard;
