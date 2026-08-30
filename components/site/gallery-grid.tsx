'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { GalleryPhoto, SchoolEvent } from '@/lib/types';
import { X } from 'lucide-react';

type GalleryPhotoWithEvent = Pick<
  GalleryPhoto,
  'id' | 'event_id' | 'public_url' | 'caption' | 'created_at'
> & {
  event: Pick<SchoolEvent, 'id' | 'title' | 'slug' | 'event_date'> | null;
};

type GalleryGridProps = {
  photos: GalleryPhotoWithEvent[];
  events: Pick<SchoolEvent, 'id' | 'title' | 'slug' | 'event_date'>[];
};

export function GalleryGrid({ photos, events }: GalleryGridProps) {
  const [activeEvent, setActiveEvent] = useState<string>('all');
  const [lightbox, setLightbox] = useState<GalleryPhotoWithEvent | null>(null);

  const filtered = useMemo(
    () =>
      activeEvent === 'all'
        ? photos
        : photos.filter((p) => p.event_id === activeEvent),
    [photos, activeEvent]
  );

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={activeEvent === 'all'}
          onClick={() => setActiveEvent('all')}
        >
          All photos
        </FilterButton>
        {events.map((event) => (
          <FilterButton
            key={event.id}
            active={activeEvent === event.id}
            onClick={() => setActiveEvent(event.id)}
          >
            {event.title}
          </FilterButton>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setLightbox(photo)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.public_url}
              alt={photo.caption || 'School event photo'}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
            {photo.caption && (
              <p className="absolute inset-x-0 bottom-0 p-3 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {photo.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <figure
            className="max-h-[90vh] max-w-4xl overflow-hidden rounded-xl bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.public_url}
              alt={lightbox.caption || 'School event photo'}
              className="max-h-[80vh] w-full object-contain"
            />
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
              <span className="text-muted-foreground">
                {lightbox.event?.title ?? 'School event'}
              </span>
              {lightbox.caption && (
                <span className="font-medium">{lightbox.caption}</span>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary'
      )}
    >
      {children}
    </button>
  );
}
