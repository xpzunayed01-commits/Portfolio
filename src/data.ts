import { Project, Service, Certificate, Tool, ProfileData, SiteSettings } from './types';

export const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'FocusFlow',
    slug: 'focusflow',
    category: 'UI/UX Design',
    categories: ['UI/UX Design'],
    shortDescription: 'A minimalist productivity application designed to reduce cognitive load and enhance focus.',
    year: '2025',
    technologies: ['Figma', 'React', 'Tailwind CSS'],
    client: 'Personal Project',
    role: 'Lead UI/UX Designer',
    liveUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070',
    gallery: [
      'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070'
    ],
    overview: 'FocusFlow is a productivity tool stripped down to its absolute essentials.',
    problem: 'Modern productivity apps are cluttered with redundant features and overwhelming notifications.',
    goal: 'Design a clean, distraction-free environment that promotes deep focus.',
    process: 'Conducted user interviews with 15 remote professionals, iterated rapid Figma prototypes, and validated core workflows.',
    solution: 'A refined single-view interface with minimal cognitive drag and instantaneous keyboard shortcuts.',
    learnings: 'Less visual noise directly correlates with higher task completion speed.',
    featured: true,
    published: true,
    order: 1
  },
  {
    id: '2',
    title: 'Aura Skincare',
    slug: 'aura-skincare',
    category: 'Web Design',
    categories: ['Web Design', 'Brand Identity'],
    shortDescription: 'E-commerce experience for a premium botanical skincare brand.',
    year: '2025',
    technologies: ['Shopify', 'React', 'Tailwind CSS'],
    client: 'Aura Botanical',
    role: 'Digital Designer & Frontend Developer',
    coverImage: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000'
    ],
    overview: 'Redesigning the digital storefront for Aura to reflect their natural, organic brand philosophy.',
    problem: 'The previous storefront had high checkout drop-offs and poor mobile rendering.',
    goal: 'Create a tactile, editorial shopping experience with effortless checkout pathways.',
    process: 'Mapped the customer journey, simplified the product catalog navigation, and designed bespoke typography layouts.',
    solution: 'A high-conversion boutique shop with smooth transitions and rich editorial photography.',
    learnings: 'Tactile product imagery and clear ingredient breakdowns doubled add-to-cart rates.',
    featured: true,
    published: true,
    order: 2
  },
  {
    id: '3',
    title: 'Nova Financial',
    slug: 'nova-financial',
    category: 'Brand Identity',
    categories: ['Brand Identity', 'UI/UX Design'],
    shortDescription: 'Complete brand overhaul and marketing site for a modern fintech startup.',
    year: '2024',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    client: 'Nova Labs',
    role: 'Brand & Product Designer',
    liveUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070'
    ],
    overview: 'Creating trust through clean, structured design language and data visualization.',
    problem: 'Traditional financial platforms overwhelm users with opaque terminology and dense tables.',
    goal: 'Demystify financial analytics through accessible diagrams and friendly UX copy.',
    process: 'Synthesized user analytics, developed a coherent design system, and engineered interactive charts.',
    solution: 'A modern, confidence-inspiring financial dashboard that clarifies cash flow.',
    learnings: 'Clarity in financial figures fosters immediate user confidence.',
    featured: true,
    published: true,
    order: 3
  }
];

