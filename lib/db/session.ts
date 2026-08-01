import { SESSION_MAX_AGE, SESSION_SECRET, assertSessionSecretConfigured } from "./constants";

export interface SessionPayload {
  uid: string;
  exp: number;
}

function b64encode(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64decode(input: string): Uint8Array {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sign(data: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new Uint8Array(data)));
}

export async function createSessionToken(uid: string): Promise<string> {
  assertSessionSecretConfigured();
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = b64encode(new TextEncoder().encode(JSON.stringify({ uid, exp })));
  const signature = b64encode(await sign(new TextEncoder().encode(payload)));
  return `${payload}.${signature}`;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = await sign(new TextEncoder().encode(payload));
  if (!timingSafeEqual(b64decode(signature), expected)) return null;

  try {
    const parsed = JSON.parse(new TextDecoder().decode(b64decode(payload)));
    if (typeof parsed.uid !== "string" || typeof parsed.exp !== "number") {
      return null;
    }
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return { uid: parsed.uid, exp: parsed.exp };
  } catch {
    return null;
  }
}
