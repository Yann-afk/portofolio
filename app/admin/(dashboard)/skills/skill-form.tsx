"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createSkill } from "../actions";
import { ErrorNotice, Field, Input, SubmitButton } from "../admin-ui";

export function SkillForm() {
  const [state, formAction] = useActionState(createSkill, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <ErrorNotice error={state?.error} />
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_80px_auto]">
        <Field label="Name">
          <Input name="name" required placeholder="React" />
        </Field>
        <Field label="Category">
          <Input name="category" placeholder="Frontend" />
        </Field>
        <Field label="Order">
          <Input type="number" name="sort_order" defaultValue={0} />
        </Field>
        <div className="flex items-end">
          <SubmitButton
            className="h-10 w-10 rounded-xl p-0"
            pendingText="..."
          >
            <Plus className="h-4 w-4" />
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
