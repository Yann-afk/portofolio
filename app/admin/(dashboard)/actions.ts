"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/db/client";
import { signIn as dbSignIn, signOut as dbSignOut } from "@/lib/db/auth";
import { hashPassword, verifyPassword } from "@/lib/db/password";
import { requireSessionUser } from "@/lib/db/require-session";

export type ActionResult = { error?: string; success?: string };

const MIN_PASSWORD_LENGTH = 8;

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const fields = {
  socials: ["github", "whatsapp"] as const,
};

export async function signIn(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const error = await dbSignIn(email, password);
  if (error) return { error };

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function signOut() {
  await requireSessionUser();
  await dbSignOut();
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}

// ------------------------------------------------------------
// Projects
// ------------------------------------------------------------

async function upsertProjectSkills(
  projectId: string,
  skillIds: string[],
) {
  const admin = createAdminClient();
  await admin.from("project_skills").delete().eq("project_id", projectId);
  if (skillIds.length > 0) {
    await admin.from("project_skills").insert(
      skillIds.map((skill_id) => ({ project_id: projectId, skill_id })),
    );
  }
}

export async function createProject(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireSessionUser();
  const admin = createAdminClient();
  const rawSlug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "");
  const payload = {
    title,
    slug: rawSlug || slugify(title),
    description: String(formData.get("description") ?? ""),
    cover_image_url: String(formData.get("cover_image_url") ?? "") || null,
    live_url: String(formData.get("live_url") ?? "") || null,
    github_url: String(formData.get("github_url") ?? "") || null,
    category: String(formData.get("category") ?? "web"),
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };

  const { data, error } = await admin
    .from("projects")
    .insert(payload)
    .select("id")
    .single();

  if (error) return { error: error.message };

  const skillIds = formData
    .getAll("skills")
    .map((v) => String(v))
    .filter(Boolean);
  await upsertProjectSkills(data.id, skillIds);

  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireSessionUser();
  const admin = createAdminClient();
  const rawSlug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "");
  const payload = {
    title,
    slug: rawSlug || slugify(title),
    description: String(formData.get("description") ?? ""),
    cover_image_url: String(formData.get("cover_image_url") ?? "") || null,
    live_url: String(formData.get("live_url") ?? "") || null,
    github_url: String(formData.get("github_url") ?? "") || null,
    category: String(formData.get("category") ?? "web"),
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };

  const { error } = await admin.from("projects").update(payload).eq("id", id);
  if (error) return { error: error.message };

  const skillIds = formData
    .getAll("skills")
    .map((v) => String(v))
    .filter(Boolean);
  await upsertProjectSkills(id, skillIds);

  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireSessionUser();
  const admin = createAdminClient();
  await admin.from("projects").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
}

// ------------------------------------------------------------
// Skills
// ------------------------------------------------------------

export async function createSkill(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireSessionUser();
  const admin = createAdminClient();
  const { error } = await admin.from("skills").insert({
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? "") || null,
    icon_url: String(formData.get("icon_url") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  await requireSessionUser();
  const admin = createAdminClient();
  await admin.from("skills").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/skills");
}

// ------------------------------------------------------------
// Experiences
// ------------------------------------------------------------

function experiencePayload(formData: FormData) {
  const isCurrent = formData.get("is_current") === "on";
  const endDate = String(formData.get("end_date") ?? "");
  return {
    company_name: String(formData.get("company_name") ?? ""),
    role: String(formData.get("role") ?? ""),
    type: String(formData.get("type") ?? "work"),
    start_date: String(formData.get("start_date") ?? ""),
    end_date: isCurrent ? null : endDate || null,
    is_current: isCurrent,
    description: String(formData.get("description") ?? ""),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
}

export async function createExperience(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireSessionUser();
  const admin = createAdminClient();
  const { error } = await admin
    .from("experiences")
    .insert(experiencePayload(formData));
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  redirect("/admin/experience");
}

export async function updateExperience(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireSessionUser();
  const admin = createAdminClient();
  const { error } = await admin
    .from("experiences")
    .update(experiencePayload(formData))
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  redirect("/admin/experience");
}

export async function deleteExperience(id: string) {
  await requireSessionUser();
  const admin = createAdminClient();
  await admin.from("experiences").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/experience");
}

// ------------------------------------------------------------
// Messages
// ------------------------------------------------------------

export async function toggleMessageRead(id: string, isRead: boolean) {
  await requireSessionUser();
  const admin = createAdminClient();
  await admin.from("messages").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireSessionUser();
  const admin = createAdminClient();
  await admin.from("messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
}

// ------------------------------------------------------------
// Profile / Settings
// ------------------------------------------------------------

export async function updateProfile(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSessionUser();

  const socials = {} as Record<string, string>;
  for (const key of fields.socials) {
    const value = String(formData.get(`social_${key}`) ?? "").trim();
    if (value) socials[key] = value;
  }

  const roles = String(formData.get("roles") ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  const admin = createAdminClient();
  const { error } = await admin.from("users").upsert(
    {
      id: session.id,
      name: String(formData.get("name") ?? ""),
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? ""),
      roles: roles.length > 0 ? roles : [String(formData.get("role") ?? "")],
      tagline: String(formData.get("tagline") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      location: String(formData.get("location") ?? ""),
      availability: String(formData.get("availability") ?? ""),
      resume_link: String(formData.get("resume_link") ?? "") || null,
      avatar_url: String(formData.get("avatar_url") ?? "") || null,
      socials,
    },
    { onConflict: "id" },
  );

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}

export async function changePassword(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireSessionUser();

  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (next.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password baru minimal ${MIN_PASSWORD_LENGTH} karakter.` };
  }
  if (next !== confirm) {
    return { error: "Konfirmasi password tidak cocok." };
  }
  if (next === current) {
    return { error: "Password baru harus berbeda dari password lama." };
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, password_hash")
    .eq("id", session.id)
    .single();

  const stored = (data as { password_hash?: string | null } | null)?.password_hash;
  if (!verifyPassword(current, stored)) {
    return { error: "Password saat ini salah." };
  }

  const { error } = await admin
    .from("users")
    .update({ password_hash: hashPassword(next) })
    .eq("id", session.id);
  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  return {
    success:
      "Password berhasil diubah. Sesi di perangkat lain sudah otomatis keluar.",
  };
}
