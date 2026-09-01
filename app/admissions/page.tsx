import { getContent } from '@/lib/content';
import { SectionHeading } from '@/components/site/section-heading';
import { AdmissionApplicationForm } from '@/components/site/admission-application-form';
import { InquiryForm } from '@/components/site/inquiry-form';
import {
  FileDown,
  ClipboardList,
  Baby,
  GraduationCap,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Phone,
  Mail,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default async function AdmissionsPage() {
  const admissions = await getContent('admissions');
  const process = Array.isArray(admissions.process) ? admissions.process : [];
  const forms = Array.isArray(admissions.forms) ? admissions.forms : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <div>
        <SectionHeading
          eyebrow="Admissions 2025–2026"
          title="Apply for Admission"
          description="Nursery & Primary School to Higher Secondary (+1 & +2). Fill the complete application form below to submit directly to the school office."
        />

        {/* Quick Highlights Bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Baby className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nursery & Primary</p>
              <p className="text-sm font-bold text-foreground">Pre-KG to Class V</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Middle & High School</p>
              <p className="text-sm font-bold text-foreground">Classes VI to X (SSLC)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Higher Secondary</p>
              <p className="text-sm font-bold text-foreground">+1 & +2 Science / Commerce</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Direct Email</p>
              <p className="text-xs font-bold text-foreground truncate">vgnprincipal@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Online Application Form */}
      <section id="application-form">
        <AdmissionApplicationForm />
      </section>

      {/* Admission Guidelines, Age Eligibility & Document Checklist */}
      <div className="grid gap-10 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-12">
          {/* Age Eligibility Matrix */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl font-semibold">Age Criteria & Eligibility</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              As per Tamil Nadu State Education Department regulations for academic admission.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                    <th className="py-3 px-3 font-semibold">Grade / Stage</th>
                    <th className="py-3 px-3 font-semibold">Age as on 31st July</th>
                    <th className="py-3 px-3 font-semibold">Key Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-muted-foreground text-xs sm:text-sm">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-foreground">Pre-KG / Nursery</td>
                    <td className="py-3 px-3">2.5 to 3 Years</td>
                    <td className="py-3 px-3">Motor skills, play-way phonics, sensory development</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-foreground">L.K.G (Lower Kindergarten)</td>
                    <td className="py-3 px-3">3 to 4 Years</td>
                    <td className="py-3 px-3">Early literacy, numeracy, social interaction</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-foreground">U.K.G (Upper Kindergarten)</td>
                    <td className="py-3 px-3">4 to 5 Years</td>
                    <td className="py-3 px-3">Reading fluency, writing, foundational concepts</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-foreground">Class I (Primary)</td>
                    <td className="py-3 px-3">5+ Years</td>
                    <td className="py-3 px-3">Integrated curriculum, languages, math, activity learning</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-foreground">Class XI (+1 Higher Secondary)</td>
                    <td className="py-3 px-3">Passed 10th / SSLC / CBSE</td>
                    <td className="py-3 px-3">Stream specialization (Bio-Maths, CS-Maths, Commerce, CA)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Admission Process Steps */}
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
                  <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
                    {String(step)}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Documents Required Checklist */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-2xl font-semibold">Documents Required for Verification</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Please carry the original copies along with 2 sets of photocopies during the interaction session.
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Original Birth Certificate (Nursery & Primary)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Transfer Certificate (TC) from previous school</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Class 10th / SSLC Marksheet (for +1 admissions)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Community Certificate (if applicable)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Student & Parent Aadhaar Card copies</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>4 recent passport size color photographs</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Sidebar: Quick Inquiries & Downloadable forms */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="sticky top-24 space-y-8">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-serif text-xl font-semibold">Admission Helpline</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Have specific queries regarding seat availability or transport routes? Contact our office.
              </p>
              
              <div className="mt-4 space-y-2 text-sm">
                <a href="tel:8220012691" className="flex items-center gap-2 text-primary font-medium hover:underline">
                  <Phone className="h-4 w-4" /> 8220012691 / 9487545919
                </a>
                <a href="mailto:vgnprincipal@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Mail className="h-4 w-4" /> vgnprincipal@gmail.com
                </a>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <h3 className="text-sm font-semibold mb-2">Quick Inquiry Form</h3>
                <InquiryForm />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <FileDown className="h-5 w-5 text-primary" />
                <h3 className="font-serif text-lg font-semibold">Prospectus & Downloads</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {forms.map((form, idx) => {
                  const f = form as { label?: string; href?: string };
                  return (
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
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

