"use client";

import { useActionState } from "react";
import type { Skill } from "@/lib/types";
import type { ActionResult } from "../actions";
import {
  Checkbox,
  ErrorNotice,
  Field,
  Input,
  Select,
  SubmitButton,
  Textarea,
} from "../admin-ui";

export interface ProjectFormValues {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  category: string;
  featured: boolean;
  sortOrder: number;
  skillIds: string[];
}

export function ProjectForm({
  action,
  skills,
  initial,
  submitLabel,
}: {
  action: (
    prev: ActionResult | undefined,
    formData: FormData,
  ) => Promise<ActionResult>;
  skills: Skill[];
  initial?: ProjectFormValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <ErrorNotice error={state?.error} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title">
          <Input name="title" required defaultValue={initial?.title} />
        </Field>
        <Field label="Slug" hint="Kosongkan untuk auto-generate dari title.">
          <Input name="slug" defaultValue={initial?.slug} />
        </Field>
      </div>

      <Field label="Description">
        <Textarea
          name="description"
          required
          rows={4}
          defaultValue={initial?.description}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Cover image URL" hint="Kosongkan untuk pakai gradient.">
          <Input
            type="url"
            name="cover_image_url"
            defaultValue={initial?.coverImageUrl ?? ""}
          />
        </Field>
        <Field label="Category">
          <Select name="category" defaultValue={initial?.category ?? "web"}>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="uiux">UI/UX</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Live URL">
          <Input
            type="url"
            name="live_url"
            defaultValue={initial?.liveUrl ?? ""}
          />
        </Field>
        <Field label="GitHub URL">
          <Input
            type="url"
            name="github_url"
            defaultValue={initial?.githubUrl ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Sort order" hint="Semakin kecil, semakin atas.">
          <Input
            type="number"
            name="sort_order"
            defaultValue={initial?.sortOrder ?? 0}
          />
        </Field>
        <div className="flex items-end pb-1">
          <Checkbox
            label="Featured (tampil pertama)"
            name="featured"
            defaultChecked={initial?.featured}
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Skills yang dipakai
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {skills.map((skill) => (
            <label
              key={skill.id}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 transition-colors has-checked:border-violet-400 has-checked:bg-violet-50 dark:border-zinc-800 dark:text-zinc-300 dark:has-checked:border-violet-700 dark:has-checked:bg-violet-500/10"
            >
              <input
                type="checkbox"
                name="skills"
                value={skill.id}
                defaultChecked={initial?.skillIds.includes(skill.id)}
                className="h-4 w-4 accent-violet-600"
              />
              {skill.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton pendingText="Saving...">{submitLabel}</SubmitButton>
        <a
          href="/admin/projects"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Batal
        </a>
      </div>
    </form>
  );
}
