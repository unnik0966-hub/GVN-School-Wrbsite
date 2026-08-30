/*
# Make site_content.updated_by nullable for seeding

1. Modified Tables
- `site_content`: `updated_by` column changed from NOT NULL to NULLABLE so that seeded
  content (e.g. contact details) can be inserted via raw SQL without an authenticated session.
  The column still defaults to auth.uid() for admin edits made through the app.
2. Security
- No policy changes. RLS still restricts writes to admin_profiles members.
*/

ALTER TABLE public.site_content ALTER COLUMN updated_by DROP NOT NULL;