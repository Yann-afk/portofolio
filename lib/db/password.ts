import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

// Used when there is no stored hash to compare against. Running scrypt anyway
// keeps the "unknown email" path the same cost as a real check, so the two
// failures cannot be told apart by response time.
const DECOY_SALT = "00000000000000000000000000000000";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  stored: string | null | undefined,
): boolean {
  const [salt, hash] = (stored ?? "").split(":");
  if (!salt || !hash) {
    scryptSync(password, DECOY_SALT, KEY_LENGTH);
    return false;
  }
  const candidate = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== candidate.length) return false;
  return timingSafeEqual(candidate, expected);
}

// Identifies which password a session was issued against. Rotating the
// password rotates the salt, which invalidates every previously issued token.
export function passwordVersion(stored: string | null | undefined): string {
  return (stored ?? "").split(":")[0] ?? "";
}
