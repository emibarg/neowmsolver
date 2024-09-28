import React, { useRef, useEffect, useState } from 'react';

import Force from './Force';

function Grid() {
  const canvasRef = useRef(null);
  const [gridSize, setGridSize] = useState(40);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      drawGrid(context, canvas.width, canvas.height, gridSize);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleScrollZoom = (event) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const zoom = event.deltaY < 0 ? 1.1 : 0.9;
      const newGridSize = Math.max(20, Math.min(100, gridSize * zoom));

      const scale = newGridSize / gridSize;
      const newOffsetX = mouseX - (mouseX - offset.x) * scale;
      const newOffsetY = mouseY - (mouseY - offset.y) * scale;

      setGridSize(newGridSize);
      setOffset({ x: newOffsetX, y: newOffsetY });
    };

    const handleMouseDown = (event) => {
      setIsDragging(true);
      setLastPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        const deltaX = event.clientX - lastPosition.x;
        const deltaY = event.clientY - lastPosition.y;
        setOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
        setLastPosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener('wheel', handleScrollZoom);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('wheel', handleScrollZoom);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [gridSize, isDragging, lastPosition, offset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    drawGrid(context, canvas.width, canvas.height, gridSize);
  }, [gridSize, offset]);

  const drawGrid = (ctx, width, height, gridSize) => {
    ctx.clearRect(0, 0, width, height);
    
    const originX = width / 2 - offset.x;
    const originY = height / 2 - offset.y;

    // Calculate grid boundaries
    const leftmostLine = Math.floor((offset.x - width / 2) / gridSize);
    const rightmostLine = Math.ceil((offset.x + width / 2) / gridSize);
    const topmostLine = Math.floor((offset.y - height / 2) / gridSize);
    const bottommostLine = Math.ceil((offset.y + height / 2) / gridSize);

    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    for (let i = leftmostLine; i <= rightmostLine; i++) {
      const x = originX + i * gridSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let i = topmostLine; i <= bottommostLine; i++) {
      const y = originY + i * gridSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Draw coordinates
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = leftmostLine; i <= rightmostLine; i++) {
      const x = originX + i * gridSize;
      ctx.fillText(i.toString(), x, originY + 5);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (let i = topmostLine; i <= bottommostLine; i++) {
      const y = originY + i * gridSize;
      ctx.fillText((-i).toString(), originX + 5, y);
    }

    // Draw the force
    const origin = [originX, originY];
    const end = [originX + gridSize, originY - gridSize];
    drawForce(ctx, origin, end, 1, 0);

  };

  const drawForce = (ctx, origin, end, magnitude, direction) => {
    const [x0, y0] = origin;
    const [x1, y1] = end;

    // Draw the force on the grid
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the arrowhead
    const angle = Math.atan2(y1 - y0, x1 - x0);
    const arrowSize = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    // Draw the first half of the arrowhead
    ctx.lineTo(
      x1 - arrowSize * Math.cos(angle - Math.PI / 6),
      y1 - arrowSize * Math.sin(angle - Math.PI / 6)
    );

    // Draw the second half of the arrowhead
    ctx.moveTo(x1, y1);
    ctx.lineTo(
      x1 - arrowSize * Math.cos(angle + Math.PI / 6),
      y1 - arrowSize * Math.sin(angle + Math.PI / 6)
    );

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  return (
    <div style={{ width: '100%', height: '600px', padding: '20px' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', border: '1px solid black' }} />
      <Force origin={[0, 0]} end={[0+gridSize, 0+gridSize]} canvasRef={canvasRef} />
    </div>
  );
}

export default Grid;