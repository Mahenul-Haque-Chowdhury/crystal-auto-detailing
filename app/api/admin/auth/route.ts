import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { createSignedToken, isValidToken } from "@/lib/adminTokens";

export const runtime = "nodejs";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TOKEN_COOKIE = "admin_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: Request) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin password not configured. Set ADMIN_PASSWORD env var." },
      { status: 500 }
    );
  }

  let body: { password?: string; action?: string };
  try {
    body = (await request.json()) as { password?: string; action?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Logout
  if (body.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  }

  // Verify session
  if (body.action === "verify") {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE)?.value;
    if (token && isValidToken(token)) {
      return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Login
  const { password } = body;
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  // Constant-time comparison to prevent timing attacks
  const passwordBuffer = Buffer.from(password);
  const adminBuffer = Buffer.from(ADMIN_PASSWORD);
  const isValid =
    passwordBuffer.length === adminBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, adminBuffer);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createSignedToken(TOKEN_MAX_AGE);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE,
    path: "/",
  });

  return res;
}
