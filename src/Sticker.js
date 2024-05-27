import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

function Sticker({ image, width, height }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.STICKER,
    item: { image, width, height },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // State to track if the sticker has been dropped
  const [dropped, setDropped] = useState(false);

  // Function to reset the dropped state after a delay
  const resetDroppedState = () => {
    setTimeout(() => {
      setDropped(false);
    }, 100);
  };

  // Effect to reset the dropped state when it changes
  useEffect(() => {
    if (dropped) {
      resetDroppedState();
    }
  }, [dropped]);

  return (
    <div
      ref={(node) => {
        drag(node);
        // Set dropped state to false when the drag ref changes
        setDropped(false);
      }}
      style={{ width, height }}
    >
      <img
        src={image}
        width={width}
        height={height}
        style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
        alt="Sticker"
      />
    </div>
  );
}

export default Sticker;
















