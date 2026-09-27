"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { changePassword } from "../actions";
import {
  ErrorNotice,
  Field,
  Input,
  SubmitButton,
  SuccessNotice,
} from "../admin-ui";

export function PasswordForm() {
  const [state, formAction] = useActionState(changePassword, undefined);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <KeyRound className="h-4 w-4" />
          Password
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Mengganti password akan mengeluarkan sesi di semua perangkat lain.
        </p>
      </div>

      <ErrorNotice error={state?.error} />
      <SuccessNotice success={state?.success} />

      <Field label="Password saat ini">
        <Input
          type="password"
          name="current_password"
          required
          autoComplete="current-password"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Password baru" hint="Minimal 8 karakter.">
          <Input
            type="password"
            name="new_password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Ulangi password baru">
          <Input
            type="password"
            name="confirm_password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Field>
      </div>

      <div className="pt-2">
        <SubmitButton pendingText="Memperbarui...">Ubah password</SubmitButton>
      </div>
    </form>
  );
}
