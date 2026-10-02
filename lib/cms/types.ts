// Content model for the Chal Oye CMS.
// Every collection item extends BaseEntity so it maps 1:1 onto a Supabase table row later
// (id uuid primary key, created_at / updated_at timestamps).

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
export type PublishStatus = 'published' | 'draft';

export interface ItineraryDay {
  title: string;
  description: string;
  distance?: string;
  altitude?: string;
}

export interface Trek extends BaseEntity {
  slug: string;
  name: string;
  region: string; // e.g. Uttarakhand
  country: string; // e.g. India
  durationDays: number;
  price: number;
  originalPrice?: number;
  difficulty: Difficulty;
  maxAltitude: string;
  bestTime: string;
  groupSize: string;
  summary: string;
  description: string;
  image: string;
  gallery: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  departures: string[]; // ISO dates YYYY-MM-DD
  rating: number;
  reviewCount: number;
  featured: boolean;
  status: PublishStatus;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking extends BaseEntity {
  trekId: string;
  trekName: string;
  customerName: string;
  email: string;
  phone: string;
  departureDate: string;
  participants: number;
  amount: number;
  status: BookingStatus;
  notes?: string;
}

export type InquiryStatus = 'new' | 'replied' | 'closed';

export interface Inquiry extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  trekInterest?: string;
  status: InquiryStatus;
}

export interface Testimonial extends BaseEntity {
  name: string;
  location: string;
  trekName: string;
  rating: number;
  quote: string;
  avatar?: string;
  published: boolean;
}

export interface TeamMember extends BaseEntity {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  order: number;
}

export interface Subscriber extends BaseEntity {
  email: string;
}

export interface Faq extends BaseEntity {
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

// ---------- Singletons (one row each) ----------

export interface StatItem {
  value: string;
  label: string;
}

export interface FeatureItem {
  icon: string; // key from lib/icons
  title: string;
  description: string;
}

/** Heading block for a page section. `highlight` is a part of `title` shown in orange. */
export interface SectionCopy {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    subtitle: string;
    videoUrl: string;
    posterImage: string;
    primaryCta: string;
    secondaryCta: string;
  };
  regions: string[];
  stats: StatItem[];
  featuresTitle: string;
  featuresSubtitle: string;
  features: FeatureItem[];
  featuresImage: string;
  cta: {
    title: string;
    subtitle: string;
    image: string;
    buttonLabel: string;
  };
  sections: {
    featured: SectionCopy;
    levels: SectionCopy;
    testimonials: SectionCopy;
    faq: SectionCopy;
  };
  levelBlurbs: Record<Difficulty, string>;
}

export interface AboutContent {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  storyEyebrow: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  values: FeatureItem[];
  stats: StatItem[];
  sections: {
    values: SectionCopy;
    team: SectionCopy;
    cta: SectionCopy;
  };
}

/** Banners and images for pages that have no editor of their own. */
export interface PagesContent {
  trips: { eyebrow: string; title: string; highlight: string; image: string };
  contact: SectionCopy & { image: string; formTitle: string; formSubtitle: string };
  auth: { image: string };
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  currency: 'INR' | 'USD' | 'EUR';
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  officeHours: string;
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    link: string;
  };
  newsletter: {
    title: string;
    subtitle: string;
  };
}

// ---------- Registry ----------

export interface Collections {
  treks: Trek;
  bookings: Booking;
  inquiries: Inquiry;
  testimonials: Testimonial;
  team: TeamMember;
  faqs: Faq;
  subscribers: Subscriber;
}

export interface Singletons {
  home: HomeContent;
  about: AboutContent;
  pages: PagesContent;
  settings: SiteSettings;
}

export type CollectionKey = keyof Collections;
export type SingletonKey = keyof Singletons;

export type NewItem<K extends CollectionKey> = Omit<Collections[K], keyof BaseEntity>;

export type CMSSnapshot = {
  [K in CollectionKey]: Collections[K][];
} & {
  [K in SingletonKey]: Singletons[K];
};
