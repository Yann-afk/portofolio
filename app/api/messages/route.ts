import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/db/client";
import { consume, MESSAGE_LIMIT } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const { allowed, retryAfterMs } = consume(
    `msg:${clientIp(request)}`,
    MESSAGE_LIMIT,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak pesan. Coba lagi nanti." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const sender_name = String(body.name ?? "").trim();
  const sender_email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!sender_name || !sender_email || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }
  if (sender_name.length > MAX_NAME || sender_email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 });
  }
  if (!EMAIL_RE.test(sender_email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("messages")
    .insert({ sender_name, sender_email, message });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
