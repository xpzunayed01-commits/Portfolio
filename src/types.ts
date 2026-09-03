export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  year: string;
  technologies: string[];
  client: string;
  liveUrl?: string;
  coverImage: string;
  gallery: string[];
  overview: string;
  problem?: string;
  goal?: string;
  role?: string;
  process?: string;
  featured: boolean;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  number: string;
  shortDescription: string;
  deliverables: string[];
  icon: string; // Will map to a lucide icon
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  expiration?: string;
  image: string;
}

export interface Tool {
  name: string;
  icon: string;
  category: string;
}
