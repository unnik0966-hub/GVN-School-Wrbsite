import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendAdmissionEmail, getRecipientEmail } from '@/lib/email-service';
import type { AdmissionApplication, AdmissionLevelCategory } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const student_name = String(body.student_name || '').trim();
    const date_of_birth = String(body.date_of_birth || '').trim();
    const gender = (body.gender || 'Male') as 'Male' | 'Female' | 'Other';
    const level_category = (body.level_category || 'nursery_primary') as AdmissionLevelCategory;
    const grade_applying = String(body.grade_applying || '').trim();
    const stream = body.stream ? String(body.stream).trim() : undefined;
    const academic_year = String(body.academic_year || '2025–2026').trim();

    const father_name = String(body.father_name || '').trim();
    const father_phone = String(body.father_phone || '').trim();
    const mother_name = String(body.mother_name || '').trim();
    const mother_phone = String(body.mother_phone || '').trim();
    const primary_email = String(body.primary_email || '').trim();
    const residential_address = String(body.residential_address || '').trim();
    const city = String(body.city || '').trim();
    const pincode = String(body.pincode || '').trim();
    const district = String(body.district || 'Coimbatore').trim();
    const state = String(body.state || 'Tamil Nadu').trim();

    // Required validation
    if (
      !student_name ||
      !date_of_birth ||
      !grade_applying ||
      !father_name ||
      !father_phone ||
      !primary_email ||
      !residential_address ||
      !city ||
      !pincode
    ) {
      return NextResponse.json(
        {
          error: 'Please fill in all mandatory fields (Student name, Date of birth, Grade applying, Father details, Primary email, and Address).',
        },
        { status: 400 }
      );
    }

    // Generate unique Application ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const application_no = `VGN-ADM-2025-${randomSuffix}`;
    const recipient_email = getRecipientEmail();

    const applicationRecord: AdmissionApplication = {
      id: `app-${Date.now()}-${randomSuffix}`,
      application_no,
      academic_year,
      level_category,
      grade_applying,
      stream: stream || (level_category === 'higher_secondary' ? 'Science / Commerce Group' : 'General Curriculum'),
      student_name,
      date_of_birth,
      gender,
      blood_group: body.blood_group ? String(body.blood_group).trim() : 'Not Specified',
      nationality: body.nationality ? String(body.nationality).trim() : 'Indian',
      mother_tongue: body.mother_tongue ? String(body.mother_tongue).trim() : 'Tamil',
      aadhaar_no: body.aadhaar_no ? String(body.aadhaar_no).trim() : undefined,
      previous_school: body.previous_school ? String(body.previous_school).trim() : undefined,
      previous_grade: body.previous_grade ? String(body.previous_grade).trim() : undefined,
      medium_of_instruction: body.medium_of_instruction ? String(body.medium_of_instruction).trim() : 'English',
      father_name,
      father_occupation: body.father_occupation ? String(body.father_occupation).trim() : undefined,
      father_phone,
      mother_name,
      mother_occupation: body.mother_occupation ? String(body.mother_occupation).trim() : undefined,
      mother_phone: mother_phone || father_phone,
      guardian_name: body.guardian_name ? String(body.guardian_name).trim() : undefined,
      guardian_phone: body.guardian_phone ? String(body.guardian_phone).trim() : undefined,
      primary_email,
      residential_address,
      city,
      pincode,
      district,
      state,
      transport_required: Boolean(body.transport_required),
      transport_pickup_location: body.transport_pickup_location ? String(body.transport_pickup_location).trim() : undefined,
      medical_notes: body.medical_notes ? String(body.medical_notes).trim() : undefined,
      status: 'submitted',
      email_sent_to_school: true,
      recipient_email,
      created_at: new Date().toISOString(),
    };

    // Save to admissions_applications in Supabase / Mock store
    const { error: dbError } = await supabase.from('admissions_applications').insert(applicationRecord);
    if (dbError) {
      console.warn('Could not insert into admissions_applications:', dbError);
    }

    // Also mirror into admissions_inquiries for backward compatibility
    await supabase.from('admissions_inquiries').insert({
      parent_name: `${father_name} / ${mother_name}`,
      email: primary_email,
      phone: father_phone,
      student_name,
      grade: `${grade_applying} ${stream ? `(${stream})` : ''}`.trim(),
      message: `[ONLINE ADMISSION FORM: ${application_no}] Level: ${level_category}. Address: ${residential_address}, ${city} - ${pincode}. Transport: ${body.transport_required ? 'Yes' : 'No'}.`,
      status: 'new',
    });

    // Send email to the school website email (vgnprincipal@gmail.com)
    const emailResult = await sendAdmissionEmail(applicationRecord);

    return NextResponse.json({
      success: true,
      message: `Admission application successfully submitted to ${recipient_email}`,
      application_no,
      application: applicationRecord,
      recipient_email,
      email_delivered: emailResult.success,
    });
  } catch (error: any) {
    console.error('Admission submission error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'An unexpected error occurred while submitting your admission application.',
      },
      { status: 500 }
    );
  }
}
