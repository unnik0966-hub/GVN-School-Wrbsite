import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">404 Error</p>
      <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl text-foreground">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button asChild variant="default">
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admissions" className="gap-2">
            Admissions
          </Link>
        </Button>
      </div>
    </div>
  );
}
