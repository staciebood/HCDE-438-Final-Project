import React, { useRef, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import Sticker from './Sticker';
import { ItemTypes } from './ItemTypes';
import './App.css'; 

/*used chat gpt to debug*/

function CanvasDrawing({ dogImage, clearCanvasTrigger, setClearCanvasTrigger }) {
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const isDrawingRef = useRef(false);
  const [drawingColor, setDrawingColor] = useState("#000000");
  

  // Drop target for stickers
  const [, drop] = useDrop({
    accept: ItemTypes.STICKER,
    drop: (item, monitor) => {
      
      if (!canvasRef.current || !offscreenCanvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      const { x, y } = monitor.getClientOffset();
      const canvasX = x - canvas.getBoundingClientRect().left;
      const canvasY = y - canvas.getBoundingClientRect().top;
      console.log('Coordinates:', { x, y, canvasX, canvasY }); // Debugging log
      const img = new Image();
      img.src = item.image;
      img.crossOrigin = 'anonymous'; // Set CORS attribute
      img.onload = () => {
        context.drawImage(img, canvasX, canvasY, item.width, item.height);
        console.log('Image drawn at:', { canvasX, canvasY, width: item.width, height: item.height }); // Debugging log
      };
      img.onerror = (err) => {
        console.error('Image load error:', err); // Debugging log
      };
    },
  });

  const startDrawing = (event) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    lastPositionRef.current = { x, y };
  };

  const draw = (event) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { x: lastX, y: lastY } = lastPositionRef.current;
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.strokeStyle = drawingColor; 
    context.lineWidth = 5;
    context.stroke();
    lastPositionRef.current = { x, y };
  };

  const endDrawing = () => {
    isDrawingRef.current = false;
  };

  useEffect(() => {
    const clearCanvas = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!canvas || !context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const offscreenCanvas = offscreenCanvasRef.current;
      if (offscreenCanvas) {
        const offscreenContext = offscreenCanvas.getContext('2d');
        if (offscreenContext) {
          context.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
        }
      }
    };

    if (clearCanvasTrigger) {
      clearCanvas();
      setClearCanvasTrigger(false); // Reset trigger after clearing
    }
  }, [clearCanvasTrigger, setClearCanvasTrigger]);

  useEffect(() => {
    if (!dogImage) return;
    const offscreenCanvas = offscreenCanvasRef.current;
    const canvas = canvasRef.current;
    if (!offscreenCanvas || !canvas) return;
    const context = canvas.getContext('2d');
    const offscreenContext = offscreenCanvas.getContext('2d');
    const img = new Image();
    img.src = dogImage;
    img.crossOrigin = 'anonymous'; // Set CORS attribute
    img.onload = () => {
      offscreenCanvas.width = img.width;
      offscreenCanvas.height = img.height;
      offscreenContext.drawImage(img, 0, 0);
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(offscreenCanvas, 0, 0);
    };
  }, [dogImage]);

  // Handle saving the canvas image
const saveCanvasImage = () => {
  console.log("save click")
  const canvas = canvasRef.current;
  if (!canvas) return;

  try {
    const dataURL = canvas.toDataURL(); 
    const anchor = document.createElement('a');
    anchor.href = dataURL;
    anchor.download = 'canvas_image.png'; 
    anchor.click();

  } catch (error) {
    
    console.error('Error saving canvas image:', error);
  }
};


  return (
    <div ref={drop} className="canvas-container">
       <div class="label-container">
        <p class="label">Chose a Sticker</p>
        
      <div className = "stickers-container">
        <Sticker className = "sticker" image="/classic-tan-felt-hat.png" width={150} height={150} />
        <Sticker className = "sticker" image="hat-isolated-white-background.png" width={200} height={150} />
        <Sticker className = "sticker" image="/dog-chew-bones-isolated-white-background.png"width={150} height={150} />
        <Sticker className = "sticker" image="/strawberry_14605295.png" width={150} height={150} />
        <Sticker className = "sticker" image="/tennis-ball_140400.png" width={100} height={100} />
      </div>
      </div>
      <div className="color-picker-container">
        <p>Chose a Color</p>
        <input type="color" value={drawingColor} onChange={(e) => setDrawingColor(e.target.value)} />
      </div>
      
      
      <div className = "canvas-and-button">
      <canvas
        className="canvas"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        
      />
      <button className="save-button" onClick={saveCanvasImage}>Save Image</button>
      </div>
      <canvas ref={offscreenCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default CanvasDrawing;
