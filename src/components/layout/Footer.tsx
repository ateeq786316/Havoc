import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { scrollToTop } from '../../lib/scrollToTop';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  const services = [
    'Mobile App Development',
    'Web Development',
    'Backend APIs',
    'Intelligent Automation',
    'Game Development',
    'QA Testing',
  ];

  const socials = [
    {
      name: 'Fiverr',
      href: 'https://fiverr.com/s/jjE6Vlm',
      icon: ExternalLink,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/havoc-solutions-583206375',
      icon: ExternalLink,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/havocsolutions.official',
      icon: ExternalLink,
    },
  ];

  const handleNavClick = (href: string) => {
    // If clicking on the same route, scroll to top
    if (window.location.pathname === href) {
      scrollToTop();
    }
  };

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link 
              to="/" 
              onClick={() => handleNavClick('/')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-text">
                Havoc Solutions
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              Havoc Solutions is a product engineering team delivering robust 
              digital platforms with cutting-edge technology and innovative solutions.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:havocsolutions1@gmail.com"
                className="flex items-center space-x-2 text-muted hover:text-primary transition-colors group"
              >
                <Mail size={16} />
                <span className="text-sm">havocsolutions1@gmail.com</span>
              </a>
              <a
                href="mailto:havocsolutions1@outlook.com"
                className="flex items-center space-x-2 text-muted hover:text-primary transition-colors group"
              >
                <Mail size={16} />
                <span className="text-sm">havocsolutions1@outlook.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-text font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-muted hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-text font-semibold">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-muted text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-text font-semibold">Connect</h3>
            <div className="space-y-3">
              {socials.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-muted hover:text-primary transition-colors group"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <social.icon size={16} />
                  <span className="text-sm">{social.name}</span>
                </motion.a>
              ))}
            </div>
            <div className="pt-4 border-t border-border">
              <Link
                to="/consultation"
                onClick={() => handleNavClick('/consultation')}
                className="inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted text-sm">
            © {currentYear} Havoc Solutions. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              to="/privacy"
              className="text-muted hover:text-primary transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-muted hover:text-primary transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;