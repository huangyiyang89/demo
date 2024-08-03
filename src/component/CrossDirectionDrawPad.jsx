import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CrossDirectionCanv from "./CrossDirectionCanv";

const CrossDirectionDrawPad = ({
  videoWidth = 1920,
  width = 960,
  isDrawing = false,
  onDrawingComplete,
  edit_data = [],
}) => {
  const [data, setData] = useState([]);
  const [currentPos, setCurrentPos] = useState(null);


  const handleClick = () => {
    if (!isDrawing) return;
    if (!currentPos) return;
    let new_data = [...data, currentPos];
    setData(new_data);
    if (new_data.length > 1) {
      onDrawingComplete(new_data);
      setCurrentPos(null);
    }
  };



  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = e.target.getBoundingClientRect();
    const scale = videoWidth / width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    //x,y取整
    setCurrentPos({ x: Math.round(x), y: Math.round(y) });
  };

  useEffect(() => {
    if (edit_data) {
      console.log("edit_data",edit_data)
      setData(edit_data);
    }

  }, [edit_data,isDrawing]);

  useEffect(() => {
    if (isDrawing) {
        setData([]);
    }
  }, [isDrawing]);

  return (
    <div
      onClick={handleClick}
      onMouseMove={handleMouseMove}
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
      <CrossDirectionCanv
        videoWidth={videoWidth}
        data={[...data, currentPos?currentPos:[]]}
      ></CrossDirectionCanv>
    </div>
  );
};

CrossDirectionDrawPad.propTypes = {
  videoWidth: PropTypes.number,
  videoHeight: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  isDrawing: PropTypes.bool,
  onDrawingComplete: PropTypes.func,
  edit_data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
])
};

export default CrossDirectionDrawPad;
