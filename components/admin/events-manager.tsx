'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminList, LoadingState, ErrorState, EmptyState } from './admin-ui';
import { Pencil, Trash2, Save } from 'lucide-react';

type EventRow = {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  description: string;
  location: string | null;
  published: boolean;
};

const empty = { title: '', slug: '', event_date: '', description: '', location: '', published: false };

export function EventsManager() {
  const { rows, loading, error, reload } = useAdminList<EventRow>(() =>
    supabase.from('events').select('*').order('event_date', { ascending: false })
  );

  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    const payload = { ...form, location: form.location || null };
    const result = editing
      ? await supabase.from('events').update(payload).eq('id', editing)
      : await supabase.from('events').insert(payload);
    if (result.error) {
      setMessage('Could not save this event.');
      return;
    }
    setForm(empty);
    setEditing(null);
    setMessage('Saved.');
    reload();
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this event and its gallery links?')) return;
    await supabase.from('events').delete().eq('id', id);
    reload();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">{editing ? 'Edit event' : 'New event'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={save}>
            <div>
              <Label>Title</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                required
                value={form.slug}
                onChange={(e) =>
                  setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
                }
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                required
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Publish publicly
            </label>
            {message && <p className="text-sm text-primary">{message}</p>}
            <div className="flex gap-2">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(null);
                    setForm(empty);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message="Could not load events." />
        ) : rows.length === 0 ? (
          <EmptyState message="No events yet." />
        ) : (
          rows.map((row) => (
            <Card key={row.id}>
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-semibold">{row.title}</h3>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {row.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {row.event_date} · {row.location || 'School campus'}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{row.description}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(row.id);
                      setForm({
                        title: row.title,
                        slug: row.slug,
                        event_date: row.event_date,
                        description: row.description,
                        location: row.location || '',
                        published: row.published,
                      });
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(row.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