export const fallbackServices: Service[] = [
  {
    id: '1',
    title: 'Web Design',
    slug: 'web-design',
    number: '01',
    shortDescription: 'Crafting visually stunning, editorial websites that convert and captivate.',
    fullDescription: 'Editorial, high-performance websites tailored to elevate brands. From wireframing to responsive design, every layout is structured for optimal clarity and aesthetic impact.',
    deliverables: ['Wireframes', 'High-Fidelity Mockups', 'Interactive Prototypes', 'Design Systems'],
    tools: ['Figma', 'Tailwind CSS', 'React', 'Adobe CC'],
    process: [
      { step: '01', title: 'Discovery & Strategy', description: 'Aligning on goals, target audience, and brand positioning.' },
      { step: '02', title: 'Information Architecture', description: 'Structuring user journeys and content wireframes.' },
      { step: '03', title: 'Editorial UI Design', description: 'Applying typographic hierarchy, warm neutrals, and responsive components.' },
      { step: '04', title: 'Handoff & Build', description: 'Delivering production-ready design tokens and asset kits.' }
    ],
    faqs: [
      { question: 'What deliverables will I receive?', answer: 'Complete Figma source files, reusable component libraries, style guides, and design specifications.' },
      { question: 'What is the standard turnaround time?', answer: 'A full website design sprint typically spans 2 to 4 weeks depending on scope.' }
    ],
    icon: 'Monitor',
    published: true,
    order: 1
  },
  {
    id: '2',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    number: '02',
    shortDescription: 'Designing intuitive, user-centric interfaces that solve real problems.',
    fullDescription: 'End-to-end interface and product experience design for web applications, SaaS platforms, and mobile apps. Every screen is designed with obsessive attention to ergonomics.',
    deliverables: ['User Research', 'User Journeys', 'Interface Design', 'Usability Testing'],
    tools: ['Figma', 'FigJam', 'Protopie', 'UserTesting'],
    process: [
      { step: '01', title: 'User Research', description: 'Identifying friction points, user needs, and competitive gaps.' },
      { step: '02', title: 'Prototyping', description: 'Building interactive flow models to test usability early.' },
      { step: '03', title: 'Systematization', description: 'Structuring robust design systems with tokens and states.' }
    ],
    faqs: [
      { question: 'Do you create interactive prototypes?', answer: 'Yes, all projects include high-fidelity interactive prototypes for stakeholder and user testing.' }
    ],
    icon: 'Layers',
    published: true,
    order: 2
  },
  {
    id: '3',
    title: 'Website Development',
    slug: 'website-development',
    number: '03',
    shortDescription: 'Building fast, accessible, and scalable digital experiences using modern frameworks.',
    fullDescription: 'Translating design concepts into clean, accessible, and ultra-fast frontend code. Utilizing React, TypeScript, and modern CSS architecture.',
    deliverables: ['Frontend Architecture', 'Responsive Development', 'Performance Optimization', 'CMS Integration'],
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    process: [
      { step: '01', title: 'Architecture Setup', description: 'Scaffolding clean, modular component structures.' },
      { step: '02', title: 'Component Engineering', description: 'Developing pixel-perfect responsive UI with smooth interactions.' },
      { step: '03', title: 'Testing & Optimization', description: 'Lighthouse audits, accessibility checks, and cross-browser testing.' }
    ],
    faqs: [
      { question: 'Is the code mobile-friendly?', answer: 'Yes, 100% responsive across phones, tablets, laptops, and ultra-wide displays.' }
    ],
    icon: 'Code',
    published: true,
    order: 3
  },
  {
    id: '4',
    title: 'Brand Identity',
    slug: 'brand-identity',
    number: '04',
    shortDescription: 'Creating cohesive visual systems that tell your unique story.',
    fullDescription: 'Developing modern visual identities that differentiate brands in crowded markets. Distinct logomarks, color palettes, and typographic rules.',
    deliverables: ['Logo Design', 'Typography Selection', 'Color Palette', 'Brand Guidelines'],
    tools: ['Illustrator', 'Photoshop', 'Figma'],
    process: [
      { step: '01', title: 'Brand Discovery', description: 'Uncovering brand personality, mood, and core values.' },
      { step: '02', title: 'Visual Explorations', description: 'Exploring distinctive logomarks and typographic styles.' },
      { step: '03', title: 'Identity Guidelines', description: 'Documenting logo usage, color palettes, and brand guidelines.' }
    ],
    faqs: [
      { question: 'What file formats are provided?', answer: 'Vector SVG, PDF, EPS, along with high-res PNG and web-optimized formats.' }
    ],
    icon: 'Sparkles',
    published: true,
    order: 4
  }
];

