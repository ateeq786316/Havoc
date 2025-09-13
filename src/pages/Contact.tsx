import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ExternalLink } from 'lucide-react';
import { useForm } from '../hooks/useForm';
import { ContactFormData } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [contactRef, contactInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const initialFormData: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'project', label: 'New Project' },
    { value: 'support', label: 'Support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'career', label: 'Career Opportunity' },
    { value: 'other', label: 'Other' },
  ];

  const validateForm = (data: ContactFormData) => {
    const errors = [];
    
    if (!data.name.trim()) {
      errors.push({ field: 'name', message: 'Name is required' });
    }
    
    if (!data.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    if (!data.subject) {
      errors.push({ field: 'subject', message: 'Please select a subject' });
    }
    
    if (!data.message.trim()) {
      errors.push({ field: 'message', message: 'Message is required' });
    } else if (data.message.trim().length < 10) {
      errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
    }
    
    return errors;
  };

  const form = useForm(initialFormData, validateForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.validate(form.data)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the form data to your API
      console.log('Form submitted:', form.data);
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['havocsolutions1@gmail.com', 'havocsolutions1@outlook.com'],
      action: 'mailto:havocsolutions1@gmail.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['Available 24/7', 'Quick response guaranteed'],
      action: 'tel:+1234567890',
    },
    {
      icon: MapPin,
      title: 'Location',
      details: ['Remote Team', 'Global Services'],
      action: '#',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Weekend: On-call support'],
      action: '#',
    },
  ];

  const socialLinks = [
    {
      name: 'Fiverr',
      url: 'https://fiverr.com/s/jjE6Vlm',
      icon: ExternalLink,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/havoc-solutions-583206375',
      icon: ExternalLink,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/havocsolutions.official',
      icon: ExternalLink,
    },
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

  if (isSubmitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-text mb-4">Message Sent Successfully!</h2>
          <p className="text-muted mb-6">
            Thank you for reaching out. We've received your message and will get back to you within 24 hours.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => setIsSubmitted(false)}
              className="w-full"
            >
              Send Another Message
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
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
              Get In Touch
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted mb-8 leading-relaxed"
            >
              Ready to start your next project? Have questions about our services? 
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
              className="lg:col-span-1"
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-text mb-6">Contact Information</h2>
                  <p className="text-muted leading-relaxed">
                    We're here to help you bring your ideas to life. Reach out to us 
                    through any of the channels below, and we'll get back to you promptly.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex items-start space-x-4"
                    >
                      <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                        <info.icon size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text mb-2">{info.title}</h3>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-muted text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="font-semibold text-text mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-surface hover:bg-card rounded-xl transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon size={20} className="text-muted group-hover:text-primary transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
              className="lg:col-span-2"
            >
              <Card className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text mb-4">Send us a Message</h2>
                  <p className="text-muted">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={form.data.name}
                      onChange={(e) => form.setField('name', e.target.value)}
                      error={form.getFieldError('name')}
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={form.data.email}
                      onChange={(e) => form.setField('email', e.target.value)}
                      error={form.getFieldError('email')}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={form.data.phone}
                      onChange={(e) => form.setField('phone', e.target.value)}
                      error={form.getFieldError('phone')}
                    />
                    
                    <Select
                      label="Subject"
                      value={form.data.subject}
                      onChange={(e) => form.setField('subject', e.target.value)}
                      error={form.getFieldError('subject')}
                      options={subjectOptions}
                      required
                    />
                  </div>

                  <Textarea
                    label="Message"
                    placeholder="Tell us about your project or inquiry..."
                    value={form.data.message}
                    onChange={(e) => form.setField('message', e.target.value)}
                    error={form.getFieldError('message')}
                    rows={6}
                    required
                  />

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!form.isValid || isSubmitting}
                    className="w-full"
                  >
                    <Send size={20} className="mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted max-w-3xl mx-auto"
            >
              Quick answers to common questions about our services and process.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                question: "How long does a typical project take?",
                answer: "Project timelines vary based on complexity, but most projects range from 2-12 weeks. We provide detailed timelines during the consultation phase."
              },
              {
                question: "Do you provide ongoing support?",
                answer: "Yes, we offer comprehensive maintenance and support packages to ensure your project continues to perform optimally after launch."
              },
              {
                question: "What technologies do you work with?",
                answer: "We work with modern technologies including React, Node.js, Python, mobile frameworks, and cloud platforms like AWS and Google Cloud."
              },
              {
                question: "How do you handle project communication?",
                answer: "We maintain regular communication through scheduled meetings, progress reports, and real-time collaboration tools to keep you informed."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h3 className="text-lg font-semibold text-text mb-3">{faq.question}</h3>
                <p className="text-muted leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
