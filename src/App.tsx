import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Reviews from './pages/Reviews';
import Consultation from './pages/Consultation';
import ConsultationApproval from './pages/ConsultationApproval';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import NotFound from './pages/NotFound';
import { useThemeStore } from './store/themeStore';

function App() {
  const { loadTheme } = useThemeStore();

  useEffect(() => {
    // Load theme on app initialization
    loadTheme();
  }, [loadTheme]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="projects" element={<Projects />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="consultation" element={<Consultation />} />
            <Route path="consultation-approval" element={<ConsultationApproval />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;