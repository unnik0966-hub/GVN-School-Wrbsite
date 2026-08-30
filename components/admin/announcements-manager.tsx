'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAdminList, LoadingState, EmptyState } from './admin-ui';
import { Trash2 } from 'lucide-react';

type Row = {
  id: string;
  title: string;
  body: string;
  publish_date: string;
  published: boolean;
};

const today = new Date().toISOString().slice(0, 10);

export function AnnouncementsManager() {
  const { rows, loading, reload } = useAdminList<Row>(() =>
    supabase.from('announcements').select('*').order('publish_date', { ascending: false })
  );

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState(today);
  const [published, setPublished] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('announcements').insert({ title, body, publish_date: date, published });
    setTitle('');
    setBody('');
    reload();
  }

  async function remove(id: string) {
    await supabase.from('announcements').delete().eq('id', id);
    reload();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">New announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={save}>
            <div>
              <Label>Title</Label>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Publish date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea required rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Publish publicly
            </label>
            <Button type="submit">Save announcement</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {loading ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState message="No announcements yet." />
        ) : (
          rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <h3 className="font-serif text-lg font-semibold">{r.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.publish_date} · {r.published ? 'Published' : 'Draft'}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
