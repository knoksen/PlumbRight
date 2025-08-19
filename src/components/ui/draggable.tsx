
'use client';

import React from 'react';

interface DraggableProps {
  children: React.ReactNode;
  id: string;
  data: any; 
}

export function Draggable({ children, id, data }: DraggableProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // We only need to store the part data, not the whole event
    e.dataTransfer.setData('application/json', JSON.stringify(data));
  };

  return (
    <div draggable onDragStart={handleDragStart} className="cursor-grab">
      {children}
    </div>
  );
}
