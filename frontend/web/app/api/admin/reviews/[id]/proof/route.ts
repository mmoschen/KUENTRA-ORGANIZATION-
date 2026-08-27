import { NextRequest, NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasAdminSession(request)) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  try {
    const { id } = await params;
    const response = await adminApiFetch(`/reviews/admin/${encodeURIComponent(id)}/proof`);
    return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/octet-stream", "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ message: "No se pudo obtener la captura." }, { status: 503 });
  }
}
