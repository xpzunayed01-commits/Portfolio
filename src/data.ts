import { Project, Service, Certificate, Tool } from './types';

export const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'FocusFlow',
    slug: 'focusflow',
    category: 'UI/UX Design',
    shortDescription: 'A minimalist productivity application designed to reduce cognitive load and enhance focus.',
    year: '2025',
    technologies: ['Figma', 'React', 'Tailwind CSS'],
    client: 'Personal Project',
    liveUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070',
    gallery: [
      'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070'
    ],
    overview: 'FocusFlow is a productivity tool stripped down to its absolute essentials.',
    featured: true
  },
  {
    id: '2',
    title: 'Aura Skincare',
    slug: 'aura-skincare',
    category: 'Web Design',
    shortDescription: 'E-commerce experience for a premium botanical skincare brand.',
    year: '2025',
    technologies: ['Shopify', 'Next.js', 'Framer Motion'],
    client: 'Aura',
    coverImage: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000',
    gallery: [],
    overview: 'Redesigning the digital storefront for Aura to reflect their natural identity.',
    featured: true
  },
  {
    id: '3',
    title: 'Nova Financial',
    slug: 'nova-financial',
    category: 'Brand Identity',
    shortDescription: 'Complete brand overhaul and marketing site for a modern fintech startup.',
    year: '2024',
    technologies: ['Webflow', 'Illustrator', 'Figma'],
    client: 'Nova',
    liveUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070',
    gallery: [],
    overview: 'Creating trust through clean, structured design language.',
    featured: true
  }
];

export const fallbackServices: Service[] = [
  {
    id: '1',
    title: 'Web Design',
    slug: 'web-design',
    number: '01',
    shortDescription: 'Crafting visually stunning, editorial websites that convert and captivate.',
    deliverables: ['Wireframes', 'High-Fidelity Mockups', 'Interactive Prototypes', 'Design Systems'],
    icon: 'Monitor'
  },
  {
    id: '2',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    number: '02',
    shortDescription: 'Designing intuitive, user-centric interfaces that solve real problems.',
    deliverables: ['User Research', 'User Journeys', 'Interface Design', 'Usability Testing'],
    icon: 'Layers'
  },
  {
    id: '3',
    title: 'Website Development',
    slug: 'website-development',
    number: '03',
    shortDescription: 'Building fast, accessible, and scalable digital experiences using modern frameworks.',
    deliverables: ['Frontend Architecture', 'Responsive Development', 'Performance Optimization', 'CMS Integration'],
    icon: 'Code'
  },
  {
    id: '4',
    title: 'Brand Identity',
    slug: 'brand-identity',
    number: '04',
    shortDescription: 'Creating cohesive visual systems that tell your unique story.',
    deliverables: ['Logo Design', 'Typography Selection', 'Color Palette', 'Brand Guidelines'],
    icon: 'Sparkles'
  }
];

export const fallbackCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Google AI Essentials',
    issuer: 'Google / Coursera',
    issued: 'March 13, 2025',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070' // placeholder
  },
  {
    id: '2',
    title: 'Professional Machine Learning Engineer',
    issuer: 'Google Cloud',
    issued: 'May 27, 2025',
    expiration: 'May 27, 2027',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070'
  }
];

export const fallbackTools: Tool[] = [
  { name: 'Figma', icon: 'Figma', category: 'Design' },
  { name: 'React', icon: 'Code2', category: 'Development' },
  { name: 'Next.js', icon: 'Blocks', category: 'Development' },
  { name: 'Tailwind CSS', icon: 'Palette', category: 'Development' },
  { name: 'Supabase', icon: 'Database', category: 'Backend' },
  { name: 'Illustrator', icon: 'PenTool', category: 'Design' },
];
