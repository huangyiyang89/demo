import { PropTypes } from "prop-types";
import { useRef, useEffect } from "react";
import { stringToPoints } from "../service";

const CrossDirectionCanv = ({ videoWidth, data, lineWidth = 1 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let points = [];
    try {
      if (typeof data === 'string') {
        points = stringToPoints(data);
      } else if (Array.isArray(data)) {
        points = data;
      }
    } catch {
      console.log("data parse error");
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return; // 确保 canvas 存在
    const context = canvas.getContext("2d");

    const drawLines = () => {
      //init canvas
      if (!canvas) return;
      
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "#FF0000";
      context.fillStyle = "#FF0000";
      context.lineWidth = lineWidth;
      const scale = width / videoWidth;
      //绘制图形
      if (points.length > 1) {
        context.beginPath();
        context.moveTo(points[0].x * scale, points[0].y * scale);
        context.lineTo(points[1].x * scale, points[1].y * scale);
        //绘制方向箭头
        let angle = Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x);
        context.lineTo(
            points[1].x * scale - 10 * Math.cos(angle - Math.PI / 6),
            points[1].y * scale - 10 * Math.sin(angle - Math.PI / 6)
        );
        context.moveTo(points[1].x * scale, points[1].y * scale);
        context.lineTo(
            points[1].x * scale - 10 * Math.cos(angle + Math.PI / 6),
            points[1].y * scale - 10 * Math.sin(angle + Math.PI / 6)
        );
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
        zIndex: 999,
      }}
    />
  );
};

CrossDirectionCanv.propTypes = {
  videoWidth: PropTypes.number.isRequired,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  lineWidth: PropTypes.number,
};

export default CrossDirectionCanv;
