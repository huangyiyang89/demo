import { PropTypes } from "prop-types";
import { useRef, useEffect } from "react";
import { convertPolygonPoints } from "../service";

const PolygonCanv = ({ videoWidth, data, lineWidth = 2 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let points = [];
    try {
      points = convertPolygonPoints(data);
    } catch {
      console.log("polygon points data error");
      points = [];
    }

    const canvas = canvasRef.current;
    if (!canvas) return; // 确保 canvas 存在
    const context = canvas.getContext("2d");

    const drawLines = () => {
      //init canvas
      if (!canvas) return;

      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "#FF0088";
      context.fillStyle = "#FF0088";
      context.lineWidth = lineWidth;
      const scale = width / videoWidth;

      //绘制图形
      if (points.length > 0) {
        context.beginPath();
        context.moveTo(points[0].x * scale, points[0].y * scale);
        points.forEach((point) => {
          context.lineTo(point.x * scale, point.y * scale);
        });
        //context.closePath(); // 可选：闭合路径
        context.stroke();
      }
    };

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      drawLines();
    };

    // 初始绘制和尺寸调整
    resizeCanvas();

    // 处理窗口大小调整事件
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [videoWidth, data, lineWidth]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex:999
      }}
    />
  );
};

PolygonCanv.propTypes = {
  videoWidth: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  lineWidth: PropTypes.number,
};

export default PolygonCanv;
