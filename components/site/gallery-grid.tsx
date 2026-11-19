'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { GALLERY_CATEGORIES, isGalleryCategorySlug } from '@/lib/gallery-categories';
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
  const [clientPhotos, setClientPhotos] = useState<GalleryPhotoWithEvent[]>(photos);
  const [clientEvents, setClientEvents] = useState(events);
  const [activeEvent, setActiveEvent] = useState<string>('all');
  const [lightbox, setLightbox] = useState<GalleryPhotoWithEvent | null>(null);
  const eventsRef = useRef(events);

  useEffect(() => {
    eventsRef.current = events;
    setClientPhotos(photos);
    setClientEvents(events);
  }, [photos, events]);

  useEffect(() => {
    let active = true;
    supabase
      .from('gallery_photos')
      .select('id, event_id, storage_path, public_url, caption, created_at, event:events ( id, title, slug, event_date )')
      .order('created_at', { ascending: false })
      .then(({ data }: { data: any[] | null }) => {
        if (!active || !data) return;
        const categoryIdSet = new Set<string>(GALLERY_CATEGORIES.map((c) => c.id));
        const normalized: GalleryPhotoWithEvent[] = data
          .map((p) => ({
            id: p.id,
            event_id: p.event_id,
            public_url: p.public_url,
            caption: p.caption,
            created_at: p.created_at,
            event: Array.isArray(p.event) ? p.event[0] ?? null : (p.event ?? null),
          }))
          .filter((p) => isGalleryCategorySlug(p.event?.slug) || categoryIdSet.has(p.event_id));
        setClientPhotos(normalized);
        const categoryEvents = GALLERY_CATEGORIES.map((cat) => {
          const matched = normalized.find((p) => p.event?.slug === cat.slug)?.event;
          const fallback = eventsRef.current.find((e) => e.slug === cat.slug);
          return {
            id: matched ? matched.id : fallback ? fallback.id : cat.slug,
            title: cat.title,
            slug: cat.slug,
            event_date: '',
          };
        });
        setClientEvents(categoryEvents);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      activeEvent === 'all'
        ? clientPhotos
        : clientPhotos.filter(
            (p) => p.event_id === activeEvent || p.event?.slug === activeEvent
          ),
    [clientPhotos, activeEvent]
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
        {clientEvents.map((event) => (
          <FilterButton
            key={event.id}
            active={activeEvent === event.id}
            onClick={() => setActiveEvent(event.id)}
          >
            {event.title}
          </FilterButton>
        ))}
      </div>

      {filtered.length > 0 ? (
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
                alt={photo.caption || 'Annual Day photo'}
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
      ) : (
        <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No photos have been uploaded in this category yet.
        </p>
      )}

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
              alt={lightbox.caption || 'Annual Day photo'}
              className="max-h-[80vh] w-full object-contain"
            />
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
              <span className="text-muted-foreground">
                {lightbox.event?.title ?? 'Annual Day'}
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
