"use client";

import { useState } from "react";
import Image from "next/image";
import { ItineraryForm } from "@/components/itinerary-form";
import { ItineraryDisplay } from "@/components/itinerary-display";
import { Header } from "@/components/header";
import { LoadingSpinner } from "@/components/loading-spinner";
import type { Itinerary } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-background");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center text-center text-white px-4">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
              Craft Your Next Adventure
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90">
              Let AI be your guide. Get personalized, detailed travel
              itineraries in seconds.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="-mt-24 md:-mt-32 relative z-20">
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
        </section>
      </main>
    </div>
  );
}
