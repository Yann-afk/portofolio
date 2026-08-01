import "server-only";
import { cookies } from "next/headers";
import { createAdminClient, type UserRow } from "./client";
import { createSessionToken, verifySessionToken } from "./session";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./constants";
import { verifyPassword } from "./password";
import { consume, LOGIN_LIMIT, resetKey } from "@/lib/rate-limit";

export interface AdminUser {
  id: string;
  email: string;
}

export async function getSessionUser(cookieValue?: string): Promise<AdminUser | null> {
  const value =
    cookieValue ?? (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = await verifySessionToken(value);
  if (!payload) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, email")
    .eq("id", payload.uid)
    .single();

  const user = data as UserRow | null;
  if (!user) return null;
  return { id: user.id, email: user.email };
}

export async function signIn(
  email: string,
  password: string,
): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const limitKey = `login:${normalizedEmail}`;

  const { allowed, retryAfterMs } = consume(limitKey, LOGIN_LIMIT);
  if (!allowed) {
    const minutes = Math.max(1, Math.ceil(retryAfterMs / 60000));
    return `Terlalu banyak percobaan login. Coba lagi dalam ${minutes} menit.`;
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, email, password_hash")
    .eq("email", normalizedEmail)
    .single();

  const user = data as UserRow | null;
  if (!user?.password_hash || !verifyPassword(password, user.password_hash)) {
    return "Email atau password salah.";
  }

  resetKey(limitKey);
  const token = await createSessionToken(user.id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return null;
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
