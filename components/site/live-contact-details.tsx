'use client';

import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getFallbackContent } from '@/lib/fallback-data';

export function LiveContactDetails({
  initialAddress,
  initialPhone,
  initialEmail,
  initialHours,
  initialMapEmbed,
}: {
  initialAddress: string;
  initialPhone: string;
  initialEmail: string;
  initialHours: string;
  initialMapEmbed: string;
}) {
  const [address, setAddress] = useState(initialAddress);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [hours, setHours] = useState(initialHours);
  const [mapEmbed, setMapEmbed] = useState(initialMapEmbed);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_content')
      .select('content')
      .eq('content_key', 'contact')
      .maybeSingle()
      .then(({ data }: { data: { content?: Record<string, unknown> } | null }) => {
        if (!active || !data?.content) return;
        const merged = { ...getFallbackContent('contact'), ...data.content };
        setAddress(String(merged.address ?? ''));
        setPhone(String(merged.phone ?? ''));
        setEmail(String(merged.email ?? ''));
        setHours(String(merged.hours ?? ''));
        setMapEmbed(String(merged.map_embed ?? ''));
      });
    return () => {
      active = false;
    };
  }, []);

  return (
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
              <ExternalLink className="h-4 w-4 text-primary" />
              Open in Google Maps
            </a>
          </div>
        ) : (
          <div className="flex h-[420px] items-center justify-center bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
            Campus map can be embedded by setting the contact map URL in the admin dashboard.
          </div>
        )}
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
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}
