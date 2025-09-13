import { ProjectType } from '../lib/supabase';

// Re-export types from supabase
export type {
  Project,
  Service,
  TeamMember,
  Review,
  Consultation,
  Chat,
  Theme,
  Settings,
  ProjectType,
  ConsultationStatus,
  UserRole,
} from '../lib/supabase';

// Additional types for the application
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ConsultationFormData {
  // Personal Information
  name: string;
  email: string;
  phone?: string;
  
  // Project Information
  projectType: string[];
  description: string;
  budget: string;
  ownership: 'own' | 'representing';
  location?: string;
  links: string[];
  idea?: string;
  timeline?: string;
  
  // Files
  attachments?: File[];
}

export interface FilterOptions {
  category?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'name';
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationData;
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface TechStack {
  name: string;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Database' | 'Cloud' | 'DevOps' | 'AI/ML' | 'Language' | 'Framework';
  icon?: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  icon?: string;
}

export interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

export interface Statistic {
  icon: string;
  value: string;
  label: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientCompany?: string;
  clientImage?: string;
  content: string;
  rating: number;
  projectId?: string;
  approved: boolean;
  createdAt: string;
}

export interface ProjectFilter {
  type?: ProjectType;
  technology?: string;
  search?: string;
}

export interface ServiceFilter {
  category?: string;
  search?: string;
}

// Form validation schemas
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// Theme related types
export interface ThemeColors {
  bg: string;
  surface: string;
  card: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
}

export interface PresetTheme {
  name: string;
  colors: ThemeColors;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardProps extends BaseComponentProps {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

// Animation types
export interface AnimationVariants {
  hidden: any;
  visible: any;
  exit?: any;
}

// SEO types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: AppError;
}

// Data fetching states
export interface DataState<T> extends LoadingState {
  data?: T;
  refetch?: () => void;
}
