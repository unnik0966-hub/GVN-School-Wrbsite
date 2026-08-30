import { cn } from '@/lib/utils';

type HighlightCardProps = {
  icon: React.ReactNode;
  heading: string;
  body: string;
  className?: string;
};

export function HighlightCard({ icon, heading, body, className }: HighlightCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md',
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <h3 className="mt-4 font-serif text-lg font-semibold">{heading}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
