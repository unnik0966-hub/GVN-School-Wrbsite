import { createClient } from '@supabase/supabase-js';
import { getFallbackContent } from './fallback-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const hasValidCredentials =
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('http') &&
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey.length > 10;

// Default initial data for mock store
const INITIAL_EVENTS = [
  {
    id: 'e1001',
    title: 'Annual Sports Day 2025',
    slug: 'annual-sports-day-2025',
    event_date: '2025-09-20',
    description: 'A day of track and field athletics, house march-past, drill displays, and medal ceremonies celebrating sportsmanship.',
    location: 'School Sports Complex',
    cover_image_url: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e1002',
    title: 'Cultural Evening & Talents Day',
    slug: 'cultural-evening-talents-day',
    event_date: '2025-10-15',
    description: 'An evening of classical music, folk dance, drama, and student performances showcasing the artistic brilliance of our students.',
    location: 'Main Auditorium',
    cover_image_url: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=800',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e1003',
    title: 'State Level Open Speed Skating Championship',
    slug: 'state-level-open-speed-skating-championship',
    event_date: '2025-11-05',
    description: 'Our champions glided to glory winning 6 Gold, 7 Silver, and 8 Bronze medals at the state tournament.',
    location: 'District Skating Arena',
    cover_image_url: 'https://images.pexels.com/photos/2005992/pexels-photo-2005992.jpeg?auto=compress&cs=tinysrgb&w=800',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e1004',
    title: 'Science & Innovation Expo 2025',
    slug: 'science-innovation-expo-2025',
    event_date: '2025-12-10',
    description: 'Student-built working models, robotics showcases, and interactive chemistry demonstrations across all grades.',
    location: 'Science Laboratory Block',
    cover_image_url: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=800',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'a1001',
    title: 'Admissions Open for Academic Year 2025–2026',
    body: 'Applications are now invited for Kindergarten through Class XII. Visit the admissions section to download forms or submit an inquiry.',
    publish_date: '2025-08-01',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a1002',
    title: '100% Pass Result in Board Examinations (X & XII Std)',
    body: 'Congratulations to all our high-achieving toppers and teachers for securing centum scores across Science and Commerce streams.',
    publish_date: '2025-07-20',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a1003',
    title: 'Parent-Teacher Interactive Forum Schedule',
    body: 'The term-1 review meeting for Class VI through XII will be held on the upcoming Saturday between 9:00 AM and 1:00 PM.',
    publish_date: '2025-07-10',
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
    id: 'g1001',
    event_id: 'e1001',
    storage_path: 'mock/annual_sports.jpg',
    public_url: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'March past salute by the senior student council at Sports Day',
    created_at: new Date().toISOString(),
    event: { id: 'e1001', title: 'Annual Sports Day 2025', slug: 'annual-sports-day-2025', event_date: '2025-09-20' },
  },
  {
    id: 'g1002',
    event_id: 'e1002',
    storage_path: 'mock/cultural_fest.jpg',
    public_url: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Classical dance performance during Cultural Talents Day',
    created_at: new Date().toISOString(),
    event: { id: 'e1002', title: 'Cultural Evening & Talents Day', slug: 'cultural-evening-talents-day', event_date: '2025-10-15' },
  },
  {
    id: 'g1003',
    event_id: 'e1003',
    storage_path: 'mock/skating_championship.jpg',
    public_url: 'https://images.pexels.com/photos/2005992/pexels-photo-2005992.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'State Level Speed Skating medal winners with the rolling trophy',
    created_at: new Date().toISOString(),
    event: { id: 'e1003', title: 'State Level Open Speed Skating Championship', slug: 'state-level-open-speed-skating-championship', event_date: '2025-11-05' },
  },
  {
    id: 'g1004',
    event_id: 'e1004',
    storage_path: 'mock/science_lab.jpg',
    public_url: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Hands-on physics and chemistry exhibits during Science Expo',
    created_at: new Date().toISOString(),
    event: { id: 'e1004', title: 'Science & Innovation Expo 2025', slug: 'science-innovation-expo-2025', event_date: '2025-12-10' },
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

// In-memory / localStorage store for robust offline mock execution
class MockSupabaseStore {
  data: Record<string, any[]> = {
    events: [...INITIAL_EVENTS],
    announcements: [...INITIAL_ANNOUNCEMENTS],
    staff: [...INITIAL_STAFF],
    gallery_photos: [...INITIAL_GALLERY],
    admissions_inquiries: [...INITIAL_INQUIRIES],
    admin_profiles: [{ user_id: 'mock-admin-id', display_name: 'School Administrator' }],
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
    insert: async (payload: any) => {
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
          publicUrl = URL.createObjectURL(file);
        }
        return {
          data: { path, publicUrl },
          error: null,
        };
      },
      getPublicUrl: (path: string) => ({
        data: {
          publicUrl: path.startsWith('http')
            ? path
            : 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
        },
      }),
      remove: async (_paths: string[]) => ({
        data: [],
        error: null,
      }),
    }),
  },
};

// Export real Supabase client if configured, otherwise export seamless fallback
export const supabase: any = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;
