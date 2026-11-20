import { createClient } from '@supabase/supabase-js';
import { getFallbackContent } from './fallback-data';
import { GALLERY_CATEGORIES, isGalleryCategorySlug } from './gallery-categories';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

const isPlaceholderCredentials =
  supabaseUrl.includes('vgn-school.supabase.com') ||
  supabaseUrl.includes('placeholder') ||
  supabaseUrl.includes('example.com') ||
  supabaseAnonKey === 'vgn-anon-key';

const hasValidCredentials =
  !isPlaceholderCredentials &&
  supabaseUrl.startsWith('https://') &&
  (supabaseAnonKey.startsWith('eyJ') ||
    supabaseAnonKey.startsWith('sb_publishable_') ||
    supabaseAnonKey.length > 40);

// Default initial data for mock store (existing gallery categories only; School Events entries removed)
const INITIAL_EVENTS = GALLERY_CATEGORIES.map((cat) => ({
  id: cat.id,
  title: cat.title,
  slug: cat.slug,
  event_date: '',
  description: `Annual Day — ${cat.title} photo gallery collection`,
  location: 'School Campus',
  cover_image_url: null,
  published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'a1001',
    title: 'Admissions Open for Academic Year 2026–2027',
    body: 'Applications are now invited for Kindergarten through Class XII. Submit the online application form or contact the school office for campus visits.',
    publish_date: '2026-06-15',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a1002',
    title: '100% Pass Result in Board Examinations (X & XII Std)',
    body: 'Congratulations to all our high-achieving toppers and teachers for securing centum scores across Science and Commerce streams.',
    publish_date: '2026-05-20',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a1003',
    title: 'Parent-Teacher Interactive Forum Schedule',
    body: 'The term review meeting for Class VI through XII will be held on the upcoming Saturday between 9:00 AM and 1:00 PM.',
    publish_date: '2026-07-10',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_STAFF = [
  {
    id: 's1001',
    name: 'G. Venkatasree',
    role: 'Principal',
    department: 'Administration',
    bio: 'Dedicated educator leading curriculum innovation and values-based mentoring.',
    photo_url: '/images/51409c9e-5c41-455d-9f96-9ea3775f1f7f.png',
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's1002',
    name: 'Dr. K. Senthil Kumar',
    role: 'Head of Department — Science',
    department: 'Physics & Chemistry',
    bio: 'Guiding higher secondary scholars into premier research and engineering institutes.',
    photo_url: null,
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's1003',
    name: 'Mrs. R. Malathi',
    role: 'Senior Faculty — Mathematics',
    department: 'Mathematics',
    bio: 'Fostering analytical curiosity and problem-solving confidence for over 18 years.',
    photo_url: null,
    sort_order: 3,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's1004',
    name: 'Mr. P. Vijay Anand',
    role: 'Director of Physical Education',
    department: 'Sports & Athletics',
    bio: 'Coaching state and district champion athletes in speed skating, kabaddi, and track events.',
    photo_url: null,
    sort_order: 4,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's1005',
    name: 'Mrs. S. Hemalatha',
    role: 'Head of Department — Commerce',
    department: 'Commerce & Accountancy',
    bio: 'Specializing in financial literacy, economics, and business enterprise.',
    photo_url: null,
    sort_order: 5,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's1006',
    name: 'Mr. N. Ramanathan',
    role: 'Faculty — Computer Science',
    department: 'Computer Science & AI',
    bio: 'Mentoring students in algorithmic problem solving and practical programming.',
    photo_url: null,
    sort_order: 6,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_GALLERY = [
  {
    id: 'g-annual-events',
    event_id: 'cat-events',
    storage_path: 'annual-day/events.jpg',
    public_url: '/images/gallery/annual-day-events.jpg',
    caption: 'Annual Day inaugural lamp lighting ceremony on stage',
    created_at: new Date().toISOString(),
    event: { id: 'cat-events', title: 'Events', slug: 'gallery-category-events', event_date: '' },
  },
  {
    id: 'g-annual-campus-life',
    event_id: 'cat-campus-life',
    storage_path: 'annual-day/campus-life.jpg',
    public_url: '/images/gallery/annual-day-campus-life.jpg',
    caption: 'Students gathering across the decorated campus for Annual Day',
    created_at: new Date().toISOString(),
    event: { id: 'cat-campus-life', title: 'Campus Life', slug: 'gallery-category-campus-life', event_date: '' },
  },
  {
    id: 'g-annual-celebrations',
    event_id: 'cat-celebrations',
    storage_path: 'annual-day/celebrations.jpg',
    public_url: '/images/gallery/annual-day-celebrations.jpg',
    caption: 'Annual Day grand finale celebration in the school auditorium',
    created_at: new Date().toISOString(),
    event: { id: 'cat-celebrations', title: 'Celebrations', slug: 'gallery-category-celebrations', event_date: '' },
  },
  {
    id: 'g-annual-achievements',
    event_id: 'cat-achievements',
    storage_path: 'annual-day/achievements.jpg',
    public_url: '/images/gallery/annual-day-achievements.jpg',
    caption: 'Annual Day prize distribution and excellence trophy presentation',
    created_at: new Date().toISOString(),
    event: { id: 'cat-achievements', title: 'Achievements', slug: 'gallery-category-achievements', event_date: '' },
  },
  {
    id: 'g-annual-activities',
    event_id: 'cat-activities',
    storage_path: 'annual-day/activities.jpg',
    public_url: '/images/gallery/annual-day-activities.jpg',
    caption: 'Annual Day student folk drama and choral showcase',
    created_at: new Date().toISOString(),
    event: { id: 'cat-activities', title: 'Activities', slug: 'gallery-category-activities', event_date: '' },
  },
  {
    id: 'g-annual-academics',
    event_id: 'cat-academics',
    storage_path: 'annual-day/academics.jpg',
    public_url: '/images/gallery/annual-day-academics.jpg',
    caption: 'Annual Day academic proficiency medalists and faculty on stage',
    created_at: new Date().toISOString(),
    event: { id: 'cat-academics', title: 'Academics', slug: 'gallery-category-academics', event_date: '' },
  },
  {
    id: 'g-annual-sports-fitness',
    event_id: 'cat-sports-fitness',
    storage_path: 'annual-day/sports-fitness.jpg',
    public_url: '/images/gallery/annual-day-sports-fitness.jpg',
    caption: 'Annual Day rhythmic mass drill and house march-past display',
    created_at: new Date().toISOString(),
    event: { id: 'cat-sports-fitness', title: 'Sports & Fitness', slug: 'gallery-category-sports-fitness', event_date: '' },
  },
  {
    id: 'g-annual-arts-culture',
    event_id: 'cat-arts-culture',
    storage_path: 'annual-day/arts-culture.jpg',
    public_url: '/images/gallery/annual-day-arts-culture.jpg',
    caption: 'Annual Day classical Bharatanatyam dance presentation',
    created_at: new Date().toISOString(),
    event: { id: 'cat-arts-culture', title: 'Arts & Culture', slug: 'gallery-category-arts-culture', event_date: '' },
  },
];

const INITIAL_INQUIRIES = [
  {
    id: 'inq-1',
    parent_name: 'P. Sundaram',
    email: 'sundaram.p@example.com',
    phone: '+91 98421 23456',
    student_name: 'S. Kavin',
    grade: 'Class XI — Science Group',
    message: 'Seeking details regarding hostel facilities and state board curriculum coaching.',
    status: 'new',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const INITIAL_APPLICATIONS = [
  {
    id: 'app-1001',
    application_no: 'VGN-ADM-2026-0101',
    academic_year: '2026–2027',
    level_category: 'nursery_primary',
    grade_applying: 'LKG (Lower Kindergarten)',
    stream: 'General Primary Curriculum',
    student_name: 'Aadhya Rajesh',
    date_of_birth: '2021-04-12',
    gender: 'Female',
    blood_group: 'O+',
    nationality: 'Indian',
    mother_tongue: 'Tamil',
    aadhaar_no: 'XXXXXXXX1234',
    previous_school: 'Little Star Play School, Coimbatore',
    previous_grade: 'Pre-KG',
    medium_of_instruction: 'English',
    father_name: 'Rajesh Kumar M',
    father_occupation: 'Senior Mechanical Engineer',
    father_phone: '+91 98765 43210',
    mother_name: 'Deepa Rajesh',
    mother_occupation: 'Software Consultant',
    mother_phone: '+91 98765 43211',
    primary_email: 'rajesh.m@example.com',
    residential_address: 'No. 24, Gandhi Nagar, Othakalmandapam',
    city: 'Coimbatore',
    pincode: '641032',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    transport_required: true,
    transport_pickup_location: 'Othakalmandapam Bus Stop Junction',
    medical_notes: 'None. Fully vaccinated.',
    status: 'submitted',
    email_sent_to_school: true,
    recipient_email: 'vgnprincipal@gmail.com',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'app-1002',
    application_no: 'VGN-ADM-2026-0102',
    academic_year: '2026–2027',
    level_category: 'higher_secondary',
    grade_applying: 'Class XI (Higher Secondary First Year)',
    stream: 'Science Group (Physics, Chemistry, Mathematics, Biology)',
    student_name: 'Karthik Sivakumar',
    date_of_birth: '2009-08-25',
    gender: 'Male',
    blood_group: 'B+',
    nationality: 'Indian',
    mother_tongue: 'Tamil',
    aadhaar_no: 'XXXXXXXX5678',
    previous_school: 'Govt Higher Secondary School, Kinathukadavu',
    previous_grade: 'Class X (SSLC Board 92.4%)',
    medium_of_instruction: 'English',
    father_name: 'Sivakumar N',
    father_occupation: 'Agricultural Officer',
    father_phone: '+91 94432 11223',
    mother_name: 'Revathi Sivakumar',
    mother_occupation: 'School Teacher',
    mother_phone: '+91 94432 11224',
    primary_email: 'sivakumar.kinath@example.com',
    residential_address: '15/2, Pollachi Main Road',
    city: 'Kinathukadavu',
    pincode: '642109',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    transport_required: true,
    transport_pickup_location: 'Kinathukadavu Main Bus Stand',
    medical_notes: 'Mild dust allergy.',
    status: 'under_review',
    email_sent_to_school: true,
    recipient_email: 'vgnprincipal@gmail.com',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// In-memory / localStorage store for robust offline mock execution
class MockSupabaseStore {
  data: Record<string, any[]> = {
    events: [...INITIAL_EVENTS],
    announcements: [...INITIAL_ANNOUNCEMENTS],
    staff: [...INITIAL_STAFF],
    gallery_photos: [...INITIAL_GALLERY],
    admissions_inquiries: [...INITIAL_INQUIRIES],
    admissions_applications: [...INITIAL_APPLICATIONS],
    admin_profiles: [{ user_id: 'mock-admin-id', display_name: 'Smt. G. Venkatasree, Principal' }],
    site_content: [
      { id: '1', content_key: 'home', content: getFallbackContent('home') },
      { id: '2', content_key: 'about', content: getFallbackContent('about') },
      { id: '3', content_key: 'academics', content: getFallbackContent('academics') },
      { id: '4', content_key: 'admissions', content: getFallbackContent('admissions') },
      { id: '5', content_key: 'contact', content: getFallbackContent('contact') },
    ],
  };

  currentUser: any = null;
  authListeners: Array<(event: string, session: any) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vgn_mock_store');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.data = { ...this.data, ...parsed };
          if (!Array.isArray(this.data.events)) {
            this.data.events = [...INITIAL_EVENTS];
          } else {
            // Remove all School Events entries and ensure all 8 gallery categories exist
            const categoryEventsOnly = this.data.events.filter((ev: any) => isGalleryCategorySlug(ev.slug));
            const existingSlugs = new Set(categoryEventsOnly.map((ev: any) => ev.slug));
            const missingCategoryEvents = GALLERY_CATEGORIES
              .filter((cat) => !existingSlugs.has(cat.slug))
              .map((cat) => ({
                id: cat.id,
                title: cat.title,
                slug: cat.slug,
                event_date: '',
                description: `Annual Day — ${cat.title} photo gallery collection`,
                location: 'School Campus',
                cover_image_url: null,
                published: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }));
            this.data.events = [...categoryEventsOnly, ...missingCategoryEvents];
          }

          if (!parsed.__annual_day_only_v1) {
            const categoryIds = new Set(GALLERY_CATEGORIES.map((c) => c.id));
            const customCategoryPhotos = (Array.isArray(this.data.gallery_photos) ? this.data.gallery_photos : []).filter(
              (p: any) =>
                categoryIds.has(p.event_id) &&
                !String(p.id || '').startsWith('g100') &&
                !String(p.id || '').startsWith('g-annual-')
            );
            this.data.gallery_photos = [...customCategoryPhotos, ...INITIAL_GALLERY];
            (this.data as any).__annual_day_only_v1 = true;
            this.save();
          }
          if (!parsed.__session_2026_v1 && Array.isArray(this.data.announcements)) {
            this.data.announcements = this.data.announcements.map((a: any) =>
              a.id === 'a1001' && String(a.title || '').includes('2025–2026')
                ? { ...a, title: 'Admissions Open for Academic Year 2026–2027', publish_date: '2026-06-15' }
                : a
            );
            (this.data as any).__session_2026_v1 = true;
            this.save();
          }
          if (!Array.isArray(this.data.admin_profiles) || !this.data.admin_profiles.some((p: any) => p.user_id === 'mock-admin-id')) {
            this.data.admin_profiles = [{ user_id: 'mock-admin-id', display_name: 'Smt. G. Venkatasree, Principal' }, ...(this.data.admin_profiles || [])];
          } else {
            this.data.admin_profiles = this.data.admin_profiles.map((p: any) =>
              p.user_id === 'mock-admin-id' && p.display_name === 'School Administrator'
                ? { ...p, display_name: 'Smt. G. Venkatasree, Principal' }
                : p
            );
          }
        }
        const savedUser = localStorage.getItem('vgn_mock_user');
        if (savedUser) {
          this.currentUser = JSON.parse(savedUser);
        }
      } catch (e) {
        // ignore
      }
    }
  }

  save() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vgn_mock_store', JSON.stringify(this.data));
      } catch (e) {
        // ignore
      }
    }
  }

  setSession(user: any) {
    this.currentUser = user;
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('vgn_mock_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('vgn_mock_user');
      }
    }
    const session = user ? { user, access_token: 'mock-token' } : null;
    this.authListeners.forEach((cb) => cb(user ? 'SIGNED_IN' : 'SIGNED_OUT', session));
  }
}

const mockStore = new MockSupabaseStore();

function createQueryBuilder(table: string) {
  let filters: Array<(item: any) => boolean> = [];
  let sortFn: ((a: any, b: any) => number) | null = null;
  let limitN: number | null = null;

  const builder: any = {
    select: (_cols?: string) => builder,
    eq: (col: string, val: any) => {
      filters.push((item) => item[col] === val);
      return builder;
    },
    gte: (col: string, val: any) => {
      filters.push((item) => String(item[col]) >= String(val));
      return builder;
    },
    lte: (col: string, val: any) => {
      filters.push((item) => String(item[col]) <= String(val));
      return builder;
    },
    order: (col: string, opts?: { ascending?: boolean }) => {
      const asc = opts?.ascending ?? true;
      sortFn = (a, b) => {
        const valA = a[col];
        const valB = b[col];
        if (valA < valB) return asc ? -1 : 1;
        if (valA > valB) return asc ? 1 : -1;
        return 0;
      };
      return builder;
    },
    limit: (n: number) => {
      limitN = n;
      return builder;
    },
    maybeSingle: async () => {
      const { data } = await builder.execute();
      return { data: data && data.length > 0 ? data[0] : null, error: null };
    },
    single: async () => {
      const { data } = await builder.execute();
      return { data: data && data.length > 0 ? data[0] : null, error: null };
    },
    execute: async () => {
      let list = [...(mockStore.data[table] || [])];
      if (table === 'gallery_photos') {
        const eventsById = new Map((mockStore.data.events || []).map((ev: any) => [ev.id, ev]));
        list = list.map((item) => {
          if (!item.event && item.event_id) {
            const ev = eventsById.get(item.event_id);
            if (ev) {
              return {
                ...item,
                event: { id: ev.id, title: ev.title, slug: ev.slug, event_date: ev.event_date },
              };
            }
          }
          return item;
        });
      }
      for (const filter of filters) {
        list = list.filter(filter);
      }
      if (sortFn) {
        list.sort(sortFn);
      }
      if (limitN !== null) {
        list = list.slice(0, limitN);
      }
      return { data: list, error: null };
    },
    then: (resolve: any, reject: any) => {
      return builder.execute().then(resolve, reject);
    },
    insert: (payload: any) => {
      const runInsert = async () => {
        const items = Array.isArray(payload) ? payload : [payload];
        const inserted = items.map((item) => ({
          id: item.id || `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item,
        }));
        if (!mockStore.data[table]) mockStore.data[table] = [];
        mockStore.data[table].unshift(...inserted);
        mockStore.save();
        return { data: Array.isArray(payload) ? inserted : inserted[0], error: null };
      };
      let promise: Promise<any> | null = null;
      const exec = () => (promise ??= runInsert());
      const insertBuilder: any = {
        select: (_cols?: string) => insertBuilder,
        single: async () => {
          const res = await exec();
          return { data: Array.isArray(res.data) ? res.data[0] : res.data, error: res.error };
        },
        maybeSingle: async () => {
          const res = await exec();
          return { data: Array.isArray(res.data) ? res.data[0] ?? null : res.data ?? null, error: res.error };
        },
        then: (resolve: any, reject: any) => exec().then(resolve, reject),
      };
      return insertBuilder;
    },
    upsert: async (payload: any, options?: { onConflict?: string }) => {
      const items = Array.isArray(payload) ? payload : [payload];
      const conflictKey = options?.onConflict || 'id';
      if (!mockStore.data[table]) mockStore.data[table] = [];

      items.forEach((item) => {
        const idx = mockStore.data[table].findIndex((r) => r[conflictKey] === item[conflictKey]);
        if (idx >= 0) {
          mockStore.data[table][idx] = { ...mockStore.data[table][idx], ...item, updated_at: new Date().toISOString() };
        } else {
          mockStore.data[table].push({
            id: item.id || `mock-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...item,
          });
        }
      });
      mockStore.save();
      return { data: payload, error: null };
    },
    update: (payload: any) => {
      let updateFilter: ((item: any) => boolean) | null = null;
      const updateBuilder: any = {
        eq: (col: string, val: any) => {
          updateFilter = (item) => item[col] === val;
          return updateBuilder;
        },
        execute: async () => {
          if (!mockStore.data[table]) return { data: [], error: null };
          const updated: any[] = [];
          mockStore.data[table] = mockStore.data[table].map((item) => {
            if (!updateFilter || updateFilter(item)) {
              const u = { ...item, ...payload, updated_at: new Date().toISOString() };
              updated.push(u);
              return u;
            }
            return item;
          });
          mockStore.save();
          return { data: updated, error: null };
        },
        then: (resolve: any, reject: any) => updateBuilder.execute().then(resolve, reject),
      };
      return updateBuilder;
    },
    delete: () => {
      let deleteFilter: ((item: any) => boolean) | null = null;
      const deleteBuilder: any = {
        eq: (col: string, val: any) => {
          deleteFilter = (item) => item[col] === val;
          return deleteBuilder;
        },
        execute: async () => {
          if (!mockStore.data[table]) return { data: [], error: null };
          if (deleteFilter) {
            mockStore.data[table] = mockStore.data[table].filter((item) => !deleteFilter!(item));
          }
          mockStore.save();
          return { data: [], error: null };
        },
        then: (resolve: any, reject: any) => deleteBuilder.execute().then(resolve, reject),
      };
      return deleteBuilder;
    },
  };

  return builder;
}

