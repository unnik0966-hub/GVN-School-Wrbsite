'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

export function InquiryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      parent_name: String(formData.get('parent_name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      student_name: String(formData.get('student_name') ?? '').trim(),
      grade: String(formData.get('grade') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    if (!payload.parent_name || !payload.email || !payload.phone || !payload.student_name || !payload.grade) {
      setStatus('error');
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const { error } = await supabase.from('admissions_inquiries').insert({
      ...payload,
      status: 'new',
    });

    if (error) {
      setStatus('error');
      setErrorMsg('We could not submit your inquiry right now. Please try again later.');
      return;
    }

    setStatus('success');
    event.currentTarget.reset();
  }

  if (status === 'success') {
    return (
      <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-5 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-2 text-sm font-medium text-foreground">
          Thank you. Your inquiry has been received.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Our admissions office will contact you shortly.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setStatus('idle')}
        >
          Submit another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="parent_name">Parent / guardian name</Label>
        <Input id="parent_name" name="parent_name" placeholder="Your full name" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+91 ..." required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="student_name">Student name</Label>
        <Input id="student_name" name="student_name" placeholder="Child's full name" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="grade">Grade applying for</Label>
        <Input id="grade" name="grade" placeholder="e.g. Class VI" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Anything you would like us to know"
          rows={3}
        />
      </div>

      {status === 'error' && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMsg}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit inquiry
          </>
        )}
      </Button>
    </form>
  );
}
