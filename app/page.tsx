import { supabase } from '@/lib/supabase';
import { getContent } from '@/lib/content';
import type { Announcement, SchoolEvent } from '@/lib/types';
import { isGalleryCategorySlug } from '@/lib/gallery-categories';
import { LiveHomeContent } from '@/components/site/live-home-content';

export default async function Home() {
  const home = await getContent('home');
  const welcomeHeading = String(home.welcome_heading ?? '');
  const welcomeBody = String(home.welcome_body ?? '');
  const highlights = Array.isArray(home.highlights)
    ? (home.highlights as Array<{ icon?: string; heading?: string; body?: string }>)
    : [];
  const quickLinks = Array.isArray(home.quick_links)
    ? (home.quick_links as Array<{ label?: string; href?: string; note?: string }>)
    : [];

  const today = new Date().toISOString().slice(0, 10);
  const [{ data: rawEvents }, { data: rawAnnouncements }] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, slug, event_date, description, location, cover_image_url')
      .eq('published', true)
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(12),
    supabase
      .from('announcements')
      .select('id, title, body, publish_date')
      .eq('published', true)
      .lte('publish_date', today)
      .order('publish_date', { ascending: false })
      .limit(3),
  ]);

  const events = ((rawEvents ?? []) as Pick<
    SchoolEvent,
    'id' | 'title' | 'slug' | 'event_date' | 'description' | 'location'
  >[])
    .filter((e) => !isGalleryCategorySlug(e.slug))
    .slice(0, 3);

  const announcements = (rawAnnouncements ?? []) as Pick<
    Announcement,
    'id' | 'title' | 'body' | 'publish_date'
  >[];

  return (
    <LiveHomeContent
      initialHeading={welcomeHeading}
      initialBody={welcomeBody}
      initialHighlights={highlights}
      initialQuickLinks={quickLinks}
      initialEvents={events}
      initialAnnouncements={announcements}
    />
  );
}
