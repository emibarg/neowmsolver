import React, { useRef, useEffect, useState } from 'react';

function Grid() {
  const canvasRef = useRef(null);
  const [gridSize, setGridSize] = useState(20);  // Adjustable grid size for zoom

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 800;

    // Call function to draw the grid whenever gridSize changes (for zoom)
    drawGrid(context, canvas.width, canvas.height, gridSize);
  }, [gridSize]);

  const drawGrid = (ctx, width, height, gridSize) => {
    // Clear the canvas before drawing
    ctx.clearRect(0, 0, width, height);

    // Set the grid color
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    // Draw vertical grid lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw the x and y axes
    ctx.strokeStyle = '#000';  // Axes color
    ctx.lineWidth = 2;

    // X axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  };

  // Zoom controls
  const handleZoomIn = () => setGridSize(prevSize => prevSize + 10);
  const handleZoomOut = () => setGridSize(prevSize => Math.max(10, prevSize - 10));

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
      <div>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
    </div>
  );
}

export default Grid;
