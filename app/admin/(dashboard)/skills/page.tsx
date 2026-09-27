import { createAdminClient } from "@/lib/db/client";
import { DeleteButton, PageHeader } from "../admin-ui";
import { deleteSkill } from "../actions";
import { SkillForm } from "./skill-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Skills — Admin",
};

export default async function SkillsPage() {
  const admin = createAdminClient();
  const { data: skills } = await admin
    .from("skills")
    .select("id, name, category, sort_order")
    .order("sort_order", { ascending: true });

  const skillsList = skills ?? [];
  const grouped = new Map<string, Array<(typeof skillsList)[number]>>();
  for (const skill of skillsList) {
    const key = skill.category ?? "Lainnya";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)?.push(skill);
  }

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Skill tampil di marquee halaman Tentang, dan bisa dihubungkan ke project."
      />

      <SkillForm />

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {[...grouped.entries()].map(([category, items]) => (
          <div
            key={category}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h3 className="mb-3 font-mono text-sm font-semibold text-violet-600 dark:text-violet-400">
              {category}
            </h3>
            <ul className="flex flex-col gap-2">
              {items.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/60"
                >
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {skill.name}
                  </span>
                  <DeleteButton
                    confirm={`Hapus skill "${skill.name}"?`}
                    action={deleteSkill.bind(null, skill.id)}
                  >
                    Hapus
                  </DeleteButton>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
