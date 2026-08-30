'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminList, LoadingState, EmptyState } from './admin-ui';
import { Trash2 } from 'lucide-react';

type Row = { id: string; name: string; role: string; department: string | null };

export function StaffManager() {
  const { rows, loading, reload } = useAdminList<Row>(() =>
    supabase.from('staff').select('id,name,role,department').order('sort_order')
  );

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('staff').insert({ name, role, department: department || null, published: true });
    setName('');
    setRole('');
    setDepartment('');
    reload();
  }

  async function remove(id: string) {
    await supabase.from('staff').delete().eq('id', id);
    reload();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Add staff profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={save}>
            <div>
              <Label>Name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Role</Label>
              <Input required value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <Button type="submit">Add staff member</Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState message="No staff profiles yet." />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-serif text-lg font-semibold">{r.name}</h3>
                  <p className="text-sm text-primary">{r.role}</p>
                  <p className="text-xs text-muted-foreground">{r.department}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
