import { cache } from "react";
import { createAdminClient, type UserRow } from "@/lib/db/client";
import type {
  Experience,
  Profile,
  Project,
  Skill,
  Stat,
} from "./types";
import {
  placeholderExperiences,
  placeholderProfile,
  placeholderProjects,
  placeholderSkills,
} from "./placeholder";

const monthYear = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
});

function formatPeriod(start: string, end: string | null, isCurrent: boolean) {
  const s = monthYear.format(new Date(start));
  const e = isCurrent || !end ? "Present" : monthYear.format(new Date(end));
  return `${s} — ${e}`;
}

function mapProfile(row: UserRow): Profile {
  const roles = Array.isArray(row.roles) ? row.roles : [];
  const socials = (row.socials ?? {}) as Profile["socials"];
  return {
    name: row.name,
    username: row.username,
    email: row.email,
    role: row.role ?? "",
    roles: roles.length > 0 ? roles.map(String) : [row.role ?? ""],
    tagline: row.tagline ?? "",
    bio: row.bio ?? "",
    location: row.location ?? "",
    availability: row.availability ?? "",
    resume: row.resume_link ?? "/resume.pdf",
    avatarUrl: row.avatar_url,
    socials: {
      github: socials.github,
      linkedin: socials.linkedin,
      twitter: socials.twitter,
      instagram: socials.instagram,
    },
  };
}

function mapProject(row: {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  category: string;
  featured: boolean;
  skills: Array<{ name: string }>;
}): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    category:
      row.category === "mobile" || row.category === "uiux" ? row.category : "web",
    featured: row.featured,
    skills: row.skills?.map((s) => s.name) ?? [],
  };
}

function mapExperience(row: {
  id: string;
  company_name: string;
  role: string;
  type: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}): Experience {
  const isCurrent = row.is_current;
  return {
    id: row.id,
    period: formatPeriod(row.start_date, row.end_date, isCurrent),
    role: row.role,
    company: row.company_name,
    type: row.type === "education" ? "education" : "work",
    isCurrent,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description ?? "",
    tags: [],
  };
}

function computeStats(
  projects: Project[],
  skills: Skill[],
  experiences: Experience[],
): Stat[] {
  const work = experiences.filter((e) => e.type === "work");
  let years = 3;
  if (work.length > 0) {
    const start = Math.min(...work.map((e) => new Date(e.startDate).getTime()));
    const hasCurrent = work.some((e) => e.isCurrent);
    const end = hasCurrent
      ? Date.now()
      : Math.max(
          ...work.map((e) =>
            e.endDate ? new Date(e.endDate).getTime() : Date.now(),
          ),
        );
    years = Math.max(1, Math.round((end - start) / (365.25 * 24 * 3600 * 1000)));
  }
  return [
    { value: `${years}+`, label: "Years of Experience" },
    { value: `${projects.length}`, label: "Projects Shipped" },
    { value: `${skills.length}`, label: "Skills Mastered" },
  ];
}

export async function getProfile(): Promise<Profile> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("users")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) return placeholderProfile;
  return mapProfile(data as UserRow);
}

export async function getProjects(): Promise<Project[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .select(
      "id, title, slug, description, cover_image_url, live_url, github_url, category, featured, skills(name)",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return placeholderProjects;
  return data.map(mapProject);
}

export async function getSkills(): Promise<Skill[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("skills")
    .select("id, name, icon_url, category, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) return placeholderSkills;
  return data.map((s) => ({
    id: s.id,
    name: s.name,
    iconUrl: s.icon_url,
    category: s.category,
    sortOrder: s.sort_order,
  }));
}

export async function getExperiences(): Promise<Experience[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("experiences")
    .select(
      "id, company_name, role, type, start_date, end_date, is_current, description, sort_order",
    )
    .order("sort_order", { ascending: true });

  if (error || !data) return placeholderExperiences;
  return data.map(mapExperience);
}

export const getPortfolioData = cache(async () => {
  const [profile, projects, skills, experiences] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
    getExperiences(),
  ]);

  return {
    profile,
    projects,
    skills,
    experiences,
    stats: computeStats(projects, skills, experiences),
  };
});
