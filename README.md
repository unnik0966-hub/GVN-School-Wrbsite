# Dr. V. Genguswamy Naidu Matriculation Higher Secondary School

A production-ready Next.js + Supabase school website with public content pages and a protected staff dashboard.

## Local setup

1. Create a Supabase project.
2. Apply the SQL migration in `supabase/migrations/` using the Supabase SQL migration workflow.
3. Copy `.env.example` to `.env.local` and add the project URL and anon key.
4. Create staff accounts manually in Supabase Auth with email/password. Do not expose public sign-up.
5. Add each approved Auth user ID to `public.admin_profiles`.
6. Optional: use `supabase/seed.sql` only for demo or staging data. Keep production data separate.
7. Run the normal Next.js development or production commands for your environment.

## Admin security

The browser never decides whether someone is an administrator. Public reads are limited to published events, gallery photos tied to published events, published staff, announcements, and site content. Public visitors may only insert a new admissions inquiry.

All event, gallery, staff, announcement, and site-content inserts, updates, and deletes require an authenticated user present in `admin_profiles`. Storage writes to the `school-gallery` bucket require the same admin check and a user-ID folder prefix. Gallery viewing remains public, while gallery editing is database- and storage-policy protected.

## Deployment

Deploy the Next.js app to Vercel and add the same public Supabase URL and anon key as production environment variables. The database migration and storage policies live in Supabase, not in the frontend deployment.
