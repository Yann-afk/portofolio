"use client";

import { useActionState } from "react";
import { Lock, Mail } from "lucide-react";
import { signIn } from "../(dashboard)/actions";
import { ErrorNotice, SubmitButton, inputClass } from "../(dashboard)/admin-ui";

export function LoginForm({
  error,
}: {
  error?: string;
}) {
  const [state, formAction] = useActionState(signIn, undefined);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <p className="font-mono text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          admin.
          <span className="text-violet-600 dark:text-violet-400">panel</span>
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Selamat datang kembali
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Masuk untuk mengelola data portofolio kamu.
        </p>
      </div>

      <form
        action={formAction}
        className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <ErrorNotice error={state?.error ?? error} />

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className={`${inputClass} pl-9`}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${inputClass} pl-9`}
            />
          </div>
        </label>

        <SubmitButton className="mt-1 w-full" pendingText="Memproses...">
          Masuk
        </SubmitButton>
      </form>
    </div>
  );
}
