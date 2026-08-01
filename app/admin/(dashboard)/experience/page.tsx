import Link from "next/link";
import { createAdminClient } from "@/lib/db/client";
import { DeleteButton, PageHeader } from "../admin-ui";
import { createExperience, deleteExperience } from "../actions";
import { ExperienceForm } from "./experience-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Experience — Admin",
};

export default async function ExperiencePage() {
  const admin = createAdminClient();
  const { data: experiences } = await admin
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Riwayat kerja, pendidikan, organisasi, dan penghargaan."
      />

      <ExperienceForm action={createExperience} submitLabel="Add entry" />

      <div className="mt-8">
        {experiences && experiences.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {experiences.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {e.role}
                    </h3>
                    <span className="text-sm text-zinc-400">@ {e.company_name}</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {e.type}
                    </span>
                    {e.is_current ? (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 font-mono text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                        current
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {e.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/experience/${e.id}/edit`}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-violet-700 dark:hover:text-violet-400"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    confirm={`Hapus "${e.role} @ ${e.company_name}"?`}
                    action={deleteExperience.bind(null, e.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            Belum ada entri experience.
          </p>
        )}
      </div>
    </div>
  );
}
