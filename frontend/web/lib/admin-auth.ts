import "server-only";

import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const sessionCookieName = "kuentra_admin_session";
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

type SessionPayload = { exp: number; nonce: string; role: "admin" };

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET debe tener al menos 32 caracteres.");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function requestIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) throw new Error("Origen no permitido.");
}

export function assertLoginAllowed(request: NextRequest) {
  const ip = requestIp(request);
  const now = Date.now();
  const current = loginAttempts.get(ip);
  const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + 15 * 60 * 1000 } : current;
  if (entry.count >= 5) throw new Error("Demasiados intentos. Esperá 15 minutos antes de volver a intentar.");
  entry.count += 1;
  loginAttempts.set(ip, entry);
}

export async function verifyAdminPassword(password: string) {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) throw new Error("ADMIN_PASSWORD_HASH no está configurada.");
  const [algorithm, salt, expectedHash] = passwordHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHash) throw new Error("ADMIN_PASSWORD_HASH tiene un formato inválido.");
  const derived = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, Buffer.from(salt, "base64url"), 64, { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
  const expected = Buffer.from(expectedHash, "base64url");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export function createAdminSession() {
  const payload: SessionPayload = { exp: Date.now() + 8 * 60 * 60 * 1000, nonce: randomBytes(18).toString("base64url"), role: "admin" };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function isAdminSession(token: string | undefined) {
  if (!token) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  const expectedSignature = sign(encoded);
  if (signature.length !== expectedSignature.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    return payload.role === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function hasAdminSession(request: NextRequest) {
  return isAdminSession(request.cookies.get(sessionCookieName)?.value);
}

export const adminSessionCookie = {
  name: sessionCookieName,
  options: {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
  },
};
