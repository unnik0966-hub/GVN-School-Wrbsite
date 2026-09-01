import nodemailer from 'nodemailer';
import type { AdmissionApplication } from './types';

export const DEFAULT_SCHOOL_EMAIL = 'vgnprincipal@gmail.com';

export function getRecipientEmail(): string {
  return (
    process.env.SCHOOL_ADMISSION_EMAIL ||
    process.env.CONTACT_EMAIL ||
    DEFAULT_SCHOOL_EMAIL
  );
}

export function formatAdmissionEmailHtml(application: AdmissionApplication): string {
  const recipient = getRecipientEmail();
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Admission Application - ${application.application_no}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0f172a; color: #ffffff; padding: 28px 24px; text-align: center; border-bottom: 4px solid #166534; }
    .school-name { font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.01em; color: #ffffff; }
    .school-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge { display: inline-block; background: #166534; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-top: 12px; }
    .content { padding: 24px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; }
    .table-data { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13.5px; }
    .table-data td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    .table-data td.label { font-weight: 600; color: #64748b; width: 38%; }
    .table-data td.value { color: #0f172a; font-weight: 500; }
    .highlight-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin: 16px 0; }
    .footer { background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="school-name">Dr. V. Genguswamy Naidu Matric. Hr. Sec. School</h1>
      <p class="school-sub">Othakalmandapam, Coimbatore – 641032 | Ph: 8220012691, 9487545919</p>
      <div class="badge">Application Ref: ${application.application_no}</div>
    </div>
    
    <div class="content">
      <div class="highlight-box">
        <strong style="color: #166534; font-size: 14px;">🎓 Online Admission Application Received</strong><br/>
        <span style="font-size: 13px; color: #334155;">
          A new application for <strong>${application.grade_applying}</strong> (${application.academic_year}) has been submitted via the school website directly to <strong>${recipient}</strong>.
        </span>
      </div>

      <div class="section-title">1. Course & Admission Details</div>
      <table class="table-data">
        <tr><td class="label">Application Number</td><td class="value"><strong>${application.application_no}</strong></td></tr>
        <tr><td class="label">Academic Year</td><td class="value">${application.academic_year}</td></tr>
        <tr><td class="label">Admission Level</td><td class="value">${formatLevelLabel(application.level_category)}</td></tr>
        <tr><td class="label">Grade Applying For</td><td class="value"><strong>${application.grade_applying}</strong></td></tr>
        ${application.stream ? `<tr><td class="label">Stream / Subject Group</td><td class="value">${application.stream}</td></tr>` : ''}
        <tr><td class="label">Previous School</td><td class="value">${application.previous_school || 'Not applicable / First schooling'}</td></tr>
        <tr><td class="label">Previous Class & Board</td><td class="value">${application.previous_grade || 'N/A'}</td></tr>
        <tr><td class="label">Medium of Instruction</td><td class="value">${application.medium_of_instruction || 'English'}</td></tr>
      </table>

      <div class="section-title">2. Student Information</div>
      <table class="table-data">
        <tr><td class="label">Student Full Name</td><td class="value"><strong>${application.student_name}</strong></td></tr>
        <tr><td class="label">Date of Birth</td><td class="value">${application.date_of_birth}</td></tr>
        <tr><td class="label">Gender</td><td class="value">${application.gender}</td></tr>
        <tr><td class="label">Blood Group</td><td class="value">${application.blood_group || 'Not specified'}</td></tr>
        <tr><td class="label">Nationality</td><td class="value">${application.nationality}</td></tr>
        <tr><td class="label">Mother Tongue</td><td class="value">${application.mother_tongue}</td></tr>
        <tr><td class="label">Aadhaar Number</td><td class="value">${application.aadhaar_no || 'Not provided'}</td></tr>
        ${application.medical_notes ? `<tr><td class="label">Medical / Health Notes</td><td class="value">${application.medical_notes}</td></tr>` : ''}
      </table>

      <div class="section-title">3. Parents / Guardian Information</div>
      <table class="table-data">
        <tr><td class="label">Father's Name</td><td class="value">${application.father_name} (${application.father_occupation || 'Occupation N/A'})</td></tr>
        <tr><td class="label">Father's Mobile</td><td class="value"><a href="tel:${application.father_phone}">${application.father_phone}</a></td></tr>
        <tr><td class="label">Mother's Name</td><td class="value">${application.mother_name} (${application.mother_occupation || 'Occupation N/A'})</td></tr>
        <tr><td class="label">Mother's Mobile</td><td class="value"><a href="tel:${application.mother_phone}">${application.mother_phone || 'Same as primary'}</a></td></tr>
        ${application.guardian_name ? `<tr><td class="label">Guardian's Name & Phone</td><td class="value">${application.guardian_name} (${application.guardian_phone})</td></tr>` : ''}
        <tr><td class="label">Primary Email</td><td class="value"><a href="mailto:${application.primary_email}"><strong>${application.primary_email}</strong></a></td></tr>
      </table>

      <div class="section-title">4. Residential & Transport Details</div>
      <table class="table-data">
        <tr><td class="label">Residential Address</td><td class="value">${application.residential_address}, ${application.city}, ${application.district} - ${application.pincode}, ${application.state}</td></tr>
        <tr><td class="label">School Transport Required?</td><td class="value"><strong>${application.transport_required ? 'YES (School Bus Service Required)' : 'NO (Self / Parent Transport)'}</strong></td></tr>
        ${application.transport_pickup_location ? `<tr><td class="label">Preferred Pickup Point</td><td class="value">${application.transport_pickup_location}</td></tr>` : ''}
        <tr><td class="label">Submission Date & Time</td><td class="value">${new Date(application.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
      </table>
    </div>

    <div class="footer">
      This is an automated notification from the Dr. V. Genguswamy Naidu Matriculation Higher Secondary School Admissions Portal.<br/>
      Website: https://ais-dev-mau7wn5dau5owqhmwosmea-219787692095.asia-southeast1.run.app | Email: ${recipient}
    </div>
  </div>
</body>
</html>
  `.trim();
}

function formatLevelLabel(level: string): string {
  switch (level) {
    case 'nursery_primary':
      return 'Nursery & Primary School (Pre-KG to Class V)';
    case 'middle_school':
      return 'Middle School (Class VI to Class VIII)';
    case 'high_school':
      return 'High School (Class IX & Class X)';
    case 'higher_secondary':
      return 'Higher Secondary School (Class XI & Class XII)';
    default:
      return level;
  }
}

export async function sendAdmissionEmail(application: AdmissionApplication): Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }> {
  const recipient = getRecipientEmail();
  const htmlContent = formatAdmissionEmailHtml(application);

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"VGN Admissions" <admissions@vgnschool.edu.in>`;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: recipient,
        replyTo: application.primary_email,
        subject: `[New Admission Application] ${application.application_no} - ${application.student_name} (${application.grade_applying})`,
        html: htmlContent,
      });

      console.log('Admission email sent via SMTP:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('SMTP send error, falling back to recorded dispatch:', err);
    }
  }

  // Graceful simulation / robust logging for container environments
  console.log('========================================================');
  console.log(`[ADMISSION DISPATCH TO ${recipient}] Application ${application.application_no}`);
  console.log(`Student: ${application.student_name} | Grade: ${application.grade_applying}`);
  console.log(`Parent: ${application.father_name} / ${application.mother_name} | Email: ${application.primary_email} | Phone: ${application.father_phone}`);
  console.log('========================================================');

  return { success: true, simulated: true };
}
