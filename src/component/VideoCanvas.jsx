import videojs from "video.js";
import "video.js/dist/video-js.css";
import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import { Button } from "antd";

export const VideoCanvas = (props) => {
  VideoCanvas.propTypes = {
    options: PropTypes.object,
    onReady: PropTypes.func,
  };

  //Draw
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentPos, setCurrentPos] = useState(null);
  const [lines, setLines] = useState([]);
  const [startLine, setStartLine] = useState(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // 清空画布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 设置绘图样式
    context.strokeStyle = "royalblue";
    context.lineWidth = 1;
    context.fillStyle = "royalblue";

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

  //player
  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef, onReady]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

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
      <div data-vjs-player width={940} height={540}>
        <div ref={videoRef}>
          <canvas
            width={940}
            height={540}
            ref={canvasRef}
            style={{
              backgroundColor: "rgba(211, 211, 211, 0.2)",
              cursor:
                isDrawingPolygon || isDrawingLine ? "crosshair" : "default",
              position: "absolute",
              zIndex: 999,
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onContextMenu={handleCanvasContextMenu}
          />
        </div>
      </div>

      <Button type="primary" onClick={startDrawingPolygon}>
        多边形
      </Button>
      <Button type="primary" onClick={startDrawingLine}>
        画直线
      </Button>
    </>
  );
};

export default VideoCanvas;
