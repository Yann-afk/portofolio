"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/types";
import { gradientFor, projectCategories } from "@/lib/site";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { GitHubIcon } from "./icons";
import { cn } from "@/lib/utils";

function ProjectCard({ project }: { project: Project }) {
  const thumbHref = project.liveUrl ?? project.githubUrl ?? "#";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <a
        href={thumbHref}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[16/10] overflow-hidden"
        aria-label={`Open ${project.title}`}
      >
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "h-full w-full bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
              gradientFor(project.slug),
            )}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        {project.featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 font-mono text-xs font-medium text-white backdrop-blur">
            ★ Featured
          </span>
        ) : null}
        <span className="absolute bottom-4 left-4 font-mono text-sm font-semibold text-white">
          {project.title}
        </span>
        <ArrowUpRight className="absolute bottom-4 right-4 h-5 w-5 text-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
      </a>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 transition-colors hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400"
            >
              Live Demo <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 transition-colors hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400"
            >
              <GitHubIcon className="h-3.5 w-3.5" /> Source
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory | "all">("all");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Projects"
            title="Things I've built"
            description="A curated selection of projects I've designed and developed. Filter by category to see the highlights."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-10 flex flex-wrap gap-2">
            {projectCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active === cat.id
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
