import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { PublicLayout } from './components/layout/PublicLayout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Work } from './pages/Work';
import { ProjectDetail } from './pages/ProjectDetail';
import { CaseStudies } from './pages/CaseStudies';
import { CaseStudyDetail } from './pages/CaseStudyDetail';
import { Certificates } from './pages/Certificates';
import { CV } from './pages/CV';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProjects } from './pages/admin/Projects';
import { AdminServices } from './pages/admin/Services';
import { AdminCertificates } from './pages/admin/Certificates';
import { AdminMessages } from './pages/admin/Messages';
import { AdminProfile } from './pages/admin/Profile';
import { AdminSettings } from './pages/admin/Settings';
import { AdminNotFound } from './pages/admin/AdminNotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin Login - Standalone view with no public navbar/footer and no admin sidebar */}
        <Route path="/Root/login" element={<AdminLogin />} />

        {/* Admin CMS Pages */}
        <Route path="/Root" element={<AdminDashboard />} />
        <Route path="/Root/projects" element={<AdminProjects />} />
        <Route path="/Root/services" element={<AdminServices />} />
        <Route path="/Root/certificates" element={<AdminCertificates />} />
        <Route path="/Root/messages" element={<AdminMessages />} />
        <Route path="/Root/profile" element={<AdminProfile />} />
        <Route path="/Root/settings" element={<AdminSettings />} />
        <Route path="/Root/*" element={<AdminNotFound />} />

        {/* Public Website Pages (Rendered inside PublicLayout) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
