import Link from "next/link";
import { Plus } from "lucide-react";
import { createAdminClient } from "@/lib/db/client";
import { projectCategoryLabel } from "@/lib/site";
import { DeleteButton, PageHeader } from "../admin-ui";
import { deleteProject } from "../actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects — Admin",
};

export default async function ProjectsPage() {
  const admin = createAdminClient();
  const { data: projects, error } = await admin
    .from("projects")
    .select("id, title, slug, category, featured, sort_order, skills(name)")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${projects?.length ?? 0} proyek terdaftar.`}
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-violet-400"
          >
            <Plus className="h-4 w-4" />
            New project
          </Link>
        }
      />

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
      ) : null}

      {projects && projects.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {projects.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {p.title}
                  </h3>
                  {p.featured ? (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 font-mono text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                      featured
                    </span>
                  ) : null}
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {projectCategoryLabel(p.category)}
                  </span>
                </div>
                <p className="mt-1 truncate font-mono text-xs text-zinc-400">
                  /{p.slug}
                </p>
                <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                  {p.skills?.map((s) => s.name).join(" · ") ?? ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-violet-700 dark:hover:text-violet-400"
                >
                  Edit
                </Link>
                <DeleteButton
                  confirm={`Hapus project "${p.title}"?`}
                  action={deleteProject.bind(null, p.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          Belum ada project. Klik &quot;New project&quot; untuk menambah.
        </p>
      )}
    </div>
  );
}
