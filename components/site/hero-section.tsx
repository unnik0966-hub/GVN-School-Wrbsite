import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

type HeroSectionProps = {
  heading: string;
  body: string;
};

export function HeroSection({ heading, body }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 via-background to-background py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Intro Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Est. 1982 · Coimbatore</span>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              {heading || 'Where Curiosity Meets Character'}
            </h1>

            <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              {body ||
                'For over four decades, Dr. V. Genguswamy Naidu Matriculation Higher Secondary School has nurtured confident, curious, and compassionate learners in Coimbatore.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-secondary"
            >
              <span>About the School</span>
            </Link>
          </div>
        </div>

        {/* Hero Showcase Image with medium circled emblem in the right side corner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {/* Main School Campus Photo with full clarity, exact aspect ratio and unaltered details */}
          <div className="relative w-full overflow-hidden bg-muted aspect-[16/9] sm:aspect-[16/9]">
            <Image
              src="/images/school-assembly-hero.jpg"
              alt="Dr. V. Genguswamy Naidu Matriculation Higher Secondary School Campus and Students Assembly"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Medium Circled Emblem in the right-side corner */}
          <div className="absolute right-3 top-3 sm:right-6 sm:top-6 z-10 flex flex-col items-center">
            <div className="group relative flex flex-col items-center">
              {/* Subtle ambient shadow */}
              <div className="absolute -inset-1 rounded-full bg-black/20 blur-sm" />

              {/* Medium circled emblem container */}
              <div className="relative h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 overflow-hidden rounded-full border-3 sm:border-4 border-white bg-slate-900 shadow-xl ring-2 sm:ring-3 ring-primary/40">
                <Image
                  src="/images/d2f7bd71-284f-4ea3-ae43-b8a9707730dc.png"
                  alt="Dr. V. Genguswamy Naidu - Founder & Visionary"
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
                  priority
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Founder Tag Badge */}
              <div className="relative -mt-2.5 sm:-mt-3.5 rounded-full border border-primary/30 bg-background/95 px-2.5 sm:px-3 py-0.5 sm:py-1 text-center shadow-md backdrop-blur-md">
                <p className="font-serif text-[10px] sm:text-xs font-bold text-foreground whitespace-nowrap">
                  Dr. V. Genguswamy Naidu
                </p>
                <p className="text-[8px] sm:text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                  Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

