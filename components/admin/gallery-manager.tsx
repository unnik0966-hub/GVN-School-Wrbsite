'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminList, LoadingState, ErrorState, EmptyState } from './admin-ui';
import { Upload, Trash2 } from 'lucide-react';

type EventRow = { id: string; title: string; published: boolean };
type PhotoRow = {
  id: string;
  event_id: string;
  public_url: string;
  storage_path: string;
  caption: string;
  event?: { title: string } | null;
};

export function GalleryManager() {
  const { rows: events } = useAdminList<EventRow>(() =>
    supabase.from('events').select('id,title,published').order('event_date', { ascending: false })
  );
  const { rows, loading, error, reload } = useAdminList<PhotoRow>(() =>
    supabase.from('gallery_photos').select('*, event:id(title)').order('created_at', { ascending: false })
  );

  const [eventId, setEventId] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !eventId) {
      setMessage('Choose an event and photo.');
      return;
    }
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const path = `${user.user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const uploaded = await supabase.storage
      .from('school-gallery')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploaded.error) {
      setMessage('Could not upload this photo.');
      return;
    }
    const url = supabase.storage.from('school-gallery').getPublicUrl(path).data.publicUrl;
    const inserted = await supabase
      .from('gallery_photos')
      .insert({ event_id: eventId, storage_path: path, public_url: url, caption });
    if (inserted.error) {
      setMessage('Photo uploaded but could not be added to the gallery.');
      return;
    }
    setFile(null);
    setCaption('');
    setMessage('Photo added.');
    reload();
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
              <Label>Event</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
              >
                <option value="">Choose event</option>
                {events
                  .filter((e) => e.published)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label>Photo</Label>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label>Caption</Label>
              <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optional caption" />
            </div>
            <Button type="submit">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </form>
          {message && <p className="mt-3 text-sm text-primary">{message}</p>}
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
                <p className="truncate text-xs text-muted-foreground">{row.caption || row.event?.title}</p>
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
