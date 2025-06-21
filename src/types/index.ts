// Profile Module Types
export type ProfileAvailability = "available" | "not_available" | "freelance";

export interface Profile {
  id: string | number;
  name: string;
  about?: string;
  profile_image?: string;
  location?: string;
  headline?: string;
  availability?: ProfileAvailability;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface ProfileFormData {
  name: string;
  about?: string;
  profile_image?: string;
  location?: string;
  headline?: string;
  availability?: ProfileAvailability;
}

// Projects Module Types
export type ProjectStatus = "completed" | "ongoing" | "draft";

export interface Project {
  id: string | number;
  title: string;
  description: string;
  video?: string;
  image?: string;
  image_path?: string;
  tech_stack: string[];
  deployed_link?: string;
  github_link?: string;
  status: ProjectStatus;
  category?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  // Optional fields for modal details
  learnings?: string | string[];
  challenges?: string | string[];
  duration?: string;
  role?: string;
  team_size?: number;
  features?: string | string[];
}

export interface ProjectFormData {
  title: string;
  description: string;
  status: ProjectStatus;
  tech_stack: string[];
  github_link: string;
  deployed_link?: string;
  image?: string;
  image_path?: string;
  video?: string;
  duration?: string;
  role?: string;
  team_size?: number;
  features?: string | string[];
  learnings?: string | string[];
  challenges?: string | string[];
}

// Experience Module Types
export interface Experience {
  id: string | number;
  role: string;
  company_name: string;
  company_logo?: string;
  duration: string;
  start_date?: string;
  end_date?: string;
  role_description: string;
  achievements: string[];
  challenges_faced: string;
  learnings: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface ExperienceFormData {
  company_name: string;
  role: string;
  duration: string;
  role_description: string;
  achievements: string[];
  challenges_faced: string;
  learnings: string;
}

// Skills Module Types
export type SkillCategory =
  | "frontend"
  | "backend"
  | "devops"
  | "database"
  | "tools"
  | "languages"
  | "frameworks"
  | "other";

export interface Skill {
  id: string | number;
  name: string;
  category?: SkillCategory;
  proficiency_level?: number; // 1-5 scale for progress bars
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface SkillFormData {
  name: string;
  category: SkillCategory;
  proficiency_level?: number;
}

export type SkillsByCategory = {
  [key in SkillCategory]: Skill[];
};

// Contact Module Types
export interface ContactInfo {
  id: string | number;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface ContactFormData {
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

export interface ContactMessage {
  id: string | number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at?: string | Date;
}

export interface ContactMessageFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Authentication Types
export interface User {
  id: string | number;
  username: string;
  password_hash: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface AuthSession {
  user: {
    id: string | number;
    username: string;
  };
  expires: string;
}

// Theme Types
export type ThemeMode = "light" | "dark";

export interface ThemeConfig {
  mode: ThemeMode;
  accent_color: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

// Form States
export interface FormState {
  success: boolean;
  error?: string;
  data?: unknown;
}

// Dashboard Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  description?: string;
}

// SEO Types
export interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string[];
  og_image?: string;
  twitter_handle?: string;
}

// Animation Types
export interface AnimationConfig {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
}

// Component Props Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface FormProps extends ComponentProps {
  onSubmit: (data: unknown) => void;
  isLoading?: boolean;
  initialData?: unknown;
}

// Tech Stack Options
export const TECH_STACK_OPTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "PostgreSQL",
  "MongoDB",
  "Prisma",
  "Tailwind CSS",
  "Framer Motion",
  "Python",
  "Django",
  "Flask",
  "Docker",
  "AWS",
  "Vercel",
  "Git",
  "GitHub",
  "REST API",
  "GraphQL",
  "Socket.io",
  "Redis",
  "Stripe",
  "Firebase",
  "Supabase",
  "Figma",
  "Adobe XD",
  "Vue.js",
  "Angular",
  "React Native",
  "Flutter",
  "MySQL",
  "PHP",
  "Laravel",
  "Ruby on Rails",
  "Go",
  "Rust",
  "Java",
  "Spring Boot",
  "C#",
  ".NET",
  "Swift",
  "Kotlin",
  "Unity",
  "Unreal Engine",
  "Blender",
  "Photoshop",
  "Illustrator",
] as const;

export type TechStackOption = (typeof TECH_STACK_OPTIONS)[number];

// Skill Categories Display Names
export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  database: "Database",
  tools: "Tools",
  languages: "Languages",
  frameworks: "Frameworks",
  other: "Other",
};

// Project Status Display Names
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  draft: "Draft",
};

// Default Values
export const DEFAULT_PROFILE: Partial<Profile> = {
  name: "Your Name",
  about: "Tell us about yourself...",
  headline: "Full Stack Developer",
  availability: "available",
};

export const DEFAULT_CONTACT_INFO: Partial<ContactInfo> = {
  email: "your.email@example.com",
};

// User profile data (legacy compatibility)
export interface UserProfile {
  id: string | number;
  name: string;
  title: string;
  bio: string;
  location?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  resume_url?: string;
  available_for_work: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
}