const mockSupabase = {
  from: (table: string) => createQueryBuilder(table),
  auth: {
    getSession: async () => {
      const user = mockStore.currentUser;
      return {
        data: {
          session: user ? { user, access_token: 'mock-session-token' } : null,
        },
        error: null,
      };
    },
    getUser: async () => {
      return {
        data: { user: mockStore.currentUser },
        error: null,
      };
    },
    signInWithPassword: async ({ email }: { email: string; password?: string }) => {
      const mockUser = {
        id: 'mock-admin-id',
        email: email || 'admin@vgnschool.edu.in',
        role: 'authenticated',
        created_at: new Date().toISOString(),
      };
      mockStore.setSession(mockUser);
      return {
        data: { user: mockUser, session: { user: mockUser, access_token: 'mock-token' } },
        error: null,
      };
    },
    signOut: async () => {
      mockStore.setSession(null);
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      mockStore.authListeners.push(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              mockStore.authListeners = mockStore.authListeners.filter((cb) => cb !== callback);
            },
          },
        },
      };
    },
  },
  storage: {
    from: (_bucket: string) => ({
      upload: async (path: string, file: File) => {
        let publicUrl = 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800';
        if (typeof window !== 'undefined' && file instanceof Blob) {
          publicUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : URL.createObjectURL(file));
            reader.onerror = () => resolve(URL.createObjectURL(file));
            reader.readAsDataURL(file);
          });
          mockStore.data.__uploads = mockStore.data.__uploads || [];
          mockStore.data.__uploads = mockStore.data.__uploads.filter((u: any) => u.path !== path);
          mockStore.data.__uploads.push({ path, publicUrl });
          mockStore.save();
        }
        return {
          data: { path, publicUrl },
          error: null,
        };
      },
      getPublicUrl: (path: string) => {
        const stored = (mockStore.data.__uploads || []).find((u: any) => u.path === path);
        return {
          data: {
            publicUrl: stored?.publicUrl
              ? stored.publicUrl
              : path.startsWith('http')
                ? path
                : 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
        };
      },
      remove: async (paths: string[]) => {
        if (mockStore.data.__uploads) {
          mockStore.data.__uploads = mockStore.data.__uploads.filter((u: any) => !paths.includes(u.path));
          mockStore.save();
        }
        return {
          data: [],
          error: null,
        };
      },
    }),
  },
};

export const isSupabaseConfigured = hasValidCredentials;

// Export real Supabase client if configured, otherwise export seamless fallback
export const supabase: any = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;
