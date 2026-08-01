"use client";

import { useActionState } from "react";
import { ExternalLink } from "lucide-react";
import { updateProfile } from "../actions";
import {
  ErrorNotice,
  Field,
  Input,
  SubmitButton,
  Textarea,
} from "../admin-ui";

const socialFields = [
  { key: "github", label: "GitHub URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "twitter", label: "X / Twitter URL" },
  { key: "instagram", label: "Instagram URL" },
] as const;

export function SettingsForm({
  profile,
}: {
  profile: Record<string, string>;
}) {
  const [state, formAction] = useActionState(updateProfile, undefined);

  const value = (key: string) => profile[key] ?? "";
  const socials = (profile.socials ? JSON.parse(profile.socials) : {}) as Record<
    string,
    string
  >;
  const roles = Array.isArray(profile.roles)
    ? (profile.roles as unknown as string[]).join(", ")
    : String(profile.roles ?? "");

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <ErrorNotice error={state?.error} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name">
          <Input name="name" required defaultValue={value("name")} />
        </Field>
        <Field label="Username" hint="Untuk URL /username.">
          <Input name="username" defaultValue={value("username")} />
        </Field>
        <Field label="Email">
          <Input type="email" name="email" defaultValue={value("email")} />
        </Field>
        <Field label="Location">
          <Input name="location" defaultValue={value("location")} />
        </Field>
      </div>

      <Field label="Role" hint="Contoh: Frontend Developer">
        <Input name="role" defaultValue={value("role")} />
      </Field>
      <Field label="Roles" hint="Pisahkan dengan koma. Contoh: React, TypeScript, UI Design">
        <Input name="roles" defaultValue={roles} />
      </Field>

      <Field label="Tagline">
        <Input name="tagline" defaultValue={value("tagline")} />
      </Field>
      <Field label="Bio">
        <Textarea name="bio" rows={5} defaultValue={value("bio")} />
      </Field>

      <Field label="Availability" hint="Contoh: open to work">
        <Input name="availability" defaultValue={value("availability")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Avatar URL">
          <Input
            type="url"
            name="avatar_url"
            defaultValue={value("avatar_url")}
          />
        </Field>
        <Field label="Resume URL">
          <Input
            type="url"
            name="resume_link"
            defaultValue={value("resume_link")}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <ExternalLink className="h-4 w-4" />
          Social links
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {socialFields.map(({ key, label }) => (
            <Field key={key} label={label}>
              <Input
                type="url"
                name={`social_${key}`}
                defaultValue={socials[key] ?? ""}
              />
            </Field>
          ))}
        </div>
      </fieldset>

      <div className="pt-2">
        <SubmitButton pendingText="Saving...">Save profile</SubmitButton>
      </div>
    </form>
  );
}
