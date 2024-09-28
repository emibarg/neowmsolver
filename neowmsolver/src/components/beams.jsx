import React, {useState} from 'react';

function CreateBeams(startPoint, endPoint) {
    const length = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const angleInDegrees = (angle * (180 / Math.PI) + 360) % 360;
    return (
        <svg>
          <line
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="black"
            strokeWidth="2"
          />
          <text x={startPoint.x} y={startPoint.y - 10} fill="black">
            Length: {length.toFixed(2)}
          </text>
          <text x={startPoint.x} y={startPoint.y - 20} fill="black">
            Angle: {angleInDegrees.toFixed(2)}
          </text>
        </svg>
      );
}
export default CreateBeams;