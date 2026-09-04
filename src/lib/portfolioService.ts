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
import { Project, Service, Certificate } from '@/types';
import { fallbackProjects, fallbackServices, fallbackCertificates } from '@/data';

export interface SiteProfile {
  name: string;
  professionalTitle: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  aboutBio: string;
  profileImageUrl: string;
  availabilityStatus: string;
  location: string;
  email: string;
  phone?: string;
  githubUrl: string;
  linkedinUrl: string;
  behanceUrl?: string;
  dribbbleUrl?: string;
  cvUrl?: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logoText: string;
  logoImageUrl: string;
  faviconUrl: string;
  footerText: string;
}

export const defaultProfile: SiteProfile = {
  name: 'Zunayed Al Hasan',
  professionalTitle: 'Web Designer · UI/UX Designer · Creative Developer',
  tagline: 'Design · Development · Creativity',
  heroHeadline: 'Turning ideas into digital experiences people remember.',
  heroSubtitle: 'I design thoughtful interfaces, build modern websites, and create digital experiences that are made to look good, work beautifully, and make an impact.',
  aboutBio: "I'm Zunayed Al Hasan, a freelance Web Designer, UI/UX Designer, and Creative Developer working at the intersection of creativity and logic. I specialize in taking an idea from a rough concept to a highly polished digital experience.",
  profileImageUrl: 'https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png',
  availabilityStatus: 'Available for Freelance & Creative Opportunities',
  location: 'Dhaka, Bangladesh · Remote Worldwide',
  email: 'xpzunayed01@gmail.com',
  phone: '+880 1700-000000',
  githubUrl: 'https://github.com/zunayedalhasan',
  linkedinUrl: 'https://linkedin.com/in/zunayedalhasan',
  behanceUrl: 'https://behance.net/zunayedalhasan',
  dribbbleUrl: 'https://dribbble.com/zunayedalhasan',
  cvUrl: '#'
};

export const defaultSettings: SiteSettings = {
  siteName: "Zunayed's Portfolio",
  siteDescription: 'Web Designer · UI/UX Designer · Creative Developer',
  logoText: "Zunayed's Portfolio",
  logoImageUrl: 'https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png',
  faviconUrl: 'https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png',
  footerText: '© 2025 Zunayed Al Hasan. All rights reserved.'
};

// Seed initial fallback data into Firestore (called from admin panel)
export async function seedFirestoreWithDefaults() {
  const batchPromises: Promise<any>[] = [];

  // Seed Projects
  for (const proj of fallbackProjects) {
    const projRef = doc(db, 'projects', proj.slug || proj.id);
    batchPromises.push(setDoc(projRef, {
      ...proj,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true }));
  }

  // Seed Services
  for (const srv of fallbackServices) {
    const srvRef = doc(db, 'services', srv.slug || srv.id);
    batchPromises.push(setDoc(srvRef, {
      ...srv,
      updatedAt: serverTimestamp()
    }, { merge: true }));
  }

  // Seed Certificates
  for (const cert of fallbackCertificates) {
    const certRef = doc(db, 'certificates', cert.id);
    batchPromises.push(setDoc(certRef, {
      ...cert,
      updatedAt: serverTimestamp()
    }, { merge: true }));
  }

  // Seed Profile
  const profileRef = doc(db, 'profile', 'main');
  batchPromises.push(setDoc(profileRef, defaultProfile, { merge: true }));

  // Seed Settings
  const settingsRef = doc(db, 'settings', 'main');
  batchPromises.push(setDoc(settingsRef, defaultSettings, { merge: true }));

  await Promise.all(batchPromises);
}

// Project Operations
export async function saveProject(project: Partial<Project> & { id?: string; slug: string }) {
  const docId = project.slug || project.id || String(Date.now());
  const ref = doc(db, 'projects', docId);
  const data = {
    ...project,
    id: docId,
    updatedAt: serverTimestamp()
  };
  await setDoc(ref, data, { merge: true });
  return docId;
}

export async function removeProject(id: string) {
  await deleteDoc(doc(db, 'projects', id));
}

// Service Operations
export async function saveService(service: Partial<Service> & { id?: string; slug: string }) {
  const docId = service.slug || service.id || String(Date.now());
  const ref = doc(db, 'services', docId);
  const data = {
    ...service,
    id: docId,
    updatedAt: serverTimestamp()
  };
  await setDoc(ref, data, { merge: true });
  return docId;
}

export async function removeService(id: string) {
  await deleteDoc(doc(db, 'services', id));
}

// Certificate Operations
export async function saveCertificate(cert: Partial<Certificate> & { id?: string }) {
  const docId = cert.id || String(Date.now());
  const ref = doc(db, 'certificates', docId);
  const data = {
    ...cert,
    id: docId,
    updatedAt: serverTimestamp()
  };
  await setDoc(ref, data, { merge: true });
  return docId;
}

export async function removeCertificate(id: string) {
  await deleteDoc(doc(db, 'certificates', id));
}

// Profile & Settings Operations
export async function saveProfile(profile: Partial<SiteProfile>) {
  const ref = doc(db, 'profile', 'main');
  await setDoc(ref, profile, { merge: true });
}

export async function saveSettings(settings: Partial<SiteSettings>) {
  const ref = doc(db, 'settings', 'main');
  await setDoc(ref, settings, { merge: true });
}
