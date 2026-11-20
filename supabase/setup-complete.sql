-- ============================================================================
-- Dr. V. Genguswamy Naidu Matriculation Higher Secondary School
-- COMPLETE ONE-CLICK SUPABASE SETUP SCRIPT
-- Combines all 6 migrations, Storage bucket ("school-gallery"), RLS policies,
-- Annual Day gallery categories, and initial 2026-2027 school content.
-- ============================================================================

-- 1. Core tables
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Smt. G. Venkatasree, Principal',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  event_date date NOT NULL,
  description text NOT NULL DEFAULT '',
  location text,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ALTER COLUMN created_by DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_photos ALTER COLUMN created_by DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  department text,
  bio text,
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff ALTER COLUMN created_by DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid DEFAULT auth.uid() REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ALTER COLUMN updated_by DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  published boolean NOT NULL DEFAULT false,
  publish_date date NOT NULL DEFAULT current_date,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ALTER COLUMN created_by DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.admissions_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  student_name text NOT NULL,
  grade text NOT NULL,
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admissions_applications (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  application_no text NOT NULL UNIQUE,
  academic_year text NOT NULL DEFAULT '2026–2027',
  level_category text NOT NULL,
  grade_applying text NOT NULL,
  stream text,
  student_name text NOT NULL,
  date_of_birth text NOT NULL,
  gender text NOT NULL,
  blood_group text,
  nationality text NOT NULL DEFAULT 'Indian',
  mother_tongue text NOT NULL DEFAULT 'Tamil',
  aadhaar_no text,
  previous_school text,
  previous_grade text,
  medium_of_instruction text,
  father_name text NOT NULL,
  father_occupation text,
  father_phone text NOT NULL,
  mother_name text NOT NULL DEFAULT '',
  mother_occupation text,
  mother_phone text,
  guardian_name text,
  guardian_phone text,
  primary_email text NOT NULL,
  residential_address text NOT NULL,
  city text NOT NULL,
  pincode text NOT NULL,
  district text NOT NULL DEFAULT 'Coimbatore',
  state text NOT NULL DEFAULT 'Tamil Nadu',
  transport_required boolean NOT NULL DEFAULT false,
  transport_pickup_location text,
  medical_notes text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'interview_scheduled', 'approved', 'enrolled', 'rejected')),
  email_sent_to_school boolean NOT NULL DEFAULT false,
  recipient_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure constraint matches all dashboard statuses if table existed previously
ALTER TABLE public.admissions_applications DROP CONSTRAINT IF EXISTS admissions_applications_status_check;
ALTER TABLE public.admissions_applications
  ADD CONSTRAINT admissions_applications_status_check
  CHECK (status IN ('submitted', 'under_review', 'interview_scheduled', 'approved', 'enrolled', 'rejected'));

