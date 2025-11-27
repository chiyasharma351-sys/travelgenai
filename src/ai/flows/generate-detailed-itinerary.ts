'use server';

/**
 * @fileOverview Generates a detailed travel itinerary based on user inputs.
 *
 * - generateDetailedItinerary - A function that generates a detailed travel itinerary.
 * - GenerateDetailedItineraryInput - The input type for the generateDetailedItinerary function.
 * - GenerateDetailedItineraryOutput - The return type for the generateDetailedItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDetailedItineraryInputSchema = z.object({
  destination: z.string().describe('The destination for the trip.'),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('The start date of the trip (YYYY-MM-DD).'),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('The end date of the trip (YYYY-MM-DD).'),
  budget_type: z.enum(['economical', 'standard', 'luxury']).describe('The budget type for the trip.'),
  travellers: z.number().int().min(1).describe('The number of travellers.'),
  previous_itineraries: z.string().optional().describe('Previous travel itineraries to avoid repetition.'),
});

export type GenerateDetailedItineraryInput = z.infer<typeof GenerateDetailedItineraryInputSchema>;

const GenerateDetailedItineraryOutputSchema = z.object({
  trip_summary: z.string().describe('A summary of the trip.'),
  total_days: z.number().int().describe('The total number of days of the trip.'),
  itinerary: z.array(
    z.object({
      day: z.number().int().describe('The day number.'),
      title: z.string().describe('The title of the day.'),
      morning: z.string().describe('The morning activity.'),
      afternoon: z.string().describe('The afternoon activity.'),
      evening: z.string().describe('The evening activity.'),
      commute: z.string().describe('Local commute information.'),
      food: z.string().describe('Food recommendations.'),
      notes: z.string().describe('Additional notes and tips.'),
    })
  ).describe('The detailed day-wise itinerary.'),
  tips: z.string().describe('Weather, safety, and transport tips.'),
});

export type GenerateDetailedItineraryOutput = z.infer<typeof GenerateDetailedItineraryOutputSchema>;

export async function generateDetailedItinerary(input: GenerateDetailedItineraryInput): Promise<GenerateDetailedItineraryOutput> {
  return generateDetailedItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDetailedItineraryPrompt',
  input: {schema: GenerateDetailedItineraryInputSchema},
  output: {schema: GenerateDetailedItineraryOutputSchema},
  prompt: `You are TravelGenAI, an AI travel itinerary generator.

  Generate a highly detailed, realistic, day-wise travel itinerary based on the user’s input.

  Destination: {{{destination}}}
  From Date: {{{from_date}}}
  To Date: {{{to_date}}}
  Budget Type: {{{budget_type}}}
  Travellers: {{{travellers}}}

  Calculate the total number of days from from_date to to_date.

  Produce a clear, structured, day-wise itinerary.

  Each day must include:

  Morning activity
  Afternoon activity
  Evening activity
  Local commute info
  Food recommendations based on budget_type
  Cost-conscious suggestions for economical / comfort options for standard / premium experiences for luxury

  Provide weather, safety, and transport tips relevant for the destination.

  {{#if previous_itineraries}}
  Reference previous itineraries naturally—do NOT repeat them. Use them only to personalize recommendations.
  Previous Itineraries: {{{previous_itineraries}}}
  {{/if}}

  Maintain a friendly, travel-guide tone but ensure accuracy and helpfulness.

  Always output in the following JSON format:

  {
  "trip_summary": "...",
  "total_days": number,
  "itinerary": [
  {
  "day": 1,
  "title": "Day 1: ...",
  "morning": "...",
  "afternoon": "...",
  "evening": "...",
  "commute": "...",
  "food": "...",
  "notes": "..."
  }
  ],
  "tips": "..."
  }

  Your goal is to help the user plan the perfect trip based on their preferences.
  `,
});

const generateDetailedItineraryFlow = ai.defineFlow(
  {
    name: 'generateDetailedItineraryFlow',
    inputSchema: GenerateDetailedItineraryInputSchema,
    outputSchema: GenerateDetailedItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

