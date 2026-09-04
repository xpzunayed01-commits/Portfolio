import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Project, 
  Service, 
  Certificate, 
  ContactMessage, 
  SiteProfile, 
  ProfileData,
  SiteSettings 
} from '@/types';
import { 
  fallbackProjects, 
  fallbackServices, 
  fallbackCertificates, 
  fallbackProfile, 
  fallbackSettings 
} from '@/data';

export const defaultProfile: SiteProfile = {
  name: 'Zunayed Al Hasan',
  professionalName: "Zunayed's Portfolio",
  professionalTitle: 'Web Designer · UI/UX Designer · Creative Developer',
  tagline: 'Design · Development · Creativity',
  heroHeadline: 'Turning ideas into digital experiences people remember.',
  heroSubtitle: 'I design thoughtful interfaces, build modern websites, and create digital experiences that are made to look good, work beautifully, and make an impact.',
  heroCtaText: 'View My Work',
  aboutHeading: 'Designing with intention, building with precision.',
  aboutBio: "I'm Zunayed Al Hasan, a freelance Web Designer, UI/UX Designer, and Creative Developer working at the intersection of creativity and logic. I specialize in taking an idea from a rough concept to a highly polished digital experience.",
  profileImageUrl: 'https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png',
  availabilityStatus: 'Available for Freelance & Creative Opportunities',
  location: 'Dhaka, Bangladesh · Remote Worldwide',
  experienceText: '5+ years crafting bespoke digital interfaces',
  email: 'xpzunayed01@gmail.com',
  phone: '+880 1700-000000',
  githubUrl: 'https://github.com/zunayedalhasan',
  linkedinUrl: 'https://linkedin.com/in/zunayedalhasan',
  behanceUrl: 'https://behance.net/zunayedalhasan',
  dribbbleUrl: 'https://dribbble.com/zunayedalhasan',
  youtubeUrl: '',
  otherSocialUrl: '',
  cvUrl: '#',
  cvButtonText: 'Download CV'
};

export const defaultSettings: SiteSettings = {
  siteName: "Zunayed's Portfolio",
  siteTitle: "Zunayed Al Hasan · Web & UI/UX Designer, Creative Developer",
  siteDescription: 'Portfolio of Zunayed Al Hasan — Web Designer, UI/UX Designer, and Creative Developer crafting modern, high-impact digital experiences.',
  logoText: "Zunayed's Portfolio",
  logoImageUrl: 'https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png',
  faviconUrl: 'https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png',
  defaultLanguage: 'English (US)',
  primaryColor: '#121316',
  backgroundColor: '#FAF9F6',
  buttonStyle: 'pill',
  contactEmail: 'xpzunayed01@gmail.com',
  availabilityStatus: 'Available for Freelance & Creative Opportunities',
  contactCtaText: "Let's Work Together",
  githubUrl: 'https://github.com/zunayedalhasan',
  linkedinUrl: 'https://linkedin.com/in/zunayedalhasan',
  instagramUrl: '',
  behanceUrl: 'https://behance.net/zunayedalhasan',
  dribbbleUrl: 'https://dribbble.com/zunayedalhasan',
  youtubeUrl: '',
  twitterUrl: '',
  metaTitle: "Zunayed Al Hasan · Web Designer · UI/UX Designer · Creative Developer",
  metaDescription: "Turning ideas into digital experiences people remember. Thoughtful interfaces, modern websites, and digital experiences.",
  ogImageUrl: 'https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png',
  keywords: 'Web Designer, UI/UX Designer, Creative Developer, React, Frontend, Portfolio, Dhaka, Remote',
  footerText: '© 2025 Zunayed Al Hasan. All rights reserved.',
  copyrightText: 'Designed & Developed with precision by Zunayed Al Hasan.',
  socialVisibility: true,
  maintenanceMode: false,
  authorizedAdmins: ['admin@zunayed.me', 'xpzunayed01@gmail.com']
};

