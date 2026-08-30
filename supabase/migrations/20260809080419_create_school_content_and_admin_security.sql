/*
# Create school website content and admin security model

1. New Tables
- `admin_profiles`: manually managed list of staff accounts allowed to edit school content.
- `events`: public school events with publication controls and audit ownership.
- `gallery_photos`: public gallery metadata connected to published events and storage objects.
- `staff`: public staff directory records managed by administrators.
- `site_content`: editable singleton content blocks for admissions, contact, mission, and homepage copy.
- `announcements`: published notice-board items.
- `admissions_inquiries`: public admission questions that only administrators can view or manage.

2. Security
- Every table has Row Level Security enabled.
- Public visitors can read only published public content.
- Only authenticated users listed in `admin_profiles` can create, update, or delete school content.
- Public visitors may submit an admissions inquiry but cannot read, edit, or delete inquiries.
- Storage policies protect the `school-gallery` bucket and only permit administrators to write files.

3. Important Notes
- Admin accounts are created manually in Supabase Auth, then their user ID is added to `admin_profiles`.
- No public sign-up path is provided by the application.
- Gallery files use a user-ID folder prefix so storage writes are scoped to the authenticated uploader.
*/

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'School Administrator',
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
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  department text,
  bio text,
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  published boolean NOT NULL DEFAULT false,
  publish_date date NOT NULL DEFAULT current_date,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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

CREATE INDEX IF NOT EXISTS events_public_date_idx ON public.events (published, event_date DESC);
CREATE INDEX IF NOT EXISTS gallery_event_idx ON public.gallery_photos (event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS announcements_public_date_idx ON public.announcements (published, publish_date DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.admissions_inquiries (status, created_at DESC);

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_inquiries ENABLE ROW LEVEL SECURITY;

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