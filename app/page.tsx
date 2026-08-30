import Link from 'next/link';
import { ArrowRight, CalendarDays, Sparkles, GraduationCap, FlaskConical, Trophy, Palette } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getContent } from '@/lib/content';
import type { Announcement, SchoolEvent } from '@/lib/types';
import { HeroSection } from '@/components/site/hero-section';
import { HighlightCard } from '@/components/site/highlight-card';
import { SectionHeading } from '@/components/site/section-heading';
import { formatDate } from '@/lib/format';

const ICON_MAP: Record<string, typeof ArrowRight> = {
  GraduationCap,
  FlaskConical,
  Trophy,
  Palette,
};

export default async function Home() {
  const home = await getContent('home');
  const welcomeHeading = String(home.welcome_heading ?? '');
  const welcomeBody = String(home.welcome_body ?? '');
  const highlights = Array.isArray(home.highlights) ? home.highlights : [];
  const quickLinks = Array.isArray(home.quick_links) ? home.quick_links : [];

  const today = new Date().toISOString().slice(0, 10);
  const [{ data: events }, { data: announcements }] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, slug, event_date, description, location, cover_image_url')
      .eq('published', true)
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(3),
    supabase
      .from('announcements')
      .select('id, title, body, publish_date')
      .eq('published', true)
      .lte('publish_date', today)
      .order('publish_date', { ascending: false })
      .limit(3),
  ]);

  return (
    <div>
      <HeroSection heading={welcomeHeading} body={welcomeBody} />

      <section className="border-y border-border/70 bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {highlights.map((item, idx) => {
            const h = item as { icon?: string; heading?: string; body?: string };
            const Icon = ICON_MAP[h.icon ?? 'GraduationCap'] ?? ArrowRight;
            return (
              <HighlightCard
                key={idx}
                icon={<Icon className="h-6 w-6 text-primary" />}
                heading={h.heading ?? ''}
                body={h.body ?? ''}
              />
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Start here"
          title="Quick links for families"
          description="The most-visited pages, gathered in one place."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, idx) => {
            const l = link as { label?: string; href?: string; note?: string };
            return (
              <Link
                key={idx}
                href={l.href ?? '#'}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="font-serif text-lg font-semibold text-foreground">
                    {l.label}
                  </span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{l.note}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border/70 bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <SectionHeading
              eyebrow="What's coming up"
              title="Upcoming events"
              description="Sports days, cultural fests, examinations, and community gatherings."
            />
            <div className="mt-8 space-y-4">
              {events && events.length > 0 ? (
                events.map((event: any) => {
                  const e = event as Pick<
                    SchoolEvent,
                    'id' | 'title' | 'slug' | 'event_date' | 'description' | 'location'
                  >;
                  return (
                    <Link
                      key={e.id}
                      href={`/events#${e.slug}`}
                      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <CalendarDays className="h-5 w-5" />
                          <span className="mt-0.5 text-[11px] font-semibold">
                            {formatDate(e.event_date, { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-semibold group-hover:text-primary">
                            {e.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {e.description}
                          </p>
                          {e.location && (
                            <p className="mt-1 text-xs text-muted-foreground">{e.location}</p>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="hidden h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary sm:block" />
                    </Link>
                  );
                })
              ) : (
                <p className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                  No upcoming events are scheduled right now. Please check back soon.
                </p>
              )}
            </div>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              View all events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <SectionHeading eyebrow="Notice board" title="Announcements" />
            <div className="mt-8 space-y-4">
              {announcements && announcements.length > 0 ? (
                announcements.map((a: any) => {
                  const ann = a as Pick<Announcement, 'id' | 'title' | 'body' | 'publish_date'>;
                  return (
                    <article
                      key={ann.id}
                      className="rounded-xl border border-border bg-card p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        {formatDate(ann.publish_date)}
                      </div>
                      <h3 className="mt-2 font-serif text-base font-semibold">{ann.title}</h3>
                      <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                        {ann.body}
                      </p>
                    </article>
                  );
                })
              ) : (
                <p className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                  No announcements have been posted yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-accent px-6 py-12 text-primary-foreground shadow-md sm:px-12">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Admissions open for the new academic year
            </h2>
            <p className="mt-3 text-base text-primary-foreground/90">
              Begin your child&apos;s journey with a school that values character as much as achievement.
              Explore the process or send us an inquiry today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admissions"
                className="inline-flex items-center gap-1.5 rounded-md bg-background px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Admissions details
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-md border border-primary-foreground/40 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Contact the office
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
