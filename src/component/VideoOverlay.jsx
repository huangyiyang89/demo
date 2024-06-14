import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoOverlay = ({ videoSrc, options }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const playerRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (videoElement) {
        playerRef.current = videojs(videoElement, options, () => {
          console.log('Video.js player is ready');
        });
      }
    }

    const handleResize = () => {
      const canvas = canvasRef.current;
      const videoElement = videoRef.current;
      if (canvas && videoElement) {
        canvas.width = videoElement.clientWidth;
        canvas.height = videoElement.clientHeight;
        drawLines();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set canvas size

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [options]);

  const drawLines = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    if (points.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.stroke();
    }
  };

  const handleMouseDown = (event) => {
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPoints([{ x, y }]);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPoints(prevPoints => [...prevPoints, { x, y }]);
    drawLines();
  };

  const handleMouseUp = () => {
    setDrawing(false);
    drawLines();
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <video ref={videoRef} className="video-js" controls preload="auto" style={{ display: 'block' }}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, cursor: 'crosshair' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

VideoOverlay.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  options: PropTypes.object,
};

VideoOverlay.defaultProps = {
  options: {
    controls: true,
    autoplay: false,
    preload: 'auto',
  },
};

export default VideoOverlay;
