import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DogImage from './DogImage';
import CanvasDrawing from './CanvasDrawing';
import './App.css'; 

/*used chat gpt to debug*/

function App() {
  const [breed, setBreed] = useState('');
  const [dogImage, setDogImage] = useState('');
  const [error, setError] = useState('');
  const [clearCanvasTrigger, setClearCanvasTrigger] = useState(false);

  const handleGenerateDogImage = async () => {
    if (!breed) {
      setError('Please enter a breed');
      return;
    }
  
    try {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const data = await response.json();
      setDogImage(data.message);
      setError('');
    } catch (error) {
      console.error('Error fetching dog image:', error);
      setError('Failed to fetch image. Please try again.');
    }
  };
  

  const handleClearCanvas = () => {
    setClearCanvasTrigger(true);
  };

  const handleBreedChange = (event) => {
    setBreed(event.target.value);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <header className="App-header">
          <h1>Dog Image Editor</h1>
          <div className = "input-field">
            <input
              type="text"
              placeholder="Enter breed name here"
              value={breed}
              onChange={handleBreedChange}
            />
            <button onClick={handleGenerateDogImage}>Generate Dog Image</button>
          <button onClick={handleClearCanvas}>Clear Canvas</button>
          
            <DogImage
              breed={breed}
              setDogImage={setDogImage}
              setError={setError}
            />
             {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
         
        </header>
        <div className="canvas-content">
          <CanvasDrawing
            dogImage={dogImage}
            clearCanvasTrigger={clearCanvasTrigger}
            setClearCanvasTrigger={setClearCanvasTrigger} ></CanvasDrawing>
            
        </div>
        
      </div>
    </DndProvider>
  );
}

export default App;


