export type Announcement = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  publish_date: string;
  created_at: string;
  updated_at: string;
};

export type SchoolEvent = {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  description: string;
  location: string | null;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryPhoto = {
  id: string;
  event_id: string;
  storage_path: string;
  public_url: string;
  caption: string;
  created_at: string;
  event?: Pick<SchoolEvent, 'id' | 'title' | 'slug' | 'event_date'>;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string | null;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteContentKey =
  | 'home'
  | 'about'
  | 'academics'
  | 'admissions'
  | 'contact';

export type SiteContentRecord = {
  id: string;
  content_key: SiteContentKey;
  content: Record<string, unknown>;
  updated_at: string;
};

export type AdmissionsInquiry = {
  id: string;
  parent_name: string;
  email: string;
  phone: string;
  student_name: string;
  grade: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
};

export type AdminProfile = {
  user_id: string;
  display_name: string;
  created_at: string;
};
