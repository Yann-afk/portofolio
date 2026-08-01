import { createAdminClient } from "@/lib/db/client";
import { getSessionUser } from "@/lib/db/auth";
import { PageHeader } from "../admin-ui";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings — Admin",
};

export default async function SettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Not authenticated.
      </p>
    );
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const values: Record<string, string> = {
    name: profile?.name ?? user.email ?? "",
    username: profile?.username ?? "",
    email: profile?.email ?? user.email ?? "",
    role: profile?.role ?? "",
    roles: Array.isArray(profile?.roles) ? profile.roles.join(", ") : "",
    tagline: profile?.tagline ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    availability: profile?.availability ?? "",
    resume_link: profile?.resume_link ?? "",
    avatar_url: profile?.avatar_url ?? "",
    socials: JSON.stringify(profile?.socials ?? {}),
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Profil yang tampil di Hero dan About."
      />
      <SettingsForm profile={values} />
    </div>
  );
}