-- 2. Indexes
CREATE INDEX IF NOT EXISTS events_public_date_idx ON public.events (published, event_date DESC);
CREATE INDEX IF NOT EXISTS gallery_event_idx ON public.gallery_photos (event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS announcements_public_date_idx ON public.announcements (published, publish_date DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.admissions_inquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS admissions_applications_status_idx ON public.admissions_applications (status, created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_applications ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Admins can read admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can read admin profiles" ON public.admin_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can read published events" ON public.events;
CREATE POLICY "Public can read published events" ON public.events FOR SELECT TO anon, authenticated USING (published = true OR EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()) AND created_by = auth.uid());
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can read gallery for published events" ON public.gallery_photos;
CREATE POLICY "Public can read gallery for published events" ON public.gallery_photos FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = gallery_photos.event_id AND (events.published = true OR EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))));
DROP POLICY IF EXISTS "Admins can insert gallery photos" ON public.gallery_photos;
CREATE POLICY "Admins can insert gallery photos" ON public.gallery_photos FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()) AND created_by = auth.uid());
DROP POLICY IF EXISTS "Admins can update gallery photos" ON public.gallery_photos;
CREATE POLICY "Admins can update gallery photos" ON public.gallery_photos FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete gallery photos" ON public.gallery_photos;
CREATE POLICY "Admins can delete gallery photos" ON public.gallery_photos FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can read published staff" ON public.staff;
CREATE POLICY "Public can read published staff" ON public.staff FOR SELECT TO anon, authenticated USING (published = true OR EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can insert staff" ON public.staff;
CREATE POLICY "Admins can insert staff" ON public.staff FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()) AND created_by = auth.uid());
DROP POLICY IF EXISTS "Admins can update staff" ON public.staff;
CREATE POLICY "Admins can update staff" ON public.staff FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete staff" ON public.staff;
CREATE POLICY "Admins can delete staff" ON public.staff FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can read site content" ON public.site_content;
CREATE POLICY "Public can read site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can insert site content" ON public.site_content;
CREATE POLICY "Admins can insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()) AND updated_by = auth.uid());
DROP POLICY IF EXISTS "Admins can update site content" ON public.site_content;
CREATE POLICY "Admins can update site content" ON public.site_content FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()) AND updated_by = auth.uid());
DROP POLICY IF EXISTS "Admins can delete site content" ON public.site_content;
CREATE POLICY "Admins can delete site content" ON public.site_content FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Public can read published announcements" ON public.announcements;
CREATE POLICY "Public can read published announcements" ON public.announcements FOR SELECT TO anon, authenticated USING (published = true OR EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can insert announcements" ON public.announcements;
CREATE POLICY "Admins can insert announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()) AND created_by = auth.uid());
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
CREATE POLICY "Admins can update announcements" ON public.announcements FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;
CREATE POLICY "Admins can delete announcements" ON public.announcements FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can submit admissions inquiry" ON public.admissions_inquiries;
CREATE POLICY "Anyone can submit admissions inquiry" ON public.admissions_inquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');
DROP POLICY IF EXISTS "Admins can read inquiries" ON public.admissions_inquiries;
CREATE POLICY "Admins can read inquiries" ON public.admissions_inquiries FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.admissions_inquiries;
CREATE POLICY "Admins can update inquiries" ON public.admissions_inquiries FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.admissions_inquiries;
CREATE POLICY "Admins can delete inquiries" ON public.admissions_inquiries FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Anyone can submit admission application" ON public.admissions_applications;
CREATE POLICY "Anyone can submit admission application" ON public.admissions_applications FOR INSERT TO anon, authenticated WITH CHECK (status = 'submitted');
DROP POLICY IF EXISTS "Admins can read admission applications" ON public.admissions_applications;
CREATE POLICY "Admins can read admission applications" ON public.admissions_applications FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can update admission applications" ON public.admissions_applications;
CREATE POLICY "Admins can update admission applications" ON public.admissions_applications FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete admission applications" ON public.admissions_applications;
CREATE POLICY "Admins can delete admission applications" ON public.admissions_applications FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- 5. Storage Bucket ("school-gallery") & Policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-gallery', 'school-gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view school gallery" ON storage.objects;
CREATE POLICY "Public can view school gallery" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'school-gallery');
DROP POLICY IF EXISTS "Admins can upload school gallery" ON storage.objects;
CREATE POLICY "Admins can upload school gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'school-gallery' AND (storage.foldername(name))[1] = auth.uid()::text AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can update school gallery" ON storage.objects;
CREATE POLICY "Admins can update school gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'school-gallery' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid())) WITH CHECK (bucket_id = 'school-gallery' AND (storage.foldername(name))[1] = auth.uid()::text AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can delete school gallery" ON storage.objects;
CREATE POLICY "Admins can delete school gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'school-gallery' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

-- 6. Gallery Categories & Annual Day Photos (Removes non-category School Events)
DELETE FROM public.events WHERE slug NOT LIKE 'gallery-category-%';

