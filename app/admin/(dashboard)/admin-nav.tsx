"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "./actions";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Tags },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function AdminNav({
  unread,
  variant = "sidebar",
}: {
  unread: number;
  variant?: "sidebar" | "top";
}) {
  const pathname = usePathname();
  const top = variant === "top";

  return (
    <nav
      className={cn(
        "flex gap-1 p-4",
        top
          ? "w-max flex-row items-center overflow-x-auto"
          : "h-full flex-col",
      )}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <a
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl text-sm font-medium transition-colors",
              top ? "shrink-0 px-3 py-2" : "px-3 py-2.5",
              active
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
            {href === "/admin/messages" && unread > 0 ? (
              <span className="ml-auto rounded-full bg-violet-600 px-2 py-0.5 font-mono text-xs font-semibold text-white">
                {unread}
              </span>
            ) : null}
          </a>
        );
      })}

      {top ? null : (
        <>
          <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            View site
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Log out
            </button>
          </form>
        </>
      )}
    </nav>
  );
}

export { items as adminNavItems };
