"use client";

import { useActionState, useState } from "react";
import type { Skill } from "@/lib/types";
import { isProjectCategory, projectCategoryOptions } from "@/lib/site";
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
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initial?.skillIds ?? []),
  );

  const allSelected = skills.length > 0 && selected.size === skills.length;

  const toggleSkill = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <ErrorNotice error={state?.error} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Judul">
          <Input name="title" required defaultValue={initial?.title} />
        </Field>
        <Field label="Slug" hint="Kosongkan untuk auto-generate dari judul.">
          <Input name="slug" defaultValue={initial?.slug} />
        </Field>
      </div>

      <Field label="Deskripsi">
        <Textarea
          name="description"
          required
          rows={4}
          defaultValue={initial?.description}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="URL cover image" hint="Kosongkan untuk pakai gradient.">
          <Input
            type="url"
            name="cover_image_url"
            defaultValue={initial?.coverImageUrl ?? ""}
          />
        </Field>
        <Field label="Kategori">
          <Select
            name="category"
            defaultValue={
              isProjectCategory(initial?.category) ? initial.category : "web"
            }
          >
            {projectCategoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="URL live">
          <Input
            type="url"
            name="live_url"
            defaultValue={initial?.liveUrl ?? ""}
          />
        </Field>
        <Field label="URL GitHub">
          <Input
            type="url"
            name="github_url"
            defaultValue={initial?.githubUrl ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Urutan" hint="Semakin kecil, semakin atas.">
          <Input
            type="number"
            name="sort_order"
            defaultValue={initial?.sortOrder ?? 0}
          />
        </Field>
        <div className="flex items-end pb-1">
          <Checkbox
            label="Unggulan (tampil pertama)"
            name="featured"
            defaultChecked={initial?.featured}
          />
        </div>
      </div>

      <fieldset>
        <legend className="sr-only">Skills yang dipakai</legend>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Skills yang dipakai
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span className="tabular-nums text-zinc-500 dark:text-zinc-400">
              {selected.size}/{skills.length} dipilih
            </span>
            <button
              type="button"
              onClick={() =>
                setSelected(
                  allSelected ? new Set<string>() : new Set(skills.map((s) => s.id)),
                )
              }
              className="rounded-lg border border-zinc-200 px-2.5 py-1 font-medium text-zinc-700 transition-colors hover:border-violet-400 hover:text-violet-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-violet-600 dark:hover:text-violet-300"
            >
              {allSelected ? "Kosongkan semua" : "Pilih semua"}
            </button>
          </div>
        </div>
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
                checked={selected.has(skill.id)}
                onChange={() => toggleSkill(skill.id)}
                className="h-4 w-4 accent-violet-600"
              />
              {skill.name}
            </label>
          ))}
        </div>
        {skills.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Belum ada skill. Tambahkan di halaman Skills dulu.
          </p>
        ) : null}
      </fieldset>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton pendingText="Menyimpan...">{submitLabel}</SubmitButton>
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