export const fallbackCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Google AI Essentials',
    issuer: 'Google / Coursera',
    issued: 'March 13, 2025',
    certificateId: 'GCC-982341',
    verificationUrl: 'https://coursera.org/verify/google-ai-essentials',
    description: 'Foundational knowledge of generative AI tools, prompt engineering, and ethical AI integration.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070',
    published: true,
    order: 1
  },
  {
    id: '2',
    title: 'Professional Machine Learning Engineer',
    issuer: 'Google Cloud',
    issued: 'May 27, 2025',
    expiration: 'May 27, 2027',
    certificateId: 'GCP-MLE-71829',
    verificationUrl: 'https://cloud.google.com/certification',
    description: 'Specialization in architecting machine learning systems, data pipelines, and production deployments.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070',
    published: true,
    order: 2
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

export const fallbackProfile: ProfileData = {
  name: 'Zunayed Al Hasan',
  title: 'Web Designer · UI/UX Designer · Creative Developer',
  tagline: 'Turning ideas into digital experiences people remember.',
  avatarUrl: 'https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png',
  bioParagraph1: 'I am a multidisciplinary designer and creative developer passionate about building thoughtful, human-centered digital products. I combine clean aesthetics with functional precision.',
  bioParagraph2: 'With experience across visual design, user research, design systems, and modern web engineering, I help founders and ambitious brands translate complex ideas into intuitive, memorable experiences.',
  availability: 'Available for select freelance & contract projects',
  resumeUrl: '/resume.pdf',
  location: 'Dhaka, Bangladesh · Available Worldwide',
  email: 'hello@zunayed.me',
  stats: {
    experience: '4+ Years',
    projects: '30+ Projects',
    clients: '100% Satisfaction'
  },
  skills: {
    design: [
      'UI/UX Design',
      'Design Systems',
      'Wireframing & Prototyping',
      'Information Architecture',
      'User Research & Testing',
      'Responsive Web Design',
      'Typography & Layout'
    ],
    development: [
      'React & TypeScript',
      'Tailwind CSS',
      'Next.js & Vite',
      'HTML5 / Modern CSS',
      'REST APIs & Cloud Firestore',
      'Framer Motion & Animations',
      'Git & Version Control'
    ],
    tools: [
      'Figma & FigJam',
      'Adobe Illustrator & Photoshop',
      'VS Code',
      'GitHub',
      'Vercel & Cloudflare',
      'Notion & Linear'
    ]
  },
  experience: [
    {
      id: 'exp-1',
      period: '2023 - Present',
      role: 'Lead UI/UX Designer & Developer',
      company: 'Independent Studio',
      description: 'Designing and engineering high-impact web applications, brand identities, and design systems for global clients.',
      type: 'experience'
    },
    {
      id: 'exp-2',
      period: '2021 - 2023',
      role: 'UI/UX Designer',
      company: 'Digital Product Agency',
      description: 'Crafted mobile app interfaces, SaaS dashboards, and e-commerce design systems with cross-functional teams.',
      type: 'experience'
    }
  ],
  education: [
    {
      id: 'edu-1',
      period: '2020 - 2024',
      role: 'B.Sc. in Computer Science & Engineering',
      company: 'University of Engineering',
      description: 'Focused on Human-Computer Interaction, Web Technologies, and Software Architecture.',
      type: 'education'
    }
  ],
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    figma: 'https://figma.com',
    dribbble: 'https://dribbble.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com'
  }
};

export const fallbackSettings: SiteSettings = {
  siteName: "Zunayed Al Hasan · Portfolio",
  metaDescription: "A premium, minimalistic, light-theme personal portfolio website for Zunayed Al Hasan, Web Designer & Creative Developer.",
  contactEmail: "hello@zunayed.me",
  footerText: "© 2025 Zunayed Al Hasan. All rights reserved.",
  allowMessages: true,
  authorizedAdmins: ["admin@zunayed.me", "zunayed@gmail.com"]
};
