"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail, MapPin, Send } from "lucide-react";
import type { Profile } from "@/lib/types";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { GitHubIcon, WhatsAppIcon } from "./icons";

function buildSocials(profile: Profile) {
  return [
    { label: "GitHub", href: profile.socials.github, Icon: GitHubIcon },
    { label: "WhatsApp", href: profile.socials.whatsapp, Icon: WhatsAppIcon },
  ].filter((s) => Boolean(s.href));
}

export function Contact({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const socials = buildSocials(profile);
  const waNumber = (profile.socials.whatsapp ?? "")
    .replace("https://wa.me/", "")
    .replace("+", "");
  const waDisplay = waNumber.startsWith("62")
    ? `0${waNumber.slice(2)}`
    : waNumber;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const openMailto = () => {
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", email: "", message: "" });
        setSent(true);
        return;
      }
    } catch {
      // fall through to mailto
    }

    openMailto();
    setSent(true);
  };

  const inputClasses =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500";

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something great"
            description="Have a project in mind, a question, or just want to say hi? My inbox is always open — I usually reply within 24 hours."
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Email me at
                  </p>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="group mt-1 inline-flex items-center gap-2 text-lg font-semibold text-zinc-900 transition-colors hover:text-violet-600 dark:text-zinc-50 dark:hover:text-violet-400"
                  >
                    {profile.email}
                    <span className="relative">
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.span
                            key="copied"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          >
                            <Check className="h-3 w-3" /> Copied!
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-violet-100 group-hover:text-violet-600 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-violet-500/10 dark:group-hover:text-violet-400"
                          >
                            <Copy className="h-3 w-3" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <WhatsAppIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Chat on WhatsApp
                  </p>
                  <a
                    href={profile.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-lg font-semibold text-zinc-900 transition-colors hover:text-violet-600 dark:text-zinc-50 dark:hover:text-violet-400"
                  >
                    {waDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Based in
                  </p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {profile.location}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Find me on
                </p>
                <div className="flex items-center gap-3">
                  {socials.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-violet-700 dark:hover:text-violet-400"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Name
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClasses}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Email
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClasses}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Message
                </span>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`${inputClasses} resize-none`}
                />
              </label>
              <button
                type="submit"
                className="group mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-500/25 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-violet-400"
              >
                Send Message
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <AnimatePresence>
                {sent ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden text-sm font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    Message sent. Talk soon!
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
