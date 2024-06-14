import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

const DrawPad = ({
  onStartDrawingPolygon,
  onStartDrawingLine,
  onDrawingComplete,
}) => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentPos, setCurrentPos] = useState(null);
  const [lines, setLines] = useState([]);
  const [startLine, setStartLine] = useState(null);

  useEffect(() => {
    //初始化
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    //设置绘图样式
    context.lineWidth = 2;
    context.strokeStyle = "#FF0088";
    context.fillStyle = "#FF0088";

    //定义画线函数
    const drawLine = (context, start, end) => {
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();

      // 如果是第二条线需要绘制箭头
      if (lines[1] && end.x === lines[1].end.x) {
        const headLength = 10; // 箭头长度
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        context.beginPath();
        context.moveTo(end.x, end.y);
        context.lineTo(
          end.x - headLength * Math.cos(angle - Math.PI / 6),
          end.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        context.lineTo(
          end.x - headLength * Math.cos(angle + Math.PI / 6),
          end.y - headLength * Math.sin(angle + Math.PI / 6)
        );
        context.lineTo(end.x, end.y);
        context.lineTo(
          end.x - headLength * Math.cos(angle - Math.PI / 6),
          end.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        context.stroke();
        context.fill();
      }
    };

    // 重新绘制多边形
    if (points.length > 0) {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      points.forEach((point) => {
        context.lineTo(point.x, point.y);
      });
      //绘制线到当前鼠标位置
      if (currentPos && isDrawingPolygon) {
        context.lineTo(currentPos.x, currentPos.y);
      }
      context.stroke();

      // 绘制顶点
      points.forEach((point) => {
        context.beginPath();
        context.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        context.fill();
      });
    }

    // 重新绘制所有直线
    lines.forEach((line) => {
      drawLine(context, line.start, line.end);
    });
    //绘制线到当前鼠标位置
    if (startLine && currentPos && isDrawingLine) {
      drawLine(context, startLine, currentPos);
    }

  }, [points, currentPos, isDrawingPolygon, isDrawingLine, startLine, lines]);



  const handleCanvasClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawingPolygon) {
      setPoints([...points, { x, y }]);
    } else if (isDrawingLine) {
      if (!startLine) {
        setStartLine({ x, y });
      } else {
        setLines([...lines, { start: startLine, end: { x, y } }]);
        setStartLine(null);
        setCurrentPos(null);
        if (lines.length + 1 >= 2) {
          setIsDrawingLine(false);
          onDrawingComplete({type:"line",data:[...lines, { start: startLine, end: { x, y } }]});
        }
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawingPolygon && !isDrawingLine) return;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPos({ x, y });
  };

  const handleCanvasContextMenu = (e) => {
    if (!isDrawingPolygon) return;

    e.preventDefault();
    setIsDrawingPolygon(false);
    setCurrentPos(null);
    // 闭合多边形
    if (points.length > 1) {
      setPoints([...points, points[0]]);
      onDrawingComplete({tpye:"polygon",data:[...points, points[0]]});
    }
  };

  useEffect(() => {
    if (onStartDrawingPolygon) {
      setIsDrawingPolygon(true);
      setIsDrawingLine(false);
      setPoints([]);
      setLines([]);
      setStartLine(null);
    }

    if (onStartDrawingLine) {
      setIsDrawingLine(true);
      setIsDrawingPolygon(false);
      setPoints([]);
      setLines([]);
      setStartLine(null);
    }
  }, [onStartDrawingPolygon,onStartDrawingLine]);



  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 999,
        backgroundColor:
          isDrawingPolygon || isDrawingLine
            ? "rgba(211, 211, 211, 0.5)"
            : "rgba(211, 211, 211, 0)",
        cursor: isDrawingPolygon || isDrawingLine ? "crosshair" : "default",
        pointerEvents: isDrawingPolygon || isDrawingLine ? "auto" : "none",
      }}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      onContextMenu={handleCanvasContextMenu}
    />
  );
};

DrawPad.propTypes = {
  onStartDrawingPolygon: PropTypes.bool.isRequired,
  onStartDrawingLine: PropTypes.bool.isRequired,
  onDrawingComplete: PropTypes.func.isRequired,
};

export default DrawPad;
