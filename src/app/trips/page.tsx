'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Header } from '@/components/header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function TripsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const tripsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/trips`), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: trips, isLoading, error } = useCollection(tripsQuery);

  const renderContent = () => {
    if (isUserLoading || isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <p className="text-center text-destructive">Error loading trips: {error.message}</p>;
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

    if (trips && trips.length === 0) {
      return (
        <div className="text-center">
          <p>You haven't saved any trips yet.</p>
          <Button asChild className="mt-4">
            <Link href="/">Plan a New Trip</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips?.map((trip) => (
          <Card key={trip.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{trip.destination}</CardTitle>
              <CardDescription>{trip.trip_summary}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Badge>{trip.total_days} Days</Badge>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/trips/${trip.id}`}>
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Trips</h1>
        {renderContent()}
      </main>
    </>
  );
}
