import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { SectionHeading } from '@/components/site/section-heading';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the history, mission, management, and achievements of Dr. V. Genguswamy Naidu Matriculation Higher Secondary School.',
  alternates: {
    canonical: '/about',
  },
};
import {
  Users,
  Target,
  ScrollText,
  Trophy,
  Award,
  Medal,
  Sparkles,
  Quote,
} from 'lucide-react';

export default async function AboutPage() {
  const about = await getContent('about');
  const history = String(about.history ?? '');
  const mission = String(about.mission ?? '');
  const management = Array.isArray(about.management) ? about.management : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Our story"
        title="About the school"
        description="A matriculation higher secondary school rooted in dignity, discipline, and wonder."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ScrollText className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-semibold">History</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{history}</p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-semibold">Mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mission}</p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-7 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-semibold">Management</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {management.map((m, idx) => {
              const member = m as { name?: string; role?: string };
              return (
                <li key={idx} className="flex flex-col">
                  <span className="font-medium text-foreground">{member.name}</span>
                  <span className="text-xs text-muted-foreground">{member.role}</span>
                </li>
              );
            })}
          </ul>
        </article>
      </div>

      {/* Our Special Moments */}
      <section className="mt-16">
        <SectionHeading
          eyebrow="Celebrating excellence"
          title="Our Special Moments"
          description="A glimpse of the achievements and milestones that make our school proud."
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <MomentCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Warm Welcome to KG Kids"
          >
            Welcomed the KG kids with great enthusiasm along with the event
            management team.
          </MomentCard>

          <MomentCard
            icon={<Trophy className="h-5 w-5" />}
            title="Annual Day Celebration"
          >
            Annual Day function has been celebrated with great pomp and show.
          </MomentCard>

          <MomentCard
            icon={<Award className="h-5 w-5" />}
            title="Pattam Inter-School Quiz Competition"
          >
            Our students A. Caitlyn Litvinah and Neha S of IX std secured the
            third prize in the Pattam Inter-School Level Quiz Competition and
            were awarded a tablet.
          </MomentCard>

          <MomentCard
            icon={<Award className="h-5 w-5" />}
            title="Tamilodu Vilayadu Season 3"
          >
            Our students participated in Tamilodu Vilayadu Season 3, conducted by
            Kalaignar TV, and their performance was featured in Episode 9,
            telecast from Chennai.
          </MomentCard>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <AchievementCard
            icon={<Medal className="h-5 w-5" />}
            title="State Level Open Speed Skating"
            highlights={[
              { label: 'Gold Medals', count: '6' },
              { label: 'Silver Medals', count: '7' },
              { label: 'Bronze Medals', count: '8' },
            ]}
          >
            Our champions glided to glory, winning an impressive tally of medals.
          </AchievementCard>

          <AchievementCard
            icon={<Medal className="h-5 w-5" />}
            title="Goju Ryu Karate — National Open Championship"
            highlights={[
              { label: 'I Prize', count: '4' },
              { label: 'II Prize', count: '5' },
              { label: 'III Prize', count: '20' },
            ]}
          >
            Held at Vidya Sagar College of Arts &amp; Science, Udumalpet.
          </AchievementCard>

          <AchievementCard
            icon={<Medal className="h-5 w-5" />}
            title="Silambam — District &amp; National Level"
            highlights={[
              { label: 'I Prize', count: '2' },
              { label: 'II Prize', count: '3' },
              { label: 'III Prize', count: '1' },
            ]}
          >
            Our students received prizes at both district and national level
            silambam competitions.
          </AchievementCard>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/40 p-7">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-xl font-semibold">Sports &amp; Athletics</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Our students secured numerous medals and prizes in various athletic
            events and games at the Madhukkarai Zonal and District Level
            competitions. Our student secured the runner-up position in the
            State-Level Kabaddi Open Meet held in Karur.
          </p>
        </div>
      </section>

      {/* Academic Achievements */}
      <section className="mt-16">
        <SectionHeading
          eyebrow="Excellence in academics"
          title="Academic Achievements 2024–2025"
          description="Board exam toppers and consistent 100% results in X & XII std."
        />

        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="text-sm font-semibold text-primary">
            Consistent 100% Results in X Std &amp; XII Std
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <TopperCard
            title="XII Std Toppers"
            toppers={[
              { rank: 'I', name: 'Jothikaa M.R', score: '590/600', group: 'Science Group' },
              { rank: 'II', name: 'Jacob Wilson P', score: '585/600', group: 'Science Group' },
              { rank: 'III', name: 'Mahesh V', score: '581/600', group: 'Science Group' },
              { rank: 'III', name: 'Kalaiselvi S', score: '581/600', group: 'Arts Group' },
            ]}
          />
          <TopperCard
            title="X Std Toppers"
            toppers={[
              { rank: 'I', name: 'Ravina Sirvi K & Sangamithra S', score: '493/500', group: '' },
              { rank: 'II', name: 'Saruhasini S', score: '488/500', group: '' },
              { rank: 'III', name: 'Avanthica A', score: '487/500', group: '' },
            ]}
          />
          <TopperCard
            title="XI Std Toppers"
            toppers={[
              { rank: 'I', name: 'Dhanya M', score: '583/600', group: 'Science Group' },
              { rank: 'I', name: 'Kavya K', score: '583/600', group: 'Arts Group' },
              { rank: 'II', name: 'Swarnalatha S', score: '580/600', group: 'Arts Group' },
              { rank: 'III', name: 'Sudarvizhi S', score: '573/600', group: 'Arts Group' },
            ]}
          />
        </div>
      </section>

      {/* Principal's Desk */}
      <section className="mt-16">
        <SectionHeading
          eyebrow="From the desk of"
          title="Principal's Desk"
          description="A message from our Principal, G. Venkatasree."
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-gradient-to-br from-primary/5 to-secondary/40 px-7 py-5">
            <div className="flex items-start gap-3">
              <Quote className="h-8 w-8 shrink-0 text-primary/40" />
              <p className="font-serif text-xl font-semibold italic text-foreground sm:text-2xl">
                &ldquo;Education is the key to a Brighter Destiny.&rdquo;
              </p>
            </div>
          </div>
          <div className="space-y-4 px-7 py-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Dr. V. Genguswamy Naidu Matriculation Higher Secondary School is a
              symbol of progressive and quality education. Welcome you all to our
              35th year of excellence. We aim to empower our students to grow as
              individuals with strong, open, discerning minds. In our school,
              children gain an all-round education and achieve their potential
              not only in the academic field but also in the field of sports and
              co-curricular activities like Yoga, Karate, Silambam, Skating,
              Western Dance, Bharatanatyam, Music, Judo, Scouts and Guides. We
              also take our students for field trips to enhance their innate
              talents.
            </p>
            <p>
              Our school has a dedicated, qualified staff to help the students
              reach their full potential in becoming productive members of
              society. Our utmost efforts are to make sure that our students get
              an environment effectively supported with a cover of care and
              opportunities that would help them learn to face challenges and
              bloom to their best and fullest.
            </p>
            <p className="font-medium text-foreground">
              &ldquo;We cannot always prepare a better future for our children but we
              can always prepare our children for a better future!&rdquo;
            </p>
            <p>
              As the Principal of VGN, I thank you parents for trusting us with
              your most valuable possession and choosing us to give the
              responsibility of nurturing your young ones. I, along with my team
              of educators, am committed to create a conducive environment for
              learning with creativity, innovations, passion and a drive to
              excel. We are looking forward to wonderful days where like-minded
              people come together for an amazing cause — to explore and learn.
            </p>
            <p className="text-foreground">
              Dear Young Learners,
              <br />
              I wish you a joyful journey of learning. Be inspired every day,
              brimming with new ideas. Have a blissful life... Happy Learning.
            </p>
          </div>
          <div className="border-t border-border bg-secondary/30 px-7 py-5 text-right">
            <p className="font-serif text-lg font-semibold text-foreground">G. Venkatasree</p>
            <p className="text-sm text-muted-foreground">
              Principal, Dr. VGN Mat. Hr. Sec. School
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MomentCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </article>
  );
}

