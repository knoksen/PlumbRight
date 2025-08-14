
import { QuoteGenerator } from './quote-generator';

export default function QuotePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Quote Generator</h1>
        <p className="text-muted-foreground">
          Build detailed quotes, calculate costs, and generate a professional quote for your clients.
        </p>
      </div>
      <QuoteGenerator />
    </div>
  );
}
