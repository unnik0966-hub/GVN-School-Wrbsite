import Image from 'next/image';

type HeroSectionProps = {
  heading: string;
  body: string;
};

export function HeroSection({ heading, body }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.pexels.com/photos/3231359/pexels-photo-3231359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Students in a classroom"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/65 to-accent/70" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground backdrop-blur">
            Est. 1982 · Coimbatore
          </span>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-primary-foreground text-balance sm:text-5xl lg:text-6xl">
            {heading || 'Where curiosity meets character'}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/90">
            {body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/admissions"
              className="inline-flex items-center gap-2 rounded-md bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Apply for admission
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/40 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              About the school
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
