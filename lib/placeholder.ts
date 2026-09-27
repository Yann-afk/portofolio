import type { Experience, Profile, Project, Skill, Stat } from "./types";

export const placeholderProfile: Profile = {
  name: "Abdullah Mubarok Maspeke",
  username: "abdullahmaspeke",
  email: "tzyyann07@gmail.com",
  role: "Full-Stack Developer",
  roles: ["Full-Stack Developer", "UI/UX Enthusiast", "Open Source Contributor"],
  tagline:
    "Saya membangun pengalaman web yang cepat, aksesibel, dan menyenangkan untuk dipakai.",
  bio: "Halo! Saya Abdullah Mubarok Maspeke, Full-Stack Developer yang berbasis di Jakarta, Indonesia. Saya menikmati mengubah masalah sulit menjadi produk yang sederhana dan enak dipakai. Saat tidak ngoding, saya sedang menggambar ide UI, berkontribusi ke open source, atau mencoba teknologi baru.\n\nDengan pengalaman lebih dari 3 tahun dalam membangun produk dari ide sampai produksi, saya peduli pada performa, kode yang bersih, dan detail kecil yang membuat pengalaman pengguna terasa bagus.",
  location: "Jakarta, Indonesia",
  availability: "Tersedia untuk freelance",
  resume: "/resume.pdf",
  avatarUrl: null,
  socials: {
    github: "https://github.com/Yann-afk",
    whatsapp: "https://wa.me/6289504472172",
  },
};

export const placeholderStats: Stat[] = [
  { value: "3+", label: "Tahun Pengalaman" },
  { value: "20+", label: "Project Selesai" },
  { value: "10+", label: "Klien Puas" },
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
    title: "Platform E-Commerce",
    slug: "e-commerce-platform",
    description:
      "Platform e-commerce headless dengan stok real-time, pembayaran Stripe, dan dashboard admin.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/ecommerce",
    category: "web",
    featured: true,
    skills: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
  },
  {
    id: "p2",
    title: "Aplikasi Manager Tugas",
    slug: "task-manager-app",
    description:
      "Aplikasi produktivitas lintas platform dengan dukungan offline, papan kanban, dan kolaborasi tim.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/taskmanager",
    category: "mobile",
    featured: false,
    skills: ["React Native", "Expo", "Firebase"],
  },
  {
    id: "p3",
    title: "UI Dashboard Keuangan",
    slug: "finance-dashboard-ui",
    description:
      "Desain dashboard bersih dan padat data untuk melacak keuangan pribadi, dengan dukungan mode gelap.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: null,
    category: "uiux",
    featured: false,
    skills: ["Figma", "Design System", "Dark Mode"],
  },
  {
    id: "p4",
    title: "Aplikasi Chat Real-time",
    slug: "real-time-chat-app",
    description:
      "Aplikasi pesan real-time dengan indikator mengetik, tanda sudah dibaca, dan enkripsi end-to-end.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/chat",
    category: "web",
    featured: false,
    skills: ["React", "Socket.io", "Redis", "Node.js"],
  },
  {
    id: "p5",
    title: "Aplikasi Pelacak Fitness",
    slug: "fitness-tracking-app",
    description:
      "Aplikasi mobile yang melacak latihan, konsumsi kalori, dan kemajuan dengan visualisasi data yang menarik.",
    coverImageUrl: null,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/fitness",
    category: "mobile",
    featured: false,
    skills: ["React Native", "Reanimated", "Supabase"],
  },
  {
    id: "p6",
    title: "Website Pemesanan Perjalanan",
    slug: "travel-booking-website",
    description:
      "Riset UX dan UI high-fidelity untuk platform pemesanan perjalanan dengan fokus pada alur tanpa hambatan.",
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
      "Memimpin tim frontend membangun design system dan micro-frontend yang melayani 1 juta+ pengguna per bulan.",
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
      "Merilis fitur inti untuk web dan mobile, memangkas waktu muat halaman 60%, dan mendorong pertumbuhan platform hingga 100 ribu pengguna.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
  },
  {
    id: "e3",
    period: "Jan 2021 — Jun 2022",
    role: "Web Developer Freelance",
    company: "Independent",
    type: "work",
    isCurrent: false,
    startDate: "2021-01-01",
    endDate: "2022-06-01",
    description:
      "Berkarya dengan 10+ klien dari berbagai industri untuk merancang, membangun, dan meluncurkan situs pemasaran serta web app.",
    tags: ["React", "Tailwind CSS", "Vercel"],
  },
  {
    id: "e4",
    period: "Aug 2019 — Jun 2021",
    role: "S.Kom. Ilmu Komputer",
    company: "Universitas Indonesia",
    type: "education",
    isCurrent: false,
    startDate: "2019-08-01",
    endDate: "2021-06-01",
    description:
      "Fokus pada rekayasa web, interaksi manusia-komputer, dan kontribusi open source.",
    tags: ["Algorithms", "HCI", "Open Source"],
  },
];
