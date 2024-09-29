import React, { useRef, useEffect, useState } from 'react';
import Force from './Force';
import Toolbox from './Toolbox';
import CreateBeams from './components/beams';

function Grid() {
  const canvasRef = useRef(null);
  const [gridSize, setGridSize] = useState(40);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [currentTool, setCurrentTool] = useState('Select');
  const [elements, setElements] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);

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
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (currentTool === 'Select') {
        setIsDragging(true);
        setLastPosition({ x: event.clientX, y: event.clientY });
      } else if (currentTool === 'Beam') {
        setIsDrawing(true);
        setStartPoint({ x: snapToGrid(x), y: snapToGrid(y) }); // Snap to grid
      }
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (isDragging) {
        const deltaX = event.clientX - lastPosition.x;
        const deltaY = event.clientY - lastPosition.y;
        setOffset(prev => ({ x: prev.x - deltaX, y: prev.y - deltaY }));
        setLastPosition({ x: event.clientX, y: event.clientY });
      } else if (isDrawing && startPoint) {
        drawGrid(context, canvas.width, canvas.height, gridSize);
        drawTempElement(context, startPoint, { x: snapToGrid(x), y: snapToGrid(y) }); // Snap endpoint
      }
    };

    const handleMouseUp = (event) => {
      if (isDrawing && startPoint) {
        const rect = canvas.getBoundingClientRect();
        const endPoint = {
          x: snapToGrid(event.clientX - rect.left),
          y: snapToGrid(event.clientY - rect.top)
        };
        addElement(startPoint, endPoint); // Store the new beam without offset
        setIsDrawing(false);
        setStartPoint(null);
      }
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
  }, [gridSize, isDragging, lastPosition, offset, currentTool, isDrawing, startPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    drawGrid(context, canvas.width, canvas.height, gridSize);
  }, [gridSize, offset, elements]);

  const snapToGrid = (value) => {
    return Math.round(value / gridSize) * gridSize; // Snap to nearest grid point
  };

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

    // Draw elements (beams)
    elements.forEach(element => {
      drawElement(ctx, element);
    });
  };

  const drawTempElement = (ctx, start, end) => {
    ctx.strokeStyle = '#00F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(start.x + offset.x, start.y + offset.y); // Adjust for offset
    ctx.lineTo(end.x + offset.x, end.y + offset.y); // Adjust for offset
    ctx.stroke();
  };

  const drawElement = (ctx, element) => {
    ctx.strokeStyle = '#00F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(element.start.x, element.start.y); // Use stored coordinates
    ctx.lineTo(element.end.x, element.end.y); // Use stored coordinates
    ctx.stroke();
  };

  const addElement = (start, end) => {
    if (currentTool === 'Beam') {
      // Store the start and end points without applying the offset
      setElements(prevElements => [
        ...prevElements,
        { start: { x: start.x, y: start.y }, end: { x: end.x, y: end.y } } // Store the new beam without offset
      ]);
    }
  };

  return (
    <div>
      <Toolbox currentTool={currentTool} setCurrentTool={setCurrentTool} />
      <div style={{ width: '100%', height: '600px', padding: '20px' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', border: '1px solid black' }} />
      </div>
    </div>
  );
}

export default Grid;
