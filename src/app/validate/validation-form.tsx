'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { handleValidation } from './actions';
import type { ValidatePlumbingPartOutput } from '@/ai/flows/validate-plumbing-part';
import { Upload, Wand2, CheckCircle, Info, Loader2 } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Please provide a more detailed description (at least 10 characters).',
  }),
  photo: z.any().refine((file) => file, 'A photo is required.'),
});

type ValidationResult = ValidatePlumbingPartOutput & {
  photoUrl: string;
};

export function ValidationForm() {
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      photo: null,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(values.photo);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const validationResult = await handleValidation({
          description: values.description,
          photoDataUri: photoDataUri,
        });
        setResult({ ...validationResult, photoUrl: photoDataUri });
      } catch (error) {
        console.error('Validation failed:', error);
        toast({
          variant: 'destructive',
          title: 'Validation Failed',
          description: 'The AI model could not process your request. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected image file.',
        });
        setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Submit for Validation</CardTitle>
              <CardDescription>Upload an image and describe the part below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="photo"
                render={() => (
                  <FormItem>
                    <FormLabel>Part Photo</FormLabel>
                    <FormControl>
                      <>
                        <Input type="file" accept="image/*" className="hidden" id="file-upload" onChange={handleFileChange} />
                        <label
                          htmlFor="file-upload"
                          className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary"
                        >
                          {photoPreview ? (
                            <Image src={photoPreview} alt="Part preview" width={160} height={160} className="h-full w-auto object-contain" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <Upload className="size-8" />
                              <span>Click or drag to upload image</span>
                            </div>
                          )}
                        </label>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'A metal valve with a red handle, looks like it connects to copper pipe...'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Validate Part
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Validation Results</CardTitle>
          <CardDescription>AI-powered suggestions will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
              <Loader2 className="size-12 animate-spin text-primary" />
              <p>Analyzing part... Please wait.</p>
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
              <Info className="size-12" />
              <p>Results will be shown here after submission.</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
                <div className="flex justify-center">
                    <Image src={result.photoUrl} alt="Validated part" width={200} height={200} className="rounded-lg object-contain shadow-md" />
                </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 size-5 shrink-0 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Part Type</h3>
                    <p className="text-muted-foreground">{result.partType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 size-5 shrink-0 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Material</h3>
                    <p className="text-muted-foreground">{result.material}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 size-5 shrink-0 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Connection Type</h3>
                    <p className="text-muted-foreground">{result.connectionType}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground">
              Disclaimer: AI suggestions are for reference only. Always verify part compatibility and specifications.
        </CardFooter>
      </Card>
    </div>
  );
}
