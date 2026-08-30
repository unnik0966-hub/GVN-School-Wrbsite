import { supabase } from '@/lib/supabase';
import { getContent } from '@/lib/content';
import type { StaffMember } from '@/lib/types';
import { SectionHeading } from '@/components/site/section-heading';
import { BookOpen } from 'lucide-react';

export default async function AcademicsPage() {
  const academics = await getContent('academics');
  const streams = Array.isArray(academics.streams) ? academics.streams : [];
  const curriculum = String(academics.curriculum ?? '');

  const { data: faculty } = await supabase
    .from('staff')
    .select('id, name, role, department, bio, photo_url')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .limit(8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Academics"
        title="Streams, curriculum & faculty"
        description="A balanced program that prepares students for board excellence and life beyond it."
      />

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {streams.map((stream, idx) => {
          const s = stream as {
            name?: string;
            subjects?: string[];
            description?: string;
          };
          return (
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
          );
        })}
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
        {faculty && faculty.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {faculty.map((row: any) => {
              const f = row as Pick<
                StaffMember,
                'id' | 'name' | 'role' | 'department' | 'bio' | 'photo_url'
              >;
              return (
                <article
                  key={f.id}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-serif text-lg font-semibold text-muted-foreground">
                    {f.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={f.photo_url}
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
              );
            })}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
            Faculty profiles will be published here soon.
          </p>
        )}
      </section>
    </div>
  );
}