function AchievementCard({
  icon,
  title,
  highlights,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  highlights: { label: string; count: string }[];
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
      <div className="mt-4 space-y-2">
        {highlights.map((h) => (
          <div
            key={h.label}
            className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
          >
            <span className="text-sm font-medium text-foreground">{h.label}</span>
            <span className="font-serif text-lg font-bold text-primary">{h.count}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function TopperCard({
  title,
  toppers,
}: {
  title: string;
  toppers: { rank: string; name: string; score: string; group: string }[];
}) {
  const rankColor: Record<string, string> = {
    I: 'bg-amber-100 text-amber-700',
    II: 'bg-slate-200 text-slate-600',
    III: 'bg-orange-100 text-orange-700',
  };

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="bg-primary px-5 py-3 text-center">
        <h3 className="font-serif text-lg font-semibold text-primary-foreground">{title}</h3>
      </div>
      <ul className="divide-y divide-border">
        {toppers.map((t, idx) => (
          <li key={idx} className="flex items-center gap-3 px-5 py-4">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankColor[t.rank] ?? 'bg-secondary text-muted-foreground'}`}
            >
              {t.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
              {t.group && (
                <p className="text-xs text-muted-foreground">{t.group}</p>
              )}
            </div>
            <span className="shrink-0 font-serif text-sm font-semibold text-primary">
              {t.score}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
