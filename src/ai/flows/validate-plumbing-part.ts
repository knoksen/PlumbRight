'use server';
/**
 * @fileOverview Validates a plumbing part based on an image and description.
 *
 * - validatePlumbingPart - A function that handles the plumbing part validation process.
 * - ValidatePlumbingPartInput - The input type for the validatePlumbingPart function.
 * - ValidatePlumbingPartOutput - The return type for the validatePlumbingPart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidatePlumbingPartInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plumbing part, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the plumbing part.'),
});
export type ValidatePlumbingPartInput = z.infer<typeof ValidatePlumbingPartInputSchema>;

const ValidatePlumbingPartOutputSchema = z.object({
  partType: z.string().describe('The suggested type of the plumbing part.'),
  material: z.string().describe('The suggested material of the plumbing part.'),
  connectionType: z.string().describe('The suggested connection type of the plumbing part.'),
});
export type ValidatePlumbingPartOutput = z.infer<typeof ValidatePlumbingPartOutputSchema>;

export async function validatePlumbingPart(input: ValidatePlumbingPartInput): Promise<ValidatePlumbingPartOutput> {
  return validatePlumbingPartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validatePlumbingPartPrompt',
  input: {schema: ValidatePlumbingPartInputSchema},
  output: {schema: ValidatePlumbingPartOutputSchema},
  prompt: `You are an expert plumber specializing in identifying plumbing parts.

You will use this information to identify the part type, material, and connection type of the plumbing part.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Suggest the part type, material, and connection type.
`,
});

const validatePlumbingPartFlow = ai.defineFlow(
  {
    name: 'validatePlumbingPartFlow',
    inputSchema: ValidatePlumbingPartInputSchema,
    outputSchema: ValidatePlumbingPartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
