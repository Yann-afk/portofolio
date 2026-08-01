"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import type { Experience as ExperienceType } from "@/lib/types";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

export function Experience({ experiences }: { experiences: ExperienceType[] }) {
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            title="My journey so far"
            description="From my first line of code to leading teams — the milestones along the way."
          />
        </Reveal>

        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-zinc-200 sm:left-[23px] dark:bg-zinc-800" />

          <div className="flex flex-col gap-10">
            {experiences.map((exp, i) => {
              const isEducation = exp.type === "education";
              const Icon = isEducation ? GraduationCap : Briefcase;
              return (
                <Reveal key={`${exp.company}-${i}`} delay={i * 0.08}>
                  <div className="group relative flex gap-6 sm:gap-8">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors group-hover:border-violet-300 group-hover:bg-violet-50 group-hover:text-violet-600 sm:h-12 sm:w-12 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:group-hover:border-violet-700 dark:group-hover:bg-violet-500/10 dark:group-hover:text-violet-400">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>

                    <div className="flex-1 rounded-2xl border border-zinc-200 bg-white p-6 transition-all group-hover:-translate-y-0.5 group-hover:border-zinc-300 group-hover:shadow-lg group-hover:shadow-zinc-900/5 sm:p-7 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-zinc-700 dark:group-hover:shadow-black/20">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {exp.role}
                        </h3>
                        <span className="rounded-full bg-violet-100 px-3 py-1 font-mono text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                          {exp.period}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-violet-600 sm:text-sm dark:text-violet-400">
                        {exp.company}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {exp.description}
                      </p>
                      {exp.tags.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {exp.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
