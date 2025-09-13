import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type ProjectType = 'mobile' | 'web' | 'ai' | 'fullstack';
export type ConsultationStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'editor' | 'viewer' | 'client';

export interface Project {
  id: string;
  title: string;
  description?: string;
  type: ProjectType;
  images: string[];
  technologies: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
  is_active?: boolean;
  display_order?: number;
  what_included?: string[];
  technologies?: string[];
  show_request_button?: boolean;
  show_contact_button?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  image_url?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  social_links?: Record<string, string>;
  is_active?: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
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

export interface Consultation {
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

export interface Chat {
  id: string;
  consultation_id: string;
  sender: 'client' | 'team';
  message?: string;
  file_url?: string;
  timestamp: string;
  read: boolean;
}

export interface Theme {
  id: string;
  name?: string;
  colors: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: boolean;
  company_name: string;
  emails: string[];
  socials: Record<string, string>;
  address?: string;
  about?: string;
  seo: Record<string, any>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  template: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  consultation_id: string;
  template_id: string;
  recipient_email: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  sent_at?: string;
  error_message?: string;
  created_at: string;
}