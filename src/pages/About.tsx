import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Target, Award, CheckCircle, Linkedin, Github, Mail, Phone } from 'lucide-react';
import { useTeam } from '../hooks/useTeam';
import { TeamMember } from '../lib/supabase';

const About: React.FC = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [storyRef, storyInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [workflowRef, workflowInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [teamRef, teamInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  // Fetch team members dynamically
  const { teamMembers, isLoading: teamLoading } = useTeam();

  const values = [
    {
      icon: Target,
      title: 'Innovation First',
      description: 'We embrace cutting-edge technologies and innovative approaches to solve complex problems.',
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'Your success is our priority. We build lasting relationships through transparent communication.',
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We deliver exceptional quality through rigorous testing and continuous improvement.',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Requirements',
      description: 'We analyze your needs and define project scope with detailed specifications.',
    },
    {
      step: '02',
      title: 'Design',
      description: 'Create user-centric designs with modern UI/UX principles and prototyping.',
    },
    {
      step: '03',
      title: 'Development',
      description: 'Build robust solutions using best practices and cutting-edge technologies.',
    },
    {
      step: '04',
      title: 'Testing',
      description: 'Comprehensive quality assurance with automated and manual testing.',
    },
    {
      step: '05',
      title: 'Deployment',
      description: 'Smooth launch with proper CI/CD pipelines and monitoring setup.',
    },
    {
      step: '06',
      title: 'Maintenance',
      description: 'Ongoing support, updates, and optimization for long-term success.',
    },
  ];

  const techStack = [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Framework' },
    { name: 'Supabase', category: 'Database' },
    { name: 'Firebase', category: 'Platform' },
    { name: 'React Native', category: 'Mobile' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'Python', category: 'AI/ML' },
    { name: 'TensorFlow', category: 'AI/ML' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'Docker', category: 'DevOps' },
  ];

  // Helper function to get fallback image
  const getFallbackImage = (memberName: string) => {
    const nameMap: { [key: string]: string } = {
      'Sufyan': '/images/team/backup/sufyan.jpg',
      'Ateeq': '/images/team/backup/ateeq.jpg',
      'Team Member 1': '/images/team/backup/member1.jpg',
      'Team Member 2': '/images/team/backup/member2.jpg',
      'Team Member 3': '/images/team/backup/member3.jpg',
      'Team Member 4': '/images/team/backup/member4.jpg',
      'Team Member 5': '/images/team/backup/member5.jpg',
      'Team Member 6': '/images/team/backup/member6.jpg',
      'Team Member 7': '/images/team/backup/member7.jpg',
    };
    return nameMap[memberName] || '/images/team/backup/member1.jpg';
  };

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
    <div className="pt-16">
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
              About Havoc Solutions
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted mb-8 leading-relaxed"
            >
              We are a team of passionate engineers and designers dedicated to 
              transforming ideas into powerful digital solutions that drive business success.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section
        ref={storyRef}
        className="py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={storyInView ? "visible" : "hidden"}
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl sm:text-4xl font-bold text-text mb-6"
              >
                Our Story
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-muted mb-6 leading-relaxed"
              >
                Founded with a vision to bridge the gap between innovative ideas and 
                practical solutions, Havoc Solutions has grown from a small team of 
                developers into a comprehensive software development company.
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-muted mb-8 leading-relaxed"
              >
                Our journey began with a simple belief: great software can transform 
                businesses and improve lives. Today, we continue to pursue that mission 
                by delivering exceptional digital products that exceed expectations.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="space-y-4"
              >
                {['50+ Projects Delivered', '98% Client Satisfaction', '24/7 Support'].map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-primary" />
                    <span className="text-text font-medium">{achievement}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate={storyInView ? "visible" : "hidden"}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8">
                <img
                  src="/images/team/havoc-solutions.png"
                  alt="Havoc Solutions Team"
                  className="rounded-xl w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800";
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-text mb-6"
            >
              Our Values
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted max-w-3xl mx-auto"
            >
              The principles that guide everything we do and shape how we work with our clients.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <value.icon size={48} className="text-primary mx-auto mb-6" />
                <h3 className="text-xl font-bold text-text mb-4">{value.title}</h3>
                <p className="text-muted leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <motion.section
        ref={workflowRef}
        className="py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={workflowInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-text mb-6"
            >
              Our Development Process
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted max-w-3xl mx-auto"
            >
              A systematic approach that ensures quality, transparency, and success at every stage.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={workflowInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-text mb-4 mt-4">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-text mb-6"
            >
              Technologies We Use
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted max-w-3xl mx-auto"
            >
              Cutting-edge tools and frameworks that power our solutions.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                  {tech.name}
                </h3>
                <p className="text-sm text-muted mt-1">{tech.category}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <motion.section
        ref={teamRef}
        className="py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-text mb-6"
            >
              Meet Our Team
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted max-w-3xl mx-auto"
            >
              Talented professionals dedicated to bringing your vision to life.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {teamLoading ? (
              // Loading skeleton
              Array.from({ length: 9 }).map((_, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-card rounded-2xl p-6 text-center animate-pulse"
                >
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-surface"></div>
                  <div className="h-6 bg-surface rounded mb-2"></div>
                  <div className="h-4 bg-surface rounded mb-3"></div>
                  <div className="h-12 bg-surface rounded mb-4"></div>
                  <div className="flex justify-center space-x-2">
                    <div className="w-8 h-8 bg-surface rounded-full"></div>
                    <div className="w-8 h-8 bg-surface rounded-full"></div>
                  </div>
                </motion.div>
              ))
            ) : (
              teamMembers.map((member: TeamMember) => (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={member.image || member.image_url || getFallbackImage(member.name)}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary/20"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getFallbackImage(member.name);
                    }}
                  />
                  <h3 className="text-lg font-bold text-text mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted leading-relaxed mb-4">{member.bio}</p>
                  
                  {/* Contact Info */}
                  {(member.email || member.phone) && (
                    <div className="mb-4 space-y-1">
                      {member.email && (
                        <div className="flex items-center justify-center text-xs text-muted">
                          <Mail size={12} className="mr-1" />
                          <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">
                            {member.email}
                          </a>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center justify-center text-xs text-muted">
                          <Phone size={12} className="mr-1" />
                          <a href={`tel:${member.phone}`} className="hover:text-primary transition-colors">
                            {member.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex justify-center space-x-2">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                        title="LinkedIn Profile"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                    {member.github_url && (
                      <a
                        href={member.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                        title="GitHub Profile"
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {member.social_links && Object.entries(member.social_links).map(([platform, url]) => {
                      if (platform === 'linkedin' || platform === 'github' || !url) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                          title={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Profile`}
                        >
                          <span className="text-xs font-medium">{platform.charAt(0).toUpperCase()}</span>
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;