
'use client';

import React from 'react';

interface DraggableProps {
  children: React.ReactNode;
  id: string;
  data: any; 
}

export function Draggable({ children, id, data }: DraggableProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Use a ghost image for better UX
    const ghost = e.currentTarget.cloneNode(true) as HTMLDivElement;
    ghost.style.position = "absolute";
    ghost.style.top = "-1000px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, e.currentTarget.clientWidth / 2, e.currentTarget.clientHeight / 2);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({ id, ...data }));
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  return (
    <div draggable onDragStart={handleDragStart} className="cursor-grab">
      {children}
    </div>
  );
}
