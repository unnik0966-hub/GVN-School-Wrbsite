import './globals.css';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { getSiteUrl } from '@/lib/site-url';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dr. V. Genguswamy Naidu Matriculation Higher Secondary School',
    template: '%s | Dr. V. Genguswamy Naidu MHSS',
  },
  description:
    'A matriculation higher secondary school in Othakalmandapam, Coimbatore nurturing confident, curious, and compassionate learners since 1982.',
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'PcmjStDsZb1ma0Sqn1BZrbAzgmN5WXs9r1b8XTCjoRw',
  },
  openGraph: {
    title: 'Dr. V. Genguswamy Naidu Matriculation Higher Secondary School',
    description:
      'A matriculation higher secondary school in Othakalmandapam, Coimbatore nurturing confident, curious, and compassionate learners since 1982.',
    url: `${siteUrl}/`,
    siteName: 'Dr. V. Genguswamy Naidu Matriculation Higher Secondary School',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/school-assembly-hero.jpg',
        alt: 'Dr. V. Genguswamy Naidu Matriculation Higher Secondary School campus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. V. Genguswamy Naidu Matriculation Higher Secondary School',
    description:
      'A matriculation higher secondary school in Othakalmandapam, Coimbatore nurturing confident, curious, and compassionate learners since 1982.',
    images: ['/images/school-assembly-hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const schoolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'School',
  name: 'Dr. V. Genguswamy Naidu Matriculation Higher Secondary School',
  alternateName: 'Dr. V. Genguswamy Naidu MHSS',
  url: siteUrl,
  logo: `${siteUrl}/images/WhatsApp_Image_2026-08-08_at_2.02.10_PM.jpeg`,
  image: `${siteUrl}/images/school-assembly-hero.jpg`,
  description:
    'Matriculation Higher Secondary School in Othakalmandapam, Coimbatore offering Pre-KG to Class XII education since 1982.',
  foundingDate: '1982',
  email: 'vgnprincipal@gmail.com',
  telephone: ['+91-8220012691', '+91-9487545919'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Othakalmandapam',
    addressLocality: 'Coimbatore',
    addressRegion: 'Tamil Nadu',
    postalCode: '641032',
    addressCountry: 'IN',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }}
        />
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
