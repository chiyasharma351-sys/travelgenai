'use client';

import { useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { ItineraryDisplay } from '@/components/itinerary-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Itinerary } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TripDetailPage() {
  const { tripId } = useParams();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const tripDocRef = useMemoFirebase(() => {
    if (!firestore || !user || !tripId) return null;
    return doc(firestore, `users/${user.uid}/trips`, tripId as string);
  }, [firestore, user, tripId]);

  const { data: trip, isLoading, error } = useDoc<Itinerary>(tripDocRef);

  const renderContent = () => {
    if (isLoading || isUserLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <Alert variant="destructive" className="max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load trip details. You may not have permission to view this trip.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!user) {
      return (
        <div className="text-center">
          <p>Please log in to see your saved trips.</p>
          <Button asChild className="mt-4">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      );
    }

    if (!trip) {
      return (
        <Alert variant="destructive" className="max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Trip Not Found</AlertTitle>
          <AlertDescription>The requested trip could not be found.</AlertDescription>
        </Alert>
      );
    }

    return <ItineraryDisplay itinerary={trip} />;
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </>
  );
}
