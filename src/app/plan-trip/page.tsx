'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { ItineraryForm } from '@/components/itinerary-form';
import { ItineraryDisplay } from '@/components/itinerary-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Itinerary } from '@/lib/types';

export default function PlanTripPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div id="plan-trip" className="scroll-mt-20">
          <ItineraryForm
            setItinerary={setItinerary}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        </div>

        <div className="mt-8 md:mt-12">
          {isLoading && <LoadingSpinner />}
          {error && (
            <Alert variant="destructive" className="max-w-3xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {itinerary && (
            <div className="animate-in fade-in-50 duration-500">
              <ItineraryDisplay itinerary={itinerary} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
