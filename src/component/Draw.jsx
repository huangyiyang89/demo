import { useRef, useState, useEffect } from "react";
import { Button } from "antd";
import { EditOutlined, FormOutlined } from "@ant-design/icons";

const Draw = () => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentPos, setCurrentPos] = useState(null);
  const [lines, setLines] = useState([]);
  const [startLine, setStartLine] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    // 设置canvas大小等于上级标签大小
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // 清空画布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 设置绘图样式
    context.strokeStyle = "#FF0088";
    context.lineWidth = 2;
    context.fillStyle = "#FF0088";

    // 重新绘制多边形
    if (points.length > 0) {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      points.forEach((point) => {
        context.lineTo(point.x, point.y);
      });
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
      drawLineWithArrow(context, line.start, line.end);
    });

    // 绘制当前的直线
    if (startLine && currentPos && isDrawingLine) {
      drawLineWithArrow(context, startLine, currentPos);
    }
  }, [points, currentPos, isDrawingPolygon, isDrawingLine, startLine, lines]);

  const drawLineWithArrow = (context, start, end) => {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();

    // 绘制箭头
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
  };

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
        }
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    console.log("mouse_move");
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
    }
  };

  const startDrawingPolygon = () => {
    setPoints([]);
    setLines([]);
    setIsDrawingPolygon(true);
    setIsDrawingLine(false);
    setStartLine(null);
  };

  const startDrawingLine = () => {
    setPoints([]);
    setLines([]);
    setIsDrawingPolygon(false);
    setIsDrawingLine(true);
    setStartLine(null);
  };

  return (
    <>
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
      <Button icon={<EditOutlined />} size="large" onClick={startDrawingLine}></Button>
      <Button icon={<FormOutlined />} size="large" onClick={startDrawingPolygon}></Button>
    </>
  );
};

export default Draw;
