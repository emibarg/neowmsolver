import React, { useRef, useEffect, useState } from 'react';

function Grid() {
  const canvasRef = useRef(null);
  const [gridSize, setGridSize] = useState(20);  // Adjustable grid size for zoom

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 800;

    // Initial grid draw
    drawGrid(context, canvas.width, canvas.height, gridSize);

    // Event listener for zooming with scroll
    const handleScrollZoom = (event) => {
      event.preventDefault();  // Prevent default scroll behavior

      if (event.deltaY < 0) {
        // Scrolling up -> Zoom in
        setGridSize(prevSize => prevSize + 5);
      } else {
        // Scrolling down -> Zoom out
        setGridSize(prevSize => Math.max(5, prevSize - 5));
      }
    };

    // Add event listener to canvas
    canvas.addEventListener('wheel', handleScrollZoom);

    // Clean up event listener on component unmount
    return () => {
      canvas.removeEventListener('wheel', handleScrollZoom);
    };
  }, [gridSize]);  // Redraw the grid whenever gridSize changes

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

    // X axis (horizontal line through the middle)
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Y axis (vertical line through the middle)
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
    </div>
  );
}

export default Grid;
