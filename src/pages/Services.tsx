import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, ArrowRight, CheckCircle, Zap, Code, Smartphone, Gamepad2, TestTube, Cog } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useApi';
import { useDebounce } from '../hooks/useDebounce';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Service } from '../types';

// Add custom styles for scrollbar hiding
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: services, isLoading, error } = useServices();

  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const serviceIcons: Record<string, React.ReactNode> = {
    'Mobile Apps': <Smartphone size={24} className="text-primary" />,
    'Web Development': <Code size={24} className="text-primary" />,
    'Backend APIs': <Zap size={24} className="text-primary" />,
    'Intelligent Automation': <Cog size={24} className="text-primary" />,
    'Game Development': <Gamepad2 size={24} className="text-primary" />,
    'QA Testing': <TestTube size={24} className="text-primary" />,
  };

  const mainCategories = [
    'All',
    'Development',
    'Testing',
    'Integration',
    'Design'
  ];

  const additionalCategories = [
    'Custom Software Development',
    'Web Development',
    'Mobile App Development',
    'Enterprise Software Development',
    'IT Consulting',
    'DevOps Services',
    'Quality Assurance & Testing',
    'System Integration',
    'UI/UX Design',
    'Maintenance & Support',
    'AI & Machine Learning Development',
    'Game Development',
    'E-commerce Development',
    'SaaS Development',
    'Embedded Systems Development',
    'Legacy System Modernization',
    'Data Analytics',
    'Cybersecurity Services',
    'Cloud Migration',
  ];

  const categories = showAllCategories ? [...mainCategories, ...additionalCategories] : mainCategories;

  const filteredServices = useMemo(() => {
    if (!services) return [];

    return services
      .filter((service: Service) => {
        // Only show active services (default to true if not set)
        if (service.is_active === false) return false;
        
      const matchesSearch = debouncedSearch === '' || 
        service.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          (service.description && service.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || 
          service.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
      })
      .sort((a: Service, b: Service) => {
        // Sort by display_order (lower numbers first), then by title
        const orderA = a.display_order || 0;
        const orderB = b.display_order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
    });
  }, [services, debouncedSearch, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-4">Error Loading Services</h2>
          <p className="text-muted mb-6">{error.message}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <style>{scrollbarHideStyles}</style>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="py-20 bg-gradient-to-br from-bg via-surface to-card"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6"
            >
              Our Services
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted mb-8 leading-relaxed"
            >
              Comprehensive software development solutions tailored to your business needs. 
              From concept to deployment, we deliver excellence at every step.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="mb-12"
          >
            <div className="flex flex-col gap-6">
              {/* Search */}
              <div className="relative w-full max-w-md mx-auto">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-text placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-text mb-2">Filter by Category</h3>
                  <p className="text-sm text-muted">Click on a category to filter services</p>
                </div>
                
                {/* Mobile: Scrollable horizontal */}
                <div className="block lg:hidden">
                  <motion.div 
                    className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                    layout
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                {categories.map((category) => (
                      <motion.button
                    key={category}
                        onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                          (category === 'All' && selectedCategory === '') || selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text hover:bg-card'
                    }`}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </motion.div>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden lg:block">
                  <motion.div 
                    className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 max-w-6xl mx-auto"
                    layout
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left ${
                          (category === 'All' && selectedCategory === '') || selectedCategory === category
                            ? 'bg-primary text-white shadow-lg transform scale-105'
                            : 'bg-surface text-text hover:bg-card hover:shadow-md hover:transform hover:scale-105'
                        }`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                  >
                    {category}
                      </motion.button>
                    ))}
                  </motion.div>
                </div>

                {/* Show More/Less Button */}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="px-6 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-primary/20 hover:border-primary/40 rounded-lg"
                  >
                    {showAllCategories ? 'Show Less Categories' : `Show All Categories (${additionalCategories.length} more)`}
                  </button>
                </div>

                {/* Active filter indicator */}
                {selectedCategory && (
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                      <span className="text-sm text-muted">Active filter:</span>
                      <span className="text-sm font-medium text-primary">{selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory('')}
                        className="text-muted hover:text-text transition-colors"
                      >
                        ✕
                  </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredServices.map((service: Service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group"
              >
                <Card hover className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      {service.icon ? (
                        <span className="text-2xl">{service.icon}</span>
                      ) : (
                        serviceIcons[service.title] || <Code size={24} className="text-primary" />
                      )}
                    </div>
                    {service.category && (
                      <span className="px-3 py-1 bg-surface text-muted text-sm rounded-full">
                        {service.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-muted mb-6 flex-grow leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    {(service.what_included && service.what_included.length > 0) ? (
                      service.what_included.slice(0, 3).map((item: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-muted">
                          <CheckCircle size={16} className="text-primary" />
                          <span>{item}</span>
                        </div>
                      ))
                    ) : (
                      <>
                    <div className="flex items-center space-x-2 text-sm text-muted">
                      <CheckCircle size={16} className="text-primary" />
                      <span>Custom Solutions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted">
                      <CheckCircle size={16} className="text-primary" />
                      <span>Expert Support</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted">
                      <CheckCircle size={16} className="text-primary" />
                      <span>Quality Assurance</span>
                    </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                      onClick={() => setSelectedService(service)}
                    >
                      Learn More
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-text mb-2">No services found</h3>
              <p className="text-muted mb-6">
                Try adjusting your search terms or category filter.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss your project requirements and create a solution that 
              perfectly fits your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/consultation"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              >
                <span>Start a Project</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center space-x-2"
              >
                <span>Contact Us</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedService(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    {selectedService.icon ? (
                      <span className="text-2xl">{selectedService.icon}</span>
                    ) : (
                      serviceIcons[selectedService.title] || <Code size={24} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text">{selectedService.title}</h2>
                    {selectedService.category && (
                      <span className="text-muted">{selectedService.category}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 text-muted hover:text-text hover:bg-surface rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="prose prose-lg max-w-none text-muted mb-8">
                {selectedService.description}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">What's Included</h3>
                  <ul className="space-y-2">
                    {(selectedService.what_included && selectedService.what_included.length > 0) ? (
                      selectedService.what_included.map((item: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-primary" />
                          <span className="text-muted">{item}</span>
                        </li>
                      ))
                    ) : (
                      ['Custom Development', 'Quality Assurance', 'Documentation', 'Support & Maintenance'].map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-primary" />
                        <span className="text-muted">{item}</span>
                      </li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedService.technologies && selectedService.technologies.length > 0) ? (
                      selectedService.technologies.map((tech: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-surface text-muted text-sm rounded-full">
                          {tech}
                        </span>
                      ))
                    ) : (
                      ['React', 'Node.js', 'TypeScript', 'Supabase'].map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-surface text-muted text-sm rounded-full">
                        {tech}
                      </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {selectedService.show_request_button !== false && (
                <Link
                  to="/consultation"
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-primary/90 transition-colors"
                  onClick={() => setSelectedService(null)}
                >
                  Request This Service
                </Link>
                )}
                {selectedService.show_contact_button !== false && (
                <Link
                  to="/contact"
                  className="flex-1 border border-primary text-primary px-6 py-3 rounded-lg font-semibold text-center hover:bg-primary hover:text-white transition-colors"
                  onClick={() => setSelectedService(null)}
                >
                  Contact Us
                </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Services;
