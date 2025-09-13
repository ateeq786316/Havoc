import axios from 'axios';
import toast from 'react-hot-toast';
import { sampleServices, sampleProjects, sampleTeamMembers, sampleReviews } from '../data/sampleData';
import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Ensure API_BASE_URL doesn't already end with /api
const cleanBaseURL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

// Create axios instance with default config
export const api = axios.create({
  baseURL: cleanBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/admin/login';
    }
    
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Mock API functions for development
const mockApiCall = <T>(data: T, delay: number = 500): Promise<{ data: T }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// Real API call with fallback to mock
const apiCall = async <T>(endpoint: string, options: any = {}): Promise<{ data: T }> => {
  try {
    const response = await api.get(endpoint, options);
    return { data: response.data.data || response.data };
  } catch (error) {
    console.warn(`API call failed for ${endpoint}, using mock data:`, error);
    // Return mock data as fallback
    return mockApiCall(null as T, 100);
  }
};

// Supabase read helper with graceful fallback
const supabaseRead = async <T>(queryFn: () => Promise<{ data: any; error: any }>, fallback: () => Promise<{ data: T }>): Promise<{ data: T }> => {
  try {
    const { data, error } = await queryFn();
    if (error) throw error;
    // If no data returned, fallback
    if (data == null) return fallback();
    return { data } as { data: T };
  } catch (err) {
    console.warn('Supabase read failed, using fallback:', err);
    return fallback();
  }
};

const supabaseWrite = async <T>(queryFn: () => Promise<{ data: any; error: any }>, fallback: () => Promise<{ data: T }>): Promise<{ data: T }> => {
  try {
    const { data, error } = await queryFn();
    if (error) throw error;
    return { data } as { data: T };
  } catch (err) {
    console.warn('Supabase write failed, using fallback:', err);
    return fallback();
  }
};

// API functions with real backend integration and fallback to mock data
export const apiClient = {
  // Projects
  getProjects: async (status?: string, adminMode: boolean = false) =>
    supabaseRead(
      async () => {
        let query = supabase.from('projects').select('*');
        if (!adminMode) {
          query = query.eq('status', 'published');
        }
        if (status && status !== 'all') {
          query = query.eq('status', status);
        }
        return query.order('created_at', { ascending: false });
      },
      () => mockApiCall(sampleProjects)
    ),
  getProject: async (id: string) =>
    supabaseRead(
      async () => supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle(),
      () => mockApiCall(sampleProjects.find(p => p.id === id) || null)
    ),
  createProject: (data: any) => api.post('/projects', data).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ ...data, id: Date.now().toString() })),
  updateProject: (id: string, data: any) => api.put(`/projects/${id}`, data).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ ...data, id })),
  deleteProject: (id: string) => api.delete(`/projects/${id}`).then(res => ({ data: res.data })).catch(() => mockApiCall({ success: true })),

  // Services
  getServices: async () =>
    supabaseRead(
      async () => supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false }),
      () => mockApiCall(sampleServices)
    ),
  getService: async (id: string) =>
    supabaseRead(
      async () => supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .maybeSingle(),
      () => mockApiCall(sampleServices.find(s => s.id === id) || null)
    ),
  createService: (data: any) => api.post('/services', data).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ ...data, id: Date.now().toString() })),
  updateService: (id: string, data: any) => api.put(`/services/${id}`, data).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ ...data, id })),
  deleteService: (id: string) => api.delete(`/services/${id}`).then(res => ({ data: res.data })).catch(() => mockApiCall({ success: true })),

  // Team
  getTeamMembers: async (activeOnly: boolean = true) =>
    supabaseRead(
      async () => {
        let query = supabase.from('team_members').select('*');
        if (activeOnly) {
          query = query.eq('is_active', true);
        }
        return query.order('display_order', { ascending: true }).order('created_at', { ascending: false });
      },
      () => mockApiCall(sampleTeamMembers)
    ),
  getTeamMember: async (id: string) =>
    supabaseRead(
      async () => supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .maybeSingle(),
      () => mockApiCall(sampleTeamMembers.find(t => t.id === id) || null)
    ),
  createTeamMember: async (data: any) =>
    supabaseWrite(
      async () => supabase.from('team_members').insert(data).select().single(),
      () => mockApiCall({ ...data, id: Date.now().toString() })
    ),
  updateTeamMember: async (id: string, data: any) =>
    supabaseWrite(
      async () => supabase.from('team_members').update(data).eq('id', id).select().single(),
      () => mockApiCall({ ...data, id })
    ),
  deleteTeamMember: async (id: string) =>
    supabaseWrite(
      async () => supabase.from('team_members').delete().eq('id', id),
      () => mockApiCall({ success: true })
    ),

  // Reviews
  getReviews: async (approvedOnly: boolean = true) => {
    console.log('🔍 Fetching reviews, approvedOnly:', approvedOnly);
    return supabaseRead(
      async () => {
        let query = supabase.from('reviews').select('*');
        if (approvedOnly) {
          query = query.eq('approved', true);
        }
        const result = await query.order('created_at', { ascending: false });
        console.log('✅ Reviews fetched:', result);
        return result;
      },
      () => mockApiCall(sampleReviews)
    );
  },
  getReview: async (id: string) =>
    supabaseRead(
      async () => supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .maybeSingle(),
      () => mockApiCall(sampleReviews.find(r => r.id === id) || null)
    ),
  createReview: async (data: any) =>
    supabaseWrite(
      async () => supabase.from('reviews').insert({
        ...data,
        approved: false,
        status: 'pending'
      }).select().single(),
      () => mockApiCall({ ...data, id: Date.now().toString(), approved: false, status: 'pending' })
    ),
  updateReview: async (id: string, data: any) =>
    supabaseWrite(
      async () => supabase.from('reviews').update(data).eq('id', id).select().single(),
      () => mockApiCall({ ...data, id })
    ),
  approveReview: async (id: string, adminNotes?: string) => {
    console.log('🔍 Approving review:', id, 'with notes:', adminNotes);
    return supabaseWrite(
      async () => {
        const result = await supabase.from('reviews').update({
          approved: true,
          status: 'approved',
          admin_notes: adminNotes
        }).eq('id', id).select().single();
        console.log('✅ Approve result:', result);
        return result;
      },
      () => mockApiCall({ success: true })
    );
  },
  rejectReview: async (id: string, adminNotes?: string) => {
    console.log('🔍 Rejecting review:', id, 'with notes:', adminNotes);
    return supabaseWrite(
      async () => {
        const result = await supabase.from('reviews').update({
          approved: false,
          status: 'rejected',
          admin_notes: adminNotes
        }).eq('id', id).select().single();
        console.log('✅ Reject result:', result);
        return result;
      },
      () => mockApiCall({ success: true })
    );
  },
  deleteReview: async (id: string) =>
    supabaseWrite(
      async () => supabase.from('reviews').delete().eq('id', id),
      () => mockApiCall({ success: true })
    ),

  // Consultations
  getConsultations: async (status?: string, assignedTo?: string) => {
    console.log('🔍 Fetching consultations, status:', status, 'assignedTo:', assignedTo);
    return supabaseRead(
      async () => {
        let query = supabase.from('consultations').select('*');
        if (status) {
          query = query.eq('status', status);
        }
        if (assignedTo) {
          query = query.eq('assigned_to', assignedTo);
        }
        const result = await query.order('created_at', { ascending: false });
        console.log('✅ Consultations fetched:', result);
        return result;
      },
      () => mockApiCall([])
    );
  },
  getConsultation: async (id: string) =>
    supabaseRead(
      async () => supabase
        .from('consultations')
        .select('*')
        .eq('id', id)
        .maybeSingle(),
      () => mockApiCall(null)
    ),
  createConsultation: async (data: any) =>
    supabaseWrite(
      async () => supabase.from('consultations').insert({
        ...data,
        status: 'new',
        priority: 'medium',
        urgency: 'medium',
        source: 'website'
      }).select().single(),
      () => mockApiCall({ ...data, id: Date.now().toString(), status: 'new' })
    ),
  updateConsultation: async (id: string, data: any) =>
    supabaseWrite(
      async () => supabase.from('consultations').update(data).eq('id', id).select().single(),
      () => mockApiCall({ ...data, id })
    ),
  deleteConsultation: async (id: string) =>
    supabaseWrite(
      async () => supabase.from('consultations').delete().eq('id', id),
      () => mockApiCall({ success: true })
    ),
  assignConsultation: async (id: string, assignedTo: string) =>
    supabaseWrite(
      async () => supabase.from('consultations').update({ assigned_to: assignedTo }).eq('id', id).select().single(),
      () => mockApiCall({ success: true })
    ),
  updateConsultationStatus: async (id: string, status: string, notes?: string) =>
    supabaseWrite(
      async () => supabase.from('consultations').update({ 
        status, 
        internal_notes: notes ? `${new Date().toISOString()}: ${notes}` : undefined 
      }).eq('id', id).select().single(),
      () => mockApiCall({ success: true })
    ),

  // Chats
  getChats: (consultationId: string) => apiCall(`/chats/${consultationId}`).catch(() => mockApiCall([])),
  createChat: (data: any) => api.post('/chats', data).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ ...data, id: Date.now().toString() })),

  // Themes
  getThemes: async () =>
    supabaseRead(
      async () => supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false }),
      () => mockApiCall([
        {
          id: '1',
          name: 'Modern Tech Minimal',
          colors: {
            bg: '#fefae0',
            surface: '#e9edc9',
            card: '#faedcd',
            primary: '#d4a373',
            secondary: '#ccd5ae',
            accent: '#777567',
            text: '#33312b',
            muted: '#545248',
            border: '#c4c0ab',
          },
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
    ),
  getActiveTheme: async () =>
    supabaseRead(
      async () => supabase
        .from('themes')
        .select('*')
        .eq('is_active', true)
        .maybeSingle(),
      () => mockApiCall({
        id: '1',
        name: 'Modern Tech Minimal',
        colors: {
          bg: '#fefae0',
          surface: '#e9edc9',
          card: '#faedcd',
          primary: '#d4a373',
          secondary: '#ccd5ae',
          accent: '#777567',
          text: '#33312b',
          muted: '#545248',
          border: '#c4c0ab',
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    ),
  createTheme: (data: any) => api.post('/themes', data).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ ...data, id: Date.now().toString() })),
  updateTheme: (id: string, data: any) => api.put(`/themes/${id}`, data).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ ...data, id })),
  deleteTheme: (id: string) => api.delete(`/themes/${id}`).then(res => ({ data: res.data })).catch(() => mockApiCall({ success: true })),

  // Settings
  getSettings: async () =>
    supabaseRead(
      async () => supabase
        .from('settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      () => mockApiCall({
        id: true,
        company_name: 'Havoc Solutions',
        emails: ['havocsolutions1@gmail.com', 'havocsolutions1@outlook.com'],
        socials: {
          fiverr: 'https://fiverr.com/s/jjE6Vlm',
          linkedin: 'https://www.linkedin.com/in/havoc-solutions-583206375',
          instagram: 'https://www.instagram.com/havocsolutions.official',
        },
        address: 'Remote Team',
        about: 'Havoc Solutions is a product engineering team delivering robust digital platforms.',
        seo: {},
      })
    ),
  updateSettings: (data: any) => api.put('/settings', data).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ ...data })),

  // Auth
  login: (credentials: any) => api.post('/auth/login', credentials).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ 
    token: 'mock-jwt-token', 
    user: { id: '1', email: credentials.email, name: 'Admin', role: 'admin' } 
  })),
  register: (data: any) => api.post('/auth/register', data).then(res => ({ data: res.data.data })).catch(() => mockApiCall({ 
    token: 'mock-jwt-token', 
    user: { id: '1', email: data.email, name: data.name, role: 'admin' } 
  })),
  refresh: () => api.post('/auth/refresh').then(res => ({ data: res.data.data })).catch(() => mockApiCall({ token: 'new-mock-jwt-token' })),
  logout: () => api.post('/auth/logout').then(res => ({ data: res.data })).catch(() => mockApiCall({ success: true })),

  // Email Templates
  getEmailTemplates: async () =>
    supabaseRead(
      async () => supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
      () => mockApiCall([])
    ),
  createEmailTemplate: async (data: any) =>
    supabaseWrite(
      async () => supabase.from('email_templates').insert(data).select().single(),
      () => mockApiCall({ ...data, id: Date.now().toString() })
    ),
  updateEmailTemplate: async (id: string, data: any) =>
    supabaseWrite(
      async () => supabase.from('email_templates').update(data).eq('id', id).select().single(),
      () => mockApiCall({ ...data, id })
    ),
  deleteEmailTemplate: async (id: string) =>
    supabaseWrite(
      async () => supabase.from('email_templates').delete().eq('id', id),
      () => mockApiCall({ success: true })
    ),

  // Email Logs
  getEmailLogs: async (consultationId?: string) =>
    supabaseRead(
      async () => {
        let query = supabase.from('email_logs').select('*');
        if (consultationId) {
          query = query.eq('consultation_id', consultationId);
        }
        return query.order('created_at', { ascending: false });
      },
      () => mockApiCall([])
    ),

  // Send consultation approval email
  sendConsultationApprovalEmail: async (consultationId: string, quoteData: any) =>
    supabaseWrite(
      async () => {
        // Get consultation details
        const { data: consultation } = await supabase
          .from('consultations')
          .select('*')
          .eq('id', consultationId)
          .single();

        if (!consultation) throw new Error('Consultation not found');

        // Generate approval token
        const approvalToken = crypto.randomUUID();
        const baseUrl = window.location.origin;
        const approvalUrl = `${baseUrl}/consultation-approval?token=${approvalToken}&action=approve`;
        const rejectionUrl = `${baseUrl}/consultation-approval?token=${approvalToken}&action=reject`;

        // Get email template
        const { data: template } = await supabase
          .from('email_templates')
          .select('*')
          .eq('type', 'consultation_approval')
          .eq('is_active', true)
          .single();

        if (!template) throw new Error('Email template not found');

        // Update consultation with quote data and approval token
        const { data: updatedConsultation } = await supabase
          .from('consultations')
          .update({
            ...quoteData,
            email_sent: true,
            email_sent_at: new Date().toISOString(),
            email_template_used: template.name,
            status: 'in_progress',
            client_approval_status: 'pending',
            client_approval_token: approvalToken,
            project_officially_assigned: false
          })
          .eq('id', consultationId)
          .select()
          .single();

        // Create email log
        const { data: emailLog } = await supabase
          .from('email_logs')
          .insert({
            consultation_id: consultationId,
            template_id: template.id,
            recipient_email: consultation.email,
            subject: template.subject,
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .select()
          .single();

        return { data: { consultation: updatedConsultation, emailLog, approvalUrl, rejectionUrl }, error: null };
      },
      () => mockApiCall({ success: true })
    ),

  // Handle client approval/rejection
  handleClientApproval: async (token: string, action: 'approve' | 'reject', notes?: string, rejectionReason?: string) =>
    supabaseWrite(
      async () => {
        // Find consultation by token
        const { data: consultation } = await supabase
          .from('consultations')
          .select('*')
          .eq('client_approval_token', token)
          .eq('client_approval_status', 'pending')
          .single();

        if (!consultation) throw new Error('Invalid or expired approval token');

        // Update consultation based on action
        const updateData = {
          client_approval_status: action === 'approve' ? 'approved' : 'rejected',
          client_approval_date: new Date().toISOString(),
          client_approval_notes: notes || null,
          client_rejection_reason: action === 'reject' ? rejectionReason : null,
          project_officially_assigned: action === 'approve',
          project_assignment_date: action === 'approve' ? new Date().toISOString() : null,
          status: action === 'approve' ? 'in_progress' : 'cancelled'
        };

        const { data: updatedConsultation } = await supabase
          .from('consultations')
          .update(updateData)
          .eq('id', consultation.id)
          .select()
          .single();

        return { data: updatedConsultation, error: null };
      },
      () => mockApiCall({ success: true })
    ),

  // Get consultation by approval token
  getConsultationByToken: async (token: string) =>
    supabaseRead(
      async () => supabase
        .from('consultations')
        .select('*')
        .eq('client_approval_token', token)
        .single(),
      () => mockApiCall(null)
    ),
};