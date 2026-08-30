import { getContent } from '@/lib/content';
import { SectionHeading } from '@/components/site/section-heading';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

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

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <ContactRow icon={<MapPin className="h-5 w-5" />} label="Address" value={address} />
          <ContactRow icon={<Phone className="h-5 w-5" />} label="Phone" value={phone} />
          <ContactRow
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            value={
              <a href={`mailto:${email}`} className="text-primary hover:underline">
                {email}
              </a>
            }
          />
          <ContactRow icon={<Clock className="h-5 w-5" />} label="Office hours" value={hours} />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
          {mapEmbed ? (
            <div className="relative">
              <iframe
                title="School location map"
                src={mapEmbed}
                className="h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://maps.app.goo.gl/HrLoaSGXVukvBmXx8"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-foreground shadow-md backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <MapPin className="h-4 w-4 text-primary" />
                Open in Google Maps
              </a>
            </div>
          ) : (
            <div className="flex h-[420px] items-center justify-center bg-secondary text-sm text-muted-foreground">
              Map unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
