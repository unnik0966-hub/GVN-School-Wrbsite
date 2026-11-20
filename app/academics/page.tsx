import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { getContent } from '@/lib/content';
import type { StaffMember } from '@/lib/types';
import { SectionHeading } from '@/components/site/section-heading';
import { LiveAcademicsContent } from '@/components/site/live-academics-content';

export const metadata: Metadata = {
  title: 'Academics & Curriculum',
  description: 'Explore academic streams, curriculum, faculty, and educational programs at Dr. V. Genguswamy Naidu MHSS.',
  alternates: {
    canonical: '/academics',
  },
  openGraph: {
    title: 'Academics & Curriculum | Dr. V. Genguswamy Naidu MHSS',
    description: 'Explore academic streams, curriculum, faculty, and educational programs at Dr. V. Genguswamy Naidu MHSS.',
    url: '/academics',
    type: 'website',
    images: [{ url: '/images/gallery/annual-day-academics.jpg', alt: 'Academics at Dr. V. Genguswamy Naidu MHSS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academics & Curriculum | Dr. V. Genguswamy Naidu MHSS',
    description: 'Explore academic streams, curriculum, faculty, and educational programs at Dr. V. Genguswamy Naidu MHSS.',
    images: ['/images/gallery/annual-day-academics.jpg'],
  },
};

export default async function AcademicsPage() {
  const academics = await getContent('academics');
  const streams = Array.isArray(academics.streams)
    ? (academics.streams as Array<{ name?: string; subjects?: string[]; description?: string }>)
    : [];
  const curriculum = String(academics.curriculum ?? '');

  const { data: faculty } = await supabase
    .from('staff')
    .select('id, name, role, department, bio, photo_url')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .limit(8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Academics"
        title="Streams, curriculum & faculty"
        description="A balanced program that prepares students for board excellence and life beyond it."
      />

      <LiveAcademicsContent
        initialStreams={streams}
        initialCurriculum={curriculum}
        initialFaculty={(faculty ?? []) as Pick<
          StaffMember,
          'id' | 'name' | 'role' | 'department' | 'bio' | 'photo_url'
        >[]}
      />
    </div>
  );
}
