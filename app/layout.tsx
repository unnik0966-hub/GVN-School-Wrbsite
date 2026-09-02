import './globals.css';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export const metadata: Metadata = {
  title: 'Dr. V. Genguswamy Naidu Matriculation Higher Secondary School',
  description:
    'A matriculation higher secondary school nurturing confident, curious, and compassionate learners since 1982.',

  verification: {
    google: 'PcmjStDsZb1ma0Sqn1BZrbAzgmN5WXs9r1b8XTCjoRw',
  },

  openGraph: {
    title: 'Dr. V. Genguswamy Naidu Matriculation Higher Secondary School',
    description:
      'A matriculation higher secondary school nurturing confident, curious, and compassionate learners since 1982.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