// Seed initial fallback data into Firestore
export async function seedFirestoreWithDefaults() {
  const batchPromises: Promise<any>[] = [];

  // Seed Projects
  for (let i = 0; i < fallbackProjects.length; i++) {
    const proj = fallbackProjects[i];
    const docId = proj.slug || proj.id;
    const projRef = doc(db, 'projects', docId);
    batchPromises.push(setDoc(projRef, {
      ...proj,
      id: docId,
      published: true,
      order: i + 1,
      categories: proj.categories || [proj.category],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true }));
  }

  // Seed Services
  for (let i = 0; i < fallbackServices.length; i++) {
    const srv = fallbackServices[i];
    const docId = srv.slug || srv.id;
    const srvRef = doc(db, 'services', docId);
    batchPromises.push(setDoc(srvRef, {
      ...srv,
      id: docId,
      published: true,
      order: i + 1,
      updatedAt: serverTimestamp()
    }, { merge: true }));
  }

  // Seed Certificates
  for (let i = 0; i < fallbackCertificates.length; i++) {
    const cert = fallbackCertificates[i];
    const docId = cert.id;
    const certRef = doc(db, 'certificates', docId);
    batchPromises.push(setDoc(certRef, {
      ...cert,
      id: docId,
      published: true,
      order: i + 1,
      updatedAt: serverTimestamp()
    }, { merge: true }));
  }

  // Seed Profile in both 'profile/main' and 'siteContent/profile' for compatibility
  const profileRef = doc(db, 'siteContent', 'profile');
  batchPromises.push(setDoc(profileRef, {
    ...fallbackProfile,
    updatedAt: serverTimestamp()
  }, { merge: true }));

  const legacyProfileRef = doc(db, 'profile', 'main');
  batchPromises.push(setDoc(legacyProfileRef, {
    ...defaultProfile,
    updatedAt: serverTimestamp()
  }, { merge: true }));

  // Seed Settings in both 'siteContent/settings' and 'settings/main'
  const settingsRef = doc(db, 'siteContent', 'settings');
  batchPromises.push(setDoc(settingsRef, {
    ...defaultSettings,
    updatedAt: serverTimestamp()
  }, { merge: true }));

  const legacySettingsRef = doc(db, 'settings', 'main');
  batchPromises.push(setDoc(legacySettingsRef, {
    ...defaultSettings,
    updatedAt: serverTimestamp()
  }, { merge: true }));

  await Promise.all(batchPromises);
}

// -------------------------------------------------------------
// Project Operations
// -------------------------------------------------------------
export async function saveProject(project: Partial<Project> & { slug: string; id?: string }) {
  const docId = project.id || project.slug || `project-${Date.now()}`;
  const ref = doc(db, 'projects', docId);
  const data = {
    ...project,
    id: docId,
    published: project.published !== undefined ? project.published : true,
    featured: Boolean(project.featured),
    updatedAt: serverTimestamp(),
    ...(project.createdAt ? {} : { createdAt: serverTimestamp() })
  };
  await setDoc(ref, data, { merge: true });
  return docId;
}

export async function removeProject(id: string) {
  await deleteDoc(doc(db, 'projects', id));
}

