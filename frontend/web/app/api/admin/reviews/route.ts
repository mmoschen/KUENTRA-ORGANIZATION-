import { NextRequest, NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!hasAdminSession(request)) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  try {
    const status = request.nextUrl.searchParams.get("status");
    const response = await adminApiFetch(`/reviews/admin${status ? `?status=${encodeURIComponent(status)}` : ""}`);
    return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json", "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "No se pudo consultar el panel." }, { status: 503 });
  }
}
