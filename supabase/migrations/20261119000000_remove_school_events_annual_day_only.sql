/* Remove all School Events entries and maintain Annual Day photos inside the 8 existing gallery categories without years */
ALTER TABLE public.events ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE public.gallery_photos ALTER COLUMN created_by DROP NOT NULL;

/* Remove all non-category School Events entries (cascades any gallery_photos linked only to removed events) */
DELETE FROM public.events
WHERE slug NOT LIKE 'gallery-category-%';

/* Ensure the 8 existing gallery categories exist cleanly without year references */
INSERT INTO public.events (title, slug, event_date, description, location, published)
VALUES
  ('Events', 'gallery-category-events', '2025-01-01', 'Annual Day — Events photo gallery collection.', 'Campus', true),
  ('Campus Life', 'gallery-category-campus-life', '2025-01-01', 'Annual Day — Campus Life photo gallery collection.', 'Campus', true),
  ('Celebrations', 'gallery-category-celebrations', '2025-01-01', 'Annual Day — Celebrations photo gallery collection.', 'Campus', true),
  ('Achievements', 'gallery-category-achievements', '2025-01-01', 'Annual Day — Achievements photo gallery collection.', 'Campus', true),
  ('Activities', 'gallery-category-activities', '2025-01-01', 'Annual Day — Activities photo gallery collection.', 'Campus', true),
  ('Academics', 'gallery-category-academics', '2025-01-01', 'Annual Day — Academics photo gallery collection.', 'Campus', true),
  ('Sports & Fitness', 'gallery-category-sports-fitness', '2025-01-01', 'Annual Day — Sports & Fitness photo gallery collection.', 'School Sports Complex', true),
  ('Arts & Culture', 'gallery-category-arts-culture', '2025-01-01', 'Annual Day — Arts & Culture photo gallery collection.', 'Main Auditorium', true)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  published = true;

/* Seed Annual Day gallery content inside the 8 existing gallery categories */
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
