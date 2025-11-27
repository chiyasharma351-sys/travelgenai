import type { GenerateDetailedItineraryOutput } from '@/ai/flows/generate-detailed-itinerary';
import { FieldValue } from 'firebase/firestore';

export type Itinerary = GenerateDetailedItineraryOutput & {
    id?: string;
    userId?: string;
    createdAt?: FieldValue;
    destination?: string;
};
