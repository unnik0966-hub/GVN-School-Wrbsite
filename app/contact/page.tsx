import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { SectionHeading } from '@/components/site/section-heading';
import { LiveContactDetails } from '@/components/site/live-contact-details';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Dr. V. Genguswamy Naidu Matriculation Higher Secondary School. Find campus address, contact numbers, email, and visiting hours.',
  alternates: {
    canonical: '/contact',
  },
};

export default async function ContactPage() {
  const contact = await getContent('contact');
  const address = String(contact.address ?? '');
  const phone = String(contact.phone ?? '');
  const email = String(contact.email ?? '');
  const hours = String(contact.hours ?? '');
  const mapEmbed = String(contact.map_embed ?? '');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Get in touch"
        title="Contact the school"
        description="Visit, call, or write to us — our office is open Monday through Saturday."
      />

      <LiveContactDetails
        initialAddress={address}
        initialPhone={phone}
        initialEmail={email}
        initialHours={hours}
        initialMapEmbed={mapEmbed}
      />
    </div>
  );
}
