
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Sparkles } from 'lucide-react';
import { partsData, Part } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';


export default function PartsLibraryPage() {
  const [customParts] = useLocalStorage<Part[]>('customParts', []);

  const allParts = [...partsData, ...customParts];

  const groupedParts = allParts.reduce((acc, part) => {
    (acc[part.category] = acc[part.category] || []).push(part);
    return acc;
  }, {} as Record<Part['category'], Part[]>);

  const categories = Object.keys(groupedParts).sort() as Part['category'][];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Parts Library</h1>
            <p className="text-muted-foreground">Browse and search our extensive catalog of plumbing parts.</p>
        </div>
        <Button asChild>
            <Link href="/parts/new">
                <PlusCircle className="mr-2" />
                Add Custom Part
            </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-8">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Part Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedParts[category].map((part) => (
                    <TableRow key={part.id}>
                      <TableCell>
                        <Image
                          src={part.imageUrl}
                          alt={part.name}
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                          data-ai-hint={part.aiHint}
                        />
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        {part.name}
                        {customParts.some(p => p.id === part.id) && (
                            <Badge variant="outline" className="text-primary border-primary/50">
                                <Sparkles className="mr-1.5 size-3"/>
                                Custom
                            </Badge>
                        )}
                      </TableCell>
                      <TableCell>{part.description}</TableCell>
                      <TableCell className="text-right">${part.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

    