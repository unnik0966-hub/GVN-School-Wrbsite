'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import type { AdmissionLevelCategory, AdmissionApplication } from '@/lib/types';
import {
  Baby,
  BookOpen,
  GraduationCap,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Printer,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Bus,
  ShieldCheck,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const LEVEL_OPTIONS: Array<{
  id: AdmissionLevelCategory;
  title: string;
  subtitle: string;
  grades: string[];
  icon: any;
}> = [
  {
    id: 'nursery_primary',
    title: 'Nursery & Kindergarten',
    subtitle: 'Pre-KG, LKG, UKG',
    grades: ['Pre-KG / Nursery', 'LKG (Lower Kindergarten)', 'UKG (Upper Kindergarten)'],
    icon: Baby,
  },
  {
    id: 'nursery_primary',
    title: 'Primary School',
    subtitle: 'Classes I to V',
    grades: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'],
    icon: BookOpen,
  },
  {
    id: 'middle_school',
    title: 'Middle & High School',
    subtitle: 'Classes VI to X',
    grades: ['Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X (SSLC Board)'],
    icon: GraduationCap,
  },
  {
    id: 'higher_secondary',
    title: 'Higher Secondary School',
    subtitle: 'Classes XI & XII (Science & Commerce)',
    grades: ['Class XI (Higher Secondary 1st Year)', 'Class XII (Higher Secondary 2nd Year)'],
    icon: Sparkles,
  },
];

const HIGHER_SECONDARY_STREAMS = [
  {
    id: 'science_bio_maths',
    name: 'Science Group 1 (Bio-Maths)',
    subjects: 'Physics, Chemistry, Biology, Mathematics, English, Tamil/Language',
    description: 'Ideal for Medicine, Engineering, Biotechnology, and Pure Sciences.',
  },
  {
    id: 'science_cs_maths',
    name: 'Science Group 2 (Computer Science & Maths)',
    subjects: 'Physics, Chemistry, Computer Science, Mathematics, English, Tamil/Language',
    description: 'Ideal for Computer Science, IT, Artificial Intelligence, and Architecture.',
  },
  {
    id: 'commerce_cs_bm',
    name: 'Commerce Group 1 (Accountancy & Computer Applications)',
    subjects: 'Accountancy, Commerce, Economics, Computer Applications, English, Tamil',
    description: 'Ideal for Chartered Accountancy (CA), B.Com, IT Management, and Business.',
  },
  {
    id: 'commerce_bmaths',
    name: 'Commerce Group 2 (Accountancy & Business Maths)',
    subjects: 'Accountancy, Commerce, Economics, Business Mathematics & Statistics, English',
    description: 'Ideal for Finance, Actuarial Science, Banking, and Corporate Economics.',
  },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Not Known'];

export function AdmissionApplicationForm() {
  const [levelCategory, setLevelCategory] = useState<AdmissionLevelCategory>('nursery_primary');
  const [selectedGrade, setSelectedGrade] = useState('Pre-KG / Nursery');
  const [selectedStream, setSelectedStream] = useState(HIGHER_SECONDARY_STREAMS[0].name);
  const [transportNeeded, setTransportNeeded] = useState(false);
  const [declarationAgreed, setDeclarationAgreed] = useState(false);

  // Form State
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState<AdmissionApplication | null>(null);

  // Handlers for level switch
  const handleLevelSelect = (level: AdmissionLevelCategory, defaultGrade: string) => {
    setLevelCategory(level);
    setSelectedGrade(defaultGrade);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');

    if (!declarationAgreed) {
      setErrorMsg('Please confirm the declaration checkbox before submitting.');
      return;
    }

    setStatus('loading');
    const formData = new FormData(e.currentTarget);

    const payload = {
      academic_year: String(formData.get('academic_year') ?? '2025–2026'),
      level_category: levelCategory,
      grade_applying: selectedGrade,
      stream: levelCategory === 'higher_secondary' ? selectedStream : undefined,
      student_name: String(formData.get('student_name') ?? '').trim(),
      date_of_birth: String(formData.get('date_of_birth') ?? '').trim(),
      gender: String(formData.get('gender') ?? 'Male'),
      blood_group: String(formData.get('blood_group') ?? ''),
      nationality: String(formData.get('nationality') ?? 'Indian').trim(),
      mother_tongue: String(formData.get('mother_tongue') ?? 'Tamil').trim(),
      aadhaar_no: String(formData.get('aadhaar_no') ?? '').trim(),
      previous_school: String(formData.get('previous_school') ?? '').trim(),
      previous_grade: String(formData.get('previous_grade') ?? '').trim(),
      medium_of_instruction: String(formData.get('medium_of_instruction') ?? 'English'),
      father_name: String(formData.get('father_name') ?? '').trim(),
      father_occupation: String(formData.get('father_occupation') ?? '').trim(),
      father_phone: String(formData.get('father_phone') ?? '').trim(),
      mother_name: String(formData.get('mother_name') ?? '').trim(),
      mother_occupation: String(formData.get('mother_occupation') ?? '').trim(),
      mother_phone: String(formData.get('mother_phone') ?? '').trim(),
      guardian_name: String(formData.get('guardian_name') ?? '').trim(),
      guardian_phone: String(formData.get('guardian_phone') ?? '').trim(),
      primary_email: String(formData.get('primary_email') ?? '').trim(),
      residential_address: String(formData.get('residential_address') ?? '').trim(),
      city: String(formData.get('city') ?? '').trim(),
      pincode: String(formData.get('pincode') ?? '').trim(),
      district: String(formData.get('district') ?? 'Coimbatore').trim(),
      state: String(formData.get('state') ?? 'Tamil Nadu').trim(),
      transport_required: transportNeeded,
      transport_pickup_location: String(formData.get('transport_pickup_location') ?? '').trim(),
      medical_notes: String(formData.get('medical_notes') ?? '').trim(),
    };

    try {
      const res = await fetch('/api/admissions/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit admission application.');
      }

      setSubmittedData(data.application);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please check your details and try again.');
    }
  }

  if (status === 'success' && submittedData) {
    return (
      <div id="admission-success-receipt" className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-10 shadow-lg text-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">
            Application Submitted Successfully
          </p>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold">
            Admission Application Received
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A copy of this completed form has been sent directly to the school administration email (<strong className="text-foreground">vgnprincipal@gmail.com</strong>).
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-5 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <p className="text-xs uppercase font-semibold text-muted-foreground">Application Reference Number</p>
                <p className="font-mono text-lg font-bold text-primary">{submittedData.application_no}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase font-semibold text-muted-foreground">Academic Year</p>
                <p className="text-sm font-semibold">{submittedData.academic_year}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Student Name</p>
                <p className="font-semibold text-foreground">{submittedData.student_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Grade Applied</p>
                <p className="font-semibold text-foreground">{submittedData.grade_applying}</p>
              </div>
              {submittedData.stream && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground font-medium">Stream / Group</p>
                  <p className="font-medium text-foreground">{submittedData.stream}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground font-medium">Father / Mother</p>
                <p className="text-foreground">{submittedData.father_name} & {submittedData.mother_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Primary Contact</p>
                <p className="text-foreground">{submittedData.father_phone} · {submittedData.primary_email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Residential Town / City</p>
                <p className="text-foreground">{submittedData.city}, {submittedData.district} - {submittedData.pincode}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">School Bus Transport</p>
                <p className="text-foreground">{submittedData.transport_required ? `Yes (${submittedData.transport_pickup_location || 'Pickup requested'})` : 'No (Self transport)'}</p>
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 p-4 text-xs text-muted-foreground border border-primary/10">
              <strong className="text-primary block font-semibold mb-1">Next Steps for Parents:</strong>
              1. Keep this Reference ID (<strong>{submittedData.application_no}</strong>) for all future admissions correspondence.<br />
              2. Our admissions office will reach out via phone/email to schedule the student-parent interaction session.<br />
              3. Please keep the student&apos;s Birth Certificate, Transfer Certificate (if applicable), Aadhaar copy, and 2 passport photos ready.
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
            <Button
              variant="default"
              onClick={() => window.print()}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print / Save Application Receipt
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <a
                href={`mailto:vgnprincipal@gmail.com?subject=Inquiry regarding Application ${submittedData.application_no} - ${submittedData.student_name}&body=Dear Principal,%0D%0A%0D%0AI have submitted an online admission application for my child ${submittedData.student_name} for ${submittedData.grade_applying} (Ref: ${submittedData.application_no}).%0D%0A%0D%0AParent Contact: ${submittedData.father_phone}%0D%0AEmail: ${submittedData.primary_email}`}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact School via Email
              </a>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setStatus('idle');
                setSubmittedData(null);
                setDeclarationAgreed(false);
              }}
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
          <FileText className="h-4 w-4" />
          Official Online Admission Portal · 2025–2026
        </div>
        <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-foreground">
          Student Admission Application Form
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Please fill out the complete details below for students applying to <strong>Nursery & Kindergarten</strong>, <strong>Primary School</strong>, <strong>Middle/High School</strong>, or <strong>Higher Secondary School (+1 & +2)</strong>. Upon submission, this completed application will be dispatched directly to the school principal&apos;s email (<strong className="text-foreground">vgnprincipal@gmail.com</strong>).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-10">
        {/* Step 1: Select Academic Category */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              Select Admission Level & Grade
            </h3>
            <span className="text-xs text-muted-foreground">Pre-KG to Class XII</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LEVEL_OPTIONS.map((lvl, index) => {
              const Icon = lvl.icon;
              const isSelected =
                levelCategory === lvl.id &&
                ((lvl.title.includes('Nursery') && selectedGrade.includes('KG')) ||
                  (lvl.title.includes('Primary') && selectedGrade.includes('Class I')) ||
                  lvl.id === 'middle_school' ||
                  lvl.id === 'higher_secondary');

              return (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleLevelSelect(lvl.id, lvl.grades[0])}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/40'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-semibold text-sm text-foreground">{lvl.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{lvl.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Grade selection dropdown & Academic Year */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-secondary/30 p-4 sm:p-5 border border-border">
            <div className="space-y-2">
              <Label htmlFor="grade_applying" className="text-sm font-semibold">
                Class / Grade Applying For <span className="text-destructive">*</span>
              </Label>
              <select
                id="grade_applying"
                name="grade_applying"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                {levelCategory === 'nursery_primary' && (
                  <optgroup label="Nursery & Kindergarten">
                    <option value="Pre-KG / Nursery">Pre-KG / Nursery</option>
                    <option value="LKG (Lower Kindergarten)">LKG (Lower Kindergarten)</option>
                    <option value="UKG (Upper Kindergarten)">UKG (Upper Kindergarten)</option>
                  </optgroup>
                )}
                {levelCategory === 'nursery_primary' && (
                  <optgroup label="Primary School">
                    <option value="Class I">Class I</option>
                    <option value="Class II">Class II</option>
                    <option value="Class III">Class III</option>
                    <option value="Class IV">Class IV</option>
                    <option value="Class V">Class V</option>
                  </optgroup>
                )}
                {levelCategory === 'middle_school' && (
                  <optgroup label="Middle & High School">
                    <option value="Class VI">Class VI</option>
                    <option value="Class VII">Class VII</option>
                    <option value="Class VIII">Class VIII</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class X (SSLC Board)">Class X (SSLC Board)</option>
                  </optgroup>
                )}
                {levelCategory === 'higher_secondary' && (
                  <optgroup label="Higher Secondary (+1 & +2)">
                    <option value="Class XI (Higher Secondary First Year)">
                      Class XI (Higher Secondary First Year)
                    </option>
                    <option value="Class XII (Higher Secondary Second Year)">
                      Class XII (Higher Secondary Second Year)
                    </option>
                  </optgroup>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year" className="text-sm font-semibold">
                Academic Year <span className="text-destructive">*</span>
              </Label>
              <select
                id="academic_year"
                name="academic_year"
                defaultValue="2025–2026"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="2025–2026">2025–2026 (New Academic Session)</option>
                <option value="2026–2027">2026–2027 (Advance Enrollment)</option>
              </select>
            </div>

            {/* Higher Secondary Stream Selection */}
            {levelCategory === 'higher_secondary' && (
              <div className="sm:col-span-2 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">
                    Choose Higher Secondary Stream / Group <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-xs text-primary font-medium">Tamil Nadu State Board</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {HIGHER_SECONDARY_STREAMS.map((st, i) => (
                    <label
                      key={i}
                      className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedStream === st.name
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                          : 'border-border bg-card hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="stream_choice"
                          value={st.name}
                          checked={selectedStream === st.name}
                          onChange={() => setSelectedStream(st.name)}
                          className="mt-1 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-semibold text-xs text-foreground">{st.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{st.subjects}</p>
                          <p className="text-[11px] text-primary/80 mt-1 font-medium">{st.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Student Personal Details */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              Student Information
            </h3>
            <span className="text-xs text-muted-foreground">As in Birth Certificate</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="student_name">
                Student Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="student_name"
                name="student_name"
                placeholder="e.g. R. Kavin Kumar / S. Ananya"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date_of_birth">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender">
                Gender <span className="text-destructive">*</span>
              </Label>
              <select
                id="gender"
                name="gender"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="blood_group">Blood Group</Label>
              <select
                id="blood_group"
                name="blood_group"
                defaultValue="O+"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mother_tongue">Mother Tongue</Label>
              <Input id="mother_tongue" name="mother_tongue" defaultValue="Tamil" placeholder="Tamil, English, etc." />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" name="nationality" defaultValue="Indian" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="aadhaar_no">Student Aadhaar No. (Optional)</Label>
              <Input id="aadhaar_no" name="aadhaar_no" placeholder="12-digit Aadhaar" maxLength={16} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="medium_of_instruction">Medium of Study</Label>
              <select
                id="medium_of_instruction"
                name="medium_of_instruction"
                defaultValue="English"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="English">English Medium</option>
                <option value="Tamil">Tamil Medium</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="previous_school">Previous School (if transferring)</Label>
              <Input
                id="previous_school"
                name="previous_school"
                placeholder="Name of current/previous school & town"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="previous_grade">Last Grade Studied / Marks %</Label>
              <Input
                id="previous_grade"
                name="previous_grade"
                placeholder="e.g. Class X (88%) / UKG"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Parents & Guardian Details */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </span>
              Parents / Guardian Information
            </h3>
            <span className="text-xs text-muted-foreground">Official Correspondence</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="father_name">
                Father&apos;s Full Name <span className="text-destructive">*</span>
              </Label>
              <Input id="father_name" name="father_name" placeholder="Father's name" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="father_occupation">Father&apos;s Occupation</Label>
              <Input id="father_occupation" name="father_occupation" placeholder="e.g. Engineer / Business / Agriculture" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="father_phone">
                Father&apos;s Mobile No. <span className="text-destructive">*</span>
              </Label>
              <Input
                id="father_phone"
                name="father_phone"
                type="tel"
                placeholder="+91 98420 12345"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mother_name">
                Mother&apos;s Full Name <span className="text-destructive">*</span>
              </Label>
              <Input id="mother_name" name="mother_name" placeholder="Mother's name" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mother_occupation">Mother&apos;s Occupation</Label>
              <Input id="mother_occupation" name="mother_occupation" placeholder="e.g. Teacher / Homemaker / Doctor" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mother_phone">Mother&apos;s Mobile No.</Label>
              <Input id="mother_phone" name="mother_phone" type="tel" placeholder="+91 98420 67890" />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="primary_email">
                Primary Contact Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="primary_email"
                name="primary_email"
                type="email"
                placeholder="parent@example.com (Admission copy & interview dates will be sent here)"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="guardian_name">Guardian&apos;s Name (if applicable)</Label>
              <Input id="guardian_name" name="guardian_name" placeholder="Optional" />
            </div>
          </div>
        </div>

        {/* Step 4: Residential Address & School Bus Transport */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                4
              </span>
              Residential Address & Transport
            </h3>
            <span className="text-xs text-muted-foreground">Location & Bus Routes</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
              <Label htmlFor="residential_address">
                Door No. & Street Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="residential_address"
                name="residential_address"
                placeholder="e.g. 42/B, Anna Nagar, Pollachi Main Road"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">
                Town / City <span className="text-destructive">*</span>
              </Label>
              <Input id="city" name="city" defaultValue="Othakalmandapam" placeholder="City" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="district">District</Label>
              <Input id="district" name="district" defaultValue="Coimbatore" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pincode">
                PIN Code <span className="text-destructive">*</span>
              </Label>
              <Input id="pincode" name="pincode" defaultValue="641032" maxLength={6} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" defaultValue="Tamil Nadu" required />
            </div>

            {/* Transport Section */}
            <div className="sm:col-span-2 lg:col-span-4 rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="transport_required"
                  checked={transportNeeded}
                  onChange={(e) => setTransportNeeded(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <Label htmlFor="transport_required" className="cursor-pointer font-semibold text-sm flex items-center gap-2">
                  <Bus className="h-4 w-4 text-primary" />
                  Do you require School Bus Transport?
                </Label>
              </div>

              {transportNeeded && (
                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="transport_pickup_location" className="text-xs">
                    Preferred Bus Route / Pickup Landmark
                  </Label>
                  <Input
                    id="transport_pickup_location"
                    name="transport_pickup_location"
                    placeholder="e.g. Kinathukadavu, Malumichampatti, Eachanari, Chettipalayam, etc."
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2 lg:col-span-4 space-y-1.5">
              <Label htmlFor="medical_notes">Any Medical Condition or Learning Needs (Optional)</Label>
              <Textarea
                id="medical_notes"
                name="medical_notes"
                placeholder="Mention allergies, dietary requirements, or any notes you would like the teachers to be aware of."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Declaration & Email Notification Confirmation */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="declaration_checkbox"
              checked={declarationAgreed}
              onChange={(e) => setDeclarationAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            <label htmlFor="declaration_checkbox" className="text-xs sm:text-sm text-muted-foreground leading-relaxed cursor-pointer">
              <strong className="text-foreground">Parent Declaration:</strong> I hereby certify that the information supplied in this online application is true and complete to the best of my knowledge. I understand that submission of this form sends a formal application record to <strong>vgnprincipal@gmail.com</strong> for review by the admissions committee.
            </label>
          </div>
        </div>

        {/* Error message */}
        {status === 'error' && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Direct submission to Principal&apos;s office (<strong className="text-foreground">vgnprincipal@gmail.com</strong>)
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={status === 'loading'}
            className="w-full sm:w-auto px-8 font-semibold shadow-md"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting Application to School Email...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit Admission Application
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
