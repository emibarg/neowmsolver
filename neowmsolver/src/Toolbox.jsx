import React from 'react';

const Toolbox = ({ currentTool, setCurrentTool }) => {
  const tools = [
    { name: 'Select', icon: '⭐' },
    { name: 'Beam', icon: '📏' },
    { name: 'Support', icon: '🔺' },
    { name: 'Load', icon: '⬇️' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
      {tools.map((tool) => (
        <button
          key={tool.name}
          onClick={() => setCurrentTool(tool.name)}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            backgroundColor: currentTool === tool.name ? '#ddd' : 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {tool.icon} {tool.name}
        </button>
      ))}
    </div>
  );
};

export default Toolbox;