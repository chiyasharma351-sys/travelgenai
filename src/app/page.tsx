"use client";

import Image from "next/image";
import Link from 'next/link';
import { Header } from "@/components/header";
import { Bot, Plane, Briefcase, UserCheck, Send, ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center">
    <CardHeader>
      <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
        {icon}
      </div>
      <CardTitle className="font-headline pt-2">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
);


export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-background");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white px-4">
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
          <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
            <Send className="w-20 h-20 text-primary mx-auto" />
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
              Welcome to TravelGenAI
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Let AI be your guide. Get personalized, detailed travel
              itineraries in seconds, complete with recommendations for flights, hotels, packing, and more. Your next adventure starts here.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/plan-trip">
                Start Planning Your Trip
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>

        <section id="features" className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-2 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Discover a smarter way to plan your travels. Our AI-powered platform simplifies trip planning into three easy steps.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <FeatureCard 
                icon={<Bot className="w-8 h-8 text-primary" />}
                title="AI-Powered Itineraries"
                description="Get hyper-personalized travel plans in seconds. Just enter your destination, dates, and budget."
              />
              <FeatureCard 
                icon={<Plane className="w-8 h-8 text-primary" />}
                title="Comprehensive Details"
                description="Receive day-by-day plans with activities, food suggestions, and local commute information."
              />
              <FeatureCard 
                icon={<Briefcase className="w-8 h-8 text-primary" />}
                title="Trip Essentials"
                description="We provide hotel/flight recommendations, weather forecasts, packing lists, and crucial travel tips."
              />
               <FeatureCard 
                icon={<UserCheck className="w-8 h-8 text-primary" />}
                title="Save & Access Trips"
                description="Create an account to save your generated itineraries and access them anytime, anywhere."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
