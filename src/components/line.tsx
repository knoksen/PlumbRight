
'use client';

import * as React from 'react';

interface Point {
    x: number;
    y: number;
}

interface LineProps {
    from: Point;
    to: Point;
    isTemporary?: boolean;
}

export function Line({ from, to, isTemporary = false }: LineProps) {
    return (
        <line
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={isTemporary ? "hsl(var(--primary) / 0.5)" : "hsl(var(--primary))"}
            strokeWidth="2"
            strokeDasharray={isTemporary ? "4 4" : undefined}
        />
    );
}
