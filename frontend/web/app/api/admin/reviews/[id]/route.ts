import { NextRequest, NextResponse } from "next/server";
import { adminApiFetch } from "@/lib/admin-api";
import { assertSameOrigin, hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!hasAdminSession(request)) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  try {
    assertSameOrigin(request);
    const { id } = await params;
    const response = await adminApiFetch(`/reviews/admin/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    });
    return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json", "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "No se pudo actualizar la opinión." }, { status: 400 });
  }
}
