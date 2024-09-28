import React from 'react';
import './App.css';
import Grid from './Grid';  // Import the Grid component
import Toolbox from './Toolbox';

function App() {
  return (
    <div className="App">
      
      <h1>Structural Beam Calculator with Grid</h1>
      <Toolbox/>
      <Grid />  {/* Use the Grid component */}
    </div>
  );
}

export default App;
