'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Draggable } from '@/components/draggable';
import { Pipe, Circle, Square, Minus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StudioItem {
  id: string;
  component: React.ReactNode;
  name: string;
}

const paletteItems: StudioItem[] = [
  { id: 'pipe', component: <Pipe className="size-8" />, name: 'Pipe' },
  { id: 'elbow', component: <div className="h-8 w-8 border-l-4 border-t-4 border-gray-500" />, name: 'Elbow' },
  { id: 'tee', component: <div className="relative h-8 w-8"><div className="absolute h-8 w-1 bg-gray-500 left-1/2 -translate-x-1/2" /><div className="absolute w-8 h-1 bg-gray-500 top-1/2 -translate-y-1/2" /></div>, name: 'Tee' },
  { id: 'valve', component: <Circle className="size-8" />, name: 'Valve' },
  { id: 'pump', component: <Square className="size-8" />, name: 'Pump' },
  { id: 'sink', component: <div className="w-10 h-6 border-2 border-gray-500 rounded-sm" />, name: 'Sink' },
];

interface PlacedItem {
  id: string;
  x: number;
  y: number;
  type: string;
  name: string;
}

export default function StudioPage() {
  const [placedItems, setPlacedItems] = React.useState<PlacedItem[]>([]);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const dataString = e.dataTransfer.getData('application/json');
    if (!dataString) return;

    const { id: type, name } = JSON.parse(dataString);
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const newItem: PlacedItem = {
      id: crypto.randomUUID(),
      type,
      name,
      x,
      y,
    };
    setPlacedItems((prev) => [...prev, newItem]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setPlacedItems([]);
  };
  
  const getComponentForType = (type: string) => {
    const item = paletteItems.find(p => p.id === type);
    return item ? React.cloneElement(item.component as React.ReactElement, {className: "size-10 text-primary"}) : null;
  }

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Design Studio</h1>
        <p className="text-muted-foreground">
          Visually plan your plumbing projects by dragging components onto the canvas.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 flex-1 min-h-0">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Components</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-2 gap-4">
                {paletteItems.map((item) => (
                  <Draggable key={item.id} id={item.id} data={{ name: item.name }}>
                    <div className="flex flex-col items-center justify-center gap-2 p-4 border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors aspect-square">
                      {item.component}
                      <span className="text-xs font-medium text-center">{item.name}</span>
                    </div>
                  </Draggable>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Canvas</CardTitle>
            <Button variant="outline" size="sm" onClick={handleClear}>Clear Canvas</Button>
          </CardHeader>
          <CardContent
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex-1 relative bg-muted/20 rounded-md border-2 border-dashed"
          >
            {placedItems.map((item) => (
              <div
                key={item.id}
                className="absolute flex flex-col items-center"
                style={{ left: `${item.x}px`, top: `${item.y}px`, transform: 'translate(-50%, -50%)' }}
              >
                {getComponentForType(item.type)}
                <span className="text-xs mt-1 bg-background/80 px-1 rounded">{item.name}</span>
              </div>
            ))}
             {placedItems.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Drag components here to start designing</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
