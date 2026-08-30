import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone, GraduationCap } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/WhatsApp_Image_2026-08-08_at_2.02.10_PM.jpeg"
                alt="Dr. V. Genguswamy Naidu Matriculation Higher Secondary School logo"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div className="leading-tight">
                <p className="font-serif text-base font-semibold">
                  Dr. V. Genguswamy Naidu
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Matriculation Hr. Sec. School
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Nurturing confident, curious, and compassionate learners since 1982.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link className="hover:text-primary" href="/about">About the school</Link></li>
              <li><Link className="hover:text-primary" href="/academics">Academics</Link></li>
              <li><Link className="hover:text-primary" href="/admissions">Admissions</Link></li>
              <li><Link className="hover:text-primary" href="/events">Events</Link></li>
              <li><Link className="hover:text-primary" href="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Reach us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Othakalmandapam, Coimbatore – 641032
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                8220012691, 9487545919
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                vgnprincipal@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-primary" />
            {new Date().getFullYear()} Dr. V. Genguswamy Naidu Matriculation Higher Secondary School
          </p>
          <p>Excellence in education since 1982</p>
        </div>
      </div>
    </footer>
  );
}
