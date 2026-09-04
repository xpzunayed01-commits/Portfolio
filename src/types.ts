export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  categories?: string[];
  shortDescription: string;
  year: string;
  technologies: string[];
  client: string;
  role?: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  coverImage: string;
  gallery: string[];
  overview: string;
  problem?: string;
  goal?: string;
  process?: string;
  solution?: string;
  learnings?: string;
  featured: boolean;
  published: boolean;
  order?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  number: string;
  icon: string;
  shortDescription: string;
  fullDescription?: string;
  deliverables: string[];
  process?: ServiceProcessStep[];
  tools?: string[];
  faqs?: ServiceFAQ[];
  published?: boolean;
  order?: number;
  updatedAt?: any;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  expiration?: string;
  certificateId?: string;
  verificationUrl?: string;
  description?: string;
  image: string;
  published?: boolean;
  order?: number;
  updatedAt?: any;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt?: any;
}

export interface Tool {
  name: string;
  icon: string;
  category: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  company: string;
  description?: string;
  type: 'experience' | 'education';
}

export interface ProfileStats {
  experience?: string;
  projects?: string;
  clients?: string;
}

export interface ProfileSkills {
  design?: string[];
  development?: string[];
  tools?: string[];
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  figma?: string;
  dribbble?: string;
  twitter?: string;
  instagram?: string;
  behance?: string;
  youtube?: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  avatarUrl: string;
  bioParagraph1?: string;
  bioParagraph2?: string;
  availability?: string;
  resumeUrl?: string;
  location?: string;
  email?: string;
  phone?: string;
  stats?: ProfileStats;
  skills?: ProfileSkills;
  experience?: TimelineItem[];
  education?: TimelineItem[];
  socials?: SocialLinks;
  updatedAt?: any;
}

export interface SiteProfile {
  name: string;
  professionalName?: string;
  professionalTitle: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroCtaText?: string;
  aboutHeading?: string;
  aboutBio: string;
  profileImageUrl: string;
  availabilityStatus: string;
  location: string;
  experienceText?: string;
  email: string;
  phone?: string;
  githubUrl: string;
  linkedinUrl: string;
  behanceUrl?: string;
  dribbbleUrl?: string;
  youtubeUrl?: string;
  otherSocialUrl?: string;
  cvUrl?: string;
  cvButtonText?: string;
  updatedAt?: any;
}

export interface SiteSettings {
  siteName: string;
  siteTitle?: string;
  siteDescription?: string;
  logoText?: string;
  logoImageUrl?: string;
  faviconUrl?: string;
  defaultLanguage?: string;
  primaryColor?: string;
  backgroundColor?: string;
  buttonStyle?: 'pill' | 'rounded' | 'square';
  contactEmail?: string;
  availabilityStatus?: string;
  contactCtaText?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  behanceUrl?: string;
  dribbbleUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  keywords?: string;
  footerText: string;
  copyrightText?: string;
  socialVisibility?: boolean;
  maintenanceMode?: boolean;
  allowMessages?: boolean;
  authorizedAdmins?: string[];
  updatedAt?: any;
}
