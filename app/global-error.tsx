'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root layout error caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-destructive">Application Notice</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            An unexpected error occurred. You can reload the application using the button below.
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => reset()}>
              Refresh Application
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
