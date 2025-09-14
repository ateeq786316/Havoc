import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Award, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { scrollToTop } from '../lib/scrollToTop';

const Home: React.FC = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const handleNavClick = (href: string) => {
    // If clicking on the same route, scroll to top
    if (window.location.pathname === href) {
      scrollToTop();
    }
  };

  const services = [
    {
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications with modern UI/UX',
      icon: '📱',
      features: ['iOS & Android', 'React Native', 'Flutter', 'App Store Publishing']
    },
    {
      title: 'Web Development',
      description: 'Modern web applications with responsive design and optimal performance',
      icon: '🌐',
      features: ['React/Vue/Angular', 'Full-Stack', 'E-commerce', 'CMS Integration']
    },
    {
      title: 'Backend APIs',
      description: 'Scalable backend services and RESTful APIs with robust architecture',
      icon: '⚡',
      features: ['REST & GraphQL', 'Database Design', 'Cloud Integration', 'Authentication']
    },
    {
      title: 'Intelligent Automation',
      description: 'AI-powered solutions and automation systems for business processes',
      icon: '🤖',
      features: ['Machine Learning', 'Process Automation', 'Data Analytics', 'AI Integration']
    },
    {
      title: 'Game Development',
      description: 'Interactive games and entertainment applications across platforms',
      icon: '🎮',
      features: ['Unity/Unreal', 'Mobile Games', 'Web Games', '2D & 3D']
    },
    {
      title: 'QA Testing',
      description: 'Comprehensive testing services to ensure quality and reliability',
      icon: '✅',
      features: ['Automated Testing', 'Manual Testing', 'Performance Testing', 'Bug Tracking']
    }
  ];

  const stats = [
    { icon: Users, value: '50+', label: 'Projects Delivered' },
    { icon: Award, value: '98%', label: 'Client Satisfaction' },
    { icon: Zap, value: '24/7', label: 'Support Available' },
  ];

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-surface to-card overflow-hidden pt-16"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-text mb-6 leading-tight"
            >
              Turning Ideas into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Scalable Products
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-muted mb-8 leading-relaxed max-w-3xl mx-auto"
            >
              Web, Mobile, APIs, and Automation built by senior engineers with 
              cutting-edge technology and innovative solutions.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/services"
                onClick={() => handleNavClick('/services')}
                className="group bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>View Services</span>
                <ArrowRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                />
              </Link>
              
              <Link
                to="/consultation"
                onClick={() => handleNavClick('/consultation')}
                className="group border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center space-x-2"
              >
                <span>Request a Quote</span>
                <ArrowRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform duration-300" 
                />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              ref={statsRef}
              variants={containerVariants}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50"
                >
                  <stat.icon size={32} className="text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-text mb-2">{stat.value}</div>
                  <div className="text-muted text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2" />
          </div>
        </motion.div>
      </motion.section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-6"
            >
              End-to-End Software Development
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted max-w-3xl mx-auto"
            >
              From concept to deployment, we deliver comprehensive solutions 
              tailored to your business needs with modern technology stacks.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-text mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm text-muted">
                      <CheckCircle size={16} className="text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="text-center mt-12"
          >
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>View All Services</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
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
              Let's Build Something Together
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Ready to turn your ideas into reality? Contact us today and let's 
              discuss how we can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:havocsolutions1@gmail.com"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              >
                <span>havocsolutions1@gmail.com</span>
              </a>
              <a
                href="mailto:havocsolutions1@outlook.com"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center space-x-2"
              >
                <span>havocsolutions1@outlook.com</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;