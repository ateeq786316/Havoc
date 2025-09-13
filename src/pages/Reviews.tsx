import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Send, CheckCircle, AlertCircle, User, Building, Mail, MessageSquare, Award } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useProjects } from '../hooks/useApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Review } from '../lib/supabase';

const Reviews: React.FC = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [reviewsRef, reviewsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  
  const { data: projects } = useProjects();
  
  const [formData, setFormData] = useState({
    client_name: '',
    client_company: '',
    client_email: '',
    project_id: '',
    rating: 5,
    content: ''
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getReviews(true); // Only approved reviews
      if (response.data) {
        setReviews(response.data as Review[]);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      // Find project title
      const selectedProject = projects?.find(p => p.id === formData.project_id);
      const payload = {
        ...formData,
        project_title: selectedProject?.title || 'Unknown Project'
      };

      await apiClient.createReview(payload);
      
      setSubmitStatus('success');
      setSubmitMessage('Thank you for your review! It has been submitted and will be reviewed by our team before being published.');
      
      // Reset form
      setFormData({
        client_name: '',
        client_company: '',
        client_email: '',
        project_id: '',
        rating: 5,
        content: ''
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit your review. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              size={20}
              className={`${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="py-20 bg-gradient-to-br from-bg via-surface to-card"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-text mb-6">
                Client <span className="text-primary">Reviews</span>
              </h1>
              <p className="text-xl text-muted mb-8 leading-relaxed">
                Hear what our clients have to say about their experience working with Havoc Solutions. 
                Your feedback helps us grow and improve our services.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Reviews Display Section */}
      <motion.section
        ref={reviewsRef}
        className="py-20"
        initial={{ opacity: 0 }}
        animate={reviewsInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={reviewsInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Don't just take our word for it. Here are some testimonials from our satisfied clients.
              </p>
            </motion.div>
          </motion.div>

          {reviews.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={reviewsInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  variants={itemVariants}
                  className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center mb-4">
                    {renderStars(review.rating)}
                  </div>
                  
                  <blockquote className="text-muted mb-6 leading-relaxed">
                    "{review.content}"
                  </blockquote>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <User size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text">{review.client_name}</h4>
                        {review.client_company && (
                          <p className="text-sm text-muted">{review.client_company}</p>
                        )}
                        {review.project_title && (
                          <p className="text-xs text-primary mt-1">Project: {review.project_title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <Award size={64} className="mx-auto text-muted mb-4" />
              <h3 className="text-xl font-semibold text-text mb-2">No Reviews Yet</h3>
              <p className="text-muted">Be the first to share your experience with us!</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Review Submission Form */}
      <motion.section
        ref={formRef}
        className="py-20 bg-gradient-to-br from-surface to-card"
        initial={{ opacity: 0 }}
        animate={formInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            className="max-w-2xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
                Share Your Experience
              </h2>
              <p className="text-lg text-muted">
                We'd love to hear about your experience working with us. Your feedback helps us improve and helps other clients make informed decisions.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Your Name *"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      required
                      icon={<User size={20} />}
                    />
                    <Input
                      label="Company Name"
                      value={formData.client_company}
                      onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                      icon={<Building size={20} />}
                    />
                  </div>

                  <Input
                    label="Email Address *"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    required
                    icon={<Mail size={20} />}
                  />

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Project (if applicable)
                    </label>
                    <Select
                      value={formData.project_id}
                      onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                      options={[
                        { value: '', label: 'Select a project (optional)' },
                        ...(projects?.map(project => ({
                          value: project.id,
                          label: project.title
                        })) || [])
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-2">
                      {renderStars(formData.rating, true, (rating) => 
                        setFormData({ ...formData, rating })
                      )}
                      <span className="text-sm text-muted ml-2">
                        {formData.rating} out of 5 stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Your Review *
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Tell us about your experience working with Havoc Solutions..."
                      rows={5}
                      required
                      icon={<MessageSquare size={20} />}
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle size={20} className="text-green-600" />
                      <p className="text-green-800">{submitMessage}</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle size={20} className="text-red-600" />
                      <p className="text-red-800">{submitMessage}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    className="w-full"
                  >
                    <Send size={20} className="mr-2" />
                    {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Reviews;
