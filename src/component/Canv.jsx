import { PropTypes } from "prop-types";
import { useRef, useEffect } from "react";



const Canv = ({ shape }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      drawLines();
    };

    const drawLines = () => {
      //init canvas
      console.log("shape", shape);
      if (!canvas) return;
      if (!shape || shape.type == undefined) return;

      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "#FF0088";
      context.fillStyle = "#FF0088";
      context.lineWidth = 2;
      const scale = width / 960;
      console.log("绘制形状", shape, scale);
      //绘制图形
      if (shape.type == "line") {
        let lines = shape.data;
        lines.forEach((line, index) => {
          context.beginPath();
          context.moveTo(line.start.x * scale, line.start.y * scale);
          context.lineTo(line.end.x * scale, line.end.y * scale);
          context.stroke();
          // 在最后一条线的终点添加箭头
          if (index === lines.length - 1) {
            const headLength = 8 * scale; // 箭头长度
            const angle = Math.atan2(
              line.end.y * scale - line.start.y * scale,
              line.end.x * scale - line.start.x * scale
            );
            context.beginPath();
            context.moveTo(line.end.x * scale, line.end.y * scale);
            context.lineTo(
              line.end.x * scale - headLength * Math.cos(angle - Math.PI / 6),
              line.end.y * scale - headLength * Math.sin(angle - Math.PI / 6)
            );
            context.lineTo(
              line.end.x * scale - headLength * Math.cos(angle + Math.PI / 6),
              line.end.y * scale - headLength * Math.sin(angle + Math.PI / 6)
            );
            context.lineTo(line.end.x * scale, line.end.y * scale);
            context.lineTo(
              line.end.x * scale - headLength * Math.cos(angle - Math.PI / 6),
              line.end.y * scale - headLength * Math.sin(angle - Math.PI / 6)
            );
            context.stroke();
            context.fill();
          }
        });
      }

      if (shape.type == "polygon") {
        console.log("polygon");
        let points = shape.data;
        if (points.length > 0) {
          context.beginPath();
          context.moveTo(points[0].x * scale, points[0].y * scale);
          points.forEach((point) => {
            context.lineTo(point.x * scale, point.y * scale);
          });
          context.stroke();
        }
      }
    };

    // 初始绘制和尺寸调整
    resizeCanvas();

    // 处理窗口大小调整事件
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [shape]);

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
      }}
    />
  );
};

Canv.propTypes = {
  shape: PropTypes.object.isRequired,
};

export default Canv;
