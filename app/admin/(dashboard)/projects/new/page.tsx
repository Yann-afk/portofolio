import type { Skill } from "@/lib/types";
import { createAdminClient } from "@/lib/db/client";
import { createProject } from "../../actions";
import { ProjectForm } from "../project-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Project baru — Admin",
};

export default async function NewProjectPage() {
  const admin = createAdminClient();
  const { data: skills } = await admin
    .from("skills")
    .select("id, name, icon_url, category, sort_order")
    .order("sort_order", { ascending: true });

  const skillList: Skill[] = (skills ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    iconUrl: s.icon_url,
    category: s.category,
    sortOrder: s.sort_order,
  }));

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Project baru
      </h1>
      <ProjectForm
        action={createProject}
        skills={skillList}
        submitLabel="Buat project"
      />
    </div>
  );
}
