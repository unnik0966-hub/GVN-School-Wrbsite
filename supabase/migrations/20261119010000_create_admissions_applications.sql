/*
# Create admissions_applications table & RLS policies

Stores full online admission applications (Nursery & Primary through +1 & +2 Higher Secondary)
and secures reads/updates to verified administrators in admin_profiles while permitting public submissions.
*/

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

CREATE INDEX IF NOT EXISTS admissions_applications_status_idx
  ON public.admissions_applications (status, created_at DESC);

ALTER TABLE public.admissions_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit admission application" ON public.admissions_applications;
CREATE POLICY "Anyone can submit admission application"
  ON public.admissions_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'submitted');

DROP POLICY IF EXISTS "Admins can read admission applications" ON public.admissions_applications;
CREATE POLICY "Admins can read admission applications"
  ON public.admissions_applications
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update admission applications" ON public.admissions_applications;
CREATE POLICY "Admins can update admission applications"
  ON public.admissions_applications
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins can delete admission applications" ON public.admissions_applications;
CREATE POLICY "Admins can delete admission applications"
  ON public.admissions_applications
  FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid()));
