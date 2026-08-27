import { NextRequest, NextResponse } from "next/server";
import { adminSessionCookie, assertLoginAllowed, assertSameOrigin, createAdminSession, hasAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: hasAdminSession(request) });
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    assertLoginAllowed(request);
    const body = await request.json() as { password?: unknown };
    if (typeof body.password !== "string" || body.password.length < 8 || !(await verifyAdminPassword(body.password))) {
      return NextResponse.json({ message: "Credenciales inválidas." }, { status: 401 });
    }
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(adminSessionCookie.name, createAdminSession(), adminSessionCookie.options);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo iniciar sesión.";
    return NextResponse.json({ message }, { status: message.includes("Demasiados") ? 429 : 400 });
  }
}

export function DELETE(request: NextRequest) {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(adminSessionCookie.name, "", { ...adminSessionCookie.options, maxAge: 0 });
  return response;
}
