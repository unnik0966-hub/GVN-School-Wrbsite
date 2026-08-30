import { supabase } from '@/lib/supabase';
import type { SchoolEvent } from '@/lib/types';
import { SectionHeading } from '@/components/site/section-heading';
import { formatDate } from '@/lib/format';
import { CalendarDays, MapPin } from 'lucide-react';

export default async function EventsPage() {
  const { data } = await supabase
    .from('events')
    .select('id, title, slug, event_date, description, location, cover_image_url')
    .eq('published', true)
    .order('event_date', { ascending: true });

  const events = (data ?? []) as Pick<
    SchoolEvent,
    'id' | 'title' | 'slug' | 'event_date' | 'description' | 'location' | 'cover_image_url'
  >[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="School calendar"
        title="Events"
        description="Sports days, cultural festivals, examinations, and community gatherings throughout the year."
      />

      {events.length > 0 ? (
        <div className="mt-12 space-y-6">
          {events.map((event) => (
            <article
              key={event.id}
              id={event.slug}
              className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md md:grid-cols-[200px_1fr]"
            >
              <div className="relative min-h-[160px] w-full bg-secondary md:min-h-0">
                {event.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[160px] w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15">
                    <CalendarDays className="h-10 w-10 text-primary/60" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-primary">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(event.event_date, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  {event.location && (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-2xl font-semibold">{event.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No events have been published yet. Please check back soon.
        </p>
      )}
    </div>
  );
}
