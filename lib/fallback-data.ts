import type { SiteContentKey } from './types';

export const FALLBACK_CONTENT: Record<SiteContentKey, Record<string, unknown>> = {
  home: {
    welcome_heading: 'Where Curiosity Meets Character',
    welcome_body:
      'For over four decades, Dr. V. Genguswamy Naidu Matriculation Higher Secondary School has nurtured confident, curious, and compassionate learners. We blend a rigorous academic program with rich cultural and sporting traditions, helping every student find their own path to excellence.',
    highlights: [
      { icon: 'GraduationCap', heading: '100% Pass Rate', body: 'Consistent board results across higher-secondary streams.' },
      { icon: 'FlaskConical', heading: 'Modern Labs', body: 'Fully equipped science, computer, and language laboratories.' },
      { icon: 'Trophy', heading: '150+ Sporting Honors', body: 'District, state, and national laurels across athletics and games.' },
      { icon: 'Palette', heading: 'Vibrant Arts', body: 'Music, dance, drama, and visual arts woven into the school calendar.' },
    ],
    quick_links: [
      { label: 'Admissions Open', href: '/admissions', note: 'Apply for the new academic year' },
      { label: 'Explore Academics', href: '/academics', note: 'Streams, curriculum, and faculty' },
      { label: 'Upcoming Events', href: '/events', note: 'Sports day, cultural fest, and more' },
      { label: 'Visit Gallery', href: '/gallery', note: 'Moments from recent school life' },
    ],
  },
  about: {
    history:
      'Founded in 1982, Dr. V. Genguswamy Naidu Matriculation Higher Secondary School began as a small neighbourhood tutorial with a big conviction: that every child deserves an education rooted in dignity, discipline, and wonder. Over the years the campus expanded into a full matriculation institution, and in 1998 was upgraded to a higher secondary school offering state-board streams in science, commerce, and humanities.',
    mission:
      'Our mission is to cultivate independent thinkers and responsible citizens — students who reason clearly, act ethically, and contribute meaningfully to their communities. We commit to small class sizes, dedicated mentoring, and an inclusive culture where effort is celebrated as much as achievement.',
    management: [
      { name: 'Sri Raveendran Genguswamy', role: 'Correspondent' },
      { name: 'Smt. Nandhini Raveendran', role: 'Secretary' },
      { name: 'Smt. G. Venkatasree', role: 'Principal' },
    ],
  },
  academics: {
    streams: [
      {
        name: 'Science',
        subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'],
        description: 'A rigorous foundation for medicine, engineering, and research careers.',
      },
      {
        name: 'Commerce',
        subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Computer Science'],
        description: 'Prepares students for finance, management, and entrepreneurship.',
      },
      {
        name: 'Humanities',
        subjects: ['History', 'Geography', 'Political Science', 'Economics', 'English Literature'],
        description: 'Develops critical perspectives for law, civil services, and the arts.',
      },
    ],
    curriculum:
      'We follow the Tamil Nadu State Board curriculum, enriched with weekly enrichment modules in coding, public speaking, environmental studies, and classical arts. Continuous assessment, project work, and quarterly exhibitions complement board preparation.',
  },
  admissions: {
    process: [
      'Collect the prospectus and application form from the school office, or download it from this page.',
      'Submit the completed form with the student\'s birth certificate, transfer certificate, and recent photographs.',
      'Attend the interaction session with the child and parents on the scheduled date.',
      'Receive the admission confirmation and complete fee payment within seven working days.',
    ],
    forms: [
      { label: 'Application Form (PDF)', href: '#' },
      { label: 'Prospectus 2025 (PDF)', href: '#' },
    ],
  },
  contact: {
    address: 'Othakalmandapam, Coimbatore – 641032',
    phone: '8220012691, 9487545919',
    email: 'vgnprincipal@gmail.com',
    hours: 'Monday – Saturday, 8:30 AM to 4:00 PM',
    map_embed:
      'https://www.google.com/maps?q=Othakalmandapam,Coimbatore+641032&output=embed',
  },
};

export function getFallbackContent(key: SiteContentKey): Record<string, unknown> {
  return FALLBACK_CONTENT[key];
}
