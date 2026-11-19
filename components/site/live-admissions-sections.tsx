'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, FileDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getFallbackContent } from '@/lib/fallback-data';

type FormLink = { label?: string; href?: string };

export function useLiveAdmissionsContent(initialProcess: string[], initialForms: FormLink[]) {
  const [process, setProcess] = useState<string[]>(initialProcess);
  const [forms, setForms] = useState<FormLink[]>(initialForms);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_content')
      .select('content')
      .eq('content_key', 'admissions')
      .maybeSingle()
      .then(({ data }: { data: { content?: Record<string, unknown> } | null }) => {
        if (!active || !data?.content) return;
        const merged = { ...getFallbackContent('admissions'), ...data.content };
        if (Array.isArray(merged.process)) setProcess(merged.process.map(String));
        if (Array.isArray(merged.forms)) setForms(merged.forms as FormLink[]);
      });
    return () => {
      active = false;
    };
  }, []);

  return { process, forms };
}

export function LiveAdmissionSteps({ initialProcess }: { initialProcess: string[] }) {
  const [process, setProcess] = useState<string[]>(initialProcess);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_content')
      .select('content')
      .eq('content_key', 'admissions')
      .maybeSingle()
      .then(({ data }: { data: { content?: Record<string, unknown> } | null }) => {
        if (!active || !data?.content) return;
        const merged = { ...getFallbackContent('admissions'), ...data.content };
        if (Array.isArray(merged.process)) setProcess(merged.process.map(String));
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-2xl font-semibold">4-Step Admission Procedure</h2>
      </div>
      <ol className="mt-6 space-y-4">
        {process.map((step, idx) => (
          <li key={idx} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm font-semibold text-primary-foreground">
              {idx + 1}
            </span>
            <p className="pt-1 text-sm leading-relaxed text-muted-foreground">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LiveAdmissionDownloads({ initialForms }: { initialForms: FormLink[] }) {
  const [forms, setForms] = useState<FormLink[]>(initialForms);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_content')
      .select('content')
      .eq('content_key', 'admissions')
      .maybeSingle()
      .then(({ data }: { data: { content?: Record<string, unknown> } | null }) => {
        if (!active || !data?.content) return;
        const merged = { ...getFallbackContent('admissions'), ...data.content };
        if (Array.isArray(merged.forms)) setForms(merged.forms as FormLink[]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <FileDown className="h-5 w-5 text-primary" />
        <h3 className="font-serif text-lg font-semibold">Prospectus &amp; Downloads</h3>
      </div>
      <ul className="mt-4 space-y-3">
        {forms.map((f, idx) => (
          <li key={idx}>
            <a
              href={f.href ?? '#'}
              className="group flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3 text-xs font-medium shadow-sm transition-all hover:border-primary/40 hover:bg-card"
            >
              <span className="flex items-center gap-2.5">
                <FileDown className="h-4 w-4 text-primary" />
                {f.label}
              </span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-primary">
                PDF
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
