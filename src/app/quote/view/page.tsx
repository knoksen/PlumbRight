'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
    const hasParts = quotedItems.length > 0;
    const hasCustomItems = customItems.length > 0;

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
            <div className="print-container bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto" id="quote-to-print">
                <header className="flex justify-between items-start mb-8 pb-4 border-b">
                    <div>
                         <div className="flex items-center gap-3 mb-4">
                            <Wrench className="size-8 text-primary" />
                            <h1 className="text-3xl font-bold text-primary">PlumbRight</h1>
                        </div>
                        <p className="text-muted-foreground text-sm">123 Plumber Lane, Suite 100</p>
                        <p className="text-muted-foreground text-sm">Anytown, USA 12345</p>
                        <p className="text-muted-foreground text-sm">contact@plumbright.pro</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-700">QUOTE</h2>
                        <p className="text-muted-foreground">#{projectDetails.projectNumber || 'N/A'}</p>
                        <p className="mt-2 text-sm">Date: {new Date(projectDetails.quoteDate).toLocaleDateString()}</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Quote For</h3>
                        <p className="font-bold">{projectDetails.customerName}</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{projectDetails.customerAddress}</p>
                    </div>
                     <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Project</h3>
                        <p className="font-bold">{projectDetails.projectName}</p>
                    </div>
                </section>
                
                 {projectDetails.scopeOfWork && (
                    <section className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Scope of Work</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap bg-gray-50 p-4 rounded-md">{projectDetails.scopeOfWork}</p>
                    </section>
                )}
                
                <section>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100 text-sm uppercase">
                                <TableHead className="w-[60%]">Description</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hasParts && (
                                 <TableRow className="bg-gray-50 font-semibold text-gray-600 text-xs">
                                    <TableCell colSpan={4} className="py-2 px-4">Parts & Materials</TableCell>
                                </TableRow>
                            )}
                            {quotedItems.map(item => (
                                <TableRow key={item.id} className="text-sm">
                                    <TableCell className="font-medium px-4">{item.name}</TableCell>
                                    <TableCell className="text-center px-4">{item.quantity}</TableCell>
                                    <TableCell className="text-right px-4">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right px-4 font-medium">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                 </TableRow>
                            ))}
                             {hasCustomItems && (
                                 <TableRow className="bg-gray-50 font-semibold text-gray-600 text-xs">
                                    <TableCell colSpan={4} className="py-2 px-4">Other Items</TableCell>
                                </TableRow>
                            )}
                            {customItems.map(item => (
                                <TableRow key={item.id} className="text-sm">
                                    <TableCell className="font-medium px-4">{item.description || "Custom Item"}</TableCell>
                                    <TableCell className="text-center px-4">-</TableCell>
                                    <TableCell className="text-right px-4">-</TableCell>
                                    <TableCell className="text-right px-4 font-medium">${Number(item.amount).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
                
                <section className="flex justify-end mt-8">
                    <div className="w-full max-w-sm space-y-3 text-sm">
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Parts Subtotal</span>
                            <span>${costs.partsSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Parts Markup ({costs.markup}%)</span>
                            <span>+ ${costs.markupAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Labor</span>
                            <span>${Number(costs.labor).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping/Misc.</span>
                            <span>${Number(costs.shipping).toFixed(2)}</span>
                        </div>
                         {customItems.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span className="text-muted-foreground">{item.description || 'Custom Item'}</span>
                                <span>${Number(item.amount).toFixed(2)}</span>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${costs.preTaxTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax ({costs.taxRate}%)</span>
                            <span>+ ${costs.taxAmount.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-2xl font-bold text-primary bg-primary/10 p-3 rounded-md">
                            <span>Grand Total</span>
                            <span>${costs.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
                <footer className="mt-12 pt-4 border-t text-center text-xs text-muted-foreground">
                    <p className="font-semibold">Thank you for your business!</p>
                    <p>Quote valid for 30 days. Terms and conditions may apply.</p>
                </footer>
            </div>
        </>
    );
}
