import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
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
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminMessages } from './pages/admin/Messages';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/Root');

  return (
    <div className="min-h-screen flex flex-col bg-paper selection:bg-graphite-900 selection:text-white">
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Routes>
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
          
          <Route path="/Root/login" element={<AdminLogin />} />
          <Route path="/Root" element={<AdminDashboard />} />
          <Route path="/Root/messages" element={<AdminMessages />} />
          
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center pt-20">
              <div className="text-center">
                <h1 className="text-4xl font-semibold mb-4 text-graphite-900">404</h1>
                <p className="text-graphite-600 mb-8">Looks like this page wandered off.</p>
                <a href="/" className="px-6 py-3 bg-graphite-900 text-white rounded-full text-sm font-medium hover:bg-graphite-800 transition-colors">
                  Back Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
