'use client';

import Link from 'next/link';
import { Send, LogOut, LogIn, UserPlus, NotebookText } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Send className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold font-headline text-foreground">
            TravelGenAI
          </h2>
        </Link>
        
        <div className="flex items-center gap-2">
          {isUserLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/trips">
                  <NotebookText />
                  My Trips
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/signup">
                  <UserPlus />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
