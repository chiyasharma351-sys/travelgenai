import type { Itinerary } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  ClipboardList,
  Lightbulb,
  Moon,
  Save,
  Sun,
  Sunrise,
  TramFront,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useUser, useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const ActivityCard = ({
  title,
  icon,
  content,
}: {
  title: string;
  icon: React.ReactNode;
  content: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="text-primary mt-1">{icon}</div>
    <div>
      <h4 className="font-semibold text-foreground">{title}</h4>
      <p className="text-muted-foreground">{content}</p>
    </div>
  </div>
);

export function ItineraryDisplay({ itinerary }: { itinerary: Itinerary }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleSaveTrip = async () => {
        if (!user || !firestore) {
            toast({
                variant: 'destructive',
                title: 'Not Logged In',
                description: 'You must be logged in to save a trip.',
            });
            return;
        }

        const tripData = {
            ...itinerary,
            userId: user.uid,
            createdAt: serverTimestamp(),
        };
        
        const tripsCollectionRef = collection(firestore, `users/${user.uid}/trips`);
        addDocumentNonBlocking(tripsCollectionRef, tripData)
          .then(() => {
              toast({
                  title: 'Trip Saved!',
                  description: 'Your itinerary has been saved to your account.',
              });
          })
          .catch((error) => {
              console.error("Failed to save trip:", error);
              toast({
                  variant: "destructive",
                  title: "Save Failed",
                  description: "Could not save your trip. Please try again."
              });
          });
    };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-3xl">
                    Your Trip to {(itinerary as any).destination || itinerary.trip_summary.split(' to ')[1]?.split(' for ')[0] || 'your destination!'}
                </CardTitle>
                <CardDescription>{itinerary.trip_summary}</CardDescription>
            </div>
            {user && (
                <Button onClick={handleSaveTrip} size="lg">
                    <Save className="mr-2 h-4 w-4" /> Save Trip
                </Button>
            )}
        </CardHeader>
        <CardContent className="p-6">
          <Badge>{itinerary.total_days} Days</Badge>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-2xl font-bold font-headline mb-4 text-center">
          Daily Plan
        </h3>
        <Accordion type="single" collapsible defaultValue="item-0">
          {itinerary.itinerary.map((day, index) => (
            <AccordionItem value={`item-${index}`} key={day.day}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-base">
                    Day {day.day}
                  </Badge>
                  <span>{day.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ActivityCard title="Morning" icon={<Sunrise />} content={day.morning} />
                    <ActivityCard title="Afternoon" icon={<Sun />} content={day.afternoon} />
                    <ActivityCard title="Evening" icon={<Moon />} content={day.evening} />
                    <ActivityCard title="Food" icon={<UtensilsCrossed />} content={day.food} />
                    <ActivityCard title="Commute" icon={<TramFront />} content={day.commute} />
                    <ActivityCard title="Notes" icon={<ClipboardList />} content={day.notes} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <Lightbulb className="w-6 h-6 text-primary" />
          <CardTitle className="font-headline text-2xl">
            Traveler Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{itinerary.tips}</p>
        </CardContent>
      </Card>
    </div>
  );
}
