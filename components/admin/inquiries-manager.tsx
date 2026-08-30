'use client';

import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminList, LoadingState, EmptyState } from './admin-ui';

type Row = {
  id: string;
  parent_name: string;
  email: string;
  phone: string;
  student_name: string;
  grade: string;
  message: string;
  status: string;
  created_at: string;
};

export function InquiriesManager() {
  const { rows, loading, reload } = useAdminList<Row>(() =>
    supabase.from('admissions_inquiries').select('*').order('created_at', { ascending: false })
  );

  async function update(id: string, status: string) {
    await supabase.from('admissions_inquiries').update({ status }).eq('id', id);
    reload();
  }

  return (
    <div className="space-y-3">
      {loading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState message="No admission inquiries yet." />
      ) : (
        rows.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="font-serif text-lg">
                    {r.student_name} · {r.grade}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.parent_name} · {r.email} · {r.phone}
                  </p>
                </div>
                <select
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                  value={r.status}
                  onChange={(e) => update(r.id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{r.message || 'No message provided.'}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
