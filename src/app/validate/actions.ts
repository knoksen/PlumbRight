'use server';

import { validatePlumbingPart, ValidatePlumbingPartInput, ValidatePlumbingPartOutput } from '@/ai/flows/validate-plumbing-part';

export async function handleValidation(input: ValidatePlumbingPartInput): Promise<ValidatePlumbingPartOutput> {
  try {
    const output = await validatePlumbingPart(input);
    return output;
  } catch (error) {
    console.error("Error in server action:", error);
    throw new Error("Failed to validate plumbing part.");
  }
}
