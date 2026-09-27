export const navLinks = [
  { label: "Tentang", href: "#about" },
  { label: "Proyek", href: "#projects" },
  { label: "Pengalaman", href: "#experience" },
  { label: "Kontak", href: "#contact" },
];

/**
 * Single source of truth for project categories. The admin form, the admin
 * list badge, the public filter pills, the read path, and the write path all
 * derive from this list, so adding a category here is enough.
 */
export const projectCategoryOptions = [
  { id: "web", label: "Web App" },
  { id: "website", label: "Website" },
  { id: "mobile", label: "Mobile App" },
  { id: "desktop", label: "Desktop App" },
  { id: "backend", label: "Backend / API" },
  { id: "uiux", label: "UI/UX" },
  { id: "ai", label: "AI / Machine Learning" },
  { id: "game", label: "Game" },
  { id: "opensource", label: "Open Source" },
  { id: "experiment", label: "Eksperimen" },
] as const;

export type ProjectCategory = (typeof projectCategoryOptions)[number]["id"];

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return (
    typeof value === "string" &&
    projectCategoryOptions.some((option) => option.id === value)
  );
}

/** Unknown or legacy values fall back to the default rather than rendering blank. */
export function normalizeProjectCategory(value: unknown): ProjectCategory {
  return isProjectCategory(value) ? value : "web";
}

export function projectCategoryLabel(value: string): string {
  return (
    projectCategoryOptions.find((option) => option.id === value)?.label ?? value
  );
}

/** Filter pills for the public site: "All" plus every real category. */
export const projectCategories = [
  { id: "all" as const, label: "Semua" },
  ...projectCategoryOptions.map(
    (option) => option as { id: ProjectCategory; label: string },
  ),
];

/**
 * Display labels for the experience `type` column. The stored values stay in
 * English because they are written to the database and already exist in
 * existing rows; only what the admin sees is translated.
 */
const experienceTypeLabels: Record<string, string> = {
  work: "Kerja",
  education: "Pendidikan",
  organization: "Organisasi",
  award: "Penghargaan",
};

export function experienceTypeLabel(value: string): string {
  return experienceTypeLabels[value] ?? value;
}

export const projectGradients = [
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-sky-500 via-cyan-500 to-emerald-500",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-rose-500 via-pink-500 to-fuchsia-500",
  "from-indigo-500 via-blue-500 to-sky-500",
];

export function gradientFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return projectGradients[hash % projectGradients.length];
}
