'use server';

import { generateDetailedItinerary, type GenerateDetailedItineraryInput } from '@/ai/flows/generate-detailed-itinerary';
import type { Itinerary } from '@/lib/types';

export async function getItinerary(input: GenerateDetailedItineraryInput): Promise<{ data: Itinerary | null, error: string | null }> {
  try {
    const itinerary = await generateDetailedItinerary(input);
    if (!itinerary) {
      return { data: null, error: 'The AI failed to generate an itinerary. Please try again.' };
    }
    return { data: itinerary, error: null };
  } catch (e) {
    console.error('Error generating itinerary:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `An unexpected error occurred while generating your itinerary. ${errorMessage}` };
  }
}
