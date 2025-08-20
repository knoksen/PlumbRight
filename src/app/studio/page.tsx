
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Draggable } from '@/components/draggable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { partsData, type Part } from '@/lib/data';
import { Line } from '@/components/line';
import { cn } from '@/lib/utils';

// A curated list of parts for the palette
const paletteParts: Part[] = [
  partsData.find(p => p.id === 'pvc-elbow-90')!,
  partsData.find(p => p.id === 'copper-pipe-10ft')!,
  partsData.find(p => p.id === 'ball-valve-1/2')!,
  partsData.find(p => p.id === 'sink-faucet-chrome')!,
  partsData.find(p => p.id === 'p-trap-1-1-2')!,
  partsData.find(p => p.id === 'pex-tubing-blue-100ft')!,
  partsData.find(p => p.id === 'gas-shutoff-valve')!,
  partsData.find(p => p.id === 'sump-pump-system')!,
];

const GRID_SIZE = 20; // Snap to a 20x20 grid

// Data structures for items on the canvas
interface PlacedItem {
  id: string;
  part: Part;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ConnectionPoint {
  itemId: string;
  x: number;
  y: number;
}

interface Connection {
  id: string;
  from: ConnectionPoint;
  to: ConnectionPoint;
}

// Main Studio Component
export default function StudioPage() {
  const [placedItems, setPlacedItems] = React.useState<PlacedItem[]>([]);
  const [connections, setConnections] = React.useState<Connection[]>([]);
  const [drawingLine, setDrawingLine] = React.useState<{ from: ConnectionPoint, to: {x: number, y: number} } | null>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // --- Drag and Drop Handlers ---
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const partString = e.dataTransfer.getData('application/json');
    if (!partString) return;
    
    const { part } = JSON.parse(partString) as { part: Part };
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Snap to grid
    const x = Math.round((e.clientX - canvasRect.left) / GRID_SIZE) * GRID_SIZE;
    const y = Math.round((e.clientY - canvasRect.top) / GRID_SIZE) * GRID_SIZE;
    
    const width = 100;
    const height = 100;

    const newItem: PlacedItem = {
      id: crypto.randomUUID(),
      part,
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
    };
    setPlacedItems((prev) => [...prev, newItem]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>)=> {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // --- Canvas and Item Management ---
  const handleClear = () => {
    setPlacedItems([]);
    setConnections([]);
    setDrawingLine(null);
  };
  
  const getConnectionPoints = React.useCallback((item: PlacedItem): ConnectionPoint[] => {
      return [
        { itemId: item.id, x: item.x + item.width / 2, y: item.y }, // Top
        { itemId: item.id, x: item.x + item.width, y: item.y + item.height / 2 }, // Right
        { itemId: item.id, x: item.x + item.width / 2, y: item.y + item.height }, // Bottom
        { itemId: item.id, x: item.x, y: item.y + item.height / 2 }, // Left
      ];
  }, []);

  // --- Connection Drawing Handlers ---
  const handleMouseDownOnPoint = (fromPoint: ConnectionPoint) => {
    setDrawingLine({ from: fromPoint, to: { x: fromPoint.x, y: fromPoint.y } });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingLine || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    setDrawingLine(prev => prev ? { ...prev, to: { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top } } : null);
  };

  const handleMouseUpOnPoint = (toPoint: ConnectionPoint) => {
    if (!drawingLine || drawingLine.from.itemId === toPoint.itemId) {
      setDrawingLine(null);
      return;
    }
    const newConnection: Connection = {
      id: crypto.randomUUID(),
      from: drawingLine.from,
      to: toPoint,
    };
    setConnections(prev => [...prev, newConnection]);
    setDrawingLine(null);
  };

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Design Studio</h1>
        <p className="text-muted-foreground">
          Visually plan your plumbing projects by dragging components onto the canvas and connecting them.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 flex-1 min-h-0">
        {/* Components Palette */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Components</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-2 gap-4">
                {paletteParts.map((part) => (
                  <Draggable key={part.id} id={part.id} data={{ part }}>
                    <div className="flex flex-col items-center justify-center gap-2 p-2 border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors aspect-square">
                      <Image src={part.imageUrl} alt={part.name} width={48} height={48} className="h-12 w-12 object-contain" data-ai-hint={part.aiHint} />
                      <span className="text-xs font-medium text-center">{part.name}</span>
                    </div>
                  </Draggable>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Canvas */}
        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Canvas</CardTitle>
            <Button variant="outline" size="sm" onClick={handleClear}>Clear Canvas</Button>
          </CardHeader>
          <CardContent
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDrawingLine(null)}
            className="flex-1 relative bg-muted/20 rounded-md border-2 border-dashed overflow-hidden"
          >
            {/* Grid background */}
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                  <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            
            {/* Connections */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {connections.map(conn => <Line key={conn.id} from={conn.from} to={conn.to} />)}
              {drawingLine && <Line from={drawingLine.from} to={drawingLine.to} isTemporary />}
            </svg>

            {/* Placed Items */}
            {placedItems.map((item) => (
              <div
                key={item.id}
                className="group absolute flex flex-col items-center justify-center bg-background/80 p-2 rounded-md shadow-md hover:shadow-lg hover:border-primary border-transparent border-2 transition-all"
                style={{ left: `${item.x}px`, top: `${item.y}px`, width: `${item.width}px`, height: `${item.height}px` }}
              >
                <Image src={item.part.imageUrl} alt={item.part.name} layout="fill" className="object-contain p-4" data-ai-hint={item.part.aiHint}/>
                <span className="absolute -bottom-6 text-xs bg-background/90 px-2 py-0.5 rounded">{item.part.name}</span>
                
                {/* Connection Points */}
                {getConnectionPoints(item).map((point, index) => (
                    <div
                        key={index}
                        className="absolute w-3 h-3 bg-primary rounded-full cursor-pointer hover:scale-150 transition-transform opacity-0 group-hover:opacity-100 z-10"
                        style={{
                            left: `${point.x - item.x - 6}px`,
                            top: `${point.y - item.y - 6}px`,
                        }}
                        onMouseDown={(e) => { e.stopPropagation(); handleMouseDownOnPoint(point); }}
                        onMouseUp={(e) => { e.stopPropagation(); handleMouseUpOnPoint(point); }}
                    />
                ))}
              </div>
            ))}
            
            {/* Empty Canvas Message */}
             {placedItems.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground pointer-events-none">
                    <p>Drag components here to start designing</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
