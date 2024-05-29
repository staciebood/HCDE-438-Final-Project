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

  const [dropped, setDropped] = useState(false);


  const resetDroppedState = () => {
    setTimeout(() => {
      setDropped(false);
    }, 100);
  };

  useEffect(() => {
    if (dropped) {
      resetDroppedState();
    }
  }, [dropped]);

  return (
    <div
      ref={(node) => {
        drag(node);
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
