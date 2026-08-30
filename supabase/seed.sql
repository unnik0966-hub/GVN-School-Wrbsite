-- Demo-only seed data for local/staging use. Keep production content separate.
-- Run after the schema migration has been applied and replace the sample text as needed.

insert into public.site_content (content_key, content)
values
  ('home', '{"welcome_heading":"Where Curiosity Meets Character","welcome_body":"A school community built on academic confidence, character, and care."}'::jsonb),
  ('contact', '{"address":"Othakalmandapam, Coimbatore – 641032","phone":"8220012691, 9487545919","email":"vgnprincipal@gmail.com","hours":"Monday – Saturday, 8:30 AM to 4:00 PM","map_embed":"https://www.google.com/maps?q=Othakalmandapam,Coimbatore+641032&output=embed"}'::jsonb)
on conflict (content_key) do nothing;

insert into public.events (title, slug, event_date, description, location, published)
values
  ('Annual Sports Day', 'annual-sports-day', current_date + 21, 'A day of teamwork, spirited competition, and celebration across the school community.', 'School grounds', true),
  ('Cultural Evening', 'cultural-evening', current_date + 45, 'An evening of music, dance, theatre, and student-led performances.', 'Main auditorium', true)
on conflict (slug) do nothing;
