import Link from "next/link";
import {
  Briefcase,
  FolderKanban,
  Inbox,
  Mail,
  Tags,
} from "lucide-react";
import { createAdminClient } from "@/lib/db/client";
import { PageHeader } from "./admin-ui";

export const dynamic = "force-dynamic";

export default async function DasborPage() {
  const admin = createAdminClient();

  const [projects, skills, experiences, messageCount, recent] =
    await Promise.all([
      admin.from("projects").select("id", { count: "exact", head: true }),
      admin.from("skills").select("id", { count: "exact", head: true }),
      admin
        .from("experiences")
        .select("id", { count: "exact", head: true }),
      admin
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
      admin
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const cards = [
    {
      label: "Proyek",
      value: projects.count ?? 0,
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Skill",
      value: skills.count ?? 0,
      href: "/admin/skills",
      icon: Tags,
    },
    {
      label: "Pengalaman",
      value: experiences.count ?? 0,
      href: "/admin/experience",
      icon: Briefcase,
    },
    {
      label: "Pesan belum dibaca",
      value: messageCount.count ?? 0,
      href: "/admin/messages",
      icon: Inbox,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dasbor"
        description="Ringkasan konten portofolio kamu."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700"
          >
            <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <p className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {value}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Pesan terbaru
          </h2>
          <Link
            href="/admin/messages"
            className="text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
          >
            Lihat semua →
          </Link>
        </div>

        {recent.data && recent.data.length > 0 ? (
          <ul className="flex flex-col divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {recent.data.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-50">
                    {!m.is_read ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                    ) : null}
                    {m.sender_name}
                    <span className="font-normal text-zinc-400">
                      {m.sender_email}
                    </span>
                  </p>
                  <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {m.message}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs text-zinc-400">
                  {new Date(m.created_at).toLocaleDateString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <Mail className="h-6 w-6 text-zinc-400" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Belum ada pesan masuk.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
