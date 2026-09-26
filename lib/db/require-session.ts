import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser, type AdminUser } from "./auth";

export async function requireSessionUser(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}
