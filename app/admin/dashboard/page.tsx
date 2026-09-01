'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdmin } from '@/components/admin/admin-provider';
import { AdminGuard } from '@/components/admin/admin-guard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsManager } from '@/components/admin/events-manager';
import { GalleryManager } from '@/components/admin/gallery-manager';
import { StaffManager } from '@/components/admin/staff-manager';
import { AnnouncementsManager } from '@/components/admin/announcements-manager';
import { InquiriesManager } from '@/components/admin/inquiries-manager';
import { ApplicationsManager } from '@/components/admin/applications-manager';
import { ContentEditor } from '@/components/admin/content-editor';
import { LogOut, ExternalLink } from 'lucide-react';

function DashboardInner() {
  const { user, signOut } = useAdmin();
  const [tab, setTab] = useState('applications');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            School admin
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold">Content dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as {user?.email}. Manage online admission applications, inquiries, events, gallery, and staff.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ExternalLink className="mr-2 h-4 w-4" />
              View site
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto">
          <TabsTrigger value="applications">Applications (Nursery – 12th)</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="content">Site content</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6">
          <ApplicationsManager />
        </TabsContent>
        <TabsContent value="inquiries" className="mt-6">
          <InquiriesManager />
        </TabsContent>
        <TabsContent value="events" className="mt-6">
          <EventsManager />
        </TabsContent>
        <TabsContent value="gallery" className="mt-6">
          <GalleryManager />
        </TabsContent>
        <TabsContent value="announcements" className="mt-6">
          <AnnouncementsManager />
        </TabsContent>
        <TabsContent value="staff" className="mt-6">
          <StaffManager />
        </TabsContent>
        <TabsContent value="content" className="mt-6">
          <ContentEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <DashboardInner />
    </AdminGuard>
  );
}
