import type { ConfigResponse, ErrorsResponse, TreeResponse } from "../types";

const BASE = "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const resp = await fetch(`${BASE}${path}`, options);
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return resp.json() as Promise<T>;
}

export function fetchConfig(): Promise<ConfigResponse> {
  return request<ConfigResponse>("/api/config");
}

export function saveConfig(dataDir: string): Promise<ConfigResponse> {
  return request<ConfigResponse>("/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data_dir: dataDir }),
  });
}

export function fetchTree(): Promise<TreeResponse> {
  return request<TreeResponse>("/api/tree");
}

export function fetchErrors(
  manufacturer: string,
  category: string,
  product: string
): Promise<ErrorsResponse> {
  const params = new URLSearchParams({ manufacturer, category, product });
  return request<ErrorsResponse>(`/api/errors?${params}`);
}
