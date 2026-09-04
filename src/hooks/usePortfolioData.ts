import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Service, Certificate, Tool, SiteProfile, SiteSettings } from '@/types';
import { fallbackProjects, fallbackServices, fallbackCertificates, fallbackTools } from '@/data';
import { defaultProfile, defaultSettings } from '@/lib/portfolioService';

export function usePortfolioData() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [certificates, setCertificates] = useState<Certificate[]>(fallbackCertificates);
  const [tools, setTools] = useState<Tool[]>(fallbackTools);
  const [profile, setProfile] = useState<SiteProfile>(defaultProfile);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubs: (() => void)[] = [];

    try {
      // Projects listener
      const projUnsub = onSnapshot(collection(db, 'projects'), (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
          setProjects(list);
        } else {
          setProjects(fallbackProjects);
        }
      }, () => {
        setProjects(fallbackProjects);
      });
      unsubs.push(projUnsub);

      // Services listener
      const srvUnsub = onSnapshot(collection(db, 'services'), (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
          setServices(list);
        } else {
          setServices(fallbackServices);
        }
      }, () => {
        setServices(fallbackServices);
      });
      unsubs.push(srvUnsub);

      // Certificates listener
      const certUnsub = onSnapshot(collection(db, 'certificates'), (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate));
          setCertificates(list);
        } else {
          setCertificates(fallbackCertificates);
        }
      }, () => {
        setCertificates(fallbackCertificates);
      });
      unsubs.push(certUnsub);

      // Tools listener
      const toolsUnsub = onSnapshot(collection(db, 'tools'), (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data() } as Tool));
          setTools(list);
        } else {
          setTools(fallbackTools);
        }
      }, () => {
        setTools(fallbackTools);
      });
      unsubs.push(toolsUnsub);

      // Profile listener
      const profileUnsub = onSnapshot(doc(db, 'profile', 'main'), (snap) => {
        if (snap.exists()) {
          setProfile({ ...defaultProfile, ...snap.data() } as SiteProfile);
        }
      }, () => {
        setProfile(defaultProfile);
      });
      unsubs.push(profileUnsub);

      // Settings listener
      const settingsUnsub = onSnapshot(doc(db, 'settings', 'main'), (snap) => {
        if (snap.exists()) {
          setSettings({ ...defaultSettings, ...snap.data() } as SiteSettings);
        }
      }, () => {
        setSettings(defaultSettings);
      });
      unsubs.push(settingsUnsub);

      setLoading(false);
    } catch {
      setLoading(false);
    }

    return () => {
      unsubs.forEach(fn => fn());
    };
  }, []);

  return {
    projects,
    services,
    certificates,
    tools,
    profile,
    settings,
    loading
  };
}
