'use client';

import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GALLERY_CATEGORIES, isGalleryCategorySlug } from '@/lib/gallery-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminList, LoadingState, ErrorState, EmptyState } from './admin-ui';
import { Upload, Trash2 } from 'lucide-react';

type EventRow = { id: string; title: string; slug: string; published: boolean };
type PhotoRow = {
  id: string;
  event_id: string;
  public_url: string;
  storage_path: string;
  caption: string;
  event?: { title: string } | null;
};

export function GalleryManager() {
  const { rows: events, reload: reloadEvents } = useAdminList<EventRow>(() =>
    supabase.from('events').select('id,title,slug,published').order('event_date', { ascending: false })
  );
  const { rows, loading, error, reload } = useAdminList<PhotoRow>(() =>
    supabase.from('gallery_photos').select('*, event:events(title)').order('created_at', { ascending: false })
  );

  const [selectedTarget, setSelectedTarget] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const publishedEvents = events.filter((e) => e.published);
  const customPublishedEvents = publishedEvents.filter((e) => !isGalleryCategorySlug(e.slug));

  async function resolveEventId(choice: string): Promise<string | null> {
    if (!choice.startsWith('category:')) {
      return choice;
    }

    const slug = choice.replace('category:', '');
    const category = GALLERY_CATEGORIES.find((c) => c.slug === slug);
    if (!category) return null;

    const existing = events.find((e) => e.slug === category.slug || e.title === category.title);
    if (existing) {
      return existing.id;
    }

    const { data: created, error: createError } = await supabase
      .from('events')
      .insert({
        title: category.title,
        slug: category.slug,
        event_date: new Date().toISOString().slice(0, 10),
        description: `${category.title} photo gallery collection`,
        location: 'School Campus',
        published: true,
      })
      .select('id')
      .single();

    if (createError || !created?.id) {
      return null;
    }

    reloadEvents();
    return created.id;
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!selectedTarget) {
      setIsError(true);
      setMessage('Please select an event or category before uploading.');
      return;
    }

    if (!file) {
      setIsError(true);
      setMessage('Please choose a photo file to upload.');
      return;
    }

    setUploading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setIsError(true);
        setMessage('Please sign in again to upload photos.');
        return;
      }

      const resolvedEventId = await resolveEventId(selectedTarget);
      if (!resolvedEventId) {
        setIsError(true);
        setMessage('Could not resolve the selected event or category.');
        return;
      }

      const path = `${user.user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      const uploaded = await supabase.storage
        .from('school-gallery')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploaded.error) {
        setIsError(true);
        setMessage('Could not upload this photo.');
        return;
      }
      const url = supabase.storage.from('school-gallery').getPublicUrl(path).data.publicUrl;
      const inserted = await supabase
        .from('gallery_photos')
        .insert({ event_id: resolvedEventId, storage_path: path, public_url: url, caption });
      if (inserted.error) {
        setIsError(true);
        setMessage('Photo uploaded but could not be added to the gallery.');
        return;
      }

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setCaption('');
      setIsError(false);
      setMessage('Photo added to the gallery.');
      reload();
    } finally {
      setUploading(false);
    }
  }

  async function remove(row: PhotoRow) {
    if (!window.confirm('Delete this photo?')) return;
    await supabase.from('gallery_photos').delete().eq('id', row.id);
    await supabase.storage.from('school-gallery').remove([row.storage_path]);
    reload();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Upload gallery photo</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4 md:items-end" onSubmit={upload}>
            <div>
              <Label htmlFor="gallery-event-select">
                Event / Category <span className="text-destructive">*</span>
              </Label>
              <select
                id="gallery-event-select"
                required
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
              >
                <option value="">Select event / category</option>
                <optgroup label="Gallery Categories">
                  {GALLERY_CATEGORIES.map((cat) => {
                    const matched = publishedEvents.find((ev) => ev.slug === cat.slug);
                    return (
                      <option key={cat.slug} value={matched ? matched.id : `category:${cat.slug}`}>
                        {cat.title}
                      </option>
                    );
                  })}
                </optgroup>
                {customPublishedEvents.length > 0 && (
                  <optgroup label="School Events">
                    {customPublishedEvents.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            <div>
              <Label htmlFor="gallery-photo-input">
                Photo <span className="text-destructive">*</span>
              </Label>
              <Input
                ref={fileInputRef}
                id="gallery-photo-input"
                type="file"
                required
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="gallery-caption-input">Caption</Label>
              <Input
                id="gallery-caption-input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Optional caption"
              />
            </div>
            <Button type="submit" disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </form>
          {message && (
            <p className={`mt-3 text-sm ${isError ? 'text-destructive' : 'text-primary'}`}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message="Could not load gallery photos." />
      ) : rows.length === 0 ? (
        <EmptyState message="No gallery photos yet." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((row) => (
            <div key={row.id} className="overflow-hidden rounded-xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={row.public_url} alt={row.caption || 'Gallery photo'} className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  {row.event?.title && (
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {row.event.title}
                    </p>
                  )}
                  <p className="truncate text-xs text-muted-foreground">
                    {row.caption || row.event?.title || 'Gallery photo'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(row)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
