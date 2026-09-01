'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminList, LoadingState, EmptyState } from './admin-ui';
import type { AdmissionApplication } from '@/lib/types';
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  GraduationCap,
  Bus,
  MapPin,
  FileText,
  Printer,
  ChevronDown,
} from 'lucide-react';

export function ApplicationsManager() {
  const { rows, loading, reload } = useAdminList<AdmissionApplication>(() =>
    supabase.from('admissions_applications').select('*').order('created_at', { ascending: false })
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);

  async function updateStatus(id: string, status: string) {
    await supabase.from('admissions_applications').update({ status }).eq('id', id);
    reload();
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp((prev) => (prev ? { ...prev, status: status as any } : null));
    }
  }

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      searchTerm === '' ||
      r.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.application_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.father_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.primary_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.grade_applying.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      levelFilter === 'all' || r.level_category === levelFilter;

    const matchesStatus =
      statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Controls & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student, ref #, parent, or grade..."
            className="pl-9 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-xs font-medium"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">All School Levels</option>
            <option value="nursery_primary">Nursery & Primary</option>
            <option value="middle_school">Middle School</option>
            <option value="high_school">High School</option>
            <option value="higher_secondary">Higher Secondary (+1/+2)</option>
          </select>

          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-xs font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted / New</option>
            <option value="under_review">Under Review</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="approved">Approved</option>
            <option value="enrolled">Enrolled</option>
            <option value="rejected">Rejected</option>
          </select>

          <Button variant="outline" size="sm" onClick={() => reload()}>
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : filteredRows.length === 0 ? (
        <EmptyState message="No admission applications matching criteria found." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRows.map((app) => (
            <Card key={app.id} className="transition-all hover:border-primary/40 hover:shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {app.application_no}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(app.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <CardTitle className="mt-1 font-serif text-xl font-bold flex items-center gap-2">
                      {app.student_name}
                      <span className="text-sm font-sans font-normal text-muted-foreground">
                        · {app.grade_applying}
                      </span>
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                        app.status === 'approved' || app.status === 'enrolled'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : app.status === 'interview_scheduled'
                          ? 'border-blue-300 bg-blue-50 text-blue-800'
                          : app.status === 'under_review'
                          ? 'border-amber-300 bg-amber-50 text-amber-800'
                          : 'border-input bg-background text-foreground'
                      }`}
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                    >
                      <option value="submitted">Submitted / New</option>
                      <option value="under_review">Under Review</option>
                      <option value="interview_scheduled">Interview Scheduled</option>
                      <option value="approved">Approved</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                      className="gap-1 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 text-sm space-y-3">
                {app.stream && (
                  <p className="text-xs text-primary font-medium bg-primary/5 px-2.5 py-1 rounded inline-block">
                    Stream: {app.stream}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-foreground" />
                    <span>Parents: <strong>{app.father_name}</strong> / {app.mother_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-foreground" />
                    <a href={`tel:${app.father_phone}`} className="hover:underline text-foreground font-medium">
                      {app.father_phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-foreground" />
                    <a href={`mailto:${app.primary_email}`} className="hover:underline truncate text-foreground font-medium">
                      {app.primary_email}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{app.city}, {app.district}</span>
                    {app.transport_required && (
                      <span className="inline-flex items-center gap-1 text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">
                        <Bus className="h-3 w-3" /> Bus Required ({app.transport_pickup_location || 'Area noted'})
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Dispatched to {app.recipient_email || 'vgnprincipal@gmail.com'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal / Detail Drawer for selected application */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {selectedApp.application_no}
                </span>
                <h3 className="mt-1 font-serif text-2xl font-bold">
                  {selectedApp.student_name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Applied for {selectedApp.grade_applying} ({selectedApp.academic_year})
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedApp(null)}
              >
                ✕ Close
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1 rounded-xl bg-secondary/40 p-3.5 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Student Details</p>
                <p><strong>DOB:</strong> {selectedApp.date_of_birth} | <strong>Gender:</strong> {selectedApp.gender}</p>
                <p><strong>Blood Group:</strong> {selectedApp.blood_group || 'N/A'}</p>
                <p><strong>Mother Tongue:</strong> {selectedApp.mother_tongue} | <strong>Nationality:</strong> {selectedApp.nationality}</p>
                {selectedApp.aadhaar_no && <p><strong>Aadhaar:</strong> {selectedApp.aadhaar_no}</p>}
                <p><strong>Medium:</strong> {selectedApp.medium_of_instruction}</p>
                {selectedApp.previous_school && (
                  <p><strong>Previous School:</strong> {selectedApp.previous_school} ({selectedApp.previous_grade})</p>
                )}
              </div>

              <div className="space-y-1 rounded-xl bg-secondary/40 p-3.5 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Parents & Contact</p>
                <p><strong>Father:</strong> {selectedApp.father_name} ({selectedApp.father_occupation || 'N/A'})</p>
                <p><strong>Father Phone:</strong> <a href={`tel:${selectedApp.father_phone}`} className="text-primary hover:underline">{selectedApp.father_phone}</a></p>
                <p><strong>Mother:</strong> {selectedApp.mother_name} ({selectedApp.mother_occupation || 'N/A'})</p>
                <p><strong>Mother Phone:</strong> <a href={`tel:${selectedApp.mother_phone}`} className="text-primary hover:underline">{selectedApp.mother_phone}</a></p>
                <p><strong>Email:</strong> <a href={`mailto:${selectedApp.primary_email}`} className="text-primary hover:underline">{selectedApp.primary_email}</a></p>
              </div>

              <div className="sm:col-span-2 space-y-1 rounded-xl bg-secondary/40 p-3.5 border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Address & Transport</p>
                <p>{selectedApp.residential_address}, {selectedApp.city}, {selectedApp.district} – {selectedApp.pincode}, {selectedApp.state}</p>
                <p><strong>School Transport:</strong> {selectedApp.transport_required ? `Yes, Pickup at: ${selectedApp.transport_pickup_location || 'Not specified'}` : 'Self / No bus required'}</p>
                {selectedApp.medical_notes && (
                  <p className="pt-1 text-amber-800 dark:text-amber-300"><strong>Medical Notes:</strong> {selectedApp.medical_notes}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Change Status:</span>
                <select
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium"
                  value={selectedApp.status}
                  onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="approved">Approved</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`mailto:${selectedApp.primary_email}?subject=Regarding Admission Application ${selectedApp.application_no} - Dr. V. Genguswamy Naidu School&body=Dear Parent,%0D%0A%0D%0AThank you for submitting the admission application for ${selectedApp.student_name} (${selectedApp.grade_applying}).%0D%0A%0D%0A`}
                  >
                    <Mail className="mr-1.5 h-4 w-4" />
                    Email Parent
                  </a>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-1.5 h-4 w-4" />
                  Print Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
