'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAdmin } from '@/components/admin/admin-provider';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { loading, session, isAdmin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      router.replace('/admin');
    }
  }, [loading, session, isAdmin, router]);

  if (loading || !session || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
