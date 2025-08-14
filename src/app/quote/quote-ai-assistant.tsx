'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, PlusCircle } from 'lucide-react';
import { suggestQuoteItems, type SuggestQuoteItemsOutput } from '@/ai/flows/suggest-quote-items';
import { partsData } from '@/lib/data';

interface QuoteAiAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (suggestion: SuggestQuoteItemsOutput) => void;
}

export function QuoteAiAssistant({ open, onOpenChange, onApply }: QuoteAiAssistantProps) {
  const [description, setDescription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<SuggestQuoteItemsOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description.trim()) {
        toast({
            variant: 'destructive',
            title: 'Description is empty',
            description: 'Please describe the project first.',
        });
        return;
    }
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestQuoteItems({ projectDescription: description });
      setSuggestion(result);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'The AI model could not process your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestion) {
        onApply(suggestion);
        onOpenChange(false);
        setSuggestion(null);
        setDescription('');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Quote Assistant</DialogTitle>
          <DialogDescription>
            Describe the plumbing job, and the AI will suggest parts, labor, and a scope of work to get you started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="project-description">Project Description</Label>
                    <Textarea
                        id="project-description"
                        placeholder="e.g., 'The customer has a leaky faucet in the master bathroom. It needs to be replaced with a new standard chrome faucet. Also, check the angle stops under the sink.'"
                        className="h-48"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Generate Suggestions
                </Button>
            </div>
            <div className="space-y-4">
                <h4 className="font-medium text-lg">Suggestions</h4>
                {isLoading && (
                    <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
                        <Loader2 className="size-10 animate-spin text-primary" />
                        <p>Generating... Please wait.</p>
                    </div>
                )}
                {suggestion && !isLoading && (
                    <div className="space-y-4 text-sm">
                        <div>
                            <h5 className="font-semibold mb-1">Suggested Parts</h5>
                            <ul className="list-disc list-inside text-muted-foreground bg-secondary p-3 rounded-md">
                                {suggestion.suggestedParts.map(part => {
                                    const partInfo = partsData.find(p => p.id === part.partId);
                                    return (
                                        <li key={part.partId}>{part.quantity}x - {partInfo?.name || part.partId}</li>
                                    )
                                })}
                                {suggestion.suggestedParts.length === 0 && <li>No specific parts suggested.</li>}
                            </ul>
                        </div>
                         <div>
                            <h5 className="font-semibold mb-1">Estimated Labor</h5>
                            <p className="text-muted-foreground bg-secondary p-3 rounded-md">{suggestion.estimatedLaborHours > 0 ? `${suggestion.estimatedLaborHours} hours` : 'Not specified'}</p>
                        </div>
                        <div>
                            <h5 className="font-semibold mb-1">Suggested Scope of Work</h5>
                            <p className="text-muted-foreground bg-secondary p-3 rounded-md">{suggestion.suggestedScopeOfWork}</p>
                        </div>
                    </div>
                )}
                 {!suggestion && !isLoading && (
                    <div className="flex items-center justify-center rounded-md border-dashed border-2 h-full text-muted-foreground">
                        <p>AI suggestions will appear here</p>
                    </div>
                 )}
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleApply} disabled={!suggestion || isLoading}>
            <PlusCircle className="mr-2 size-4" />
            Apply to Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
