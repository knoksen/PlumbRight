
'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { partsData, Part } from '@/lib/data';
import { Upload, PlusCircle } from 'lucide-react';

const uniqueCategories = [...new Set(partsData.map(p => p.category))];

const formSchema = z.object({
  name: z.string().min(3, { message: 'Part name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  category: z.enum(uniqueCategories as [string, ...string[]], { required_error: 'Please select a category.' }),
  photo: z.any().optional(),
});

export default function AddCustomPartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [customParts, setCustomParts] = useLocalStorage<Part[]>('customParts', []);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
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
    const newPart: Part = {
      id: `custom-${crypto.randomUUID()}`,
      name: values.name,
      description: values.description,
      price: values.price,
      category: values.category,
      imageUrl: photoPreview || 'https://placehold.co/100x100.png',
      aiHint: values.name.toLowerCase(),
    };

    setCustomParts([...customParts, newPart]);

    toast({
      title: 'Part Created!',
      description: `${values.name} has been added to your parts library.`,
    });

    router.push('/parts');
  }

  return (
    <div className="flex flex-col gap-8">
       <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventor Part Builder</h1>
            <p className="text-muted-foreground">Add a new custom part to your personal library.</p>
        </div>
        <Card className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Create Custom Part</CardTitle>
              <CardDescription>Fill out the details for your new part below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Part Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Hyper-Sprocket" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" placeholder="$19.99" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {uniqueCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <Textarea placeholder="Describe the part and its use case..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="photo"
                render={() => (
                  <FormItem>
                    <FormLabel>Part Photo (Optional)</FormLabel>
                    <FormControl>
                      <>
                        <Input type="file" accept="image/*" className="hidden" id="file-upload" onChange={handleFileChange} />
                        <label
                          htmlFor="file-upload"
                          className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary"
                        >
                          {photoPreview ? (
                            <Image src={photoPreview} alt="Part preview" width={120} height={120} className="h-full w-auto object-contain p-2" />
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
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Part
                </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

