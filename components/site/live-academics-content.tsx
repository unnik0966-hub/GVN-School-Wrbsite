'use client';

import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getFallbackContent } from '@/lib/fallback-data';
import { resolveAssetUrl } from '@/lib/asset-url';
import type { StaffMember } from '@/lib/types';
import { SectionHeading } from '@/components/site/section-heading';

type StreamItem = { name?: string; subjects?: string[]; description?: string };
type FacultyItem = Pick<StaffMember, 'id' | 'name' | 'role' | 'department' | 'bio' | 'photo_url'>;

export function LiveAcademicsContent({
  initialStreams,
  initialCurriculum,
  initialFaculty,
}: {
  initialStreams: StreamItem[];
  initialCurriculum: string;
  initialFaculty: FacultyItem[];
}) {
  const [streams, setStreams] = useState<StreamItem[]>(initialStreams);
  const [curriculum, setCurriculum] = useState(initialCurriculum);
  const [faculty, setFaculty] = useState<FacultyItem[]>(initialFaculty);

  useEffect(() => {
    let active = true;
    Promise.all([
      supabase.from('site_content').select('content').eq('content_key', 'academics').maybeSingle(),
      supabase
        .from('staff')
        .select('id, name, role, department, bio, photo_url')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
        .limit(8),
    ]).then(([contentRes, staffRes]) => {
      if (!active) return;

      const contentData = contentRes.data?.content as Record<string, unknown> | undefined;
      if (contentData) {
        const merged = { ...getFallbackContent('academics'), ...contentData };
        if (Array.isArray(merged.streams)) setStreams(merged.streams as StreamItem[]);
        setCurriculum(String(merged.curriculum ?? ''));
      }

      if (Array.isArray(staffRes.data)) {
        setFaculty(staffRes.data as FacultyItem[]);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {streams.map((s, idx) => (
          <article
            key={idx}
            className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold">{s.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(s.subjects ?? []).map((subject) => (
                <li
                  key={subject}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {subject}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-secondary/30 p-7 sm:p-10">
        <h2 className="font-serif text-2xl font-semibold">Curriculum approach</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {curriculum}
        </p>
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Meet the faculty"
          title="Teaching staff"
          description="Subject specialists who coach, challenge, and care for every learner."
        />
        {faculty.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {faculty.map((f) => (
              <article
                key={f.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-serif text-lg font-semibold text-muted-foreground">
                  {f.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveAssetUrl(f.photo_url)}
                      alt={f.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    f.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
                  )}
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">{f.name}</h3>
                <p className="text-sm text-primary">{f.role}</p>
                {f.department && (
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {f.department}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
            Faculty profiles will be published here soon.
          </p>
        )}
      </section>
    </>
  );
}
