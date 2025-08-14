import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { partsData } from '@/lib/data';

export default function PartsLibraryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parts Library</h1>
        <p className="text-muted-foreground">Browse and search our extensive catalog of plumbing parts.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Parts</CardTitle>
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
              {partsData.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>
                    <Image
                      src={part.imageUrl}
                      alt={part.name}
                      width={64}
                      height={64}
                      className="rounded-md"
                      data-ai-hint={part.aiHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{part.name}</TableCell>
                  <TableCell>{part.description}</TableCell>
                  <TableCell className="text-right">${part.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
