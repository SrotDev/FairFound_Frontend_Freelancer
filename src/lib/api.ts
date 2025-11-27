// e.g. src/lib/api.ts
export const API_BASE_URL = "http://localhost:8000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined || {}),
  };
  if (!mergedHeaders.Authorization && typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) mergedHeaders.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: mergedHeaders,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}