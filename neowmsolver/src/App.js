import React from 'react';
import './App.css';
import Grid from './Grid';  // Import the Grid component
import Toolbox from './Toolbox';
import CreateBeams from './components/beams';

function App() {
  return (
    <div className="App">
      
      <h1>Structural Beam Calculator with Grid</h1>
      <Toolbox/>
      <Grid />  {/* Use the Grid component */}
      <CreateBeams /> {/* Use the createBeams component */}
    </div>
  );
}

export default App;
