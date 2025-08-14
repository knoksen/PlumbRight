'use server';
/**
 * @fileOverview Suggests quote line items, labor, and scope based on a project description.
 *
 * - suggestQuoteItems - A function that handles the quote suggestion process.
 * - SuggestQuoteItemsInput - The input type for the suggestQuoteItems function.
 * - SuggestQuoteItemsOutput - The return type for the suggestQuoteItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { partsData } from '@/lib/data';

const SuggestQuoteItemsInputSchema = z.object({
  projectDescription: z.string().describe('A description of the plumbing project.'),
});
export type SuggestQuoteItemsInput = z.infer<typeof SuggestQuoteItemsInputSchema>;

const SuggestedPartSchema = z.object({
    partId: z.string().describe("The ID of the suggested part from the provided parts list."),
    quantity: z.number().describe("The suggested quantity for this part."),
});

const SuggestQuoteItemsOutputSchema = z.object({
  suggestedParts: z.array(SuggestedPartSchema).describe('A list of parts suggested for the project.'),
  estimatedLaborHours: z.number().describe('An estimate of the labor hours required.'),
  suggestedScopeOfWork: z.string().describe('A detailed, customer-facing scope of work based on the project description and suggested parts.'),
});
export type SuggestQuoteItemsOutput = z.infer<typeof SuggestQuoteItemsOutputSchema>;


export async function suggestQuoteItems(input: SuggestQuoteItemsInput): Promise<SuggestQuoteItemsOutput> {
  return suggestQuoteItemsFlow(input);
}

const availableParts = partsData.map(p => ({id: p.id, name: p.name, description: p.description, category: p.category})).slice(0, 50); // Limit context size

const prompt = ai.definePrompt({
  name: 'suggestQuoteItemsPrompt',
  input: {schema: SuggestQuoteItemsInputSchema},
  output: {schema: SuggestQuoteItemsOutputSchema},
  prompt: `You are an expert plumbing estimator. Your task is to analyze a project description and create a list of required parts, estimate labor, and write a scope of work.

Project Description:
"{{{projectDescription}}}"

Based on the description, please do the following:

1.  **Suggest Parts**: From the available parts list below, identify the necessary parts and their quantities. Only select parts from this list. Be realistic with quantities.
2.  **Estimate Labor**: Estimate the total labor hours required to complete the job.
3.  **Write Scope of Work**: Generate a clear, customer-friendly "Scope of Work" that details the tasks to be performed. This should be a paragraph, not a list.

Available Parts (do not use parts not on this list):
\`\`\`json
${JSON.stringify(availableParts, null, 2)}
\`\`\`
`,
});

const suggestQuoteItemsFlow = ai.defineFlow(
  {
    name: 'suggestQuoteItemsFlow',
    inputSchema: SuggestQuoteItemsInputSchema,
    outputSchema: SuggestQuoteItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
