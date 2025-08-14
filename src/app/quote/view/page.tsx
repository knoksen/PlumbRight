'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Printer, ArrowLeft, Wrench } from 'lucide-react';

// This is a simplified type definition for the quote data.
// In a real app, this would likely be a more complex type.
interface QuoteData {
    projectDetails: {
        projectName: string;
        projectNumber: string;
        customerName: string;
        customerAddress: string;
        quoteDate: string;
        scopeOfWork: string;
    };
    quotedItems: {
        id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    customItems: {
        id: string;
        description: string;
        amount: number;
    }[];
    costs: {
        partsSubtotal: number;
        markup: number;
        markupAmount: number;
        labor: number;
        shipping: number;
        preTaxTotal: number;
        taxRate: number;
        taxAmount: number;
        grandTotal: number;
    };
}


export default function QuoteViewPage() {
    const router = useRouter();
    const [quoteData, setQuoteData] = React.useState<QuoteData | null>(null);

    React.useEffect(() => {
        const data = sessionStorage.getItem('quoteData');
        if (data) {
            setQuoteData(JSON.parse(data));
        } else {
            // If there's no data, maybe redirect back to the generator
            router.push('/quote');
        }
    }, [router]);

    const handlePrint = () => {
        window.print();
    }
    
    if (!quoteData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading quote...</p>
            </div>
        )
    }

    const { projectDetails, quotedItems, customItems, costs } = quoteData;

    return (
        <>
            <div className="no-print mb-6 flex justify-between items-center">
                <Button variant="outline" onClick={() => router.push('/quote')}>
                    <ArrowLeft className="mr-2 size-4" />
                    Back to Editor
                </Button>
                <h1 className="text-2xl font-bold">Quote Preview</h1>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 size-4" />
                    Print / Save PDF
                </Button>
            </div>
            <div className="print-container bg-white p-8 rounded-lg shadow-lg" id="quote-to-print">
                <header className="flex justify-between items-start mb-8 pb-4 border-b">
                    <div>
                         <div className="flex items-center gap-3 mb-4">
                            <Wrench className="size-8 text-primary" />
                            <h1 className="text-3xl font-bold text-primary">PlumbRight</h1>
                        </div>
                        <p className="text-muted-foreground">123 Plumber Lane, Suite 100</p>
                        <p className="text-muted-foreground">Anytown, USA 12345</p>
                        <p className="text-muted-foreground">contact@plumbright.pro</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-700">QUOTE</h2>
                        <p className="text-muted-foreground">#{projectDetails.projectNumber || 'N/A'}</p>
                        <p className="mt-2">Date: {new Date(projectDetails.quoteDate).toLocaleDateString()}</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Quote For</h3>
                        <p className="font-bold">{projectDetails.customerName}</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{projectDetails.customerAddress}</p>
                    </div>
                     <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Project</h3>
                        <p className="font-bold">{projectDetails.projectName}</p>
                    </div>
                </section>
                
                 {projectDetails.scopeOfWork && (
                    <section className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Scope of Work</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{projectDetails.scopeOfWork}</p>
                    </section>
                )}
                
                <section>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="w-[60%]">Description</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotedItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                             {customItems.length > 0 && (
                                 <TableRow>
                                    <TableCell colSpan={4} className="py-2 px-2 font-semibold bg-gray-50">Custom Items</TableCell>
                                </TableRow>
                            )}
                            {customItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.description || "Custom Item"}</TableCell>
                                    <TableCell className="text-center">-</TableCell>
                                    <TableCell className="text-right">-</TableCell>
                                    <TableCell className="text-right">${Number(item.amount).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
                
                <section className="flex justify-end mt-8">
                    <div className="w-full max-w-sm space-y-3">
                         <div className="flex justify-between">
                            <span>Parts Subtotal</span>
                            <span>${costs.partsSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Parts Markup ({costs.markup}%)</span>
                            <span>+ ${costs.markupAmount.toFixed(2)}</span>
                        </div>
                         <Separator />
                        <div className="flex justify-between">
                            <span>Labor</span>
                            <span>${Number(costs.labor).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping/Misc.</span>
                            <span>${Number(costs.shipping).toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span>Subtotal</span>
                            <span>${costs.preTaxTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax ({costs.taxRate}%)</span>
                            <span>+ ${costs.taxAmount.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-2xl font-bold text-primary bg-primary/10 p-2 rounded-md">
                            <span>Grand Total</span>
                            <span>${costs.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
                <footer className="mt-12 pt-4 border-t text-center text-xs text-muted-foreground">
                    <p>Thank you for your business!</p>
                    <p>Quote valid for 30 days. Terms and conditions apply.</p>
                </footer>
            </div>
        </>
    );
}
