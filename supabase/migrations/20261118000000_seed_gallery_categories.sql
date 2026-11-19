/* Allow seeded gallery category rows without a session user and seed the 8 gallery categories */
ALTER TABLE public.events ALTER COLUMN created_by DROP NOT NULL;

INSERT INTO public.events (title, slug, event_date, description, location, published)
VALUES
  ('Events', 'gallery-category-events', current_date, 'Photo gallery collection for school events.', 'Campus', true),
  ('Campus Life', 'gallery-category-campus-life', current_date, 'Daily campus life, classrooms, and student community.', 'Campus', true),
  ('Celebrations', 'gallery-category-celebrations', current_date, 'School festivals, annual days, and special celebrations.', 'Campus', true),
  ('Achievements', 'gallery-category-achievements', current_date, 'Academic, co-curricular, and student awards and achievements.', 'Campus', true),
  ('Activities', 'gallery-category-activities', current_date, 'Co-curricular clubs, workshops, and student activities.', 'Campus', true),
  ('Academics', 'gallery-category-academics', current_date, 'Classroom learning, laboratories, and academic showcases.', 'Campus', true),
  ('Sports & Fitness', 'gallery-category-sports-fitness', current_date, 'Athletics, speed skating, karate, silambam, yoga, and games.', 'School Sports Complex', true),
  ('Arts & Culture', 'gallery-category-arts-culture', current_date, 'Music, classical and western dance, drama, and visual arts.', 'Main Auditorium', true)
ON CONFLICT (slug) DO NOTHING;
