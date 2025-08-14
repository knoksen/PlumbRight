import { ValidationForm } from './validation-form';

export default function ValidatePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Part Validation</h1>
        <p className="text-muted-foreground">
          Upload a photo and description of a plumbing part to get AI-powered identification.
        </p>
      </div>
      <ValidationForm />
    </div>
  );
}
