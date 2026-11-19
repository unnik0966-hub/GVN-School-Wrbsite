'use client';

import { useEffect, useState } from 'react';
import { ScrollText, Target, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getFallbackContent } from '@/lib/fallback-data';

type ManagementMember = { name?: string; role?: string };

export function LiveAboutOverview({
  initialHistory,
  initialMission,
  initialManagement,
}: {
  initialHistory: string;
  initialMission: string;
  initialManagement: ManagementMember[];
}) {
  const [history, setHistory] = useState(initialHistory);
  const [mission, setMission] = useState(initialMission);
  const [management, setManagement] = useState<ManagementMember[]>(initialManagement);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_content')
      .select('content')
      .eq('content_key', 'about')
      .maybeSingle()
      .then(({ data }: { data: { content?: Record<string, unknown> } | null }) => {
        if (!active || !data?.content) return;
        const merged = { ...getFallbackContent('about'), ...data.content };
        setHistory(String(merged.history ?? ''));
        setMission(String(merged.mission ?? ''));
        if (Array.isArray(merged.management)) {
          setManagement(merged.management as ManagementMember[]);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-3">
      <article className="rounded-2xl border border-border bg-card p-7 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ScrollText className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-serif text-2xl font-semibold">History</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{history}</p>
      </article>

      <article className="rounded-2xl border border-border bg-card p-7 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Target className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-serif text-2xl font-semibold">Mission</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mission}</p>
      </article>

      <article className="rounded-2xl border border-border bg-card p-7 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-serif text-2xl font-semibold">Management</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {management.map((member, idx) => (
            <li key={idx} className="flex flex-col">
              <span className="font-medium text-foreground">{member.name}</span>
              <span className="text-xs text-muted-foreground">{member.role}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
