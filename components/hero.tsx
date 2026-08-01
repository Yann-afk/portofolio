"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, FileText } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon, InstagramIcon } from "./icons";
import type { Profile } from "@/lib/types";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

function TerminalCard({ name, role }: { name: string; role: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative hidden lg:block"
    >
      <div className="w-[380px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40">
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-2 font-mono text-xs text-zinc-400">
            about-me.ts
          </span>
        </div>
        <div className="p-5 font-mono text-[13px] leading-7">
          <p>
            <span className="text-violet-500">const</span>{" "}
            <span className="text-sky-500">developer</span>{" "}
            <span className="text-zinc-400">=</span>{" "}
            <span className="text-zinc-500">{`{`}</span>
          </p>
          <p className="pl-5">
            name:{" "}
            <span className="text-emerald-500">&quot;{name}&quot;</span>
            ,
          </p>
          <p className="pl-5">
            role:{" "}
            <span className="text-emerald-500">&quot;{role}&quot;</span>
            ,
          </p>
          <p className="pl-5">
            stack: <span className="text-zinc-500">[</span>
            <span className="text-emerald-500">&quot;Next.js&quot;</span>
            <span className="text-zinc-500">, </span>
            <span className="text-emerald-500">&quot;TS&quot;</span>
            <span className="text-zinc-500">, </span>
            <span className="text-emerald-500">&quot;Node&quot;</span>
            <span className="text-zinc-500">]</span>,{" "}
          </p>
          <p className="pl-5">
            coffee: <span className="text-emerald-500">&quot;∞&quot;</span>,
          </p>
          <p className="pl-5">
            hireable: <span className="text-amber-500">true</span>,
          </p>
          <p>
            <span className="text-zinc-500">{`}`}</span>;
          </p>
        </div>
      </div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-6 -top-6 -z-10 h-28 w-28 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-xl opacity-60"
      />
    </motion.div>
  );
}

export function Hero({ profile }: { profile: Profile }) {
  const [roleIndex, setRoleIndex] = useState(0);

  const socials = [
    { label: "GitHub", href: profile.socials.github, Icon: GitHubIcon },
    { label: "LinkedIn", href: profile.socials.linkedin, Icon: LinkedInIcon },
    { label: "X", href: profile.socials.twitter, Icon: XIcon },
    { label: "Instagram", href: profile.socials.instagram, Icon: InstagramIcon },
  ].filter((s) => Boolean(s.href));

  useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % profile.roles.length),
      2600,
    );
    return () => clearInterval(id);
  }, [profile.roles.length]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(9,9,11,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]" />
        <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/15" />
        <div className="absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.2fr_1fr]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-6"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {profile.availability}
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50"
          >
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
              {profile.name}
            </span>
            .
          </motion.h1>

          <motion.div
            variants={item}
            className="flex h-10 items-center font-mono text-lg font-medium text-zinc-600 sm:text-2xl dark:text-zinc-400"
          >
            <span className="mr-2 text-violet-600 dark:text-violet-400">
              &gt;
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                {profile.roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
            <span className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-violet-500" />
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-2 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-600 hover:shadow-violet-500/25 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-violet-400"
            >
              Contact Me
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={profile.resume}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-4 flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-violet-700 dark:hover:text-violet-400"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        <TerminalCard name={profile.name} role={profile.role} />
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium text-zinc-400 sm:flex"
        aria-label="Scroll to About section"
      >
        <FileText className="h-4 w-4" />
        scroll down
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-zinc-400 to-transparent"
        />
      </motion.a>
    </section>
  );
}
