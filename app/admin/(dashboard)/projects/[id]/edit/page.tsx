import { notFound } from "next/navigation";
import type { Skill } from "@/lib/types";
import { createAdminClient } from "@/lib/db/client";
import { updateProject } from "../../../actions";
import { ProjectForm, type ProjectFormValues } from "../../project-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit project — Admin",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const [{ data: project }, { data: skills }] = await Promise.all([
    admin
      .from("projects")
      .select(
        "id, title, slug, description, cover_image_url, live_url, github_url, category, featured, sort_order, skills(id)",
      )
      .eq("id", id)
      .single(),
    admin
      .from("skills")
      .select("id, name, icon_url, category, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  if (!project) notFound();

  const skillList: Skill[] = (skills ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    iconUrl: s.icon_url,
    category: s.category,
    sortOrder: s.sort_order,
  }));

  const initial: ProjectFormValues = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    coverImageUrl: project.cover_image_url,
    liveUrl: project.live_url,
    githubUrl: project.github_url,
    category: project.category,
    featured: project.featured,
    sortOrder: project.sort_order,
    skillIds: (project.skills ?? []).map((s) => s.id).filter((x): x is string => Boolean(x)),
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Edit project
      </h1>
      <ProjectForm
        action={updateProject.bind(null, id)}
        skills={skillList}
        initial={initial}
        submitLabel="Simpan perubahan"
      />
    </div>
  );
}
