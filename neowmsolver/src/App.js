import React from 'react';
import './App.css';
import Grid from './Grid'; 
import CreateBeams from './components/beams' // Import the Grid component

function App() {
  return (
    <div className="App">
      <h1>Structural Beam Calculator with Grid</h1>
      <Grid />  {/* Use the Grid component */}
      <CreateBeams /> {/* Use the createBeams component */}
    </div>
  );
}

export default App;
