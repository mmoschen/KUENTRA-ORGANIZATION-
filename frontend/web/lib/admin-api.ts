import "server-only";

export async function adminApiFetch(path: string, init: RequestInit = {}) {
  const apiUrl = process.env.KUENTRA_API_URL ?? "http://localhost:4000";
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) throw new Error("ADMIN_API_KEY no está configurada.");

  const headers = new Headers(init.headers);
  headers.set("x-admin-api-key", apiKey);
  headers.set("x-admin-name", "Administrador Kuentra");
  return fetch(`${apiUrl}${path}`, { ...init, headers, cache: "no-store" });
}
