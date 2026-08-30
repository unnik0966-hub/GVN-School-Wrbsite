import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

type HeroSectionProps = {
  heading: string;
  body: string;
};

export function HeroSection({ heading, body }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary/95">
      {/* Background School Campus Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/51409c9e-5c41-455d-9f96-9ea3775f1f7f.png"
          alt="Dr. V. Genguswamy Naidu Matric Higher Secondary School Campus"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Deep contrast overlay for pristine typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/80" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Heading, Subtitle & Action Links */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Est. 1982 · Coimbatore</span>
            </div>

            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
              {heading || 'Where Curiosity Meets Character'}
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-200">
              {body ||
                'For over four decades, Dr. V. Genguswamy Naidu Matriculation Higher Secondary School has nurtured confident, curious, and compassionate learners in Coimbatore.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition-all hover:bg-amber-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5"
              >
                <span>About the School</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Medium Circled Emblem */}
          <div className="flex justify-center lg:col-span-4 lg:justify-end">
            <div className="group relative flex flex-col items-center">
              {/* Outer decorative ring aura */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-400/30 to-white/20 blur-md transition-all group-hover:blur-lg" />
              
              {/* Circled Emblem Container */}
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 lg:h-56 lg:w-56 overflow-hidden rounded-full border-4 border-amber-300/80 bg-slate-900 shadow-2xl ring-4 ring-white/20">
                <Image
                  src="/images/d2f7bd71-284f-4ea3-ae43-b8a9707730dc.png"
                  alt="Dr. V. Genguswamy Naidu"
                  fill
                  sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 224px"
                  priority
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Founder Tag under Emblem */}
              <div className="relative -mt-4 rounded-full border border-amber-300/50 bg-slate-950/90 px-4 py-1.5 text-center shadow-lg backdrop-blur-md">
                <p className="font-serif text-xs sm:text-sm font-semibold text-amber-200 whitespace-nowrap">
                  Dr. V. Genguswamy Naidu
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-300">
                  Founder &amp; Visionary
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

