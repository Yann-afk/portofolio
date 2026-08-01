import type { Experience, Profile, Project, Skill, Stat } from "./types";

export const placeholderProfile: Profile = {
  name: "Your Name",
  username: "yourname",
  email: "hello@yourname.dev",
  role: "Full-Stack Developer",
  roles: ["Full-Stack Developer", "UI/UX Enthusiast", "Open Source Contributor"],
  tagline:
    "I build fast, accessible and delightful web experiences that people love to use.",
  bio: "Hi! I'm Your Name, a Full-Stack Developer based in Jakarta, Indonesia. I love turning complex problems into simple, beautiful and intuitive products. When I'm not coding, you'll find me sketching UI ideas, contributing to open source, or exploring new tech.\n\nWith 3+ years of experience shipping products from idea to production, I care deeply about performance, clean code, and the little details that make a great user experience.",
  location: "Jakarta, Indonesia",
  availability: "Available for freelance",
  resume: "/resume.pdf",
  avatarUrl: null,
  socials: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://x.com/yourusername",
    instagram: "https://instagram.com/yourusername",
  },
};

export const placeholderStats: Stat[] = [
  { value: "3+", label: "Years of Experience" },
  { value: "20+", label: "Projects Shipped" },
  { value: "10+", label: "Happy Clients" },
];

export const placeholderSkills: Skill[] = [
  { id: "ts", name: "TypeScript", iconUrl: null, category: "Frontend", sortOrder: 1 },
  { id: "react", name: "React", iconUrl: null, category: "Frontend", sortOrder: 2 },
  { id: "next", name: "Next.js", iconUrl: null, category: "Frontend", sortOrder: 3 },
  { id: "tailwind", name: "Tailwind CSS", iconUrl: null, category: "Frontend", sortOrder: 4 },
  { id: "node", name: "Node.js", iconUrl: null, category: "Backend", sortOrder: 5 },
  { id: "pg", name: "PostgreSQL", iconUrl: null, category: "Backend", sortOrder: 6 },
  { id: "gql", name: "GraphQL", iconUrl: null, category: "Backend", sortOrder: 7 },
  { id: "docker", name: "Docker", iconUrl: null, category: "DevOps", sortOrder: 8 },
  { id: "figma", name: "Figma", iconUrl: null, category: "Design", sortOrder: 9 },
  { id: "git", name: "Git", iconUrl: null, category: "DevOps", sortOrder: 10 },
];

export const placeholderProjects: Project[] = [
  {
    id: "p1",
    title: "E-Commerce Platform",
    slug: "e-commerce-platform",
    description:
      "A headless commerce platform with real-time inventory, Stripe payments, and an admin dashboard.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/ecommerce",
    category: "web",
    featured: true,
    skills: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
  },
  {
    id: "p2",
    title: "Task Manager App",
    slug: "task-manager-app",
    description:
      "A cross-platform productivity app with offline support, kanban board, and team collaboration.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/taskmanager",
    category: "mobile",
    featured: false,
    skills: ["React Native", "Expo", "Firebase"],
  },
  {
    id: "p3",
    title: "Finance Dashboard UI",
    slug: "finance-dashboard-ui",
    description:
      "A clean, data-dense dashboard design for tracking personal finances with dark mode support.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: null,
    category: "uiux",
    featured: false,
    skills: ["Figma", "Design System", "Dark Mode"],
  },
  {
    id: "p4",
    title: "Real-time Chat App",
    slug: "real-time-chat-app",
    description:
      "A real-time messaging app with typing indicators, read receipts, and end-to-end encryption.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/chat",
    category: "web",
    featured: false,
    skills: ["React", "Socket.io", "Redis", "Node.js"],
  },
  {
    id: "p5",
    title: "Fitness Tracking App",
    slug: "fitness-tracking-app",
    description:
      "A mobile app that tracks workouts, calories, and progress with beautiful data visualizations.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/fitness",
    category: "mobile",
    featured: false,
    skills: ["React Native", "Reanimated", "Supabase"],
  },
  {
    id: "p6",
    title: "Travel Booking Website",
    slug: "travel-booking-website",
    description:
      "UX research and high-fidelity UI for a travel booking platform with a focus on frictionless flows.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: null,
    category: "uiux",
    featured: false,
    skills: ["Figma", "Prototyping", "User Testing"],
  },
];

export const placeholderExperiences: Experience[] = [
  {
    id: "e1",
    period: "Jan 2024 — Present",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    type: "work",
    isCurrent: true,
    startDate: "2024-01-01",
    endDate: null,
    description:
      "Leading the frontend team to build a design system and micro-frontends serving 1M+ monthly users.",
    tags: ["React", "TypeScript", "Design Systems"],
  },
  {
    id: "e2",
    period: "Jun 2022 — Jan 2024",
    role: "Full-Stack Developer",
    company: "StartupX",
    type: "work",
    isCurrent: false,
    startDate: "2022-06-01",
    endDate: "2024-01-01",
    description:
      "Shipped core features across web and mobile, cut page load time by 60%, and grew the platform to 100K users.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
  },
  {
    id: "e3",
    period: "Jan 2021 — Jun 2022",
    role: "Freelance Web Developer",
    company: "Independent",
    type: "work",
    isCurrent: false,
    startDate: "2021-01-01",
    endDate: "2022-06-01",
    description:
      "Collaborated with 10+ clients across industries to design, build, and launch marketing sites and web apps.",
    tags: ["React", "Tailwind CSS", "Vercel"],
  },
  {
    id: "e4",
    period: "Aug 2019 — Jun 2021",
    role: "B.Sc. Computer Science",
    company: "University of Indonesia",
    type: "education",
    isCurrent: false,
    startDate: "2019-08-01",
    endDate: "2021-06-01",
    description:
      "Focused on web engineering, human-computer interaction, and open source contributions.",
    tags: ["Algorithms", "HCI", "Open Source"],
  },
];
