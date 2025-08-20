
'use client';

import * as React from 'react';
import { partsData, type Part } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, X, Printer, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { QuoteAiAssistant } from './quote-ai-assistant';
import type { SuggestQuoteItemsOutput } from '@/ai/flows/suggest-quote-items';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface QuotedItem extends Part {
  quantity: number;
}

interface CustomLineItem {
  id: string;
  description: string;
  amount: number;
}

interface ProjectDetails {
    projectName: string;
    projectNumber: string;
    customerName: string;
    customerAddress: string;
    quoteDate: string;
    scopeOfWork: string;
}

export function QuoteGenerator() {
  const router = useRouter();
  const [quotedItems, setQuotedItems] = React.useState<QuotedItem[]>([]);
  const [selectedPart, setSelectedPart] = React.useState<string>('');
  const [customItems, setCustomItems] = React.useState<CustomLineItem[]>([]);
  
  const [markup, setMarkup] = React.useState(20);
  const [labor, setLabor] = React.useState(0);
  const [shipping, setShipping] = React.useState(0);
  const [taxRate, setTaxRate] = React.useState(8.5);

  const [projectDetails, setProjectDetails] = React.useState<ProjectDetails>({
      projectName: '',
      projectNumber: `Q-${Math.floor(Date.now() / 1000)}`,
      customerName: '',
      customerAddress: '',
      quoteDate: new Date().toISOString().split('T')[0],
      scopeOfWork: '',
  });

  const [customParts] = useLocalStorage<Part[]>('customParts', []);
  const allParts = React.useMemo(() => [...partsData, ...customParts], [customParts]);
  const [, setQuotesCreatedCount] = useLocalStorage<number>('quotesCreatedCount', 0);


  React.useEffect(() => {
    const studioPartsData = sessionStorage.getItem('studioQuoteData');
    if (studioPartsData) {
        try {
            const studioItems: QuotedItem[] = JSON.parse(studioPartsData);
            setQuotedItems(studioItems);
            // Clear the data so it doesn't persist on refresh
            sessionStorage.removeItem('studioQuoteData');
        } catch (error) {
            console.error("Could not parse studio quote data:", error);
            sessionStorage.removeItem('studioQuoteData');
        }
    }
  }, []);

  const handleApplySuggestion = (suggestion: SuggestQuoteItemsOutput) => {
    // Add suggested parts
    const newItems: QuotedItem[] = [];
    suggestion.suggestedParts.forEach(suggestedPart => {
        const partInfo = allParts.find(p => p.id === suggestedPart.partId);
        if (partInfo) {
            newItems.push({ ...partInfo, quantity: suggestedPart.quantity });
        }
    });
    setQuotedItems(prev => {
        const updated = [...prev];
        newItems.forEach(newItem => {
            const existingIndex = updated.findIndex(i => i.id === newItem.id);
            if (existingIndex > -1) {
                updated[existingIndex].quantity += newItem.quantity;
            } else {
                updated.push(newItem);
            }
        });
        return updated;
    });

    if (suggestion.estimatedLaborHours > 0) {
      setLabor(prev => prev + (suggestion.estimatedLaborHours * 125)); // Assuming a default rate
    }

    setProjectDetails(prev => ({
        ...prev,
        scopeOfWork: suggestion.suggestedScopeOfWork
    }));
  };

  const handleProjectDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setProjectDetails(prev => ({...prev, [id]: value}));
  }

  const handleAddPart = () => {
    if (!selectedPart) return;
    const partToAdd = allParts.find((p) => p.id === selectedPart);
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
  
  const handlePrintBOM = () => {
    const bomData = { quotedItems, partsSubtotal };
    sessionStorage.setItem('bomData', JSON.stringify(bomData));
    const url = `/quote/bill-of-materials`;
    window.open(url, '_blank');
  };

  const handleGenerateQuote = () => {
      const quoteData = {
          projectDetails,
          quotedItems,
          customItems,
          costs: {
              partsSubtotal,
              markup,
              markupAmount: markedUpSubtotal - partsSubtotal,
              labor: Number(labor),
              shipping: Number(shipping),
              customItemsTotal,
              preTaxTotal,
              taxRate,
              taxAmount,
              grandTotal
          }
      };
      sessionStorage.setItem('quoteData', JSON.stringify(quoteData));
      setQuotesCreatedCount(prev => prev + 1);
      router.push('/quote/view');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">

        <QuoteAiAssistant onApply={handleApplySuggestion} />

        <Card>
          <CardHeader>
            <CardTitle>Parts & Materials</CardTitle>
              <CardDescription>Add parts from your library to the quote.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Select value={selectedPart} onValueChange={setSelectedPart}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a part to add" />
                </SelectTrigger>
                <SelectContent>
                  {allParts.map((part) => (
                    <SelectItem key={part.id} value={part.id}>
                      {part.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddPart} disabled={!selectedPart}>Add Part</Button>
            </div>
            <Separator className="my-4" />
            <div className="max-h-96 overflow-y-auto">
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
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No parts added to the quote yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
          <Card>
            <CardHeader>
              <CardTitle>Custom Line Items</CardTitle>
              <CardDescription>Add custom services or charges that are not in your parts library.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-2">
              {customItems.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2">
                      <Input placeholder={`Custom Item ${index + 1}`} value={item.description} onChange={e => updateCustomItem(item.id, 'description', e.target.value)} />
                      <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input type="number" placeholder="Amount" className="w-36 pl-6" value={item.amount} onChange={e => updateCustomItem(item.id, 'amount', Number(e.target.value))} />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeCustomItem(item.id)}><X className="h-4 w-4" /></Button>
                  </div>
              ))}
              </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={addCustomItem}><PlusCircle className="mr-2 h-4 w-4" />Add Custom Item</Button>
          </CardContent>
        </Card>

      </div>

      {/* Right Column */}
      <div className="space-y-6">

          <Card>
          <CardHeader>
              <CardTitle>Project & Customer</CardTitle>
                <CardDescription>Enter the details for this quote.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input id="projectName" value={projectDetails.projectName} onChange={handleProjectDetailChange} placeholder="e.g., Master Bathroom Remodel" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="projectNumber">Project Number</Label>
                    <Input id="projectNumber" value={projectDetails.projectNumber} onChange={handleProjectDetailChange} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="quoteDate">Quote Date</Label>
                    <Input id="quoteDate" type="date" value={projectDetails.quoteDate} onChange={handleProjectDetailChange} />
                </div>
              </div>
              <div className="space-y-1">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" value={projectDetails.customerName} onChange={handleProjectDetailChange} placeholder="e.g., Jane Smith" />
              </div>
              <div className="space-y-1">
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Textarea id="customerAddress" value={projectDetails.customerAddress} onChange={handleProjectDetailChange} placeholder="e.g., 123 Main St, Anytown, USA" />
              </div>
                <div className="space-y-1">
                  <Label htmlFor="scopeOfWork">Scope of Work</Label>
                  <Textarea id="scopeOfWork" value={projectDetails.scopeOfWork} onChange={handleProjectDetailChange} placeholder="Describe the work to be performed..." className="h-24" />
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Costs & Markups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="markup">Parts Markup (%)</Label>
              <Input id="markup" type="number" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="labor">Labor Cost ($)</Label>
              <Input id="labor" type="number" value={labor} onChange={(e) => setLabor(Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="shipping">Shipping/Misc ($)</Label>
              <Input id="shipping" type="number" value={shipping} onChange={(e) => setShipping(Number(e.target.value))} />
            </div>
              <div className="space-y-1">
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
          <CardFooter className="flex-col gap-2">
              <Button className="w-full" onClick={handleGenerateQuote}><FileText className="mr-2 size-4" /> Generate Quote</Button>
              <Button className="w-full" variant="outline" onClick={handlePrintBOM}><Printer className="mr-2 size-4" /> Export Bill of Materials</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
