import { PropTypes } from 'prop-types';
import { useRef, useEffect } from 'react';

const Canv = ({ points }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const resizeCanvas = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            console.log("aa",width,height)
            drawLines();
        };

        const drawLines = () => {
            if (!canvas) return;

            const { width, height } = canvas;

            // 清除画布
            context.clearRect(0, 0, width, height);

            // 设置画笔样式
            context.strokeStyle = "#FF0088";
            context.lineWidth = 1;

            // 根据新的大小重新绘制线条
            for (let i = 0; i < points.length - 1; i++) {
                const { x: x1, y: y1 } = points[i];
                const { x: x2, y: y2 } = points[i + 1];

                const startX = (x1 / 1920) * width;
                const startY = (y1 / 1080) * height;
                const endX = (x2 / 1920) * width;
                const endY = (y2 / 1080) * height;

                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(endX, endY);
                context.stroke();
            }
        };

        // 初始绘制和尺寸调整
        resizeCanvas();

        // 处理窗口大小调整事件
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [points]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            }}
        />
    );
};


Canv.propTypes = {
  points: PropTypes.arrayOf(
      PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired
      })
  ).isRequired
};

export default Canv;
