import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Building2,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { apiClient } from '../lib/api';
import { Consultation } from '../lib/supabase';

const ConsultationApproval: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const token = searchParams.get('token');
  const actionParam = searchParams.get('action') as 'approve' | 'reject';

  useEffect(() => {
    if (token) {
      loadConsultation();
    } else {
      setError('Invalid approval link');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (actionParam && ['approve', 'reject'].includes(actionParam)) {
      setAction(actionParam);
    }
  }, [actionParam]);

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getConsultationByToken(token!);
      
      if (result.data) {
        setConsultation(result.data);
      } else {
        setError('Consultation not found or approval link has expired');
      }
    } catch (err: any) {
      setError('Failed to load consultation: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async () => {
    if (!token || !action) return;

    try {
      setSubmitting(true);
      setError(null);

      const result = await apiClient.handleClientApproval(
        token,
        action,
        action === 'approve' ? notes : undefined,
        action === 'reject' ? rejectionReason : undefined
      );

      if (result.data) {
        setConsultation(result.data);
        setSuccess(
          action === 'approve' 
            ? 'Project approved! Havoc Solutions will contact you soon to begin development.'
            : 'Project rejected. Thank you for your time.'
        );
      } else {
        setError('Failed to process your decision. Please try again.');
      }
    } catch (err: any) {
      setError('Failed to process your decision: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !consultation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/')}>
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  if (!consultation) {
    return null;
  }

  const isAlreadyProcessed = consultation.client_approval_status !== 'pending';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Approval
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Review the quote and make your decision to officially assign this project to Havoc Solutions
          </p>
        </motion.div>

        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Project Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{consultation.name}</p>
                      <p className="text-sm text-gray-500">{consultation.email}</p>
                    </div>
                  </div>

                  {consultation.company_name && (
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{consultation.company_name}</p>
                        {consultation.website && (
                          <p className="text-sm text-blue-600">{consultation.website}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Project Type</p>
                      <p className="text-sm text-gray-500">
                        {consultation.project_type?.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Timeline</p>
                      <p className="text-sm text-gray-500">
                        {consultation.timeline || 'To be discussed'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quote Details</h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      ${consultation.quote_amount?.toLocaleString() || '0'} {consultation.quote_currency || 'USD'}
                    </div>
                    <p className="text-sm text-gray-600">
                      Valid for {consultation.quote_validity_days || 30} days
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Complete project development</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Quality assurance & testing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Documentation & handover</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">3 months post-launch support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">Regular progress updates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Approval Status */}
        {isAlreadyProcessed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className={`p-6 ${
              consultation.client_approval_status === 'approved' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-3">
                {consultation.client_approval_status === 'approved' ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {consultation.client_approval_status === 'approved' 
                      ? 'Project Approved!' 
                      : 'Project Rejected'}
                  </h3>
                  <p className="text-gray-600">
                    {consultation.client_approval_status === 'approved'
                      ? 'This project has been officially assigned to Havoc Solutions.'
                      : 'This project has been rejected and will not proceed.'}
                  </p>
                  {consultation.client_approval_date && (
                    <p className="text-sm text-gray-500 mt-1">
                      Decision made on {new Date(consultation.client_approval_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Approval Form */}
        {!isAlreadyProcessed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Make Your Decision</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800">{success}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Action Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose your decision:
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setAction('approve')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        action === 'approve'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle className={`h-6 w-6 ${
                          action === 'approve' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">Approve Project</h3>
                          <p className="text-sm text-gray-600">
                            Officially assign this project to Havoc Solutions
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setAction('reject')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        action === 'reject'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <XCircle className={`h-6 w-6 ${
                          action === 'reject' ? 'text-red-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">Reject Project</h3>
                          <p className="text-sm text-gray-600">
                            Decline this project proposal
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Notes/Reason Input */}
                {action && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {action === 'approve' ? 'Additional Notes (Optional)' : 'Reason for Rejection (Optional)'}
                    </label>
                    <textarea
                      value={action === 'approve' ? notes : rejectionReason}
                      onChange={(e) => action === 'approve' ? setNotes(e.target.value) : setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder={
                        action === 'approve' 
                          ? 'Any additional notes or requirements...'
                          : 'Please let us know why you\'re rejecting this project...'
                      }
                    />
                  </div>
                )}

                {/* Submit Button */}
                {action && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleApproval}
                      disabled={submitting}
                      loading={submitting}
                      className={`px-8 py-3 ${
                        action === 'approve'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {submitting ? (
                        'Processing...'
                      ) : action === 'approve' ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Approve Project
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 mr-2" />
                          Reject Project
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-4">
            Questions? Contact us at{' '}
            <a href="mailto:havocsolutions1@gmail.com" className="text-blue-600 hover:underline">
              havocsolutions1@gmail.com
            </a>
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Go to Homepage
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsultationApproval;
