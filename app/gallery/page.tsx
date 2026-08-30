import { Mail, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { GalleryPhoto, SchoolEvent } from '@/lib/types';
import { SectionHeading } from '@/components/site/section-heading';
import { GalleryGrid } from '@/components/site/gallery-grid';

const GALLERY_EMAIL = 'vgnprincipal@gmail.com';

export default async function GalleryPage() {
  const { data } = await supabase
    .from('gallery_photos')
    .select(
      'id, event_id, storage_path, public_url, caption, created_at, event:id ( id, title, slug, event_date )'
    )
    .order('created_at', { ascending: false });

  const rawPhotos = (data ?? []) as unknown as Array<{
    id: string;
    event_id: string;
    storage_path: string;
    public_url: string;
    caption: string;
    created_at: string;
    event: Array<Pick<SchoolEvent, 'id' | 'title' | 'slug' | 'event_date'>> | null;
  }>;

  const photos = rawPhotos.map((p) => ({
    id: p.id,
    event_id: p.event_id,
    storage_path: p.storage_path,
    public_url: p.public_url,
    caption: p.caption,
    created_at: p.created_at,
    event: Array.isArray(p.event) ? p.event[0] ?? null : null,
  }));

  const events = Array.from(
    new Map(
      photos
        .filter((p) => p.event)
        .map((p) => [p.event!.id, p.event!])
    ).values()
  ).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Moments"
        title="Gallery"
        description="Photos from school events, curated by our staff. Filter by event to explore."
      />

      {photos.length > 0 ? (
        <GalleryGrid photos={photos} events={events} />
      ) : (
        <p className="mt-12 rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          The gallery will be updated as event photos are published by our staff.
        </p>
      )}

      <div className="mt-16 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/40 p-8 sm:p-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Camera className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              Share Your Photos
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Have photos from a school event you&apos;d like to see featured in our
              gallery? Send them to our dedicated gallery email and our staff will
              review and publish them.
            </p>
            <a
              href={`mailto:${GALLERY_EMAIL}?subject=Gallery%20Photo%20Submission`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Mail className="h-4 w-4" />
              {GALLERY_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
