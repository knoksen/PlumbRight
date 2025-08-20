
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Printer, ArrowLeft, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Part } from '@/lib/data';

interface QuotedItem extends Part {
  quantity: number;
}

interface BOMData {
    projectDetails: {
        projectName: string;
        projectNumber: string;
        customerName: string;
        quoteDate: string;
    };
    quotedItems: QuotedItem[];
    partsSubtotal: number;
}


export default function BillOfMaterialsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [bomData, setBomData] = React.useState<BOMData | null>(null);

    React.useEffect(() => {
        const data = sessionStorage.getItem('bomData');
        if (data) {
            setBomData(JSON.parse(data));
        } else {
            toast({
                title: 'No Bill of Materials Data Found',
                description: 'Redirecting you to the quote generator.',
                variant: 'destructive',
            });
            router.push('/quote');
        }
    }, [router, toast]);

    const handlePrint = () => {
        window.print();
    }
    
    if (!bomData) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <p className="text-muted-foreground">Loading Bill of Materials...</p>
            </div>
        )
    }

    const { projectDetails, quotedItems, partsSubtotal } = bomData;

    return (
        <div className="bg-muted/30 print:bg-white min-h-screen">
            <header className="no-print p-4 bg-background border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Quote
                    </Button>
                    <h1 className="text-xl font-semibold hidden md:block">Bill of Materials</h1>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 size-4" />
                        Print / Save PDF
                    </Button>
                </div>
            </header>
            <main className="p-4 sm:p-8">
                <div className="print-container bg-white p-6 sm:p-10 rounded-lg shadow-lg max-w-4xl mx-auto ring-1 ring-border" id="bom-to-print">
                    <header className="flex justify-between items-start mb-8 pb-4 border-b">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Wrench className="size-8 text-primary" />
                                <h1 className="text-3xl font-bold text-primary">PlumbRight</h1>
                            </div>
                            <p className="text-muted-foreground text-sm">Internal Bill of Materials</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-gray-700">{projectDetails.projectName || 'Untitled Project'}</h2>
                            <p className="text-muted-foreground">Quote #{projectDetails.projectNumber || 'N/A'}</p>
                            <p className="mt-2 text-sm">Date: {new Date(projectDetails.quoteDate).toLocaleDateString()}</p>
                        </div>
                    </header>
                    
                    <section>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100/80 text-sm uppercase">
                                    <TableHead className="w-[100px]">Part ID</TableHead>
                                    <TableHead>Part Name</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Line Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotedItems.map(item => (
                                    <TableRow key={item.id} className="text-sm">
                                        <TableCell className="font-mono text-xs px-4">{item.id}</TableCell>
                                        <TableCell className="font-medium px-4">{item.name}</TableCell>
                                        <TableCell className="text-center px-4">{item.quantity}</TableCell>
                                        <TableCell className="text-right px-4">${item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right px-4 font-medium">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                             <TableFooter>
                                <TableRow className="text-base font-bold">
                                    <TableCell colSpan={4}>Parts Subtotal</TableCell>
                                    <TableCell className="text-right">${partsSubtotal.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </section>
                    
                    <footer className="mt-12 pt-4 border-t text-center text-xs text-muted-foreground">
                        <p>Generated by PlumbRight | For Internal Use Only</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}

