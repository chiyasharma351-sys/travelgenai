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
  Hotel,
  Plane,
  Thermometer,
  Shirt,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useUser, useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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

const InfoCard = ({
  title,
  icon,
  content,
}: {
  title: string;
  icon: React.ReactNode;
  content?: string;
}) => {
  if (!content) return null;
  
  const contentPreview = content.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*')).slice(0, 2).join('\n');
  const hasPreview = contentPreview.length > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <div className="bg-primary/10 p-3 rounded-full">{icon}</div>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {hasPreview ? (
             <ul className="text-muted-foreground space-y-1 list-disc pl-5">
                {contentPreview.split('\n').map((line, i) => (
                    <li key={i} className="truncate">{line.replace(/^- \s*/, '')}</li>
                ))}
             </ul>
        ) : (
            <p className="text-muted-foreground line-clamp-2">{content}</p>
        )}
      </CardContent>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="justify-self-end m-4 mt-0">
            View Details <ArrowRight className="ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
              {icon} {title}
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto pr-4">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

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
      
      <div className="space-y-4">
        <h3 className="text-2xl font-bold font-headline text-center">
          Trip Essentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Hotel Recommendations" icon={<Hotel className="w-6 h-6 text-primary" />} content={itinerary.hotel_recommendations} />
            <InfoCard title="Flight Recommendations" icon={<Plane className="w-6 h-6 text-primary" />} content={itinerary.flight_recommendations} />
            <InfoCard title="Weather Details" icon={<Thermometer className="w-6 h-6 text-primary" />} content={itinerary.weather_details} />
            <InfoCard title="Clothing Suggestions" icon={<Shirt className="w-6 h-6 text-primary" />} content={itinerary.clothing_suggestions} />
            <InfoCard title="Packing List" icon={<Briefcase className="w-6 h-6 text-primary" />} content={itinerary.packing_list} />
            <InfoCard title="Traveler Tips" icon={<Lightbulb className="w-6 h-6 text-primary" />} content={itinerary.tips} />
        </div>
      </div>

    </div>
  );
}
