"use client";

import { useActionState } from "react";
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

export interface ExperienceFormValues {
  companyName: string;
  role: string;
  type: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  sortOrder: number;
}

export function ExperienceForm({
  action,
  initial,
  submitLabel,
}: {
  action: (
    prev: ActionResult | undefined,
    formData: FormData,
  ) => Promise<ActionResult>;
  initial?: ExperienceFormValues;
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
        <Field label="Company">
          <Input
            name="company_name"
            required
            defaultValue={initial?.companyName}
          />
        </Field>
        <Field label="Role">
          <Input name="role" required defaultValue={initial?.role} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Type">
          <Select name="type" defaultValue={initial?.type ?? "work"}>
            <option value="work">Work</option>
            <option value="education">Education</option>
            <option value="organization">Organization</option>
            <option value="award">Award</option>
          </Select>
        </Field>
        <Field label="Start date">
          <Input
            type="date"
            name="start_date"
            required
            defaultValue={initial?.startDate}
          />
        </Field>
        <Field label="End date" hint="Nonaktifkan jika masih berlangsung.">
          <Input
            type="date"
            name="end_date"
            defaultValue={initial?.endDate ?? ""}
          />
        </Field>
      </div>

      <div className="flex items-end gap-6">
        <Checkbox
          label="Masih berlangsung"
          name="is_current"
          defaultChecked={initial?.isCurrent}
        />
        <Field label="Sort order">
          <Input
            type="number"
            name="sort_order"
            className="w-28"
            defaultValue={initial?.sortOrder ?? 0}
          />
        </Field>
      </div>

      <Field label="Description">
        <Textarea
          name="description"
          rows={4}
          defaultValue={initial?.description}
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton pendingText="Saving...">{submitLabel}</SubmitButton>
        <a
          href="/admin/experience"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Batal
        </a>
      </div>
    </form>
  );
}
