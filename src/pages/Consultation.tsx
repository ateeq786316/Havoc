import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Calendar, 
  User, 
  Link as LinkIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { apiClient } from '../lib/api';

const Consultation: React.FC = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
    project_type: [] as string[],
    project_scope: '',
    description: '',
    budget: '',
    timeline: '',
    location: '',
    ownership: 'own' as 'own' | 'representing',
    idea: '',
    links: [] as string[],
    preferred_contact_method: 'email' as 'email' | 'phone' | 'whatsapp' | 'linkedin',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    source: 'website' as 'website' | 'referral' | 'social_media' | 'advertisement' | 'other'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const projectTypes = [
    'Web Development',
    'Mobile App Development',
    'E-commerce Development',
    'AI & Machine Learning',
    'Data Analytics',
    'UI/UX Design',
    'DevOps & Cloud',
    'System Integration',
    'Quality Assurance',
    'Consulting',
    'Other'
  ];

  const budgetRanges = [
    'Under $5,000',
    '$5,000 - $15,000',
    '$15,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+',
    'To be discussed'
  ];

  const timelineOptions = [
    'ASAP (Rush)',
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3-6 months',
    '6+ months',
    'Flexible'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleLinkAdd = () => {
    const newLink = prompt('Enter a link (website, portfolio, etc.):');
    if (newLink && newLink.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, newLink.trim()]
      }));
    }
  };

  const handleLinkRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const result = await apiClient.createConsultation(formData);
      
      if (result.data) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company_name: '',
          website: '',
          project_type: [],
          project_scope: '',
          description: '',
          budget: '',
          timeline: '',
          location: '',
          ownership: 'own',
          idea: '',
          links: [],
          preferred_contact_method: 'email',
          urgency: 'medium',
          source: 'website'
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage('Failed to submit consultation request. Please try again.');
      }
    } catch (error: any) {
      console.error('Consultation submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit consultation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
        <div className="flex items-center justify-center p-4 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full"
          >
            <Card className="text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: 'rgb(var(--color-primary))' }} />
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold mb-2"
                style={{ color: 'rgb(var(--color-text))' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Thank You!
              </motion.h2>
              <motion.p 
                className="mb-6"
                style={{ color: 'rgb(var(--color-muted))' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Your consultation request has been submitted successfully. Our team will review it and get back to you within 24 hours.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  onClick={() => setSubmitStatus('idle')}
                  className="w-full"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--color-bg))' }}>
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ backgroundColor: 'rgb(var(--color-surface))' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={heroInView ? { scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ 
                backgroundColor: 'rgb(var(--color-primary))',
                color: 'white'
              }}
            >
              <Zap className="h-4 w-4 mr-2" />
              Free Project Consultation
            </motion.div>
            
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: 'rgb(var(--color-text))' }}
            >
              Let's Build Something
              <span 
                className="block"
                style={{ color: 'rgb(var(--color-primary))' }}
              >
                Amazing Together
              </span>
            </h1>
            
            <p 
              className="text-xl max-w-3xl mx-auto mb-8"
              style={{ color: 'rgb(var(--color-muted))' }}
            >
              Tell us about your project and we'll provide you with a detailed consultation, 
              timeline, and cost estimate tailored to your needs.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <div className="flex items-center text-sm" style={{ color: 'rgb(var(--color-muted))' }}>
                <CheckCircle className="h-4 w-4 mr-2" style={{ color: 'rgb(var(--color-primary))' }} />
                Free consultation
              </div>
              <div className="flex items-center text-sm" style={{ color: 'rgb(var(--color-muted))' }}>
                <CheckCircle className="h-4 w-4 mr-2" style={{ color: 'rgb(var(--color-primary))' }} />
                24-hour response
              </div>
              <div className="flex items-center text-sm" style={{ color: 'rgb(var(--color-muted))' }}>
                <CheckCircle className="h-4 w-4 mr-2" style={{ color: 'rgb(var(--color-primary))' }} />
                No obligation
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Form Section */}
      <motion.section 
        ref={formRef}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial={{ opacity: 0, y: 30 }}
        animate={formInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={formInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h3 
                  className="text-xl font-semibold mb-6 flex items-center"
                  style={{ color: 'rgb(var(--color-text))' }}
                >
                  <div 
                    className="p-2 rounded-lg mr-3"
                    style={{ backgroundColor: 'rgb(var(--color-primary))' }}
                  >
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Personal Information
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                <Input
                  label="Company Name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                />
                <Input
                  label="Website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Contact Method
                  </label>
                  <select
                    value={formData.preferred_contact_method}
                    onChange={(e) => handleInputChange('preferred_contact_method', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
              </div>
              </motion.div>

              {/* Project Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h3 
                  className="text-xl font-semibold mb-6 flex items-center"
                  style={{ color: 'rgb(var(--color-text))' }}
                >
                  <div 
                    className="p-2 rounded-lg mr-3"
                    style={{ backgroundColor: 'rgb(var(--color-primary))' }}
                  >
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Project Information
                </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type(s) * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {projectTypes.map((type) => (
                      <label key={type} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.project_type.includes(type)}
                          onChange={(e) => handleArrayChange('project_type', type, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Scope *
                  </label>
                  <textarea
                    value={formData.project_scope}
                    onChange={(e) => handleInputChange('project_scope', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the scope and requirements of your project..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Provide detailed information about your project goals, features, and any specific requirements..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Idea/Concept
                  </label>
                  <textarea
                    value={formData.idea}
                    onChange={(e) => handleInputChange('idea', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Share any initial ideas, concepts, or inspiration for your project..."
                  />
                </div>
              </div>
              </motion.div>

              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h3 
                  className="text-xl font-semibold mb-6 flex items-center"
                  style={{ color: 'rgb(var(--color-text))' }}
                >
                  <div 
                    className="p-2 rounded-lg mr-3"
                    style={{ backgroundColor: 'rgb(var(--color-primary))' }}
                  >
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  Project Details
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select timeline</option>
                    {timelineOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  </label>
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Ownership
                  </label>
                  <select
                    value={formData.ownership}
                    onChange={(e) => handleInputChange('ownership', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="own">I own this project</option>
                    <option value="representing">I'm representing a client/company</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low - No rush</option>
                    <option value="medium">Medium - Normal timeline</option>
                    <option value="high">High - Need it soon</option>
                    <option value="urgent">Urgent - ASAP</option>
                  </select>
                </div>
              </div>
              </motion.div>

              {/* Additional Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <h3 
                  className="text-xl font-semibold mb-6 flex items-center"
                  style={{ color: 'rgb(var(--color-text))' }}
                >
                  <div 
                    className="p-2 rounded-lg mr-3"
                    style={{ backgroundColor: 'rgb(var(--color-primary))' }}
                  >
                    <LinkIcon className="h-5 w-5 text-white" />
                  </div>
                  Additional Information
                </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Links
                  </label>
                  <div className="space-y-2">
                    {formData.links.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={link}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleLinkRemove(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLinkAdd}
                      className="w-full"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </div>
              </div>
              </motion.div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-lg flex items-center"
                  style={{ 
                    backgroundColor: 'rgba(var(--color-primary), 0.1)',
                    borderColor: 'rgb(var(--color-primary))',
                    borderWidth: '1px'
                  }}
                >
                  <AlertCircle className="h-5 w-5 mr-2" style={{ color: 'rgb(var(--color-primary))' }} />
                  <span style={{ color: 'rgb(var(--color-text))' }}>{errorMessage}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Consultation Request
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
                <p 
                  className="text-sm mt-4"
                  style={{ color: 'rgb(var(--color-muted))' }}
                >
                  We'll get back to you within 24 hours with a detailed proposal
                </p>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Consultation;