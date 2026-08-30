import { supabase } from '@/lib/supabase';
import { getContent } from '@/lib/content';
import { SectionHeading } from '@/components/site/section-heading';
import { InquiryForm } from '@/components/site/inquiry-form';
import { FileDown, ClipboardList } from 'lucide-react';

export default async function AdmissionsPage() {
  const admissions = await getContent('admissions');
  const process = Array.isArray(admissions.process) ? admissions.process : [];
  const forms = Array.isArray(admissions.forms) ? admissions.forms : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Join us"
        title="Admissions"
        description="Everything you need to apply, from process to forms."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-12">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl font-semibold">Admission process</h2>
            </div>
            <ol className="mt-6 space-y-4">
              {process.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm font-semibold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
                    {String(step)}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <FileDown className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl font-semibold">Downloadable forms</h2>
            </div>
            <ul className="mt-6 space-y-3">
              {forms.map((form, idx) => {
                const f = form as { label?: string; href?: string };
                return (
                  <li key={idx}>
                    <a
                      href={f.href ?? '#'}
                      className="group inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                    >
                      <FileDown className="h-4 w-4 text-primary" />
                      {f.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold">Admission inquiry</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Share a few details and our admissions office will reach out to you.
            </p>
            <InquiryForm />
          </div>
        </aside>
      </div>
    </div>
  );
}
