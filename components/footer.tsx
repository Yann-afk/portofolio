import type { Profile } from "@/lib/types";
import { GitHubIcon, LinkedInIcon, XIcon, InstagramIcon } from "./icons";

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Footer({ profile }: { profile: Profile }) {
  const socials = [
    { label: "GitHub", href: profile.socials.github, Icon: GitHubIcon },
    { label: "LinkedIn", href: profile.socials.linkedin, Icon: LinkedInIcon },
    { label: "X", href: profile.socials.twitter, Icon: XIcon },
    { label: "Instagram", href: profile.socials.instagram, Icon: InstagramIcon },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <a
          href="#home"
          className="font-mono text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          {initialsOf(profile.name)}.
          <span className="text-violet-600 dark:text-violet-400">dev</span>
        </a>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} {profile.name}. Designed & built with
          Next.js, Tailwind & Framer Motion.
        </p>

        <div className="flex items-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
