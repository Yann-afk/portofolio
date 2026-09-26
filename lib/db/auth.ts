import "server-only";
import { cookies, headers } from "next/headers";
import { createAdminClient, type UserRow } from "./client";
import { createSessionToken, verifySessionToken } from "./session";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./constants";
import { passwordVersion, verifyPassword } from "./password";
import { consume, LOGIN_EMAIL_LIMIT, LOGIN_LIMIT, resetKey } from "@/lib/rate-limit";

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
    .select("id, email, password_hash")
    .eq("id", payload.uid)
    .single();

  const user = data as UserRow | null;
  if (!user) return null;
  // The salt changes whenever the password is rotated, which retires every
  // token that was signed against the previous password.
  if (payload.pv !== passwordVersion(user.password_hash)) return null;
  return { id: user.id, email: user.email };
}

async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function signIn(
  email: string,
  password: string,
): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const ip = await clientKey();
  // Two independent buckets: the per-IP one stops an attacker from resetting
  // the counter by varying the submitted email, the per-email one stops a
  // distributed attempt against a single account.
  const ipKey = `login:ip:${ip}`;
  const emailKey = `login:email:${normalizedEmail}`;

  const byIp = consume(ipKey, LOGIN_LIMIT);
  if (!byIp.allowed) return retryMessage(byIp.retryAfterMs);

  const byEmail = consume(emailKey, LOGIN_EMAIL_LIMIT);
  if (!byEmail.allowed) return retryMessage(byEmail.retryAfterMs);

  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, email, password_hash")
    .eq("email", normalizedEmail)
    .single();

  const user = data as UserRow | null;
  // verifyPassword burns an scrypt round when the hash is missing, so an
  // unknown email costs the same as a wrong password and returns false.
  const passwordOk = verifyPassword(password, user?.password_hash);
  if (!user || !passwordOk) {
    return "Email atau password salah.";
  }

  resetKey(ipKey);
  resetKey(emailKey);
  const token = await createSessionToken(
    user.id,
    passwordVersion(user.password_hash),
  );
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

function retryMessage(retryAfterMs: number): string {
  const minutes = Math.max(1, Math.ceil(retryAfterMs / 60000));
  return `Terlalu banyak percobaan login. Coba lagi dalam ${minutes} menit.`;
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
