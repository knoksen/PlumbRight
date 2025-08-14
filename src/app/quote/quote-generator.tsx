'use client';

import * as React from 'react';
import { partsData, type Part } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, X, Printer } from 'lucide-react';

interface QuotedItem extends Part {
  quantity: number;
}

interface CustomLineItem {
  id: string;
  description: string;
  amount: number;
}

export function QuoteGenerator() {
  const [quotedItems, setQuotedItems] = React.useState<QuotedItem[]>([]);
  const [selectedPart, setSelectedPart] = React.useState<string>('');
  const [customItems, setCustomItems] = React.useState<CustomLineItem[]>([]);
  
  const [markup, setMarkup] = React.useState(20);
  const [labor, setLabor] = React.useState(0);
  const [shipping, setShipping] = React.useState(0);
  const [taxRate, setTaxRate] = React.useState(8.5);

  const handleAddPart = () => {
    if (!selectedPart) return;
    const partToAdd = partsData.find((p) => p.id === selectedPart);
    if (!partToAdd) return;

    setQuotedItems((prev) => {
      const existing = prev.find((item) => item.id === partToAdd.id);
      if (existing) {
        return prev.map((item) => (item.id === partToAdd.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...partToAdd, quantity: 1 }];
    });
    setSelectedPart('');
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    const qty = Math.max(0, newQuantity);
    setQuotedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };
  
  const removeItem = (id: string) => {
    setQuotedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addCustomItem = () => {
    setCustomItems(prev => [...prev, { id: crypto.randomUUID(), description: '', amount: 0 }]);
  }

  const updateCustomItem = (id: string, field: 'description' | 'amount', value: string | number) => {
    setCustomItems(prev => prev.map(item => {
      if (item.id === id) {
        return {...item, [field]: value};
      }
      return item;
    }));
  }

  const removeCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
  }

  const partsSubtotal = quotedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const markedUpSubtotal = partsSubtotal * (1 + markup / 100);
  const customItemsTotal = customItems.reduce((acc, item) => acc + Number(item.amount), 0);
  const preTaxTotal = markedUpSubtotal + customItemsTotal + Number(labor) + Number(shipping);
  const taxAmount = preTaxTotal * (taxRate / 100);
  const grandTotal = preTaxTotal + taxAmount;
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="no-print">
            <CardHeader>
              <CardTitle>Parts & Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Select value={selectedPart} onValueChange={setSelectedPart}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a part to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {partsData.map((part) => (
                      <SelectItem key={part.id} value={part.id}>
                        {part.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddPart}>Add Part</Button>
              </div>
              <Separator className="my-4" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part</TableHead>
                    <TableHead className="w-[120px]">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotedItems.length > 0 ? (
                    quotedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="h-8 w-24"
                            min="0"
                          />
                        </TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No parts added to the quote yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="mt-6 no-print">
             <CardHeader>
                <CardTitle>Custom Line Items</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                {customItems.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <Input placeholder={`Custom Item ${index + 1}`} value={item.description} onChange={e => updateCustomItem(item.id, 'description', e.target.value)} />
                        <Input type="number" placeholder="Amount" className="w-32" value={item.amount} onChange={e => updateCustomItem(item.id, 'amount', Number(e.target.value))} />
                        <Button variant="ghost" size="icon" onClick={() => removeCustomItem(item.id)}><X className="h-4 w-4" /></Button>
                    </div>
                ))}
                </div>
                 <Button variant="outline" size="sm" className="mt-4" onClick={addCustomItem}><PlusCircle className="mr-2 h-4 w-4" />Add Custom Item</Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="no-print">
            <CardHeader>
              <CardTitle>Costs & Markups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="markup">Parts Markup (%)</Label>
                <Input id="markup" type="number" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="labor">Labor Cost ($)</Label>
                <Input id="labor" type="number" value={labor} onChange={(e) => setLabor(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping">Shipping/Misc ($)</Label>
                <Input id="shipping" type="number" value={shipping} onChange={(e) => setShipping(Number(e.target.value))} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="tax">Tax Rate (%)</Label>
                <Input id="tax" type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Parts Subtotal</span>
                <span>${partsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Markup ({markup}%)</span>
                <span>+ ${(markedUpSubtotal - partsSubtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor Cost</span>
                <span>${Number(labor).toFixed(2)}</span>
              </div>
               <div className="flex justify-between">
                <span>Shipping/Misc</span>
                <span>${Number(shipping).toFixed(2)}</span>
              </div>
              {customItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.description || 'Custom Item'}</span>
                  <span>${Number(item.amount).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Subtotal (Pre-tax)</span>
                <span>${preTaxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Taxes ({taxRate}%)</span>
                <span>+ ${taxAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="no-print">
               <Button className="w-full" onClick={handlePrint}><Printer className="mr-2 size-4" /> Export Bill of Materials</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="print-only">
        <div className="print-container">
            <h1 className="text-3xl font-bold mb-2">Bill of Materials</h1>
            <p className="text-muted-foreground mb-6">Generated by PlumbRight</p>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part</TableHead>
                    <TableHead className="w-[120px]">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">Parts Subtotal</TableCell>
                        <TableCell className="text-right font-bold">${partsSubtotal.toFixed(2)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <p className="text-right mt-8 text-sm text-muted-foreground">Total items: {quotedItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
        </div>
      </div>
    </>
  );
}
