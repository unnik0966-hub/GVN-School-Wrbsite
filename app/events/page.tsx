import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import type { SchoolEvent } from '@/lib/types';
import { SectionHeading } from '@/components/site/section-heading';
import { isGalleryCategorySlug } from '@/lib/gallery-categories';
import { LiveEventsList } from '@/components/site/live-events-list';

export const metadata: Metadata = {
  title: 'School Events & Calendar',
  description: 'Upcoming school events, celebrations, sports meets, cultural programs, and academic calendar at Dr. V. Genguswamy Naidu MHSS.',
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'School Events & Calendar | Dr. V. Genguswamy Naidu MHSS',
    description: 'Upcoming school events, celebrations, sports meets, cultural programs, and academic calendar at Dr. V. Genguswamy Naidu MHSS.',
    url: '/events',
    type: 'website',
    images: [{ url: '/images/gallery/annual-day-events.jpg', alt: 'School Events at Dr. V. Genguswamy Naidu MHSS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Events & Calendar | Dr. V. Genguswamy Naidu MHSS',
    description: 'Upcoming school events, celebrations, sports meets, cultural programs, and academic calendar at Dr. V. Genguswamy Naidu MHSS.',
    images: ['/images/gallery/annual-day-events.jpg'],
  },
};

export default async function EventsPage() {
  const { data } = await supabase
    .from('events')
    .select('id, title, slug, event_date, description, location, cover_image_url')
    .eq('published', true)
    .order('event_date', { ascending: true });

  const events = ((data ?? []) as Pick<
    SchoolEvent,
    'id' | 'title' | 'slug' | 'event_date' | 'description' | 'location' | 'cover_image_url'
  >[]).filter((e) => !isGalleryCategorySlug(e.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="School calendar"
        title="Events"
        description="Sports days, cultural festivals, examinations, and community gatherings throughout the year."
      />

      <LiveEventsList initialEvents={events} />
    </div>
  );
}
