import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Star, 
  MessageSquare, 
  Palette, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Mail
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { apiClient } from '../lib/api';
import FileUpload from '../components/ui/FileUpload';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  is_super_admin: boolean;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  type: string;
  images: string[];
  technologies: string[];
  status: string;
  live_url?: string;
  repo_url?: string;
  created_at: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social_links: Record<string, string>;
}

interface Review {
  id: string;
  client_name?: string;
  client_company?: string;
  client_email?: string;
  content?: string;
  rating: number;
  project_id?: string;
  project_title?: string;
  approved: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  website?: string;
  project_type: string[];
  project_scope?: string;
  description: string;
  budget?: string;
  timeline?: string;
  location?: string;
  ownership?: 'own' | 'representing';
  idea?: string;
  links?: string[];
  attachments?: string[];
  preferred_contact_method?: 'email' | 'phone' | 'whatsapp' | 'linkedin';
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  source?: 'website' | 'referral' | 'social_media' | 'advertisement' | 'other';
  assigned_to?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  estimated_value?: number;
  next_follow_up?: string;
  internal_notes?: string;
  tags?: string[];
  meeting_scheduled?: string;
  meeting_link?: string;
  outcome?: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  // Email and quote fields
  quote_amount?: number;
  quote_currency?: string;
  quote_validity_days?: number;
  email_sent?: boolean;
  email_sent_at?: string;
  email_template_used?: string;
  quote_notes?: string;
  // Client approval fields
  client_approval_status?: 'pending' | 'approved' | 'rejected';
  client_approval_token?: string;
  client_approval_date?: string;
  client_approval_notes?: string;
  client_rejection_reason?: string;
  project_officially_assigned?: boolean;
  project_assignment_date?: string;
  created_at: string;
  updated_at: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  
  
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  
  // Filter states
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('all');
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data } = await apiClient.getProjects(projectStatusFilter === 'all' ? undefined : projectStatusFilter, true);
        setProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      }
    };
    loadProjects();
  }, [projectStatusFilter]);
  
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const [teamFiles, setTeamFiles] = useState<File[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Constrained input options
  const PROJECT_TYPES = ['mobile', 'web', 'ai', 'fullstack'];
  const PROJECT_STATUS = ['all', 'draft', 'published', 'archived'];
  const SERVICE_CATEGORIES = [
    'Development',
    'Testing',
    'Integration',
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
  const TECH_OPTIONS = ['React', 'React Native', 'Node.js', 'PostgreSQL', 'Stripe', 'Firebase', 'Tailwind CSS', 'TypeScript', 'Next.js', 'Docker'];
  
  // Service icon options
  const SERVICE_ICONS = [
    '🚀', '💻', '📱', '🌐', '⚡', '🔧', '🎨', '📊', '🤖', '🔒',
    '☁️', '📈', '🎯', '💡', '🛠️', '🔍', '📋', '🎮', '🏗️', '⚙️',
    '📦', '🔗', '🎪', '🌟', '💎', '🔥', '⭐', '🎭', '🏆', '🚦'
  ];

  // What's included options
  const WHAT_INCLUDED_OPTIONS = [
    'Custom Development', 'Quality Assurance', 'Documentation', 'Support & Maintenance',
    'UI/UX Design', 'Testing', 'Deployment', 'Training', 'Consulting', 'Project Management',
    'Code Review', 'Performance Optimization', 'Security Audit', 'Maintenance & Updates'
  ];

  const handleProjectFiles = (files: File[]) => {
    if (files.length > 4) {
      setError('Maximum 4 images allowed');
      setProjectFiles(files.slice(0, 4));
    } else {
      setProjectFiles(files);
    }
  };

  const handleTeamFiles = (files: File[]) => {
    if (files.length > 1) {
      setError('Only 1 image allowed for team members');
      setTeamFiles(files.slice(0, 1));
    } else {
      setTeamFiles(files);
    }
  };

  const moveImageToFront = (images: string[], index: number) => {
    if (index === 0) return images; // Already first
    const newImages = [...images];
    const [movedImage] = newImages.splice(index, 1);
    newImages.unshift(movedImage);
    return newImages;
  };

  const uploadImagesToStorage = async (files: File[], bucket: string = 'project-images'): Promise<string[]> => {
    if (!files || files.length === 0) return [];
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const folder = bucket === 'team-avatars' ? 'team' : 'projects';
      const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
      const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) uploadedUrls.push(publicUrlData.publicUrl);
    }
    return uploadedUrls;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        navigate('/admin/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name, email')
        .eq('id', userId)
        .maybeSingle();

      if (profileError || profile?.role !== 'admin') {
        navigate('/admin/login');
        return;
      }

      setUser({
        id: userId,
        name: profile.full_name || 'Admin',
        email: profile.email,
        role: 'admin',
        is_super_admin: true,
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      console.log('🔄 Loading dashboard data...');
      const [projectsRes, servicesRes, teamRes, reviewsRes, consultationsRes] = await Promise.all([
        apiClient.getProjects(), // Load all projects regardless of status
        apiClient.getServices(),
        apiClient.getTeamMembers(false), // Load all team members (active and inactive) for admin
        apiClient.getReviews(false), // Load all reviews (approved and pending) for admin
        apiClient.getConsultations(), // Load all consultations
      ]);

      console.log('📊 Dashboard data loaded:');
      console.log('  - Projects:', (projectsRes.data as any)?.length || 0);
      console.log('  - Services:', (servicesRes.data as any)?.length || 0);
      console.log('  - Team Members:', (teamRes.data as any)?.length || 0);
      console.log('  - Reviews:', (reviewsRes.data as any)?.length || 0);
      console.log('  - Consultations:', (consultationsRes.data as any)?.length || 0);
      console.log('  - Reviews data:', reviewsRes.data);
      console.log('  - Consultations data:', consultationsRes.data);

      setProjects((projectsRes.data as any) || [] as any);
      setServices((servicesRes.data as any) || [] as any);
      setTeamMembers((teamRes.data as any) || [] as any);
      setReviews((reviewsRes.data as any) || [] as any);
      setConsultations((consultationsRes.data as any) || [] as any);
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const openModal = (type: string, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (modalType === 'projects') {
        const payload = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          status: formData.status || 'draft',
          technologies: formData.technologies || [],
          images: formData.images || [],
          live_url: formData.live_url || null,
          repo_url: formData.repo_url || null,
        };
        // Upload new screenshots if provided
        const newImageUrls = await uploadImagesToStorage(projectFiles, 'project-images');
        const finalPayload = {
          ...payload,
          images: [...(editingItem?.images || payload.images || []), ...newImageUrls].slice(0, 4),
        };
        if (editingItem) {
          const { error } = await supabase.from('projects').update(finalPayload as any).eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('projects').insert(finalPayload as any);
          if (error) throw error;
        }
      } else if (modalType === 'services') {
        const payload = {
          title: formData.title,
          description: formData.description,
          icon: formData.icon || null,
          category: formData.category || null,
          is_active: formData.is_active !== false,
          display_order: formData.display_order || 0,
          what_included: formData.what_included || [],
          technologies: formData.technologies || [],
          show_request_button: formData.show_request_button !== false,
          show_contact_button: formData.show_contact_button !== false,
        } as any;
        if (editingItem) {
          const { error } = await supabase.from('services').update(payload).eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('services').insert(payload);
          if (error) throw error;
        }
      } else if (modalType === 'team') {
        // Upload new avatar if provided
        const newImageUrls = await uploadImagesToStorage(teamFiles, 'team-avatars');
        const finalImage = newImageUrls.length > 0 ? newImageUrls[0] : (formData.image || null);
        
        const payload = {
          name: formData.name,
          role: formData.role,
          bio: formData.bio || null,
          image: finalImage,
          email: formData.email || null,
          phone: formData.phone || null,
          linkedin_url: formData.linkedin_url || null,
          github_url: formData.github_url || null,
          social_links: {
            linkedin: formData.linkedin_url || '',
            github: formData.github_url || '',
            ...formData.social_links
          },
          is_active: formData.is_active !== false,
          display_order: formData.display_order || 0,
        } as any;
      if (editingItem) {
          const { error } = await supabase.from('team_members').update(payload).eq('id', editingItem.id);
          if (error) throw error;
      } else {
          const { error } = await supabase.from('team_members').insert(payload);
          if (error) throw error;
        }
      } else if (modalType === 'reviews') {
        const payload = {
          client_name: formData.client_name,
          client_company: formData.client_company || null,
          client_email: formData.client_email || null,
          project_id: formData.project_id || null,
          project_title: projects.find(p => p.id === formData.project_id)?.title || null,
          rating: formData.rating || 5,
          content: formData.content,
          approved: formData.approved || false,
          status: formData.status || 'pending',
          admin_notes: formData.admin_notes || null,
        } as any;
        
        if (editingItem) {
          const result = await apiClient.updateReview(editingItem.id, payload);
          if (result.data) {
            // Update local state immediately
            setReviews(prevReviews => 
              prevReviews.map(review => 
                review.id === editingItem.id 
                  ? { ...review, ...payload }
                  : review
              )
            );
          }
        } else {
          const result = await apiClient.createReview(payload);
          if (result.data) {
            // Add new review to local state
            setReviews(prevReviews => [result.data, ...prevReviews]);
          }
        }
      } else if (modalType === 'consultations') {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company_name: formData.company_name || null,
          website: formData.website || null,
          project_type: formData.project_type || [],
          project_scope: formData.project_scope || null,
          description: formData.description,
          budget: formData.budget || null,
          timeline: formData.timeline || null,
          location: formData.location || null,
          ownership: formData.ownership || 'own',
          idea: formData.idea || null,
          links: formData.links || [],
          preferred_contact_method: formData.preferred_contact_method || 'email',
          urgency: formData.urgency || 'medium',
          source: formData.source || 'website',
          assigned_to: formData.assigned_to || null,
          priority: formData.priority || 'medium',
          estimated_value: formData.estimated_value || null,
          internal_notes: formData.internal_notes || null,
          status: formData.status || 'new',
        } as any;
        
        if (editingItem) {
          const result = await apiClient.updateConsultation(editingItem.id, payload);
          if (result.data) {
            // Update local state immediately
            setConsultations(prevConsultations => 
              prevConsultations.map(consultation => 
                consultation.id === editingItem.id 
                  ? { ...consultation, ...payload }
                  : consultation
              )
            );
          }
        } else {
          const result = await apiClient.createConsultation(payload);
          if (result.data) {
            // Add new consultation to local state
            setConsultations(prevConsultations => [result.data, ...prevConsultations]);
          }
        }
      }

        await loadDashboardData();
        closeModal();
      setProjectFiles([]);
      setTeamFiles([]);
      setSuccessMsg('Saved successfully');
    } catch (error: any) {
      setError(error?.message || 'Operation failed');
    } finally {
      setUploading(false);
    }
  };

  const handleApproveReview = async (id: string) => {
    try {
      setError(null);
      console.log('🚀 Starting approve review for ID:', id);
      console.log('📊 Current reviews state before approve:', reviews.length, 'reviews');
      
      const result = await apiClient.approveReview(id);
      console.log('📝 Approve API result:', result);
      
      if (result.data) {
        // Update local state immediately for better UX
        setReviews(prevReviews => {
          const updated = prevReviews.map(review => 
            review.id === id 
              ? { ...review, approved: true, status: 'approved' as const }
              : review
          );
          console.log('🔄 Updated reviews state after approve:', updated.length, 'reviews');
          console.log('✅ Updated review:', updated.find(r => r.id === id));
          return updated;
        });
        setSuccessMsg('Review approved successfully!');
      } else {
        // If immediate update fails, reload data
        console.log('⚠️ Approve result had no data, reloading...');
        await loadDashboardData();
        setSuccessMsg('Review approved successfully!');
      }
    } catch (error: any) {
      console.error('❌ Approve review error:', error);
      setError('Failed to approve review: ' + (error.message || 'Unknown error'));
      // Reload data to ensure consistency
      await loadDashboardData();
    }
  };

  const handleRejectReview = async (id: string) => {
    if (!confirm('Are you sure you want to reject this review?')) return;
    
    try {
      setError(null);
      console.log('🚀 Starting reject review for ID:', id);
      console.log('📊 Current reviews state before reject:', reviews.length, 'reviews');
      
      const result = await apiClient.rejectReview(id);
      console.log('📝 Reject API result:', result);
      
      if (result.data) {
        // Update local state immediately for better UX
        setReviews(prevReviews => {
          const updated = prevReviews.map(review => 
            review.id === id 
              ? { ...review, approved: false, status: 'rejected' as const }
              : review
          );
          console.log('🔄 Updated reviews state after reject:', updated.length, 'reviews');
          console.log('✅ Updated review:', updated.find(r => r.id === id));
          return updated;
        });
        setSuccessMsg('Review rejected successfully!');
      } else {
        // If immediate update fails, reload data
        console.log('⚠️ Reject result had no data, reloading...');
        await loadDashboardData();
        setSuccessMsg('Review rejected successfully!');
      }
    } catch (error: any) {
      console.error('❌ Reject review error:', error);
      setError('Failed to reject review: ' + (error.message || 'Unknown error'));
      // Reload data to ensure consistency
      await loadDashboardData();
    }
  };

  const handleApproveConsultation = async (consultation: any) => {
    try {
      setError(null);
      
      // Open modal with consultation data pre-filled for quote
      setEditingItem(consultation);
      setFormData({
        ...consultation,
        quote_amount: consultation.quote_amount || 0,
        quote_currency: consultation.quote_currency || 'USD',
        quote_validity_days: consultation.quote_validity_days || 30,
        project_company: consultation.project_company || consultation.company_name || '',
        project_department: consultation.project_department || '',
        project_requirements: consultation.project_requirements || [],
        project_deliverables: consultation.project_deliverables || [],
        project_timeline_weeks: consultation.project_timeline_weeks || 0,
        quote_notes: consultation.quote_notes || ''
      });
      setModalType('consultation-approval');
      setShowModal(true);
      
    } catch (error: any) {
      console.error('Error opening approval modal:', error);
      setError('Failed to open approval form: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSendApprovalEmail = async () => {
    if (!editingItem) return;
    
    try {
      setError(null);
      setUploading(true);
      
      const quoteData = {
        quote_amount: formData.quote_amount || 0,
        quote_currency: formData.quote_currency || 'USD',
        quote_validity_days: formData.quote_validity_days || 30,
        project_company: formData.project_company || '',
        project_department: formData.project_department || '',
        project_requirements: formData.project_requirements || [],
        project_deliverables: formData.project_deliverables || [],
        project_timeline_weeks: formData.project_timeline_weeks || 0,
        quote_notes: formData.quote_notes || '',
        status: 'in_progress'
      };
      
      const result = await apiClient.sendConsultationApprovalEmail(editingItem.id, quoteData);
      
      if (result.data) {
        // Update local state
        setConsultations(prevConsultations => 
          prevConsultations.map(consultation => 
            consultation.id === editingItem.id 
              ? { ...consultation, ...quoteData, email_sent: true, email_sent_at: new Date().toISOString(), status: 'in_progress' as const }
              : consultation
          )
        );
        
        setSuccessMsg('Consultation approved and email sent successfully!');
        closeModal();
      } else {
        setError('Failed to send approval email');
      }
    } catch (error: any) {
      console.error('Error sending approval email:', error);
      setError('Failed to send approval email: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      if (type === 'projects') {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
      } else if (type === 'services') {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
      } else if (type === 'team') {
        const { error } = await supabase.from('team_members').delete().eq('id', id);
        if (error) throw error;
      } else if (type === 'reviews') {
        const result = await apiClient.deleteReview(id);
        
        if (result.data) {
          // Update local state immediately for better UX
          setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
          setSuccessMsg('Review deleted successfully!');
        } else {
          // If immediate update fails, reload data
          await loadDashboardData();
          setSuccessMsg('Review deleted successfully!');
        }
        return; // Don't call loadDashboardData again
      } else if (type === 'consultations') {
        const result = await apiClient.deleteConsultation(id);
        
        if (result.data) {
          // Update local state immediately for better UX
          setConsultations(prevConsultations => prevConsultations.filter(consultation => consultation.id !== id));
          setSuccessMsg('Consultation deleted successfully!');
        } else {
          // If immediate update fails, reload data
          await loadDashboardData();
          setSuccessMsg('Consultation deleted successfully!');
        }
        return; // Don't call loadDashboardData again
      }
      await loadDashboardData();
    } catch (error) {
      setError('Delete failed');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Star },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'consultations', label: 'Consultations', icon: MessageSquare },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
    ...(user?.is_super_admin ? [{ id: 'admin-management', label: 'Admin Management', icon: Users }] : []),
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services</p>
              <p className="text-2xl font-bold">{services.length}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultations</p>
              <p className="text-2xl font-bold">{consultations.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-gray-600">{project.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  project.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Consultations</h3>
          <div className="space-y-3">
            {consultations.slice(0, 5).map((consultation) => (
              <div key={consultation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{consultation.name}</p>
                  <p className="text-sm text-gray-600">{consultation.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  consultation.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                  consultation.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {consultation.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderConsultationsTable = () => {
    const newConsultations = consultations.filter(c => c.status === 'new');
    const inProgressConsultations = consultations.filter(c => c.status === 'in_progress');
    const completedConsultations = consultations.filter(c => c.status === 'completed');

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'new': return 'bg-blue-100 text-blue-800';
        case 'contacted': return 'bg-yellow-100 text-yellow-800';
        case 'in_progress': return 'bg-orange-100 text-orange-800';
        case 'scheduled': return 'bg-purple-100 text-purple-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'on_hold': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };


    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Consultations Management</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {newConsultations.length} New
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                {inProgressConsultations.length} In Progress
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {completedConsultations.length} Completed
              </span>
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                        <div className="text-sm text-gray-500">{consultation.email}</div>
                        {consultation.company_name && (
                          <div className="text-sm text-gray-500">{consultation.company_name}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <div className="font-medium">{consultation.project_type?.join(', ')}</div>
                        <div className="text-gray-500 truncate">{consultation.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        consultation.client_approval_status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : consultation.client_approval_status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {consultation.client_approval_status === 'approved' ? 'Approved' :
                         consultation.client_approval_status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                      {consultation.project_officially_assigned && (
                        <div className="text-xs text-green-600 mt-1">✓ Officially Assigned</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {consultation.quote_amount ? (
                        <div>
                          <div className="font-medium">
                            ${consultation.quote_amount.toLocaleString()} {consultation.quote_currency || 'USD'}
                          </div>
                          {consultation.quote_validity_days && (
                            <div className="text-xs text-gray-500">
                              Valid {consultation.quote_validity_days} days
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No quote</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(consultation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {consultation.status === 'new' && !consultation.email_sent && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveConsultation(consultation)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Send Quote & Approval
                          </Button>
                        )}
                        {consultation.email_sent && consultation.client_approval_status === 'pending' && (
                          <span className="text-sm text-yellow-600">
                            Awaiting Client Response
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal('consultations', consultation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete('consultations', consultation.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderReviewsTable = () => {
    const pendingReviews = reviews.filter(r => r.status === 'pending' || !r.status);
    const approvedReviews = reviews.filter(r => r.approved);
    const rejectedReviews = reviews.filter(r => r.status === 'rejected');

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Reviews Management</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {pendingReviews.length} Pending
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {approvedReviews.length} Approved
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                {rejectedReviews.length} Rejected
              </span>
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        {pendingReviews.length > 0 && (
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-yellow-800">Pending Reviews ({pendingReviews.length})</h3>
              <p className="text-sm text-gray-600">Reviews waiting for approval</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingReviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{review.client_name}</div>
                          {review.client_company && (
                            <div className="text-sm text-gray-500">{review.client_company}</div>
                          )}
                          {review.client_email && (
                            <div className="text-sm text-gray-500">{review.client_email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {review.project_title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={`${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {review.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveReview(review.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectReview(review.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openModal('reviews', review)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* All Reviews */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">All Reviews ({reviews.length})</h3>
            <p className="text-sm text-gray-600">Complete review history</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{review.client_name}</div>
                        {review.client_company && (
                          <div className="text-sm text-gray-500">{review.client_company}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {review.project_title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        review.approved 
                          ? 'bg-green-100 text-green-800' 
                          : review.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.approved ? 'Approved' : review.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal('reviews', review)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete('reviews', review.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderTable = (items: any[], columns: string[], type: string) => {
    // Filter projects by status if it's the projects table
    const filteredItems = type === 'projects' && projectStatusFilter !== 'all' 
      ? items.filter(item => item.status === projectStatusFilter)
      : items;

    return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold capitalize">{type}</h2>
          <div className="flex items-center gap-4">
            {type === 'projects' && (
              <select
                value={projectStatusFilter}
                onChange={(e) => setProjectStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Projects</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            )}
        <Button onClick={() => openModal(type)}>
          <Plus className="h-4 w-4 mr-2" />
          Add {type.slice(0, -1)}
        </Button>
          </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {col === 'image' && item.image ? (
                        <img src={item.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : col === 'icon' && item.icon ? (
                        <span className="text-2xl">{item.icon}</span>
                      ) : col === 'is_active' ? (
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      ) : col === 'display_order' ? (
                        <span className="text-sm text-gray-600">{item.display_order || 0}</span>
                      ) : col === 'images' && Array.isArray(item.images) ? (
                        <div className="flex items-center gap-2">
                          {item.images.slice(0, 3).map((src: string, idx: number) => (
                            <img
                              key={idx}
                              src={src}
                              alt="screenshot"
                              className="h-20 w-12 object-contain bg-gray-100 rounded border"
                            />
                          ))}
                        </div>
                      ) : col === 'status' ? (
                        <span className={`px-2 py-1 text-xs rounded ${
                          item[col] === 'published' || item[col] === 'approved' ? 'bg-green-100 text-green-800' : 
                          item[col] === 'draft' || item[col] === 'new' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item[col]}
                        </span>
                      ) : (
                        item[col] || '-'
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openModal(type, item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(type, item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'projects':
        return renderTable(projects, ['title', 'type', 'status', 'created_at'], 'projects');
      case 'services':
        return renderTable(services, ['icon', 'title', 'category', 'is_active', 'display_order'], 'services');
      case 'team':
        return renderTable(teamMembers, ['image', 'name', 'role', 'email', 'is_active', 'display_order'], 'team');
      case 'reviews':
        return renderReviewsTable();
      case 'consultations':
        return renderConsultationsTable();
      case 'admin-management':
        if (user?.is_super_admin) {
          // Import and render AdminManagement component
          const AdminManagement = React.lazy(() => import('./AdminManagement'));
          return (
            <React.Suspense fallback={<LoadingSpinner size="lg" />}>
              <AdminManagement />
            </React.Suspense>
          );
        }
        return <div>Access denied. Super admin privileges required.</div>;
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800">Havoc Solutions</h2>
            <p className="text-sm text-gray-600">Admin Panel</p>
          </div>
          
          <nav className="mt-6">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 ${
                    activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 w-64 p-6">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)}
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  {user?.is_super_admin && (
                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Super Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <button onClick={() => setError(null)} className="ml-2 text-red-500">×</button>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMsg}
              <button onClick={() => setSuccessMsg(null)} className="ml-2 text-green-600">×</button>
            </div>
          )}
          
          {renderContent()}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={closeModal}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit' : 'Add'} {modalType.slice(0, -1)}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {modalType === 'projects' && (
              <>
                <Input
                  label="Title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <span className="text-xs text-gray-500">{(formData.description?.length || 0)}/120</span>
                  </div>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value.slice(0, 120)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    maxLength={120}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 120 characters.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    >
                      <option value="" disabled>Select type</option>
                      {PROJECT_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || 'draft'}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    >
                      {PROJECT_STATUS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Technologies multi-select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {TECH_OPTIONS.map(tech => {
                      const checked = Array.isArray(formData.technologies) && formData.technologies.includes(tech);
                      return (
                        <label key={tech} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const current: string[] = Array.isArray(formData.technologies) ? [...formData.technologies] : [];
                              if (e.target.checked) {
                                if (!current.includes(tech)) current.push(tech);
                              } else {
                                const idx = current.indexOf(tech);
                                if (idx >= 0) current.splice(idx, 1);
                              }
                              setFormData({ ...formData, technologies: current });
                            }}
                          />
                          <span>{tech}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                {/* Live/GitHub links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Live Project Link"
                    value={formData.live_url || ''}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  />
                  <Input
                    label="GitHub Link"
                    value={formData.repo_url || ''}
                    onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                  />
                </div>
                {/* Screenshots upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Screenshots (max 4)</label>
                  {/* Existing images preview with remove and reorder */}
                  {Array.isArray(formData.images) && formData.images.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Current images (drag to reorder, first image is primary):</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.images.slice(0, 4).map((src: string, idx: number) => (
                          <div key={idx} className="relative group">
                            <img 
                              src={src} 
                              alt="screenshot" 
                              className={`h-20 w-12 object-contain bg-gray-100 rounded border ${idx === 0 ? 'ring-2 ring-blue-500' : ''}`} 
                            />
                            {idx === 0 && (
                              <div className="absolute -top-1 -left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                Primary
                              </div>
                            )}
                            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  className="bg-blue-600 text-white rounded-full h-5 w-5 text-xs"
                                  onClick={async () => {
                                    const reordered = moveImageToFront(formData.images || [], idx);
                                    
                                    // Save the reordered images immediately
                                    if (editingItem) {
                                      try {
                                        console.log('Updating project', editingItem.id, 'with images:', reordered);
                                        const { error } = await supabase
                                          .from('projects')
                                          .update({ images: reordered })
                                          .eq('id', editingItem.id);
                                        if (error) throw error;
                                        console.log('Successfully updated project images');
                                        
                                        // Update the editingItem and formData with new order
                                        const updatedItem = { ...editingItem, images: reordered };
                                        setEditingItem(updatedItem);
                                        setFormData({ ...formData, images: reordered });
                                        
                                        // Reload the data to reflect changes
                                        await loadDashboardData();
                                        setSuccessMsg('Primary image updated!');
                                      } catch (err: any) {
                                        setError('Failed to update primary image: ' + err.message);
                                      }
                                    }
                                  }}
                                  aria-label="Set as primary"
                                  title="Set as primary image"
                                >
                                  ↑
                                </button>
                              )}
                              <button
                                type="button"
                                className="bg-red-600 text-white rounded-full h-5 w-5 text-xs"
                                onClick={async () => {
                                  const next = (formData.images || []).filter((_: string, i: number) => i !== idx);
                                  
                                  // Save the updated images immediately
                                  if (editingItem) {
                                    try {
                                      console.log('Removing image from project', editingItem.id, 'new images:', next);
                                      const { error } = await supabase
                                        .from('projects')
                                        .update({ images: next })
                                        .eq('id', editingItem.id);
                                      if (error) throw error;
                                      console.log('Successfully removed image from project');
                                      
                                      // Update the editingItem and formData with new images
                                      const updatedItem = { ...editingItem, images: next };
                                      setEditingItem(updatedItem);
                                      setFormData({ ...formData, images: next });
                                      
                                      // Reload the data to reflect changes
                                      await loadDashboardData();
                                      setSuccessMsg('Image removed successfully!');
                                    } catch (err: any) {
                                      setError('Failed to remove image: ' + err.message);
                                    }
                                  } else {
                                    // For new projects (not editing), just update form data
                                    setFormData({ ...formData, images: next });
                                  }
                                }}
                                aria-label="Remove image"
                                title="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <FileUpload
                    accept="image/*"
                    multiple
                    onUpload={handleProjectFiles}
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload up to 4 images. They will be stored in Supabase Storage.</p>
                </div>
              </>
            )}

            {modalType === 'services' && (
              <>
                <Input
                  label="Title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                
                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <div className="grid grid-cols-6 gap-2 p-3 border border-gray-300 rounded-md bg-gray-50 max-h-32 overflow-y-auto">
                    {SERVICE_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`w-8 h-8 text-lg rounded border-2 transition-all hover:scale-110 ${
                          formData.icon === icon 
                            ? 'border-blue-500 bg-blue-100' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData({...formData, icon})}
                        title={`Select ${icon}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  {formData.icon && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Selected:</span>
                      <span className="text-2xl">{formData.icon}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="" disabled>Select category</option>
                      {SERVICE_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.display_order || 0}
                      onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                </div>

                {/* What's Included */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {WHAT_INCLUDED_OPTIONS.map((item) => (
                      <label key={item} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={(formData.what_included || []).includes(item)}
                          onChange={(e) => {
                            const current = formData.what_included || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, what_included: [...current, item] });
                            } else {
                              setFormData({ ...formData, what_included: current.filter((i: string) => i !== item) });
                            }
                          }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {TECH_OPTIONS.map((tech) => (
                      <label key={tech} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={(formData.technologies || []).includes(tech)}
                          onChange={(e) => {
                            const current = formData.technologies || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, technologies: [...current, tech] });
                            } else {
                              setFormData({ ...formData, technologies: current.filter((t: string) => t !== tech) });
                            }
                          }}
                        />
                        <span>{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Button Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      id="show_request_button"
                      type="checkbox"
                      checked={formData.show_request_button !== false}
                      onChange={(e) => setFormData({ ...formData, show_request_button: e.target.checked })}
                    />
                    <label htmlFor="show_request_button" className="text-sm text-gray-700">Show "Request This Service" button</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="show_contact_button"
                      type="checkbox"
                      checked={formData.show_contact_button !== false}
                      onChange={(e) => setFormData({ ...formData, show_contact_button: e.target.checked })}
                    />
                    <label htmlFor="show_contact_button" className="text-sm text-gray-700">Show "Contact Us" button</label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="service_is_active"
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <label htmlFor="service_is_active" className="text-sm text-gray-700">Active (visible on website)</label>
                </div>
              </>
            )}

            {modalType === 'team' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Name *"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <Input
                    label="Role *"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <Input
                    label="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Brief description of the team member's expertise and background..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <Input
                    label="LinkedIn URL"
                    value={formData.linkedin_url || ''}
                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                    placeholder="https://linkedin.com/in/username"
                  />
                  <Input
                    label="GitHub URL"
                    value={formData.github_url || ''}
                    onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.display_order || 0}
                      onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={formData.is_active !== false}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-700">Active (visible on website)</label>
                  </div>
                </div>

                {/* Avatar upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                  {/* Current avatar preview */}
                  {formData.image && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Current avatar:</p>
                      <div className="relative inline-block group">
                        <img 
                          src={formData.image} 
                          alt="avatar" 
                          className="h-20 w-20 object-cover rounded-full border-2 border-gray-200" 
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setFormData({ ...formData, image: null })}
                          aria-label="Remove avatar"
                          title="Remove avatar"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  <FileUpload
                    accept="image/*"
                    multiple={false}
                    onUpload={handleTeamFiles}
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a new avatar image. It will be stored in Supabase Storage.</p>
                </div>
              </>
            )}

            {modalType === 'reviews' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Client Name *"
                    value={formData.client_name || ''}
                    onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    required
                  />
                  <Input
                    label="Company Name"
                    value={formData.client_company || ''}
                    onChange={(e) => setFormData({...formData, client_company: e.target.value})}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.client_email || ''}
                  onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select
                    value={formData.project_id || ''}
                    onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a project (optional)</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Star
                          size={24}
                          className={`${
                            star <= (formData.rating || 5)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {formData.rating || 5} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Content *</label>
                  <textarea
                    value={formData.content || ''}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Write the review content..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      id="review_approved"
                      type="checkbox"
                      checked={formData.approved || false}
                      onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                    />
                    <label htmlFor="review_approved" className="text-sm text-gray-700">Approved (visible on website)</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || 'pending'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                  <textarea
                    value={formData.admin_notes || ''}
                    onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Internal notes about this review..."
                  />
                </div>
              </>
            )}

            {modalType === 'consultations' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Client Name *"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <Input
                    label="Company Name"
                    value={formData.company_name || ''}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Website"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || 'new'}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority || 'medium'}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                    <select
                      value={formData.urgency || 'medium'}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Type(s)</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {['Web Development', 'Mobile App Development', 'E-commerce Development', 'AI & Machine Learning', 'Data Analytics', 'UI/UX Design', 'DevOps & Cloud', 'System Integration', 'Quality Assurance', 'Consulting', 'Other'].map((type) => (
                      <label key={type} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={(formData.project_type || []).includes(type)}
                          onChange={(e) => {
                            const current = formData.project_type || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, project_type: [...current, type] });
                            } else {
                              setFormData({ ...formData, project_type: current.filter((t: string) => t !== type) });
                            }
                          }}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Describe the project requirements..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Budget Range"
                    value={formData.budget || ''}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                  <Input
                    label="Timeline"
                    value={formData.timeline || ''}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    value={formData.assigned_to || ''}
                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>

                {/* Quote Section */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">💰 Quote & Pricing</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Quote Amount"
                      type="number"
                      value={formData.quote_amount || ''}
                      onChange={(e) => setFormData({...formData, quote_amount: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={formData.quote_currency || 'USD'}
                        onChange={(e) => setFormData({...formData, quote_currency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="PKR">PKR (₨)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input
                      label="Quote Validity (Days)"
                      type="number"
                      value={formData.quote_validity_days || ''}
                      onChange={(e) => setFormData({...formData, quote_validity_days: parseInt(e.target.value) || 30})}
                      placeholder="30"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Timeline (Weeks)</label>
                      <input
                        type="number"
                        value={formData.project_timeline_weeks || ''}
                        onChange={(e) => setFormData({...formData, project_timeline_weeks: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="4"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote Notes</label>
                    <textarea
                      value={formData.quote_notes || ''}
                      onChange={(e) => setFormData({...formData, quote_notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Additional notes about the quote..."
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                  <textarea
                    value={formData.internal_notes || ''}
                    onChange={(e) => setFormData({...formData, internal_notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Internal notes about this consultation..."
                  />
                </div>
              </>
            )}

            {modalType === 'consultation-approval' && (
              <>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">📧 Send Approval Email with Quote</h3>
                  <p className="text-blue-700 text-sm">This will send a professional email to the client with the project quote and next steps.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Quote Amount *"
                    type="number"
                    value={formData.quote_amount || ''}
                    onChange={(e) => setFormData({...formData, quote_amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
                    <select
                      value={formData.quote_currency || 'USD'}
                      onChange={(e) => setFormData({...formData, quote_currency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="PKR">PKR (₨)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Quote Validity (Days) *"
                    type="number"
                    value={formData.quote_validity_days || ''}
                    onChange={(e) => setFormData({...formData, quote_validity_days: parseInt(e.target.value) || 30})}
                    placeholder="30"
                    required
                  />
                  <Input
                    label="Project Timeline (Weeks) *"
                    type="number"
                    value={formData.project_timeline_weeks || ''}
                    onChange={(e) => setFormData({...formData, project_timeline_weeks: parseInt(e.target.value) || 0})}
                    placeholder="4"
                    required
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote Notes</label>
                  <textarea
                    value={formData.quote_notes || ''}
                    onChange={(e) => setFormData({...formData, quote_notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Additional notes about the quote..."
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              {modalType === 'consultation-approval' ? (
                <Button 
                  type="button" 
                  onClick={handleSendApprovalEmail}
                  disabled={uploading} 
                  loading={uploading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Approval Email
                </Button>
              ) : (
                <Button type="submit" disabled={uploading} loading={uploading}>
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;
