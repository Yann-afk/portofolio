import type { ProjectCategory } from "./site";

export type { ProjectCategory } from "./site";

export interface Socials {
  github?: string;
  whatsapp?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

export interface Profile {
  name: string;
  username: string;
  email: string;
  role: string;
  roles: string[];
  tagline: string;
  bio: string;
  location: string;
  availability: string;
  resume: string;
  avatarUrl: string | null;
  socials: Socials;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  category: ProjectCategory;
  featured: boolean;
  skills: string[];
}

export interface Skill {
  id: string;
  name: string;
  iconUrl: string | null;
  category: string | null;
  sortOrder: number;
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  type: "work" | "education";
  isCurrent: boolean;
  startDate: string;
  endDate: string | null;
  description: string;
  tags: string[];
}

export interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