INSERT INTO public.events (title, slug, event_date, description, location, published)
VALUES
  ('Events', 'gallery-category-events', '2026-01-01', 'Annual Day — Events photo gallery collection.', 'Campus', true),
  ('Campus Life', 'gallery-category-campus-life', '2026-01-01', 'Annual Day — Campus Life photo gallery collection.', 'Campus', true),
  ('Celebrations', 'gallery-category-celebrations', '2026-01-01', 'Annual Day — Celebrations photo gallery collection.', 'Campus', true),
  ('Achievements', 'gallery-category-achievements', '2026-01-01', 'Annual Day — Achievements photo gallery collection.', 'Campus', true),
  ('Activities', 'gallery-category-activities', '2026-01-01', 'Annual Day — Activities photo gallery collection.', 'Campus', true),
  ('Academics', 'gallery-category-academics', '2026-01-01', 'Annual Day — Academics photo gallery collection.', 'Campus', true),
  ('Sports & Fitness', 'gallery-category-sports-fitness', '2026-01-01', 'Annual Day — Sports & Fitness photo gallery collection.', 'School Sports Complex', true),
  ('Arts & Culture', 'gallery-category-arts-culture', '2026-01-01', 'Annual Day — Arts & Culture photo gallery collection.', 'Main Auditorium', true)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  published = true;

INSERT INTO public.gallery_photos (event_id, storage_path, public_url, caption)
SELECT e.id, v.storage_path, v.public_url, v.caption
FROM (
  VALUES
    ('gallery-category-events', 'annual-day/events.jpg', '/images/gallery/annual-day-events.jpg', 'Annual Day inaugural lamp lighting ceremony on stage'),
    ('gallery-category-campus-life', 'annual-day/campus-life.jpg', '/images/gallery/annual-day-campus-life.jpg', 'Students gathering across the decorated campus for Annual Day'),
    ('gallery-category-celebrations', 'annual-day/celebrations.jpg', '/images/gallery/annual-day-celebrations.jpg', 'Annual Day grand finale celebration in the school auditorium'),
    ('gallery-category-achievements', 'annual-day/achievements.jpg', '/images/gallery/annual-day-achievements.jpg', 'Annual Day prize distribution and excellence trophy presentation'),
    ('gallery-category-activities', 'annual-day/activities.jpg', '/images/gallery/annual-day-activities.jpg', 'Annual Day student folk drama and choral showcase'),
    ('gallery-category-academics', 'annual-day/academics.jpg', '/images/gallery/annual-day-academics.jpg', 'Annual Day academic proficiency medalists and faculty on stage'),
    ('gallery-category-sports-fitness', 'annual-day/sports-fitness.jpg', '/images/gallery/annual-day-sports-fitness.jpg', 'Annual Day rhythmic mass drill and house march-past display'),
    ('gallery-category-arts-culture', 'annual-day/arts-culture.jpg', '/images/gallery/annual-day-arts-culture.jpg', 'Annual Day classical Bharatanatyam dance presentation')
) AS v(slug, storage_path, public_url, caption)
JOIN public.events e ON e.slug = v.slug
ON CONFLICT (storage_path) DO NOTHING;

-- 7. Seed Initial School Content (preserves any existing admin edits)
INSERT INTO public.site_content (content_key, content)
VALUES (
  'contact',
  '{
    "address": "Othakalmandapam, Coimbatore – 641032",
    "phone": "8220012691, 9487545919",
    "email": "vgnprincipal@gmail.com",
    "hours": "Monday – Saturday, 8:30 AM to 4:00 PM",
    "map_embed": "https://www.google.com/maps?q=Othakalmandapam,Coimbatore+641032&output=embed"
  }'::jsonb
)
ON CONFLICT (content_key) DO NOTHING;

INSERT INTO public.announcements (title, body, published, publish_date)
SELECT
  'Admissions Open for Academic Year 2026–2027',
  'Applications are now invited for Kindergarten through Class XII. Submit the online application form or contact the school office for campus visits.',
  true,
  '2026-06-15'
WHERE NOT EXISTS (
  SELECT 1 FROM public.announcements WHERE title = 'Admissions Open for Academic Year 2026–2027'
);
