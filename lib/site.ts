import type { ProjectCategory } from "./types";

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const projectCategories: Array<{
  id: ProjectCategory | "all";
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "uiux", label: "UI/UX" },
];

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