export async function duplicateProject(original: Project) {
  const newSlug = `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`;
  const newProject: Partial<Project> & { slug: string } = {
    ...original,
    id: newSlug,
    slug: newSlug,
    title: `${original.title} (Copy)`,
    published: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await saveProject(newProject);
  return newSlug;
}

// -------------------------------------------------------------
// Service Operations
// -------------------------------------------------------------
export async function saveService(service: Partial<Service> & { slug: string; id?: string }) {
  const docId = service.id || service.slug || `service-${Date.now()}`;
  const ref = doc(db, 'services', docId);
  const data = {
    ...service,
    id: docId,
    published: service.published !== undefined ? service.published : true,
    updatedAt: serverTimestamp()
  };
  await setDoc(ref, data, { merge: true });
  return docId;
}

export async function removeService(id: string) {
  await deleteDoc(doc(db, 'services', id));
}

export async function duplicateService(original: Service) {
  const newSlug = `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`;
  const nextNumber = `${Number(original.number || 1) + 1}`.padStart(2, '0');
  const newService: Partial<Service> & { slug: string } = {
    ...original,
    id: newSlug,
    slug: newSlug,
    title: `${original.title} (Copy)`,
    number: nextNumber,
    published: false,
    updatedAt: serverTimestamp()
  };
  await saveService(newService);
  return newSlug;
}

// -------------------------------------------------------------
// Certificate Operations
// -------------------------------------------------------------
export async function saveCertificate(cert: Partial<Certificate> & { id?: string }) {
  const docId = cert.id || `cert-${Date.now()}`;
  const ref = doc(db, 'certificates', docId);
  const data = {
    ...cert,
    id: docId,
    published: cert.published !== undefined ? cert.published : true,
    updatedAt: serverTimestamp()
  };
  await setDoc(ref, data, { merge: true });
  return docId;
}

export async function removeCertificate(id: string) {
  await deleteDoc(doc(db, 'certificates', id));
}

export async function duplicateCertificate(original: Certificate) {
  const docId = `cert-${Date.now()}`;
  const newCert: Partial<Certificate> = {
    ...original,
    id: docId,
    title: `${original.title} (Copy)`,
    published: false,
    updatedAt: serverTimestamp()
  };
  await saveCertificate(newCert);
  return docId;
}

// -------------------------------------------------------------
// Message Operations
// -------------------------------------------------------------
export async function updateMessageStatus(id: string, status: 'unread' | 'read' | 'archived') {
  const ref = doc(db, 'contactMessages', id);
  await updateDoc(ref, { status });
}

export async function removeMessage(id: string) {
  await deleteDoc(doc(db, 'contactMessages', id));
}

export async function markAllMessagesAsRead(messages: ContactMessage[]) {
  const unread = messages.filter(m => m.status === 'unread');
  const promises = unread.map(m => updateDoc(doc(db, 'contactMessages', m.id), { status: 'read' }));
  await Promise.all(promises);
}

// -------------------------------------------------------------
// Profile & Settings Operations
// -------------------------------------------------------------
export async function saveProfile(profile: Partial<SiteProfile>) {
  const ref = doc(db, 'profile', 'main');
  await setDoc(ref, {
    ...profile,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function saveProfileData(profile: Partial<ProfileData>) {
  const ref = doc(db, 'siteContent', 'profile');
  await setDoc(ref, {
    ...profile,
    updatedAt: serverTimestamp()
  }, { merge: true });

  // Sync to legacy profile/main as well
  const legacyRef = doc(db, 'profile', 'main');
  await setDoc(legacyRef, {
    ...profile,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function saveSettings(settings: Partial<SiteSettings>) {
  const ref = doc(db, 'settings', 'main');
  await setDoc(ref, {
    ...settings,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function saveSiteSettings(settings: Partial<SiteSettings>) {
  const ref = doc(db, 'siteContent', 'settings');
  await setDoc(ref, {
    ...settings,
    updatedAt: serverTimestamp()
  }, { merge: true });

  const legacyRef = doc(db, 'settings', 'main');
  await setDoc(legacyRef, {
    ...settings,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// Export all portfolio data for offline JSON backups
export async function exportAllDataAsJSON() {
  const projectsSnap = await getDocs(collection(db, 'projects'));
  const servicesSnap = await getDocs(collection(db, 'services'));
  const certificatesSnap = await getDocs(collection(db, 'certificates'));
  const profileSnap = await getDoc(doc(db, 'siteContent', 'profile'));
  const settingsSnap = await getDoc(doc(db, 'siteContent', 'settings'));

  return {
    exportedAt: new Date().toISOString(),
    profile: profileSnap.exists() ? profileSnap.data() : fallbackProfile,
    settings: settingsSnap.exists() ? settingsSnap.data() : fallbackSettings,
    projects: projectsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    services: servicesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    certificates: certificatesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
  };
}
