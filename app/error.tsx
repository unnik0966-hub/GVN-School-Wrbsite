'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App-level error caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-destructive">Notice</p>
      <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl text-foreground">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We encountered a temporary issue while loading this page. Please try refreshing or return to the home page.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button asChild variant="outline">
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
