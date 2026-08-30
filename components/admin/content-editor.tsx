'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ContentKey = 'admissions' | 'contact' | 'home';
const KEYS: ContentKey[] = ['admissions', 'contact', 'home'];

export function ContentEditor() {
  const [key, setKey] = useState<ContentKey>('admissions');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  async function load(next: ContentKey) {
    setKey(next);
    const { data } = await supabase
      .from('site_content')
      .select('content')
      .eq('content_key', next)
      .maybeSingle();
    setValue(data ? JSON.stringify(data.content, null, 2) : '');
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      const content = JSON.parse(value);
      const { data: user } = await supabase.auth.getUser();
      const result = await supabase
        .from('site_content')
        .upsert(
          { content_key: key, content, updated_by: user.user?.id },
          { onConflict: 'content_key' }
        );
      setMessage(result.error ? 'Could not save content.' : 'Saved.');
    } catch {
      setMessage('Enter valid JSON content.');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Edit published content</CardTitle>
        <p className="text-sm text-muted-foreground">
          Use JSON for admissions, contact, or homepage content. Existing content is preserved until you save.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {KEYS.map((k) => (
            <Button
              key={k}
              type="button"
              variant={key === k ? 'default' : 'outline'}
              size="sm"
              onClick={() => load(k)}
            >
              {k}
            </Button>
          ))}
        </div>
        <form className="space-y-3" onSubmit={save}>
          <div>
            <Label htmlFor="content-json">Content JSON</Label>
            <Textarea
              id="content-json"
              rows={18}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='{"address": "..."}'
            />
          </div>
          {message && <p className="text-sm text-primary">{message}</p>}
          <Button type="submit">Save content</Button>
        </form>
      </CardContent>
    </Card>
  );
}
