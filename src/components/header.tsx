import { Send } from 'lucide-react';

export function Header() {
  return (
    <header className="p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center gap-2">
        <Send className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold font-headline text-foreground">
          TravelGenAI
        </h2>
      </div>
    </header>
  );
}
