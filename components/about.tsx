"use client";

import { Code2, Database, PenTool, Sparkles } from "lucide-react";
import type { Stat } from "@/lib/types";
import { Reveal } from "./reveal";

const highlights = [
  {
    Icon: Code2,
    title: "Frontend",
    text: "Interactive, performant interfaces with React & Next.js.",
  },
  {
    Icon: Database,
    title: "Backend",
    text: "Robust APIs and databases with Node.js & PostgreSQL.",
  },
  {
    Icon: PenTool,
    title: "UI/UX",
    text: "Clean, accessible designs crafted in Figma, shipped pixel-perfect.",
  },
];

function MarqueeRow({ items }: { items: string[] }) {
  return (
    <div className="flex shrink-0 items-center gap-4 pr-4">
      {items.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-4 py-2 font-mono text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
          {skill}
        </span>
      ))}
    </div>
  );
}

export function About({
  bio,
  stats,
  skills,
}: {
  bio: string;
  stats: Stat[];
  skills: string[];
}) {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-12 flex max-w-2xl flex-col gap-4">
            <span className="font-mono text-sm font-medium text-violet-600 dark:text-violet-400">
              {"// "}About Me
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Turning ideas into real, working products.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="flex flex-col gap-5 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
              {bio.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <p className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-3xl font-bold text-transparent dark:from-violet-400 dark:to-fuchsia-400">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-500 sm:text-sm dark:text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col gap-4">
              {highlights.map(({ Icon, title, text }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-500/10 dark:text-violet-400 dark:group-hover:bg-violet-500 dark:group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.2} className="mt-20">
        <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
            <MarqueeRow items={skills} />
            <MarqueeRow items={skills} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
