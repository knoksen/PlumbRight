
import { QuoteGenerator } from './quote-generator';

export default function QuotePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Quote Generator</h1>
        <p className="text-muted-foreground">
          Use the AI Assistant to get a head start, then build a detailed quote and generate a professional document for your clients.
        </p>
      </div>
      <QuoteGenerator />
    </div>
  );
}
