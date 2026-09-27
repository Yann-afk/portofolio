import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/db/client";
import { updateExperience } from "../../../actions";
import {
  ExperienceForm,
  type ExperienceFormValues,
} from "../../experience-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit pengalaman — Admin",
};

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: experience } = await admin
    .from("experiences")
    .select("*")
    .eq("id", id)
    .single();

  if (!experience) notFound();

  const initial: ExperienceFormValues = {
    companyName: experience.company_name,
    role: experience.role,
    type: experience.type,
    startDate: experience.start_date,
    endDate: experience.end_date,
    isCurrent: experience.is_current,
    description: experience.description ?? "",
    sortOrder: experience.sort_order,
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Edit pengalaman
      </h1>
      <ExperienceForm
        action={updateExperience.bind(null, id)}
        initial={initial}
        submitLabel="Simpan perubahan"
      />
    </div>
  );
}
