'use server';

/**
 * @fileOverview Generates context-aware tips for a travel itinerary.
 *
 * - generateContextAwareTips - A function that generates travel tips based on the destination.
 * - GenerateContextAwareTipsInput - The input type for the generateContextAwareTips function.
 * - GenerateContextAwareTipsOutput - The return type for the generateContextAwareTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContextAwareTipsInputSchema = z.object({
  destination: z.string().describe('The destination for the travel itinerary.'),
});
export type GenerateContextAwareTipsInput = z.infer<typeof GenerateContextAwareTipsInputSchema>;

const GenerateContextAwareTipsOutputSchema = z.object({
  tips: z.string().describe('Context-aware tips about the safety and transportation options for the destination.'),
});
export type GenerateContextAwareTipsOutput = z.infer<typeof GenerateContextAwareTipsOutputSchema>;

export async function generateContextAwareTips(input: GenerateContextAwareTipsInput): Promise<GenerateContextAwareTipsOutput> {
  return generateContextAwareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContextAwareTipsPrompt',
  input: {schema: GenerateContextAwareTipsInputSchema},
  output: {schema: GenerateContextAwareTipsOutputSchema},
  prompt: `You are an expert travel guide providing essential tips for travelers.

  Based on the destination: {{{destination}}}, provide context-aware tips regarding safety precautions, local transportation options, and any other relevant advice to ensure a smooth and secure travel experience.
  Focus on practical information that travelers can use to navigate the destination effectively and stay safe during their trip.`,
});

const generateContextAwareTipsFlow = ai.defineFlow(
  {
    name: 'generateContextAwareTipsFlow',
    inputSchema: GenerateContextAwareTipsInputSchema,
    outputSchema: GenerateContextAwareTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
