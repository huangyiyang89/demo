import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import PolygonCanv from "./PolygonCanv";

const PolygonDrawPad = ({
  videoWidth = 1920,
  videoHeight = 1080,
  width = 960,
  height = 540,
  isDrawing = false,
  onDrawingComplete,
  edit_data = null,
}) => {
  const [data, setData] = useState(edit_data);
  const [currentPos, setCurrentPos] = useState(null);

  const currentMouseData = () => {
    if (!currentPos) {
      return "";
    }
    return currentPos.x.toString() + ";" + currentPos.y.toString() + ";";
  };

  const handleClick = () => {
    console.log(data + currentMouseData());
    setData(data + currentMouseData());
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = e.target.getBoundingClientRect();
    const scale = videoWidth / width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    setCurrentPos({ x, y });
  };


  //右键事件
  const handleContextMenu = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    // 闭合多边形
    let finalData = data ;
    if (finalData) {
      const firstPoint = finalData.split(";").slice(0, 2).join(";") + ";";
      finalData += firstPoint;
    }
    // 取整过滤
    finalData = finalData
      .split(";")
      .filter(Boolean)
      .map((coord, index) => (index % 2 === 0 ? Math.round(parseFloat(coord)) : Math.round(parseFloat(coord))))
      .join(";");
    
    setData(finalData);
    onDrawingComplete(finalData);
    setCurrentPos(null);
  };

  useEffect(() => {
    if (edit_data) {
      setData(edit_data);
    }

  }, [edit_data,isDrawing]);

  useEffect(() => {
    if (isDrawing) {
        setData("");
    }
  }, [isDrawing]);

  return (
    <div
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onContextMenu={handleContextMenu}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor:
          isDrawing
            ? "rgba(211, 211, 211, 0.5)"
            : "rgba(211, 211, 211, 0)",
        cursor: isDrawing ?"crosshair" : "default",
        pointerEvents: isDrawing? "auto" : "none",
      }}
    >
      <PolygonCanv
        videoWidth={videoWidth}
        data={data + currentMouseData()}
      ></PolygonCanv>
    </div>
  );
};

PolygonDrawPad.propTypes = {
  videoWidth: PropTypes.number,
  videoHeight: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  isDrawing: PropTypes.bool,
  onDrawingComplete: PropTypes.func,
  edit_data: PropTypes.string,
};

export default PolygonDrawPad;
