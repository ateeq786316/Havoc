import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, Filter, ExternalLink, Github, Eye, Smartphone, Globe, Brain, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useApi';
import { useDebounce } from '../hooks/useDebounce';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Project, ProjectFilter, ProjectType } from '../types';

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ProjectType | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: projects, isLoading, error } = useProjects(); // Force public view

  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const projectTypeIcons: Record<ProjectType, React.ReactNode> = {
    mobile: <Smartphone size={20} className="text-primary" />,
    web: <Globe size={20} className="text-primary" />,
    ai: <Brain size={20} className="text-primary" />,
    fullstack: <Layers size={20} className="text-primary" />,
  };

  const projectTypes: { value: ProjectType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Projects' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'web', label: 'Web Apps' },
    { value: 'ai', label: 'AI Solutions' },
    { value: 'fullstack', label: 'Full Stack' },
  ];

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter((project: Project) => {
      const matchesSearch = debouncedSearch === '' || 
        project.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(debouncedSearch.toLowerCase()));
      
      const matchesType = selectedType === 'all' || project.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [projects, debouncedSearch, selectedType]);

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
          <h2 className="text-2xl font-bold text-text mb-4">Error Loading Projects</h2>
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
              Our Portfolio
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted mb-8 leading-relaxed"
            >
              Explore our diverse portfolio of successful projects across mobile, web, 
              AI, and full-stack development. Each project represents our commitment 
              to innovation and excellence.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-text placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>

              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      selectedType === type.value
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text hover:bg-card'
                    }`}
                  >
                    {type.value !== 'all' && projectTypeIcons[type.value as ProjectType]}
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project: Project, index: number) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group"
              >
                <Card hover className="h-full flex flex-col overflow-hidden">
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {projectTypeIcons[project.type]}
                      </div>
                    )}
                    
                    {/* Project Type Badge */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      {projectTypeIcons[project.type]}
                      <span className="text-sm font-medium text-text capitalize">
                        {project.type}
                      </span>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm p-3 rounded-full"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Eye size={20} className="text-text" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-muted mb-4 flex-grow leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-surface text-muted text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-surface text-muted text-xs rounded-full">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-3"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-text mb-2">No projects found</h3>
              <p className="text-muted mb-6">
                Try adjusting your search terms or project type filter.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
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
              Ready to Start Your Project?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's create something amazing together. Contact us to discuss your 
              project requirements and get a personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/consultation"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              >
                <span>Start a Project</span>
                <ExternalLink size={20} />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center space-x-2"
              >
                <span>Contact Us</span>
                <ExternalLink size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      {projectTypeIcons[selectedProject.type]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-text">{selectedProject.title}</h2>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted capitalize">{selectedProject.type}</span>
                        <span className="text-muted">•</span>
                        <span className="text-muted">
                          {new Date(selectedProject.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 text-muted hover:text-text hover:bg-surface rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Project Images */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProject.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedProject.title} screenshot ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text mb-4">Project Overview</h3>
                  <p className="text-muted leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-surface text-muted text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      const url = (selectedProject as any)?.live_url;
                      if (url) window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    disabled={!((selectedProject as any)?.live_url)}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View Live Project
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      const url = (selectedProject as any)?.repo_url;
                      if (url) window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    disabled={!((selectedProject as any)?.repo_url)}
                  >
                    <Github size={16} className="mr-2" />
                    View Code
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
